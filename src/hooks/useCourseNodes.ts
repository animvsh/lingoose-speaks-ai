
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

type CourseNode = Tables<'course_nodes'>;

export const useCourseNodes = (courseId: string) => {
  return useQuery({
    queryKey: ['course-nodes', courseId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('course_nodes')
        .select('*')
        .eq('course_id', courseId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data as CourseNode[];
    },
    enabled: !!courseId,
  });
};
