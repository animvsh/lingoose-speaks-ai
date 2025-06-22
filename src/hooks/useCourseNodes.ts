
import { useQuery } from '@tanstack/react-query';

// Mock course nodes since the table was removed
const mockNodes = [
  { id: "1", course_id: "1", name: "Greetings", difficulty: "beginner", node_type: "lesson", created_at: new Date().toISOString() },
  { id: "2", course_id: "1", name: "Numbers", difficulty: "beginner", node_type: "lesson", created_at: new Date().toISOString() },
  { id: "3", course_id: "1", name: "Family", difficulty: "intermediate", node_type: "lesson", created_at: new Date().toISOString() },
  { id: "4", course_id: "2", name: "Food", difficulty: "intermediate", node_type: "lesson", created_at: new Date().toISOString() },
  { id: "5", course_id: "2", name: "Travel", difficulty: "advanced", node_type: "lesson", created_at: new Date().toISOString() },
  { id: "6", course_id: "2", name: "Business", difficulty: "advanced", node_type: "lesson", created_at: new Date().toISOString() }
];

export const useCourseNodes = (courseId: string) => {
  return useQuery({
    queryKey: ['course-nodes', courseId],
    queryFn: async () => {
      // Return mock data filtered by courseId since the table was removed
      return mockNodes.filter(node => node.course_id === courseId);
    },
    enabled: !!courseId,
  });
};
