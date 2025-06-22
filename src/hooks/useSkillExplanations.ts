
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

type SkillExplanation = Tables<'skill_explanations'>;

export const useSkillExplanations = (skillId?: string) => {
  const queryClient = useQueryClient();

  const { data: explanation, isLoading } = useQuery({
    queryKey: ['skill-explanation', skillId],
    queryFn: async () => {
      if (!skillId) return null;

      const { data, error } = await supabase
        .from('skill_explanations')
        .select('*')
        .eq('skill_id', skillId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching skill explanation:', error);
        throw error;
      }

      return data as SkillExplanation | null;
    },
    enabled: !!skillId,
  });

  const generateExplanation = useMutation({
    mutationFn: async ({ skillId, skillName }: { skillId: string; skillName: string }) => {
      const { data, error } = await supabase.functions.invoke('generate-skill-explanation', {
        body: { skillId, skillName }
      });

      if (error) {
        console.error('Error generating skill explanation:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skill-explanation'] });
    },
  });

  return {
    explanation,
    isLoading,
    generateExplanation,
  };
};
