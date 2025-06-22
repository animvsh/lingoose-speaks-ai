
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

type Skill = Tables<'skills'>;

export const useSkills = (unitId: string) => {
  return useQuery({
    queryKey: ['skills', unitId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('skills')
        .select('*')
        .eq('unit_id', unitId)
        .order('skill_order', { ascending: true });

      if (error) throw error;
      return data as Skill[];
    },
    enabled: !!unitId,
  });
};
