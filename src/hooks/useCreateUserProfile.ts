
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface CreateUserProfileData {
  phone_number: string;
  full_name: string;
  proficiency_level: number;
  language?: string;
}

export const useCreateUserProfile = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (profileData: CreateUserProfileData) => {
      console.log('Attempting to create profile with:', profileData);
      
      // First, check if a profile with this phone number already exists
      const { data: existingProfile, error: fetchError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('phone_number', profileData.phone_number)
        .maybeSingle();

      if (fetchError) {
        console.error('Error checking for existing profile:', fetchError);
        throw fetchError;
      }

      let profile;

      if (existingProfile) {
        console.log('Profile already exists, updating:', existingProfile.id);
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
          throw updateError;
        }

        profile = updatedProfile;
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
          throw insertError;
        }

        profile = newProfile;
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
