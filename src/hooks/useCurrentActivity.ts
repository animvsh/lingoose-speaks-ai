
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { usePostHog } from './usePostHog';
import { useLearningAnalytics } from './useLearningAnalytics';

export const useCurrentActivity = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { trackActivityRegenerate, trackError } = usePostHog();
  const { trackDifficultyAdjustment } = useLearningAnalytics();

  const { data: currentActivity, isLoading, error } = useQuery({
    queryKey: ['current-activity', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('No user found');

      // Get the first active activity (we'll treat this as the current activity)
      const { data, error } = await supabase
        .from('activities')
        .select('*')
        .eq('is_active', true)
        .order('activity_order')
        .limit(1)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching activity:', error);
        throw error;
      }

      // If no activity found, return a default one
      if (!data) {
        return {
          id: null,
          name: "Hotel check-in conversation",
          description: "Practice checking into a hotel 🏨",
          estimated_duration_minutes: 15,
          difficulty_level: "medium",
          prompt: "You are checking into a hotel. Practice greeting the receptionist, providing your reservation details, asking about amenities, and completing the check-in process.",
          skills: [
            { name: "Greeting phrases", rating: 65 },
            { name: "Personal information", rating: 78 },
            { name: "Room preferences", rating: 42 },
            { name: "Payment discussion", rating: 89 }
          ]
        };
      }

      return {
        ...data,
        skills: [
          { name: "Greeting phrases", rating: 65 },
          { name: "Personal information", rating: 78 },
          { name: "Room preferences", rating: 42 },
          { name: "Payment discussion", rating: 89 }
        ]
      };
    },
    enabled: !!user
  });

  const regenerateActivity = useMutation({
    mutationFn: async () => {
      if (!user || !currentActivity) {
        throw new Error('User or current activity not found');
      }

      console.log('Regenerating activity with enhanced analytics tracking');

      const response = await supabase.functions.invoke('generate-activity', {
        body: { 
          currentActivity: currentActivity.name,
          userId: user.id,
          activityId: currentActivity.id
        }
      });
      
      if (response.error) {
        console.error('Edge function error:', response.error);
        throw new Error(response.error.message || 'Failed to generate activity');
      }
      
      return response.data;
    },
    onSuccess: (data) => {
      console.log('Activity regenerated successfully:', data);
      
      // Enhanced tracking with learning analytics
      trackActivityRegenerate(currentActivity, data);
      
      // Track difficulty adjustment if applicable
      if (data && data.difficulty_level !== currentActivity.difficulty_level) {
        trackDifficultyAdjustment(
          currentActivity.difficulty_level || 'medium',
          data.difficulty_level || 'medium',
          'user_request'
        );
      }
      
      // Invalidate and refetch the current activity
      queryClient.invalidateQueries({ queryKey: ['current-activity', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['activities'] });
    },
    onError: (error) => {
      console.error('Failed to regenerate activity:', error);
      trackError(error.message, 'activity_regeneration', { 
        user_id: user?.id,
        activity_id: currentActivity?.id 
      });
    }
  });

  return {
    currentActivity,
    isLoading,
    error,
    regenerateActivity: regenerateActivity.mutate,
    isRegenerating: regenerateActivity.isPending,
    regenerateError: regenerateActivity.error
  };
};
