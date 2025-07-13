
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
    queryKey: ['subscription-check', user?.email],
    queryFn: async (): Promise<SubscriptionData> => {
      console.log('🔄 Checking subscription status for user:', user?.email);
      
      const { data, error } = await supabase.functions.invoke('check-subscription');
      
      console.log('📦 Subscription check response:', { data, error });
      
      if (error) {
        console.error('❌ Error checking subscription:', error);
        throw error;
      }

      const result = data || {
        subscribed: false,
        subscription_tier: 'free_trial',
        subscription_end: null
      };

      console.log('✅ Subscription status:', result);
      return result;
    },
    enabled: !!user?.email,
    staleTime: 30000, // Cache for 30 seconds
    refetchInterval: 60000, // Refetch every minute
  });
};
