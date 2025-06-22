
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';

// Mock call logs since the table was removed
const mockCallLogs = [
  {
    id: "1",
    user_id: "",
    phone_number: "+1234567890",
    call_status: "completed",
    duration: 300,
    created_at: new Date().toISOString()
  }
];

export const useCallLogs = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['call-logs', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('No user found');
      // Return mock data since the call_logs table was removed
      return mockCallLogs.map(log => ({ ...log, user_id: user.id }));
    },
    enabled: !!user,
  });
};
