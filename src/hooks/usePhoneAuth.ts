
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
      
      const { data, error } = await supabase.functions.invoke('twilio-verify', {
        body: {
          action: 'send',
          phoneNumber: formattedPhone
        }
      });

      if (error) {
        console.error('Send OTP error:', error);
        throw new Error(error.message || 'Failed to send verification code');
      }

      if (!data.success) {
        throw new Error(data.error || 'Failed to send verification code');
      }

      console.log('OTP sent successfully');
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
        throw new Error(error.message || 'Failed to verify code');
      }

      if (!data.success || !data.verified) {
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
