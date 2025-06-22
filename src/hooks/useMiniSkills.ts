
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

type MiniSkill = Tables<'mini_skills'>;

export const useMiniSkills = (skillId: string) => {
  return useQuery({
    queryKey: ['mini-skills', skillId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('mini_skills')
        .select('*')
        .eq('skill_id', skillId)
        .order('mini_skill_order', { ascending: true });

      if (error) throw error;
      return data as MiniSkill[];
    },
    enabled: !!skillId,
  });
};
