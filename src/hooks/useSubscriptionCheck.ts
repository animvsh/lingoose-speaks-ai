
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface SubscriptionData {
  subscribed: boolean;
  subscription_tier: string;
  subscription_end: string | null;
  trial_start_date: string | null;
}

export const useSubscriptionCheck = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['subscription-check', user?.phone_number],
    queryFn: async (): Promise<SubscriptionData> => {
      console.log('🔄 Checking subscription status for user:', user?.phone_number);
      
      const { data, error } = await supabase.functions.invoke('check-subscription', {
        body: { phone_number: user?.phone_number }
      });
      
      console.log('📦 Subscription check response:', { data, error });
      
      if (error) {
        console.error('❌ Error checking subscription:', error);
        throw error;
      }

      const result = data || {
        subscribed: false,
        subscription_tier: 'free_trial',
        subscription_end: null,
        trial_start_date: null
      };

      console.log('✅ Subscription status:', result);
      return result;
    },
    enabled: !!user?.phone_number,
    staleTime: 30000, // Cache for 30 seconds
    refetchInterval: 60000, // Refetch every minute
  });
};
