
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useEmailAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      return { success: true, data };
    } catch (error: any) {
      console.error('Sign in error:', error);
      return { 
        success: false, 
        error: error.message || 'Failed to sign in' 
      };
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, fullName: string, phoneNumber: string) => {
    setIsLoading(true);
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: fullName,
            phone_number: phoneNumber
          }
        }
      });

      if (error) throw error;

      return { success: true, data };
    } catch (error: any) {
      console.error('Sign up error:', error);
      return { 
        success: false, 
        error: error.message || 'Failed to create account' 
      };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    signIn,
    signUp,
    isLoading
  };
};
