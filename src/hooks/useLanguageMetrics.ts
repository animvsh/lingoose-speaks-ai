import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useLanguageMetrics = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['language-metrics', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('No user found');

      // Get the latest call analysis to link to language metrics
      const { data: latestCall, error: callError } = await supabase
        .from('vapi_call_analysis')
        .select('id')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (callError || !latestCall) {
        console.log('No call analysis found or error:', callError);
        return null;
      }

      // Fetch language metrics for the latest call
      // Using any type temporarily until types are regenerated
      const { data: metrics, error: metricsError } = await (supabase as any)
        .from('call_language_metrics')
        .select('*')
        .eq('vapi_call_analysis_id', latestCall.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (metricsError) {
        console.error('Error fetching language metrics:', metricsError);
        throw metricsError;
      }

      return metrics;
    },
    enabled: !!user,
    staleTime: 30000, // 30 seconds
  });
};