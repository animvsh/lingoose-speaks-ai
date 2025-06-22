
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import type { Tables } from '@/integrations/supabase/types';

type UserMiniSkillScore = Tables<'user_mini_skill_scores'>;
type UserOutlineProgress = Tables<'user_outline_progress'>;

export const useUserProgress = (outlineId?: string) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: miniSkillScores } = useQuery({
    queryKey: ['user-mini-skill-scores', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('No user found');

      const { data, error } = await supabase
        .from('user_mini_skill_scores')
        .select(`
          *,
          mini_skills (
            *,
            skills (
              *,
              learning_units (
                *,
                learning_outlines (*)
              )
            )
          )
        `)
        .eq('user_id', user.id);

      if (error) throw error;
      return data as (UserMiniSkillScore & {
        mini_skills: Tables<'mini_skills'> & {
          skills: Tables<'skills'> & {
            learning_units: Tables<'learning_units'> & {
              learning_outlines: Tables<'learning_outlines'>;
            };
          };
        };
      })[];
    },
    enabled: !!user,
  });

  const { data: outlineProgress } = useQuery({
    queryKey: ['user-outline-progress', user?.id, outlineId],
    queryFn: async () => {
      if (!user) throw new Error('No user found');

      const query = supabase
        .from('user_outline_progress')
        .select('*')
        .eq('user_id', user.id);

      if (outlineId) {
        query.eq('outline_id', outlineId);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as UserOutlineProgress[];
    },
    enabled: !!user,
  });

  const updateMiniSkillScore = useMutation({
    mutationFn: async ({ 
      miniSkillId, 
      score 
    }: { 
      miniSkillId: string; 
      score: number;
    }) => {
      if (!user) throw new Error('No user found');

      const { data, error } = await supabase
        .from('user_mini_skill_scores')
        .upsert({
          user_id: user.id,
          mini_skill_id: miniSkillId,
          score,
          last_practiced: new Date().toISOString(),
        }, {
          onConflict: 'user_id,mini_skill_id'
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-mini-skill-scores'] });
      queryClient.invalidateQueries({ queryKey: ['user-outline-progress'] });
    },
  });

  return { 
    miniSkillScores, 
    outlineProgress, 
    updateMiniSkillScore 
  };
};
