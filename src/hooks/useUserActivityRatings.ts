
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import type { Tables } from '@/integrations/supabase/types';

type UserActivityRating = Tables<'user_activity_ratings'>;

export const useUserActivityRatings = (activityId?: string) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: ratings } = useQuery({
    queryKey: ['user-activity-ratings', user?.id, activityId],
    queryFn: async () => {
      if (!user) throw new Error('No user found');

      let query = supabase
        .from('user_activity_ratings')
        .select(`
          *,
          activities (
            id,
            name,
            description,
            difficulty_level
          )
        `)
        .eq('user_id', user.id)
        .order('completed_at', { ascending: false });

      if (activityId) {
        query = query.eq('activity_id', activityId);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as (UserActivityRating & {
        activities: Tables<'activities'>;
      })[];
    },
    enabled: !!user,
  });

  const submitRating = useMutation({
    mutationFn: async ({
      activityId,
      skillId,
      rating,
      feedbackNotes,
      durationSeconds,
    }: {
      activityId: string;
      skillId: string;
      rating: number;
      feedbackNotes?: string;
      durationSeconds?: number;
    }) => {
      if (!user) throw new Error('No user found');

      const { data, error } = await supabase
        .from('user_activity_ratings')
        .upsert({
          user_id: user.id,
          activity_id: activityId,
          skill_id: skillId,
          rating,
          feedback_notes: feedbackNotes,
          duration_seconds: durationSeconds,
          completed_at: new Date().toISOString(),
        }, {
          onConflict: 'user_id,activity_id'
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-activity-ratings'] });
    },
  });

  return { 
    ratings, 
    submitRating 
  };
};
