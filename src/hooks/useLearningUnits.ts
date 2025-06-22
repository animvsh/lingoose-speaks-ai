
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

type LearningUnit = Tables<'learning_units'>;

export const useLearningUnits = (outlineId: string) => {
  return useQuery({
    queryKey: ['learning-units', outlineId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('learning_units')
        .select('*')
        .eq('outline_id', outlineId)
        .order('unit_order', { ascending: true });

      if (error) throw error;
      return data as LearningUnit[];
    },
    enabled: !!outlineId,
  });
};
