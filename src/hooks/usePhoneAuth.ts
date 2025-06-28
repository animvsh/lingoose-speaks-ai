import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAnalytics } from '@/hooks/useAnalytics';

export const usePhoneAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { trackEvent } = useAnalytics();

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
      trackEvent('otp_send_attempted', {
        phone_number_hash: btoa(formattedPhone) // Hash for privacy
      });
      
      const { data, error } = await supabase.functions.invoke('twilio-verify', {
        body: {
          action: 'send',
          phoneNumber: formattedPhone
        }
      });

      if (error) {
        console.error('Send OTP error:', error);
        trackEvent('otp_send_failed', {
          error_message: error.message,
          phone_number_hash: btoa(formattedPhone)
        });
        throw new Error(error.message || 'Failed to send verification code');
      }

      if (!data.success) {
        trackEvent('otp_send_failed', {
          error_message: data.error,
          phone_number_hash: btoa(formattedPhone)
        });
        throw new Error(data.error || 'Failed to send verification code');
      }

      console.log('OTP sent successfully');
      trackEvent('otp_send_success', {
        phone_number_hash: btoa(formattedPhone)
      });
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

  const verifyOTP = async (phoneNumber: string, code: string): Promise<{ success: boolean; error?: string; isNewUser?: boolean }> => {
    setIsLoading(true);
    
    try {
      const formattedPhone = formatPhoneNumber(phoneNumber);
      console.log('Verifying OTP for:', formattedPhone);
      
      // Track OTP verification attempt
      trackEvent('otp_verify_attempted', {
        phone_number_hash: btoa(formattedPhone)
      });
      
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
        trackEvent('otp_verify_failed', {
          error_message: error.message,
          phone_number_hash: btoa(formattedPhone)
        });
        throw new Error(error.message || 'Failed to verify code');
      }

      if (!data.success || !data.verified) {
        trackEvent('otp_verify_failed', {
          error_message: data.error || 'Invalid code',
          phone_number_hash: btoa(formattedPhone)
        });
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

      if (existingProfile) {
        console.log('Found existing profile:', existingProfile.id);
        profile = existingProfile;
        trackEvent('user_login_success', {
          user_id: profile.id,
          is_returning_user: true
        });
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
        trackEvent('user_signup_success', {
          user_id: profile.id,
          is_new_user: true,
          signup_method: 'phone'
        });
      }

      // Store the profile info in localStorage to simulate being "logged in"
      localStorage.setItem('current_user_profile', JSON.stringify(profile));
      localStorage.setItem('phone_authenticated', 'true');
      localStorage.setItem('phone_number', formattedPhone);

      console.log('Phone authentication successful, isNewUser:', isNewUser);
      return { success: true, isNewUser };
      
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
