
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";

export const useConversationAnalysis = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const analyzeConversationMutation = useMutation({
    mutationFn: async (conversationId: string) => {
      if (!user || !user.phone_number) {
        throw new Error('User information not found');
      }

      console.log('Analyzing conversation:', conversationId);

      const { data, error } = await supabase.functions.invoke('analyze-conversation', {
        body: {
          conversationId: conversationId,
          userId: user.id,
          phoneNumber: user.phone_number
        }
      });

      if (error) {
        throw new Error(error.message || 'Failed to analyze conversation');
      }

      return data;
    },
    onSuccess: (data) => {
      toast({
        title: "Analysis Complete! 📊",
        description: "Your conversation has been analyzed and insights are ready.",
      });
      console.log('Conversation analyzed successfully:', data);
    },
    onError: (error) => {
      console.error('Failed to analyze conversation:', error);
      toast({
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : 'Failed to analyze conversation',
        variant: "destructive",
      });
    }
  });

  return {
    analyzeConversation: analyzeConversationMutation.mutate,
    isAnalyzing: analyzeConversationMutation.isPending
  };
};
