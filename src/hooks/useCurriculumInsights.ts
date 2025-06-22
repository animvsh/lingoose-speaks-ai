
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export const useCurriculumInsights = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['curriculumInsights', user?.id],
    queryFn: async () => {
      if (!user?.phone_number) {
        throw new Error('User phone number not found');
      }

      const { data, error } = await supabase
        .from('curriculum_insights')
        .select('*')
        .eq('phone_number', user.phone_number)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Error fetching curriculum insights:', error);
        throw error;
      }

      return data || [];
    },
    enabled: !!user?.phone_number,
  });
};
