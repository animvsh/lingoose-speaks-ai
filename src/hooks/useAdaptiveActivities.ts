import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface AdaptiveActivity {
  id: string;
  scheduled_date: string;
  activity_type: string;
  title: string;
  description: string;
  target_metrics: string[];
  difficulty_level: number;
  estimated_duration_minutes: number;
  focus_areas: any;
  target_vocabulary: string[];
  conversation_prompts: string[];
  practice_scenarios: any;
  weakness_areas: string[];
  strength_areas: string[];
  adaptation_reason: string;
  is_completed: boolean;
  completed_at: string | null;
  performance_after: any;
  created_at: string;
}

export const useAdaptiveActivities = (daysAhead: number = 7) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['adaptive-activities', user?.id, daysAhead],
    queryFn: async () => {
      if (!user) throw new Error('No user found');

      const endDate = new Date();
      endDate.setDate(endDate.getDate() + daysAhead);

      const { data, error } = await supabase
        .from('adaptive_activities')
        .select('*')
        .eq('user_id', user.id)
        .gte('scheduled_date', new Date().toISOString().split('T')[0])
        .lte('scheduled_date', endDate.toISOString().split('T')[0])
        .order('scheduled_date', { ascending: true });

      if (error) throw error;
      return data as AdaptiveActivity[];
    },
    enabled: !!user,
  });
};

export const useTodaysActivity = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['todays-activity', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('No user found');

      const today = new Date().toISOString().split('T')[0];

      const { data, error } = await supabase
        .from('adaptive_activities')
        .select('*')
        .eq('user_id', user.id)
        .eq('scheduled_date', today)
        .limit(1)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') throw error;
      return data as AdaptiveActivity | null;
    },
    enabled: !!user,
  });
};

export const useCompleteActivity = () => {
  const { user } = useAuth();

  return async (activityId: string, performanceData?: any) => {
    if (!user) throw new Error('No user found');

    const { error } = await supabase
      .from('adaptive_activities')
      .update({
        is_completed: true,
        completed_at: new Date().toISOString(),
        performance_after: performanceData
      })
      .eq('id', activityId)
      .eq('user_id', user.id);

    if (error) throw error;
  };
};