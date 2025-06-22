
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useUserProfile = () => {
  return useQuery({
    queryKey: ['userProfile'],
    queryFn: async () => {
      // Get the current user profile from localStorage
      const userProfile = localStorage.getItem('current_user_profile');
      if (!userProfile) {
        throw new Error('No authenticated user');
      }

      const profile = JSON.parse(userProfile);
      
      // Optionally fetch fresh data from database
      const { data: freshProfile, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', profile.id)
        .single();

      if (error) {
        console.error('Error fetching fresh profile:', error);
        // Return cached profile if database fetch fails
        return profile;
      }

      // Update localStorage with fresh data
      localStorage.setItem('current_user_profile', JSON.stringify(freshProfile));
      
      return freshProfile;
    },
    enabled: !!localStorage.getItem('phone_authenticated'),
  });
};
