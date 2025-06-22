
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export const useActivityGeneration = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const generateActivityMutation = useMutation({
    mutationFn: async (currentActivity: any) => {
      if (!user || !currentActivity) {
        throw new Error('User or current activity not found');
      }

      const response = await supabase.functions.invoke('generate-activity', {
        body: { 
          currentActivity: currentActivity.name,
          userId: user.id,
          activityId: currentActivity.id
        }
      });
      
      if (response.error) {
        throw new Error(response.error.message || 'Failed to generate activity');
      }
      
      return response.data;
    },
    onSuccess: (data) => {
      console.log('Activity regenerated successfully:', data);
      // Invalidate and refetch the current activity
      queryClient.invalidateQueries({ queryKey: ['current-activity', user?.id] });
    },
    onError: (error) => {
      console.error('Failed to regenerate activity:', error);
    }
  });

  return {
    regenerateActivity: generateActivityMutation.mutate,
    isRegenerating: generateActivityMutation.isPending
  };
};
