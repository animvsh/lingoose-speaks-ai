
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useUserProfile = () => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['userProfile'],
    queryFn: async () => {
      // Get the current user profile from localStorage
      const userProfile = localStorage.getItem('current_user_profile');
      if (!userProfile) {
        throw new Error('No authenticated user');
      }

      const profile = JSON.parse(userProfile);
      
      // Always fetch fresh data from database to get latest conversation summary
      // Use secure query that works with new RLS policies
      const { data: freshProfile, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('phone_number', profile.phone_number)
        .single();

      if (error) {
        console.error('Error fetching fresh profile:', error);
        // Return cached profile if database fetch fails
        return profile;
      }

      // Update localStorage with fresh data including conversation summary
      localStorage.setItem('current_user_profile', JSON.stringify(freshProfile));
      
      return freshProfile;
    },
    enabled: !!localStorage.getItem('phone_authenticated'),
    // Refetch more frequently to ensure we have the latest conversation summary
    staleTime: 30000, // 30 seconds
    refetchInterval: 60000, // 1 minute
  });

  // Add a method to manually refresh the profile
  const refreshProfile = () => {
    queryClient.invalidateQueries({ queryKey: ['userProfile'] });
  };

  return {
    ...query,
    refreshProfile
  };
};
