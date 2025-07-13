import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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
      console.log('Sending OTP to:', formattedPhone);
      
      // Track OTP send attempt
      setTimeout(() => {
        import('@/services/posthog').then(({ posthogService }) => {
          if (posthogService) {
            posthogService.captureQueued('otp_send_attempted', formattedPhone, {
              phone_number: formattedPhone
            });
          }
        });
      }, 100);
      
      const { data, error } = await supabase.functions.invoke('twilio-verify', {
        body: {
          action: 'send',
          phoneNumber: formattedPhone
        }
      });

      if (error) {
        console.error('Send OTP error:', error);
        
        // Track OTP send failure
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

      if (!data.success) {
        // Track OTP send failure
        setTimeout(() => {
          import('@/services/posthog').then(({ posthogService }) => {
            if (posthogService) {
              posthogService.captureQueued('otp_send_failed', formattedPhone, {
                phone_number: formattedPhone,
                error: data.error
              });
            }
          });
        }, 100);
        
        throw new Error(data.error || 'Failed to send verification code');
      }

      console.log('OTP sent successfully');
      
      // Track OTP send success
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
      return { 
        success: false, 
        error: error.message || 'Failed to send verification code' 
      };
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOTP = async (phoneNumber: string, code: string): Promise<{ success: boolean; error?: string; isNewUser?: boolean; accountDetected?: boolean }> => {
    setIsLoading(true);
    
    try {
      const formattedPhone = formatPhoneNumber(phoneNumber);
      console.log('Verifying OTP for:', formattedPhone);
      
      // Track OTP verification attempt
      setTimeout(() => {
        import('@/services/posthog').then(({ posthogService }) => {
          if (posthogService) {
            posthogService.captureQueued('otp_verify_attempted', formattedPhone, {
              phone_number: formattedPhone
            });
          }
        });
      }, 100);
      
      // First verify the OTP with Twilio
      const { data, error } = await supabase.functions.invoke('twilio-verify', {
        body: {
          action: 'verify',
          phoneNumber: formattedPhone,
          code: code
        }
      });

      if (error) {
        console.error('Verify OTP error:', error);
        
        // Track OTP verification failure
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
        
        throw new Error(error.message || 'Failed to verify code');
      }

      if (!data.success || !data.verified) {
        // Track OTP verification failure
        setTimeout(() => {
          import('@/services/posthog').then(({ posthogService }) => {
            if (posthogService) {
              posthogService.captureQueued('otp_verify_failed', formattedPhone, {
                phone_number: formattedPhone,
                error: data.error || 'Invalid code'
              });
            }
          });
        }, 100);
        
        throw new Error(data.error || 'Invalid verification code');
      }

      console.log('OTP verified successfully, checking user profile...');

      // Check if profile exists
      const { data: existingProfile, error: findError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('phone_number', formattedPhone)
        .maybeSingle();

      if (findError) {
        console.error('Error finding profile:', findError);
        throw findError;
      }

      let profile;
      let isNewUser = false;
      let accountDetected = false;

      if (existingProfile) {
        console.log('Found existing profile:', existingProfile.id);
        profile = existingProfile;
        accountDetected = true;
        
        // Track returning user login
        setTimeout(() => {
          import('@/services/posthog').then(({ posthogService }) => {
            if (posthogService) {
              posthogService.capture('user_signed_in', profile.id, {
                phone_number: profile.phone_number,
                full_name: profile.full_name,
                language: profile.language,
                is_new_user: false,
                account_detected: true
              });
            }
          });
        }, 500);

        // Store the profile info and redirect to dashboard
        localStorage.setItem('current_user_profile', JSON.stringify(profile));
        localStorage.setItem('phone_authenticated', 'true');
        localStorage.setItem('phone_number', formattedPhone);

        // Show account detected message
        toast({
          title: "Account detected!",
          description: `Welcome back, ${profile.full_name}! Logging you into your account.`,
        });

        // Redirect to dashboard
        setTimeout(() => {
          window.location.href = '/app';
        }, 1500);

      } else {
        console.log('Creating new profile for new user...');
        isNewUser = true;
        
        const { data: newProfile, error: createError } = await supabase
          .from('user_profiles')
          .insert({
            full_name: 'New User',
            phone_number: formattedPhone,
            language: 'hindi'
          })
          .select('*')
          .single();

        if (createError) {
          console.error('Error creating profile:', createError);
          throw createError;
        }
        
        profile = newProfile;
        console.log('Created new profile:', profile.id);
        
        // Track new user signup
        setTimeout(() => {
          import('@/services/posthog').then(({ posthogService }) => {
            if (posthogService) {
              posthogService.capture('user_signed_up', profile.id, {
                phone_number: profile.phone_number,
                full_name: profile.full_name,
                language: profile.language,
                is_new_user: true
              });
            }
          });
        }, 500);
      }

      console.log('Phone authentication successful, isNewUser:', isNewUser, 'accountDetected:', accountDetected);
      return { success: true, isNewUser, accountDetected };
      
    } catch (error: any) {
      console.error('Verify OTP error:', error);
      return { 
        success: false, 
        error: error.message || 'Failed to verify code' 
      };
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
    isLoading
  };
};
