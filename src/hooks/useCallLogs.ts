
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import type { Tables } from '@/integrations/supabase/types';

type CallLog = Tables<'call_logs'>;

export const useCallLogs = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['call-logs', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('No user found');

      const { data, error } = await supabase
        .from('call_logs')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as CallLog[];
    },
    enabled: !!user,
  });
};
