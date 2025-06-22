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

  const createOrFindUserProfile = async (phoneNumber: string) => {
    try {
      // Check if a profile already exists for this phone number
      const { data: existingProfile, error: findError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('phone_number', phoneNumber)
        .single();

      if (existingProfile && !findError) {
        console.log('Found existing profile:', existingProfile.id);
        return existingProfile;
      }

      // Create new profile if none exists
      const { data: newProfile, error: createError } = await supabase
        .from('user_profiles')
        .insert({
          full_name: 'New User',
          phone_number: phoneNumber,
          language: 'hindi'
        })
        .select('*')
        .single();

      if (createError) {
        console.error('Error creating profile:', createError);
        throw createError;
      }

      console.log('Created new profile:', newProfile.id);
      return newProfile;
    } catch (error) {
      console.error('Error in createOrFindUserProfile:', error);
      throw error;
    }
  };

  const createTestUserIfNotExists = async (): Promise<void> => {
    try {
      console.log('Checking if test user exists...');
      
      // Try to sign in the test user to see if they exist
      const { data: existingUser, error: signInError } = await supabase.auth.signInWithPassword({
        email: 'testuser@example.com',
        password: 'testpassword123'
      });

      if (existingUser?.user) {
        console.log('Test user already exists');
        // Sign out immediately after checking
        await supabase.auth.signOut();
        return;
      }

      if (signInError && signInError.message.includes("Invalid login credentials")) {
        console.log('Test user does not exist, creating...');
        
        // Create the test user
        const { data: newUser, error: signUpError } = await supabase.auth.signUp({
          email: 'testuser@example.com',
          password: 'testpassword123',
          options: {
            data: {
              full_name: 'Test User',
              phone_number: '+16505188736'
            }
          }
        });

        if (signUpError) {
          console.error('Failed to create test user:', signUpError);
          return;
        }

        console.log('Test user created successfully:', newUser);
        
        // Sign out the newly created user
        await supabase.auth.signOut();
      }
    } catch (error) {
      console.error('Error handling test user:', error);
    }
  };

  const signInWithPhone = async (phoneNumber: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    
    try {
      const formattedPhone = formatPhoneNumber(phoneNumber);
      console.log('Signing in with phone:', formattedPhone);
      
      // Ensure user profile exists (create if needed)
      await createOrFindUserProfile(formattedPhone);
      
      // Check if this is our test phone number
      if (formattedPhone === '+16505188736') {
        console.log('Test phone number detected, ensuring test user exists...');
        
        // Ensure test user exists
        await createTestUserIfNotExists();
        
        console.log('Signing in as test user');
        
        // Sign in as the test user using email and password
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email: 'testuser@example.com',
          password: 'testpassword123'
        });
        
        if (signInError) {
          console.error('Test user sign in error:', signInError);
          throw new Error('Failed to authenticate test user');
        }
        
        // Link the test user to existing profile if it exists
        if (signInData.user) {
          const { error: linkError } = await supabase
            .from('user_profiles')
            .update({ auth_user_id: signInData.user.id })
            .eq('phone_number', formattedPhone)
            .is('auth_user_id', null);
          
          if (linkError) {
            console.error('Error linking test user profile:', linkError);
          }
        }
        
        console.log('Test user signed in successfully:', signInData);
        return { success: true };
      }
      
      // For real phone numbers, create/sign in automatically
      const sanitizedPhone = formattedPhone.replace(/[^0-9]/g, '');
      const testEmail = `phone${sanitizedPhone}@example.com`;
      const testPassword = 'phone_auth_secure_' + sanitizedPhone;
      
      console.log('Auto-signing in with phone number:', formattedPhone);
      
      // Try to sign in first
      let { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: testEmail,
        password: testPassword,
      });
      
      if (signInError && signInError.message.includes("Invalid login credentials")) {
        console.log('User does not exist, creating new auto-login user...');
        
        // Create auth user automatically
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: testEmail,
          password: testPassword,
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
        
        // Link to the existing profile we created earlier
        if (signUpData.user) {
          const { error: linkError } = await supabase
            .from('user_profiles')
            .update({ auth_user_id: signUpData.user.id })
            .eq('phone_number', formattedPhone)
            .is('auth_user_id', null);
          
          if (linkError) {
            console.error('Error linking new profile:', linkError);
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
        if (signInData?.user) {
          const { error: linkError } = await supabase
            .from('user_profiles')
            .update({ auth_user_id: signInData.user.id })
            .eq('phone_number', formattedPhone)
            .is('auth_user_id', null);
          
          if (linkError) {
            console.error('Error linking profile on sign in:', linkError);
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
