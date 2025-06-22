
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

  const sendOTP = async (phoneNumber: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    
    try {
      // Generate OTP
      const otp = generateOTP();
      const expiresAt = Date.now() + (10 * 60 * 1000); // 10 minutes from now
      
      // Store OTP in localStorage (in production, you'd want to store this server-side)
      const otpData: StoredOTP = {
        otp,
        phoneNumber,
        expiresAt
      };
      localStorage.setItem('phone_auth_otp', JSON.stringify(otpData));
      
      // Send SMS via Supabase edge function
      const { data, error } = await supabase.functions.invoke('send-sms', {
        body: { phoneNumber, otp }
      });

      if (error) {
        console.error('Edge function error:', error);
        throw new Error(error.message || 'Failed to send SMS');
      }

      if (!data?.success) {
        throw new Error(data?.error || 'Failed to send SMS');
      }

      console.log('SMS sent successfully');
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

  const verifyOTP = async (phoneNumber: string, inputOTP: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    
    try {
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
      if (otpData.phoneNumber !== phoneNumber) {
        throw new Error('Phone number mismatch. Please try again.');
      }

      // Verify OTP
      if (otpData.otp !== inputOTP) {
        throw new Error('Invalid verification code. Please try again.');
      }

      // OTP is valid, clean up
      localStorage.removeItem('phone_auth_otp');
      
      // Create a user session with phone number
      // For demo purposes, we'll create a test account
      const testEmail = `${phoneNumber.replace(/[^0-9]/g, '')}@phone.lingoose.app`;
      const testPassword = 'phone_auth_' + phoneNumber.replace(/[^0-9]/g, '');
      
      // Try to sign in first
      let { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: testEmail,
        password: testPassword,
      });
      
      if (signInError && signInError.message.includes("Invalid login credentials")) {
        // User doesn't exist, create them
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: testEmail,
          password: testPassword,
          options: {
            data: {
              full_name: "Phone User",
              phone_number: phoneNumber
            }
          }
        });
        
        if (signUpError) throw signUpError;
      } else if (signInError) {
        throw signInError;
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
