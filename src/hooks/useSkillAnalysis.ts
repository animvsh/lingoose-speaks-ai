
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface CoreMetrics {
  id: string;
  words_per_minute: number;
  filler_words_per_minute: number;
  pauses_per_minute: number;
  speech_clarity_percent: number;
  turn_count: number;
  unique_vocabulary_count: number;
  target_vocabulary_usage_percent: number;
  self_correction_rate: number;
  average_response_delay_seconds: number;
  fluency_progress_delta: number;
  composite_score: number;
  advancement_eligible: boolean;
  areas_for_improvement: string[];
  call_date: string;
  created_at: string;
}

export const useCoreMetrics = (callAnalysisId?: string) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['core-metrics', user?.id, callAnalysisId],
    queryFn: async () => {
      if (!user || !callAnalysisId) throw new Error('No user or call analysis ID found');

      const { data, error } = await supabase
        .from('core_language_metrics')
        .select('*')
        .eq('vapi_call_analysis_id', callAnalysisId)
        .eq('user_id', user.id)
        .order('call_date', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!user && !!callAnalysisId,
  });
};

export const useLatestCoreMetrics = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['latest-core-metrics', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('No user found');

      const { data, error } = await supabase
        .from('core_language_metrics')
        .select('*')
        .eq('user_id', user.id)
        .order('call_date', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },
    enabled: !!user,
  });
};
