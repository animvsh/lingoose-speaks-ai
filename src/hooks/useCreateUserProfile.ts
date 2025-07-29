
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface CreateUserProfileData {
  phone_number: string;
  full_name: string;
  proficiency_level: number;
  language?: string;
}

// Phone number formatting helper
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

// Input validation functions
const validatePhoneNumber = (phone: string): boolean => {
  return /^\+[1-9]\d{9,14}$/.test(phone);
};

const validateUserName = (name: string): boolean => {
  const trimmed = name.trim();
  return trimmed.length >= 1 && trimmed.length <= 100 && /^[a-zA-Z\s\-']+$/.test(trimmed);
};

const logSecurityEvent = async (action: string, phoneNumber: string, details: any = {}) => {
  try {
    // Use untyped insert to bypass TypeScript checks for security_audit_logs table
    await (supabase as any).from('security_audit_logs').insert({
      phone_number: phoneNumber,
      action,
      details,
      ip_address: null,
      user_agent: navigator.userAgent
    });
  } catch (error) {
    console.warn('Failed to log security event:', error);
  }
};

export const useCreateUserProfile = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (profileData: CreateUserProfileData) => {
      console.log('Attempting to create profile with:', profileData);
      
      // Auto-format phone number to handle missing country codes
      const formattedPhone = formatPhoneNumber(profileData.phone_number);
      
      // Input validation
      if (!validatePhoneNumber(formattedPhone)) {
        await logSecurityEvent('profile_creation_invalid_phone', formattedPhone, {
          error: 'Invalid phone number format',
          original_phone: profileData.phone_number
        });
        throw new Error('Please enter a valid phone number with country code (e.g., +1234567890)');
      }
      
      if (!validateUserName(profileData.full_name)) {
        await logSecurityEvent('profile_creation_invalid_name', profileData.phone_number, {
          error: 'Invalid user name format',
          attempted_name: profileData.full_name
        });
        throw new Error('Name must be 1-100 characters and contain only letters, spaces, hyphens, and apostrophes');
      }
      
      await logSecurityEvent('profile_creation_attempted', formattedPhone, {
        full_name: profileData.full_name,
        language: profileData.language || 'hindi',
        original_phone: profileData.phone_number
      });
      
      // Check if a profile with this phone number already exists
      const { data: existingProfile, error: fetchError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('phone_number', formattedPhone)
        .maybeSingle();

      if (fetchError) {
        console.error('Error checking for existing profile:', fetchError);
        await logSecurityEvent('profile_lookup_failed', formattedPhone, {
          error: fetchError.message
        });
        throw fetchError;
      }

      if (existingProfile) {
        console.log('Phone number already exists:', formattedPhone);
        await logSecurityEvent('profile_creation_duplicate_phone', formattedPhone, {
          existing_user_id: existingProfile.id,
          attempted_name: profileData.full_name
        });
        throw new Error('PHONE_EXISTS');
      }

      // Create a new profile
      console.log('Creating new profile');
      
      const { data: newProfile, error: insertError } = await supabase
        .from('user_profiles')
        .insert({
          phone_number: formattedPhone,
          full_name: profileData.full_name,
          proficiency_level: profileData.proficiency_level,
          language: profileData.language || 'hindi'
        })
        .select('*')
        .single();

      if (insertError) {
        console.error('Error creating profile:', insertError);
        await logSecurityEvent('profile_creation_failed', formattedPhone, {
          error: insertError.message
        });
        throw insertError;
      }

      const profile = newProfile;
      
      await logSecurityEvent('profile_creation_success', formattedPhone, {
        user_id: profile.id
      });

      // Store user profile in localStorage for authentication
      localStorage.setItem('current_user_profile', JSON.stringify(profile));
      localStorage.setItem('phone_authenticated', 'true');
      localStorage.setItem('phone_number', formattedPhone);
      
      // CRITICAL: Remove the needs_onboarding flag since profile is now complete
      localStorage.removeItem('needs_onboarding');

      console.log('Profile operation successful:', profile);
      return profile;
    },
    onSuccess: (profile) => {
      console.log('Profile creation/update successful:', profile);
      toast({
        title: "Profile ready",
        description: "Your profile has been successfully set up.",
      });
    },
    onError: (error) => {
      console.error('Failed to create/update profile:', error);
      toast({
        title: "Profile setup failed",
        description: error instanceof Error ? error.message : 'Failed to set up profile',
        variant: "destructive",
      });
    }
  });
};
