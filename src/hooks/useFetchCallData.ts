
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";

export const useFetchCallData = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const fetchCallDataMutation = useMutation({
    mutationFn: async (callId: string) => {
      if (!user) {
        throw new Error('User not authenticated');
      }

      console.log('Fetching call data for call ID:', callId);

      const { data, error } = await supabase.functions.invoke('fetch-vapi-call', {
        body: {
          callId: callId,
          userId: user.id
        }
      });

      if (error) {
        throw new Error(error.message || 'Failed to fetch call data');
      }

      return data;
    },
    onSuccess: (data) => {
      toast({
        title: "Call Data Retrieved! 📊",
        description: "Call analysis has been completed and saved.",
      });
      console.log('Call data fetched successfully:', data);
      
      // Invalidate and refetch call analysis data
      queryClient.invalidateQueries({ queryKey: ['callAnalysis'] });
    },
    onError: (error) => {
      console.error('Failed to fetch call data:', error);
      toast({
        title: "Failed to Fetch Call Data",
        description: error instanceof Error ? error.message : 'Failed to retrieve call analysis',
        variant: "destructive",
      });
    }
  });

  return {
    fetchCallData: fetchCallDataMutation.mutate,
    isFetching: fetchCallDataMutation.isPending
  };
};
