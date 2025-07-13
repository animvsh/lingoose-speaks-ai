
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface SubscriptionStatus {
  has_minutes: boolean;
  minutes_used: number;
  minutes_remaining: number;
  subscription_status: string;
  needs_upgrade: boolean;
}

export const useSubscriptionStatus = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['subscription-status', user?.phone_number],
    queryFn: async (): Promise<SubscriptionStatus> => {
      if (!user?.phone_number) {
        throw new Error('No phone number available');
      }

      const { data, error } = await supabase.rpc('check_available_minutes', {
        p_phone_number: user.phone_number
      });

      if (error) {
        console.error('Error checking subscription status:', error);
        throw error;
      }

      return (Array.isArray(data) ? data[0] : data) || {
        has_minutes: false,
        minutes_used: 0,
        minutes_remaining: 0,
        subscription_status: 'free_trial',
        needs_upgrade: true
      };
    },
    enabled: !!user?.phone_number,
    staleTime: 30000, // Cache for 30 seconds
    refetchInterval: 60000, // Refetch every minute
  });
};
