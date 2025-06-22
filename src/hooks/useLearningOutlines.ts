
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

type LearningOutline = Tables<'learning_outlines'>;

export const useLearningOutlines = () => {
  return useQuery({
    queryKey: ['learning-outlines'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('learning_outlines')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data as LearningOutline[];
    },
  });
};
