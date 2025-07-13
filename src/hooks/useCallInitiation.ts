
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { useSubscriptionStatus } from "@/hooks/useSubscriptionStatus";

export const useCallInitiation = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: subscriptionStatus } = useSubscriptionStatus();

  const startCallMutation = useMutation({
    mutationFn: async (currentActivity: any) => {
      if (!user || !currentActivity) {
        throw new Error('User or activity not found');
      }

      // Check if user has available minutes before starting call
      if (!subscriptionStatus?.has_minutes) {
        const errorMsg = subscriptionStatus?.subscription_status === 'free_trial' 
          ? 'Your free trial has expired or you\'ve reached your limit. Please upgrade to continue.'
          : 'You\'ve reached your weekly limit. Your minutes will reset next week or upgrade for more.';
        throw new Error(errorMsg);
      }

      console.log('User from auth context:', user);

      // Read the user profile from the database to get the most up-to-date phone number and conversation summary
      const { data: userProfile, error: profileError } = await supabase
        .from('user_profiles')
        .select('phone_number, full_name, last_conversation_summary')
        .eq('id', user.id)
        .single();

      if (profileError) {
        console.error('Error fetching user profile:', profileError);
        throw new Error('Failed to fetch user profile. Please try again.');
      }

      if (!userProfile) {
        throw new Error('User profile not found. Please update your profile.');
      }

      console.log('User profile from database:', userProfile);

      const phoneNumber = userProfile.phone_number;
      const lastConversationSummary = userProfile.last_conversation_summary;
      
      if (!phoneNumber) {
        throw new Error('Phone number not found. Please update your profile.');
      }

      // Validate phone number format
      const cleanedPhone = phoneNumber.replace(/\D/g, '');
      if (cleanedPhone.length < 10) {
        throw new Error('Invalid phone number. Please enter a complete phone number in your profile.');
      }

      console.log('Starting call with phone number:', phoneNumber);
      console.log('Last conversation summary:', lastConversationSummary);
      console.log('Minutes remaining:', subscriptionStatus?.minutes_remaining);

      // Calculate max duration based on remaining minutes (convert to seconds)
      const maxDurationSeconds = Math.floor((subscriptionStatus?.minutes_remaining || 25) * 60);

      // Start the call using the edge function with duration limit
      const { data, error } = await supabase.functions.invoke('start-vapi-call', {
        body: {
          phoneNumber: phoneNumber,
          userId: user.id,
          topic: currentActivity.description || currentActivity.name,
          lastConversationSummary: lastConversationSummary,
          maxDurationSeconds: maxDurationSeconds
        }
      });

      if (error) {
        // Handle specific Twilio trial account errors
        if (error.message && error.message.includes('Trial accounts may only make calls to verified numbers')) {
          throw new Error('Your phone number needs to be verified with our calling service. This is a limitation of trial accounts. Please contact support to verify your number, or try with a different verified phone number.');
        }
        
        if (error.message && error.message.includes('Daily Outbound Call Limit')) {
          throw new Error('Daily call limit reached. Please try again tomorrow or contact support for increased limits.');
        }
        
        if (error.message && error.message.includes('Invalid phone number')) {
          throw new Error('Invalid phone number format. Please check your phone number in profile settings and ensure it includes the country code (e.g., +1 for US numbers).');
        }
        
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
      
      // Invalidate subscription status to refresh minutes
      queryClient.invalidateQueries({ queryKey: ['subscription-status'] });
      
      // Invalidate all analytics and call-related queries to trigger refresh
      queryClient.invalidateQueries({ queryKey: ['curriculum-analytics'] });
      queryClient.invalidateQueries({ queryKey: ['call-logs'] });
      queryClient.invalidateQueries({ queryKey: ['user-activity-ratings'] });
      queryClient.invalidateQueries({ queryKey: ['call-analysis'] });
      queryClient.invalidateQueries({ queryKey: ['latest-call-analysis'] });
      queryClient.invalidateQueries({ queryKey: ['vapi_call_analysis'] });
    },
    onError: (error) => {
      console.error('Failed to start call:', error);
      
      // Show specific toast message for different error types
      if (error instanceof Error) {
        if (error.message.includes('verified numbers')) {
          toast({
            title: "Phone Verification Required",
            description: "Your phone number needs to be verified. Please contact support or try with a different verified number.",
            variant: "destructive",
          });
        } else if (error.message.includes('trial has expired') || error.message.includes('reached your limit')) {
          toast({
            title: "Minutes Limit Reached",
            description: error.message,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Call Failed",
            description: error.message,
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Call Failed",
          description: 'Failed to start practice call',
          variant: "destructive",
        });
      }
    }
  });

  return {
    startCall: startCallMutation.mutate,
    isStartingCall: startCallMutation.isPending
  };
};
