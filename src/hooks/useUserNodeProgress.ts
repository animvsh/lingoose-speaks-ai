
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';

// Mock progress data since the table was removed
const mockProgress = [
  { id: "1", user_id: "", node_id: "1", status: "completed", fluency_percentage: 100, last_practiced: new Date().toISOString(), practice_sessions: 5 },
  { id: "2", user_id: "", node_id: "2", status: "in_progress", fluency_percentage: 75, last_practiced: new Date().toISOString(), practice_sessions: 3 },
  { id: "3", user_id: "", node_id: "3", status: "available", fluency_percentage: 0, last_practiced: null, practice_sessions: 0 }
];

export const useUserNodeProgress = (courseId: string) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: progress } = useQuery({
    queryKey: ['user-node-progress', user?.id, courseId],
    queryFn: async () => {
      if (!user) throw new Error('No user found');
      // Return mock data since the table was removed
      return mockProgress.map(p => ({ ...p, user_id: user.id }));
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

      // Mock update since the table was removed - just return mock data
      return {
        id: nodeId,
        user_id: user.id,
        node_id: nodeId,
        status,
        fluency_percentage: fluencyPercentage || 0,
        last_practiced: new Date().toISOString(),
        practice_sessions: 1,
      };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-node-progress'] });
    },
  });

  return { progress, updateProgress };
};
