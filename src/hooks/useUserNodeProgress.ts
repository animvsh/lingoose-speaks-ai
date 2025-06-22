
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import type { Tables } from '@/integrations/supabase/types';

type UserNodeProgress = Tables<'user_node_progress'>;

export const useUserNodeProgress = (courseId: string) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: progress } = useQuery({
    queryKey: ['user-node-progress', user?.id, courseId],
    queryFn: async () => {
      if (!user) throw new Error('No user found');

      const { data, error } = await supabase
        .from('user_node_progress')
        .select(`
          *,
          course_nodes!inner(course_id)
        `)
        .eq('user_id', user.id)
        .eq('course_nodes.course_id', courseId);

      if (error) throw error;
      return data as (UserNodeProgress & { course_nodes: { course_id: string } })[];
    },
    enabled: !!user && !!courseId,
  });

  const updateProgress = useMutation({
    mutationFn: async ({ nodeId, status, fluencyPercentage }: { 
      nodeId: string; 
      status: 'locked' | 'available' | 'in_progress' | 'completed' | 'mastered';
      fluencyPercentage?: number;
    }) => {
      if (!user) throw new Error('No user found');

      const { data, error } = await supabase
        .from('user_node_progress')
        .upsert({
          user_id: user.id,
          node_id: nodeId,
          status,
          fluency_percentage: fluencyPercentage || 0,
          last_practiced: new Date().toISOString(),
          practice_sessions: 1,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-node-progress'] });
    },
  });

  return { progress, updateProgress };
};
