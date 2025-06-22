
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";

export const useConversationEnd = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const endConversationMutation = useMutation({
    mutationFn: async ({ conversationId, summary }: { conversationId: string; summary: string }) => {
      if (!user) {
        throw new Error('User not found');
      }

      console.log('Ending conversation:', conversationId, 'with summary:', summary);

      const { data, error } = await supabase.functions.invoke('handle-conversation-end', {
        body: {
          userId: user.id,
          conversationId: conversationId,
          summary: summary
        }
      });

      if (error) {
        throw new Error(error.message || 'Failed to end conversation');
      }

      return data;
    },
    onSuccess: (data) => {
      toast({
        title: "Conversation Ended ✅",
        description: "Your conversation summary has been saved for future context.",
      });
      console.log('Conversation ended successfully:', data);
    },
    onError: (error) => {
      console.error('Failed to end conversation:', error);
      toast({
        title: "Error Ending Conversation",
        description: error instanceof Error ? error.message : 'Failed to end conversation',
        variant: "destructive",
      });
    }
  });

  return {
    endConversation: endConversationMutation.mutate,
    isEndingConversation: endConversationMutation.isPending
  };
};
