
import { useQuery } from '@tanstack/react-query';

// Since courses table was removed, return mock data
const mockCourses = [
  {
    id: "1",
    name: "French Basics",
    language: "French", 
    description: "Learn fundamental French conversation skills",
    created_at: new Date().toISOString()
  },
  {
    id: "2",
    name: "Spanish Essentials", 
    language: "Spanish",
    description: "Master essential Spanish phrases and grammar",
    created_at: new Date().toISOString()
  }
];

export const useCourses = () => {
  return useQuery({
    queryKey: ['courses'],
    queryFn: async () => {
      // Return mock data since the courses table was removed
      return mockCourses;
    },
  });
};
