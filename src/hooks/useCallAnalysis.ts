
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export const useCallAnalysis = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['callAnalysis', user?.id],
    queryFn: async () => {
      if (!user?.id) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('vapi_call_analysis')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching call analysis:', error);
        throw error;
      }

      return data || [];
    },
    enabled: !!user?.id,
  });
};

export const useCallAnalysisById = (callId: string) => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['callAnalysis', callId, user?.id],
    queryFn: async () => {
      if (!user?.id || !callId) {
        throw new Error('User not authenticated or call ID missing');
      }

      const { data, error } = await supabase
        .from('vapi_call_analysis')
        .select('*')
        .eq('vapi_call_id', callId)
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error('Error fetching call analysis by ID:', error);
        throw error;
      }

      return data;
    },
    enabled: !!user?.id && !!callId,
  });
};
