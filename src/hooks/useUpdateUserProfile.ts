
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface UpdateUserProfileData {
  full_name?: string;
  phone_number?: string;
  language?: string;
  preferred_call_time?: string;
}

export const useUpdateUserProfile = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateUserProfileData) => {
      if (!user) throw new Error('No user found');

      const { error } = await supabase
        .from('user_profiles')
        .update(data)
        .eq('id', user.id);

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-profile', user?.id] });
    },
  });
};
