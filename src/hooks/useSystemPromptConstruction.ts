import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface ConstructPromptRequest {
  phoneNumber: string;
  language?: string;
  topic?: string;
  lastSummary?: string;
}

interface ConstructPromptResponse {
  systemPrompt: string;  // This is {{prompz}}
  firstMessage: string;  // This is {{headerz}}
  metadata: {
    templateUsed: string;
    evolvedPromptUsed: string | null;
    language: string;
    topic: string;
    hasLastSummary: boolean;
  };
}

export const useSystemPromptConstruction = () => {
  return useMutation({
    mutationFn: async (request: ConstructPromptRequest): Promise<ConstructPromptResponse> => {
      console.log('Constructing system prompt for VAPI call:', request);

      const { data, error } = await supabase.functions.invoke('construct-system-prompt', {
        body: request
      });

      if (error) {
        console.error('Failed to construct system prompt:', error);
        throw new Error(`Failed to construct system prompt: ${error.message}`);
      }

      return data;
    },
    onSuccess: (data) => {
      console.log('System prompt constructed successfully:', {
        systemPromptLength: data.systemPrompt.length,
        firstMessageLength: data.firstMessage.length,
        metadata: data.metadata
      });
    },
    onError: (error) => {
      console.error('Failed to construct system prompt:', error);
    }
  });
};