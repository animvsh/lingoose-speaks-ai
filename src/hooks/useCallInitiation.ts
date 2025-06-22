
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

      console.log('User from auth context:', user);

      // Read the user profile from the database to get the most up-to-date phone number
      const { data: userProfile, error: profileError } = await supabase
        .from('user_profiles')
        .select('phone_number, full_name')
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
      
      if (!phoneNumber) {
        throw new Error('Phone number not found. Please update your profile.');
      }

      // Validate phone number format
      const cleanedPhone = phoneNumber.replace(/\D/g, '');
      if (cleanedPhone.length < 10) {
        throw new Error('Invalid phone number. Please enter a complete phone number in your profile.');
      }

      console.log('Starting call with phone number:', phoneNumber);

      // Start the call using the edge function
      const { data, error } = await supabase.functions.invoke('start-vapi-call', {
        body: {
          phoneNumber: phoneNumber,
          userId: user.id,
          topic: currentActivity.description || currentActivity.name
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
    },
    onError: (error) => {
      console.error('Failed to start call:', error);
      
      // Show specific toast message for trial account limitation
      if (error instanceof Error && error.message.includes('verified numbers')) {
        toast({
          title: "Phone Verification Required",
          description: "Your phone number needs to be verified. Please contact support or try with a different verified number.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Call Failed",
          description: error instanceof Error ? error.message : 'Failed to start practice call',
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
