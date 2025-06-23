
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useSkillAnalysis = (callAnalysisId?: string) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['skill-analysis', user?.id, callAnalysisId],
    queryFn: async () => {
      if (!user || !callAnalysisId) throw new Error('No user or call analysis ID found');

      const { data, error } = await supabase
        .from('vapi_skill_analysis')
        .select('*')
        .eq('vapi_call_analysis_id', callAnalysisId)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!user && !!callAnalysisId,
  });
};

export const useLatestSkillAnalysis = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['latest-skill-analysis', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('No user found');

      // First get the latest call analysis
      const { data: latestCall, error: callError } = await supabase
        .from('vapi_call_analysis')
        .select('id')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (callError || !latestCall) {
        return [];
      }

      // Then get the skill analysis for that call
      const { data, error } = await supabase
        .from('vapi_skill_analysis')
        .select('*')
        .eq('vapi_call_analysis_id', latestCall.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });
};
