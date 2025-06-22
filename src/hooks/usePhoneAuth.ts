
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface StoredOTP {
  otp: string;
  phoneNumber: string;
  expiresAt: number;
}

export const usePhoneAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const generateOTP = (): string => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

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

  const createTestUserIfNotExists = async (): Promise<void> => {
    try {
      console.log('Checking if test user exists...');
      
      // Try to sign in the test user to see if they exist
      const { data: existingUser, error: signInError } = await supabase.auth.signInWithPassword({
        email: 'testuser@lingoose.app',
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
          email: 'testuser@lingoose.app',
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

  const sendOTP = async (phoneNumber: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    
    try {
      const formattedPhone = formatPhoneNumber(phoneNumber);
      console.log('Sending OTP to:', formattedPhone);
      
      // Check if this is our test phone number
      if (formattedPhone === '+16505188736') {
        console.log('Test phone number detected, ensuring test user exists...');
        
        // Ensure test user exists
        await createTestUserIfNotExists();
        
        console.log('Using test OTP: 123456');
        
        // Store a fixed OTP for the test number
        const otpData: StoredOTP = {
          otp: '123456',
          phoneNumber: formattedPhone,
          expiresAt: Date.now() + (10 * 60 * 1000) // 10 minutes from now
        };
        localStorage.setItem('phone_auth_otp', JSON.stringify(otpData));
        
        return { success: true };
      }
      
      // Generate OTP for real phone numbers
      const otp = generateOTP();
      const expiresAt = Date.now() + (10 * 60 * 1000); // 10 minutes from now
      
      // Store OTP in localStorage
      const otpData: StoredOTP = {
        otp,
        phoneNumber: formattedPhone,
        expiresAt
      };
      localStorage.setItem('phone_auth_otp', JSON.stringify(otpData));
      
      console.log('Generated OTP:', otp, 'for phone:', formattedPhone);
      
      // Send SMS via Supabase edge function
      const { data, error } = await supabase.functions.invoke('send-sms', {
        body: { phoneNumber: formattedPhone, otp }
      });

      if (error) {
        console.error('Edge function error:', error);
        throw new Error(error.message || 'Failed to send SMS');
      }

      if (!data?.success) {
        console.error('SMS sending failed:', data);
        throw new Error(data?.error || 'Failed to send SMS');
      }

      console.log('SMS sent successfully');
      return { success: true };
      
    } catch (error: any) {
      console.error('Send OTP error:', error);
      return { 
        success: false, 
        error: error.message || 'Failed to send verification code. Please check your phone number and try again.' 
      };
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOTP = async (phoneNumber: string, inputOTP: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    
    try {
      const formattedPhone = formatPhoneNumber(phoneNumber);
      
      // Get stored OTP
      const storedData = localStorage.getItem('phone_auth_otp');
      if (!storedData) {
        throw new Error('No verification code found. Please request a new one.');
      }

      const otpData: StoredOTP = JSON.parse(storedData);
      
      // Check if OTP has expired
      if (Date.now() > otpData.expiresAt) {
        localStorage.removeItem('phone_auth_otp');
        throw new Error('Verification code has expired. Please request a new one.');
      }

      // Check if phone number matches
      if (otpData.phoneNumber !== formattedPhone) {
        throw new Error('Phone number mismatch. Please try again.');
      }

      // Verify OTP
      if (otpData.otp !== inputOTP) {
        throw new Error('Invalid verification code. Please try again.');
      }

      // OTP is valid, clean up
      localStorage.removeItem('phone_auth_otp');
      
      // Check if this is our test phone number
      if (formattedPhone === '+16505188736') {
        console.log('Test phone number detected, signing in as test user');
        
        // Sign in as the test user using email and password
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email: 'testuser@lingoose.app',
          password: 'testpassword123'
        });
        
        if (signInError) {
          console.error('Test user sign in error:', signInError);
          throw new Error('Failed to authenticate test user');
        }
        
        console.log('Test user signed in successfully:', signInData);
        return { success: true };
      }
      
      // For real phone numbers, create/sign in normally
      const sanitizedPhone = formattedPhone.replace(/[^0-9]/g, '');
      const testEmail = `phone${sanitizedPhone}@lingoose.app`;
      const testPassword = 'phone_auth_secure_' + sanitizedPhone;
      
      console.log('Attempting to sign in with email:', testEmail);
      
      // Try to sign in first
      let { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: testEmail,
        password: testPassword,
      });
      
      if (signInError && signInError.message.includes("Invalid login credentials")) {
        console.log('User does not exist, creating new user...');
        // User doesn't exist, create them
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
          console.error('Sign up error:', signUpError);
          throw signUpError;
        }
        
        console.log('User created successfully:', signUpData);
      } else if (signInError) {
        console.error('Sign in error:', signInError);
        throw signInError;
      } else {
        console.log('User signed in successfully:', signInData);
      }

      return { success: true };
      
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

  return {
    sendOTP,
    verifyOTP,
    isLoading
  };
};
