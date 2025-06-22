
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";

export const useCallInitiation = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const startCallMutation = useMutation({
    mutationFn: async (currentActivity: any) => {
      if (!user || !currentActivity) {
        throw new Error('User or activity not found');
      }

      // Get user profile for phone number
      const { data: userProfile, error: profileError } = await supabase
        .from('user_profiles')
        .select('phone_number')
        .eq('id', user.id)
        .single();

      if (profileError || !userProfile?.phone_number) {
        throw new Error('Phone number not found. Please update your profile.');
      }

      // Start the call using the edge function
      const { data, error } = await supabase.functions.invoke('start-vapi-call', {
        body: {
          phoneNumber: userProfile.phone_number,
          userId: user.id,
          topic: currentActivity.description || currentActivity.name
        }
      });

      if (error) {
        throw new Error(error.message || 'Failed to start call');
      }

      return data;
    },
    onSuccess: (data) => {
      toast({
        title: "Call Initiated! 📞",
        description: "You should receive a call shortly. Answer to start your practice session!",
      });
      console.log('Call started successfully:', data);
    },
    onError: (error) => {
      console.error('Failed to start call:', error);
      toast({
        title: "Call Failed",
        description: error instanceof Error ? error.message : 'Failed to start practice call',
        variant: "destructive",
      });
    }
  });

  return {
    startCall: startCallMutation.mutate,
    isStartingCall: startCallMutation.isPending
  };
};
