
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface CreateUserProfileData {
  phone_number: string;
  full_name: string;
  proficiency_level: number;
  language?: string;
}

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
      
      // Input validation
      if (!validatePhoneNumber(profileData.phone_number)) {
        await logSecurityEvent('profile_creation_invalid_phone', profileData.phone_number, {
          error: 'Invalid phone number format'
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
      
      await logSecurityEvent('profile_creation_attempted', profileData.phone_number, {
        full_name: profileData.full_name,
        language: profileData.language || 'hindi'
      });
      
      // Check if a profile with this phone number already exists
      const { data: existingProfile, error: fetchError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('phone_number', profileData.phone_number)
        .maybeSingle();

      if (fetchError) {
        console.error('Error checking for existing profile:', fetchError);
        await logSecurityEvent('profile_lookup_failed', profileData.phone_number, {
          error: fetchError.message
        });
        throw fetchError;
      }

      let profile;

      if (existingProfile) {
        console.log('Profile already exists, updating:', existingProfile.id);
        
        await logSecurityEvent('profile_update_attempted', profileData.phone_number, {
          user_id: existingProfile.id,
          update_fields: ['full_name', 'proficiency_level', 'language']
        });
        
        // Update the existing profile
        const { data: updatedProfile, error: updateError } = await supabase
          .from('user_profiles')
          .update({
            full_name: profileData.full_name,
            proficiency_level: profileData.proficiency_level,
            language: profileData.language || 'hindi'
          })
          .eq('id', existingProfile.id)
          .select('*')
          .single();

        if (updateError) {
          console.error('Error updating profile:', updateError);
          await logSecurityEvent('profile_update_failed', profileData.phone_number, {
            user_id: existingProfile.id,
            error: updateError.message
          });
          throw updateError;
        }

        profile = updatedProfile;
        
        await logSecurityEvent('profile_update_success', profileData.phone_number, {
          user_id: profile.id
        });
      } else {
        console.log('Creating new profile');
        
        // Create a new profile
        const { data: newProfile, error: insertError } = await supabase
          .from('user_profiles')
          .insert({
            phone_number: profileData.phone_number,
            full_name: profileData.full_name,
            proficiency_level: profileData.proficiency_level,
            language: profileData.language || 'hindi'
          })
          .select('*')
          .single();

        if (insertError) {
          console.error('Error creating profile:', insertError);
          await logSecurityEvent('profile_creation_failed', profileData.phone_number, {
            error: insertError.message
          });
          throw insertError;
        }

        profile = newProfile;
        
        await logSecurityEvent('profile_creation_success', profileData.phone_number, {
          user_id: profile.id
        });
      }

      // Store user profile in localStorage for authentication
      localStorage.setItem('current_user_profile', JSON.stringify(profile));
      localStorage.setItem('phone_authenticated', 'true');
      localStorage.setItem('phone_number', profileData.phone_number);

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
