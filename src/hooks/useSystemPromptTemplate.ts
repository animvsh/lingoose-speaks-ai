import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';

export interface SystemPromptTemplate {
  id: string;
  user_id: string;
  phone_number: string;
  template_content: string;
  is_active: boolean;
  template_version: number;
  created_at: string;
  updated_at: string;
}

export const useSystemPromptTemplate = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['system-prompt-template', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('No user found');

      const { data, error } = await supabase
        .from('system_prompt_templates')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') throw error;
      return data as SystemPromptTemplate | null;
    },
    enabled: !!user,
  });
};

export const useUpdateSystemPromptTemplate = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ templateContent }: { templateContent: string }) => {
      if (!user) {
        throw new Error('User not authenticated');
      }

      // First, deactivate current template
      await supabase
        .from('system_prompt_templates')
        .update({ is_active: false })
        .eq('user_id', user.id);

      // Create new template version
      const { data, error } = await supabase
        .from('system_prompt_templates')
        .insert({
          user_id: user.id,
          phone_number: user.phone_number || '',
          template_content: templateContent,
          is_active: true,
          template_version: 1
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Template Updated! 🎯",
        description: "Your system prompt template has been saved successfully.",
      });
      
      queryClient.invalidateQueries({ queryKey: ['system-prompt-template'] });
    },
    onError: (error) => {
      console.error('Failed to update template:', error);
      toast({
        title: "Update Failed",
        description: error instanceof Error ? error.message : 'Failed to update template',
        variant: "destructive",
      });
    }
  });
};

export const useCreateSystemPromptTemplate = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ templateContent }: { templateContent: string }) => {
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('system_prompt_templates')
        .insert({
          user_id: user.id,
          phone_number: user.phone_number || '',
          template_content: templateContent,
          is_active: true,
          template_version: 1
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Template Created! 🎯",
        description: "Your system prompt template has been created successfully.",
      });
      
      queryClient.invalidateQueries({ queryKey: ['system-prompt-template'] });
    },
    onError: (error) => {
      console.error('Failed to create template:', error);
      toast({
        title: "Creation Failed",
        description: error instanceof Error ? error.message : 'Failed to create template',
        variant: "destructive",
      });
    }
  });
};