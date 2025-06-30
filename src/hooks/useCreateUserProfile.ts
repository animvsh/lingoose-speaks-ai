
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
      const { data: newProfile, error } = await supabase
        .from('user_profiles')
        .insert({
          phone_number: profileData.phone_number,
          full_name: profileData.full_name,
          proficiency_level: profileData.proficiency_level,
          language: profileData.language || 'hindi'
        })
        .select('*')
        .single();

      if (error) {
        throw error;
      }

      // Store user profile in localStorage for authentication
      localStorage.setItem('current_user_profile', JSON.stringify(newProfile));
      localStorage.setItem('phone_authenticated', 'true');
      localStorage.setItem('phone_number', profileData.phone_number);

      return newProfile;
    },
    onSuccess: () => {
      toast({
        title: "Profile created",
        description: "Your profile has been successfully created.",
      });
    },
    onError: (error) => {
      console.error('Failed to create profile:', error);
      toast({
        title: "Profile creation failed",
        description: error instanceof Error ? error.message : 'Failed to create profile',
        variant: "destructive",
      });
    }
  });
};
