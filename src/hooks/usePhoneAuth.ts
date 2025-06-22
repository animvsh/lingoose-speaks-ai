
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

  const findExistingProfile = async (phoneNumber: string) => {
    try {
      console.log('Looking for existing profile with phone:', phoneNumber);
      
      const { data: existingProfile, error: findError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('phone_number', phoneNumber)
        .maybeSingle();

      if (findError) {
        console.error('Error finding profile:', findError);
        return null;
      }

      if (existingProfile) {
        console.log('Found existing profile:', existingProfile.id);
        return existingProfile;
      }

      console.log('No existing profile found');
      return null;
    } catch (error) {
      console.error('Error in findExistingProfile:', error);
      return null;
    }
  };

  const signInWithPhone = async (phoneNumber: string): Promise<{ success: boolean; error?: string; isNewUser?: boolean }> => {
    setIsLoading(true);
    
    try {
      const formattedPhone = formatPhoneNumber(phoneNumber);
      console.log('Looking up profile for phone:', formattedPhone);
      
      // First check if profile exists
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
      
      // Also store a simple flag to indicate they're authenticated
      localStorage.setItem('phone_authenticated', 'true');
      localStorage.setItem('phone_number', formattedPhone);

      console.log('Phone authentication successful, isNewUser:', isNewUser);
      return { success: true, isNewUser };
      
    } catch (error: any) {
      console.error('Phone sign in error:', error);
      return { 
        success: false, 
        error: error.message || 'Failed to sign in with phone number' 
      };
    } finally {
      setIsLoading(false);
    }
  };

  // Keep the old method names for compatibility
  const sendOTP = signInWithPhone;
  const verifyOTP = async (_phoneNumber: string, _otp: string) => {
    return { success: true }; // OTP verification is no longer needed
  };

  return {
    sendOTP,
    verifyOTP,
    signInWithPhone,
    isLoading
  };
};
