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

  const signInWithPhone = async (phoneNumber: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    
    try {
      const formattedPhone = formatPhoneNumber(phoneNumber);
      console.log('Signing in with phone:', formattedPhone);
      
      // Check if profile already exists
      const existingProfile = await findExistingProfile(formattedPhone);
      
      // Generate consistent credentials for this phone number
      const sanitizedPhone = formattedPhone.replace(/[^0-9]/g, '');
      const autoEmail = `phone${sanitizedPhone}@example.com`;
      const autoPassword = 'phone_auth_secure_' + sanitizedPhone;
      
      console.log('Attempting auto-sign in with:', autoEmail);
      
      // Try to sign in first
      let { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: autoEmail,
        password: autoPassword,
      });
      
      if (signInError && signInError.message.includes("Invalid login credentials")) {
        console.log('User does not exist, creating new auto-login user...');
        
        // Create profile first if it doesn't exist
        let profileToUse = existingProfile;
        if (!existingProfile) {
          console.log('Creating new profile...');
          const { data: newProfile, error: createProfileError } = await supabase
            .from('user_profiles')
            .insert({
              full_name: 'Phone User',
              phone_number: formattedPhone,
              language: 'hindi'
            })
            .select('*')
            .single();

          if (createProfileError) {
            console.error('Error creating profile:', createProfileError);
            throw createProfileError;
          }
          
          profileToUse = newProfile;
          console.log('Created new profile:', profileToUse.id);
        }
        
        // Create auth user
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: autoEmail,
          password: autoPassword,
          options: {
            data: {
              full_name: "Phone User",
              phone_number: formattedPhone
            }
          }
        });
        
        if (signUpError) {
          console.error('Auto sign up error:', signUpError);
          throw signUpError;
        }
        
        // Link the profile to the new auth user
        if (signUpData.user && profileToUse && !profileToUse.auth_user_id) {
          const { error: linkError } = await supabase
            .from('user_profiles')
            .update({ auth_user_id: signUpData.user.id })
            .eq('id', profileToUse.id);
          
          if (linkError) {
            console.error('Error linking profile:', linkError);
          } else {
            console.log('Linked profile to new auth user');
          }
        }
        
        console.log('Auto-created user successfully:', signUpData);
      } else if (signInError) {
        console.error('Auto sign in error:', signInError);
        throw signInError;
      } else {
        // User signed in successfully, link any unlinked profile
        if (signInData?.user && existingProfile && !existingProfile.auth_user_id) {
          const { error: linkError } = await supabase
            .from('user_profiles')
            .update({ auth_user_id: signInData.user.id })
            .eq('id', existingProfile.id);
          
          if (linkError) {
            console.error('Error linking profile on sign in:', linkError);
          } else {
            console.log('Linked existing profile to auth user');
          }
        }
        
        console.log('Auto-signed in successfully:', signInData);
      }

      return { success: true };
      
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

  // Keep the old method names for compatibility but they now do the same thing
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
