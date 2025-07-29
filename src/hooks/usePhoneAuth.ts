
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

// Input validation functions
const validatePhoneNumber = (phone: string): boolean => {
  return /^\+[1-9]\d{9,14}$/.test(phone);
};

const validateUserName = (name: string): boolean => {
  const trimmed = name.trim();
  return trimmed.length >= 1 && trimmed.length <= 100 && /^[a-zA-Z\s\-']+$/.test(trimmed);
};

const logSecurityEvent = async (action: string, phoneNumber: string, details: any = {}) => {
  try {
    // Use untyped insert to bypass TypeScript checks for security_audit_logs table
    await (supabase as any).from('security_audit_logs').insert({
      phone_number: phoneNumber,
      action,
      details,
      ip_address: null, // We can't easily get IP on client side
      user_agent: navigator.userAgent
    });
  } catch (error) {
    console.warn('Failed to log security event:', error);
  }
};

export const usePhoneAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const formatPhoneNumber = (phone: string): string => {
    // Remove all non-digit characters
    const cleaned = phone.replace(/\D/g, '');
    
    // Add + prefix if not present and number doesn't start with country code
    if (!phone.startsWith('+')) {
      // If it's a US number (10 digits), add +1
      if (cleaned.length === 10) {
        return `+1${cleaned}`;
      }
      // Otherwise add + to whatever they provided
      return `+${cleaned}`;
    }
    
    return phone;
  };

  const sendOTP = async (phoneNumber: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      const formattedPhone = formatPhoneNumber(phoneNumber);
      if (!validatePhoneNumber(formattedPhone)) {
        await logSecurityEvent('otp_send_invalid_phone', formattedPhone, {
          error: 'Invalid phone number format'
        });
        throw new Error('Please enter a valid phone number with country code (e.g., +1234567890)');
      }
      
      console.log('Sending OTP via Supabase to:', formattedPhone);
      await logSecurityEvent('otp_send_attempted', formattedPhone);
      
      setTimeout(() => {
        import('@/services/posthog').then(({ posthogService }) => {
          if (posthogService) {
            posthogService.captureQueued('otp_send_attempted', formattedPhone, {
              phone_number: formattedPhone
            });
          }
        });
      }, 100);

      // Use Supabase Auth SMS OTP
      const { data, error } = await supabase.auth.signInWithOtp({
        phone: formattedPhone,
      });

      if (error) {
        console.error('Supabase OTP error:', error);
        await logSecurityEvent('otp_send_failed', formattedPhone, { error: error.message });
        setTimeout(() => {
          import('@/services/posthog').then(({ posthogService }) => {
            if (posthogService) {
              posthogService.captureQueued('otp_send_failed', formattedPhone, {
                phone_number: formattedPhone,
                error: error.message
              });
            }
          });
        }, 100);
        throw new Error(error.message || 'Failed to send verification code');
      }

      console.log('OTP sent successfully via Supabase');
      await logSecurityEvent('otp_send_success', formattedPhone);
      setTimeout(() => {
        import('@/services/posthog').then(({ posthogService }) => {
          if (posthogService) {
            posthogService.captureQueued('otp_send_success', formattedPhone, {
              phone_number: formattedPhone
            });
          }
        });
      }, 100);
      
      return { success: true };
    } catch (error: any) {
      console.error('Send OTP error:', error);
      return { success: false, error: error.message || 'Failed to send verification code' };
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOTP = async (phoneNumber: string, code: string): Promise<{ success: boolean; error?: string; isNewUser?: boolean; accountDetected?: boolean; profile?: any }> => {
    setIsLoading(true);
    try {
      const formattedPhone = formatPhoneNumber(phoneNumber);
      if (!validatePhoneNumber(formattedPhone)) {
        await logSecurityEvent('otp_verify_invalid_phone', formattedPhone, {
          error: 'Invalid phone number format'
        });
        throw new Error('Please enter a valid phone number with country code');
      }
      
      console.log('Verifying OTP via Supabase for:', formattedPhone);
      await logSecurityEvent('otp_verify_attempted', formattedPhone);
      
      setTimeout(() => {
        import('@/services/posthog').then(({ posthogService }) => {
          if (posthogService) {
            posthogService.captureQueued('otp_verify_attempted', formattedPhone, {
              phone_number: formattedPhone
            });
          }
        });
      }, 100);

      // Verify OTP using Supabase Auth
      const {
        data: { session },
        error,
      } = await supabase.auth.verifyOtp({
        phone: formattedPhone,
        token: code,
        type: 'sms',
      });

      if (error) {
        console.error('Supabase OTP verification error:', error);
        await logSecurityEvent('otp_verify_failed', formattedPhone, { error: error.message });
        
        // Provide more specific error messages
        let errorMessage = error.message || 'Failed to verify code';
        if (error.message?.includes('expired') || error.message?.includes('invalid')) {
          if (error.message?.includes('expired')) {
            errorMessage = 'This verification code has expired or was already used. Please request a new code.';
          } else {
            errorMessage = 'Invalid verification code. Please check your code and try again.';
          }
        }
        
        setTimeout(() => {
          import('@/services/posthog').then(({ posthogService }) => {
            if (posthogService) {
              posthogService.captureQueued('otp_verify_failed', formattedPhone, {
                phone_number: formattedPhone,
                error: error.message
              });
            }
          });
        }, 100);
        throw new Error(errorMessage);
      }

      if (!session?.user) {
        const errorMessage = 'Invalid verification code';
        console.error('Supabase OTP verification failed: No session created');
        await logSecurityEvent('otp_verify_failed', formattedPhone, { error: errorMessage });
        throw new Error(errorMessage);
      }

      console.log('OTP verified successfully via Supabase');

      // After successful verification, create or find user profile
      const { data: existingProfile, error: findError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('phone_number', formattedPhone)
        .maybeSingle();

      if (findError) {
        console.error('Error finding profile:', findError);
        await logSecurityEvent('profile_lookup_failed', formattedPhone, { error: findError.message });
        throw findError;
      }

      let profile;
      let isNewUser = false;
      let accountDetected = false;

      if (existingProfile) {
        // Account exists - don't auto-login, let UI handle this
        accountDetected = true;
        await logSecurityEvent('existing_account_detected', formattedPhone, { user_id: existingProfile.id });
        
        setTimeout(() => {
          import('@/services/posthog').then(({ posthogService }) => {
            if (posthogService) {
              posthogService.capture('existing_account_detected', existingProfile.id, {
                phone_number: existingProfile.phone_number,
                full_name: existingProfile.full_name,
                context: 'signup_attempt'
              });
            }
          });
        }, 500);
        
        // Update the existing profile with auth_user_id if not already set
        if (!existingProfile.auth_user_id) {
          await supabase
            .from('user_profiles')
            .update({ auth_user_id: session.user.id })
            .eq('id', existingProfile.id);
        }
        
        profile = { ...existingProfile, auth_user_id: session.user.id };
      } else {
        // For new users, just set a flag that they need onboarding
        // Don't create a profile yet - let the onboarding flow handle this
        isNewUser = true;
        await logSecurityEvent('otp_verify_success_new_user', formattedPhone);
        
        // Store minimal auth state for new users with Supabase session
        localStorage.setItem('phone_authenticated', 'true');
        localStorage.setItem('phone_number', formattedPhone);
        localStorage.setItem('needs_onboarding', 'true');
        localStorage.setItem('supabase_user_id', session.user.id);
        
        setTimeout(() => {
          import('@/services/posthog').then(({ posthogService }) => {
            if (posthogService) {
              posthogService.capture('phone_verified_new_user', formattedPhone, {
                phone_number: formattedPhone,
                is_new_user: true,
                user_id: session.user.id
              });
            }
          });
        }, 500);
        
        // Return success without profile for new users
        profile = null;
      }

      console.log('Phone authentication successful, isNewUser:', isNewUser, 'accountDetected:', accountDetected);
      return { success: true, isNewUser, accountDetected, profile };
    } catch (error: any) {
      console.error('Verify OTP error:', error);
      return { success: false, error: error.message || 'Failed to verify code' };
    } finally {
      setIsLoading(false);
    }
  };

  // For backward compatibility
  const signInWithPhone = async (phoneNumber: string) => {
    return sendOTP(phoneNumber);
  };

  return {
    sendOTP,
    verifyOTP,
    signInWithPhone,
    isLoading,
    formatPhoneNumber // Export this helper function
  };
};
