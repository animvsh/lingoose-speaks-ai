
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export const useUpdateUserProfile = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (profileData: {
      full_name?: string;
      phone_number?: string;
      language?: string;
      preferred_call_time?: string;
    }) => {
      if (!user?.id) {
        throw new Error('No authenticated user');
      }

      // First try to update profile linked to auth user
      const { data: linkedProfile, error: linkedError } = await supabase
        .from('user_profiles')
        .update(profileData)
        .eq('auth_user_id', user.id)
        .select('*')
        .single();

      if (linkedProfile && !linkedError) {
        return linkedProfile;
      }

      // If no linked profile, try to find and update by phone number
      const userPhone = user.phone || user.user_metadata?.phone_number;
      if (userPhone) {
        const { data: phoneProfile, error: phoneError } = await supabase
          .from('user_profiles')
          .update({ ...profileData, auth_user_id: user.id }) // Also link it while updating
          .eq('phone_number', userPhone)
          .is('auth_user_id', null)
          .select('*')
          .single();

        if (phoneProfile && !phoneError) {
          return phoneProfile;
        }
      }

      // If no profile exists, create a new one
      const { data: newProfile, error: createError } = await supabase
        .from('user_profiles')
        .insert({
          ...profileData,
          auth_user_id: user.id,
          full_name: profileData.full_name || 'New User',
          phone_number: profileData.phone_number || userPhone || '+1234567890',
          language: profileData.language || 'hindi'
        })
        .select('*')
        .single();

      if (createError) {
        throw createError;
      }

      return newProfile;
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
