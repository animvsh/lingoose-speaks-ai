
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useUpdateUserProfile = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (profileData: {
      full_name?: string;
      phone_number?: string;
      language?: string;
      preferred_call_time?: string;
    }) => {
      // Get the current user profile from localStorage
      const userProfile = localStorage.getItem('current_user_profile');
      if (!userProfile) {
        throw new Error('No authenticated user');
      }

      const profile = JSON.parse(userProfile);

      const { data: updatedProfile, error } = await supabase
        .from('user_profiles')
        .update(profileData)
        .eq('id', profile.id)
        .select('*')
        .single();

      if (error) {
        throw error;
      }

      // Update localStorage with fresh data
      localStorage.setItem('current_user_profile', JSON.stringify(updatedProfile));

      return updatedProfile;
    },
    onSuccess: () => {
      // Invalidate and refetch user profile
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
      
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
    },
    onError: (error) => {
      console.error('Failed to update profile:', error);
      toast({
        title: "Update failed",
        description: error instanceof Error ? error.message : 'Failed to update profile',
        variant: "destructive",
      });
    }
  });
};
