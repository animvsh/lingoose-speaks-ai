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

  const findOrCreateUserProfile = async (phoneNumber: string) => {
    try {
      console.log('Looking for existing profile with phone:', phoneNumber);
      
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

      console.log('No existing profile found, creating new one...');
      
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
      console.error('Error in findOrCreateUserProfile:', error);
      throw error;
    }
  };

  const signInWithPhone = async (phoneNumber: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    
    try {
      const formattedPhone = formatPhoneNumber(phoneNumber);
      console.log('Signing in with phone:', formattedPhone);
      
      // Find or create user profile first (this is safe to do multiple times)
      const profile = await findOrCreateUserProfile(formattedPhone);
      
      // Check if this is our test phone number
      if (formattedPhone === '+16505188736') {
        console.log('Test phone number detected, using test user authentication...');
        
        // Try to sign in as the test user directly
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email: 'testuser@example.com',
          password: 'testpassword123'
        });
        
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
            // Continue with auto-login instead of failing
            console.log('Falling back to auto-login for test number');
          } else {
            console.log('Test user created successfully:', newUser);
            
            // Link the new test user to the profile
            if (newUser.user && !profile.auth_user_id) {
              const { error: linkError } = await supabase
                .from('user_profiles')
                .update({ auth_user_id: newUser.user.id })
                .eq('id', profile.id);
              
              if (linkError) {
                console.error('Error linking test user profile:', linkError);
              } else {
                console.log('Linked test user to profile');
              }
            }
            
            return { success: true };
          }
        } else if (signInError) {
          console.error('Test user sign in error:', signInError);
          // Continue with auto-login instead of failing
          console.log('Falling back to auto-login for test number');
        } else {
          // Test user signed in successfully
          if (signInData?.user && !profile.auth_user_id) {
            const { error: linkError } = await supabase
              .from('user_profiles')
              .update({ auth_user_id: signInData.user.id })
              .eq('id', profile.id);
            
            if (linkError) {
              console.error('Error linking test user profile:', linkError);
            } else {
              console.log('Linked test user to profile');
            }
          }
          
          console.log('Test user signed in successfully:', signInData);
          return { success: true };
        }
      }
      
      // For all phone numbers (including test number if test auth failed), use auto-login
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
        
        // Link to the existing profile we found/created earlier
        if (signUpData.user && !profile.auth_user_id) {
          const { error: linkError } = await supabase
            .from('user_profiles')
            .update({ auth_user_id: signUpData.user.id })
            .eq('id', profile.id);
          
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
        if (signInData?.user && !profile.auth_user_id) {
          const { error: linkError } = await supabase
            .from('user_profiles')
            .update({ auth_user_id: signInData.user.id })
            .eq('id', profile.id);
          
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
