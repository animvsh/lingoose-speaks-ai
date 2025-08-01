import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface EnhancedUserProfileData {
  phone_number: string;
  full_name: string;
  proficiency_level: number;
  age: number;
  location: string;
  mother_tongue: string;
  account_type: 'self' | 'child' | 'other';
  account_holder_name?: string;
  language?: string;
}

// Helper function to format phone number
const formatPhoneNumber = (phone: string): string => {
  // Remove all non-digit characters
  const digitsOnly = phone.replace(/\D/g, '');
  
  // If it doesn't start with +, add +1 for US numbers
  if (!phone.startsWith('+')) {
    // If it's 10 digits, assume US number
    if (digitsOnly.length === 10) {
      return `+1${digitsOnly}`;
    }
    // If it's 11 digits and starts with 1, it's already US format
    if (digitsOnly.length === 11 && digitsOnly.startsWith('1')) {
      return `+${digitsOnly}`;
    }
    // Otherwise, add +91 for Indian numbers (common case)
    return `+91${digitsOnly}`;
  }
  
  return phone;
};

// Input validation functions
const validatePhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^\+[1-9]\d{6,14}$/;
  return phoneRegex.test(phone);
};

const validateUserName = (name: string): boolean => {
  return name.trim().length >= 2 && /^[a-zA-Z\s]+$/.test(name.trim());
};

// Log security events
const logSecurityEvent = async (action: string, phoneNumber: string, details?: any) => {
  try {
    await supabase
      .from('security_audit_logs')
      .insert({
        action,
        phone_number: phoneNumber,
        details: details || {},
        ip_address: 'client-side', // In a real app, you'd get this from server
        user_agent: navigator.userAgent
      });
  } catch (error) {
    console.error('Failed to log security event:', error);
  }
};

export const useEnhancedCreateUserProfile = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (profileData: EnhancedUserProfileData) => {
      const formattedPhone = formatPhoneNumber(profileData.phone_number);
      
      // Validate inputs
      if (!profileData.phone_number || !validatePhoneNumber(formattedPhone)) {
        throw new Error(`Invalid phone number format. Expected format: +1234567890, received: ${profileData.phone_number}`);
      }
      
      if (!validateUserName(profileData.full_name)) {
        throw new Error('Invalid name format');
      }

      // Log attempt
      await logSecurityEvent('profile_creation_attempt', formattedPhone, {
        full_name: profileData.full_name,
        account_type: profileData.account_type
      });

      try {
        // Use upsert to handle existing profiles
        const { data: newProfile, error } = await supabase
          .from('user_profiles')
          .upsert({
            phone_number: formattedPhone,
            full_name: profileData.full_name.trim(),
            proficiency_level: profileData.proficiency_level,
            age: profileData.age,
            location: profileData.location.trim(),
            mother_tongue: profileData.mother_tongue,
            account_type: profileData.account_type,
            account_holder_name: profileData.account_holder_name?.trim(),
            language: 'hindi', // Default learning language
            role: 'pending_user',
            is_verified: false,
            updated_at: new Date().toISOString()
          }, {
            onConflict: 'phone_number'
          })
          .select('*')
          .single();

        if (error) {
          await logSecurityEvent('profile_creation_failed', formattedPhone, {
            error: error.message,
            code: error.code
          });
          throw error;
        }

        // Log successful creation
        await logSecurityEvent('profile_creation_success', formattedPhone, {
          profile_id: newProfile.id,
          account_type: profileData.account_type
        });

        // Store user data in localStorage
        localStorage.setItem('current_user_profile', JSON.stringify(newProfile));
        localStorage.setItem('phone_authenticated', 'true');
        localStorage.setItem('user_phone_number', formattedPhone);
        
        // Remove onboarding flag
        localStorage.removeItem('needs_onboarding');

        return newProfile;
      } catch (error) {
        await logSecurityEvent('profile_creation_failed', formattedPhone, {
          error: error instanceof Error ? error.message : 'Unknown error'
        });
        throw error;
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
      
      toast({
        title: "Welcome to BOL! 🎉",
        description: `Profile created successfully for ${data.full_name}`,
      });
    },
    onError: (error) => {
      console.error('Failed to create enhanced profile:', error);
      toast({
        title: "Profile creation failed",
        description: error instanceof Error ? error.message : 'Failed to create profile',
        variant: "destructive",
      });
    }
  });
};
