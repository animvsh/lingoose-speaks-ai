import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface SubscriptionData {
  subscribed: boolean;
  subscription_tier: string;
  subscription_end: string | null;
}

export const useSubscriptionCheck = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['subscription-check', user?.phone_number],
    queryFn: async (): Promise<SubscriptionData> => {
      const { data, error } = await supabase.functions.invoke('check-subscription');
      
      if (error) {
        console.error('Error checking subscription:', error);
        throw error;
      }

      return data || {
        subscribed: false,
        subscription_tier: 'free_trial',
        subscription_end: null
      };
    },
    enabled: !!user?.phone_number,
    staleTime: 30000, // Cache for 30 seconds
    refetchInterval: 60000, // Refetch every minute
  });
};