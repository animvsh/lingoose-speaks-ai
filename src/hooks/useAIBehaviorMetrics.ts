import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';

export interface AIBehaviorMetrics {
  id: string;
  user_id: string;
  vapi_call_analysis_id: string;
  phone_number: string;
  call_date: string;
  instruction_adherence: number;
  target_vocab_prompt_rate: number;
  question_density: number;
  continuity_score: number;
  followup_quality: number;
  repetition_avoidance: number;
  tone_consistency: number;
  recovery_score: number;
  callback_usage: number;
  user_fluency_delta: number;
  analysis_details: any;
  improvement_suggestions: string[];
  created_at: string;
  updated_at: string;
}

export const useAIBehaviorMetrics = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['ai-behavior-metrics', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('No user found');

      const { data, error } = await supabase
        .from('ai_behavior_metrics')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      return data as AIBehaviorMetrics[];
    },
    enabled: !!user,
  });
};

export const useLatestAIBehaviorMetrics = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['latest-ai-behavior-metrics', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('No user found');

      const { data, error } = await supabase
        .from('ai_behavior_metrics')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') throw error;
      return data as AIBehaviorMetrics | null;
    },
    enabled: !!user,
  });
};

export const useAIBehaviorAnalysis = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const analyzeAIBehaviorMutation = useMutation({
    mutationFn: async ({ callAnalysisId, transcript }: { callAnalysisId: string; transcript: string }) => {
      if (!user) {
        throw new Error('User not authenticated');
      }

      console.log('Analyzing AI behavior for call:', callAnalysisId);

      const { data, error } = await supabase.functions.invoke('analyze-ai-behavior', {
        body: {
          callAnalysisId,
          transcript,
          userId: user.id,
          phoneNumber: user.phone_number
        }
      });

      if (error) {
        throw new Error(error.message || 'Failed to analyze AI behavior');
      }

      return data;
    },
    onSuccess: () => {
      toast({
        title: "AI Behavior Analyzed! 🤖",
        description: "AI performance metrics have been calculated and insights generated.",
      });
      
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['ai-behavior-metrics'] });
      queryClient.invalidateQueries({ queryKey: ['latest-ai-behavior-metrics'] });
      queryClient.invalidateQueries({ queryKey: ['system-prompt-evolution'] });
    },
    onError: (error) => {
      console.error('Failed to analyze AI behavior:', error);
      toast({
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : 'Failed to analyze AI behavior',
        variant: "destructive",
      });
    }
  });

  return {
    analyzeAIBehavior: analyzeAIBehaviorMutation.mutate,
    isAnalyzing: analyzeAIBehaviorMutation.isPending
  };
};

export const useSystemPromptEvolution = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['system-prompt-evolution', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('No user found');

      const { data, error } = await supabase
        .from('system_prompt_evolution')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
};

export const useCurrentSystemPrompt = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['current-system-prompt', user?.id],
    queryFn: async () => {
      if (!user?.phone_number) throw new Error('No user phone number found');

      const { data, error } = await supabase
        .from('system_prompt_evolution')
        .select('*')
        .eq('phone_number', user.phone_number)
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },
    enabled: !!user?.phone_number,
  });
};