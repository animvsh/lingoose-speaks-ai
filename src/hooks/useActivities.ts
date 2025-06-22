
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

type Activity = Tables<'activities'>;

export const useActivities = (skillId?: string) => {
  return useQuery({
    queryKey: ['activities', skillId],
    queryFn: async () => {
      let query = supabase
        .from('activities')
        .select('*')
        .eq('is_active', true)
        .order('activity_order', { ascending: true });

      if (skillId) {
        query = query.eq('skill_id', skillId);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as Activity[];
    },
    enabled: !skillId || !!skillId, // Always enabled, but if skillId provided, must be truthy
  });
};
