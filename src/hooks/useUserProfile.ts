
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export const useUserProfile = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['userProfile', user?.id],
    queryFn: async () => {
      if (!user?.id) {
        throw new Error('No authenticated user');
      }

      // First try to find profile linked to auth user
      const { data: linkedProfile, error: linkedError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('auth_user_id', user.id)
        .single();

      if (linkedProfile && !linkedError) {
        return linkedProfile;
      }

      // If no linked profile found, check if there's a profile with matching phone number
      const userPhone = user.phone || user.user_metadata?.phone_number;
      if (userPhone) {
        const { data: phoneProfile, error: phoneError } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('phone_number', userPhone)
          .is('auth_user_id', null)
          .single();

        if (phoneProfile && !phoneError) {
          // Link this profile to the current auth user
          const { data: updatedProfile, error: updateError } = await supabase
            .from('user_profiles')
            .update({ auth_user_id: user.id })
            .eq('id', phoneProfile.id)
            .select('*')
            .single();

          if (updateError) {
            console.error('Error linking profile to auth user:', updateError);
            return phoneProfile; // Return unlinked profile
          }

          return updatedProfile;
        }
      }

      // If still no profile found, create a new one
      const { data: newProfile, error: createError } = await supabase
        .from('user_profiles')
        .insert({
          auth_user_id: user.id,
          full_name: user.user_metadata?.full_name || 'New User',
          phone_number: userPhone || '+1234567890',
          language: 'hindi'
        })
        .select('*')
        .single();

      if (createError) {
        throw createError;
      }

      return newProfile;
    },
    enabled: !!user?.id,
  });
};
