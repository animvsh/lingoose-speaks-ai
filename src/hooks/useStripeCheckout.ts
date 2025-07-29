
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useStripeCheckout = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [checkoutData, setCheckoutData] = useState<{
    clientSecret: string | null;
    publishableKey: string | null;
  }>({ clientSecret: null, publishableKey: null });
  const { toast } = useToast();

  const createCheckoutSession = async () => {
    try {
      setIsLoading(true);
      console.log('🔄 Starting checkout session creation...');
      
      const { data, error } = await supabase.functions.invoke('create-checkout');
      
      console.log('📦 Checkout response:', { data, error });
      
      if (error) {
        console.error('❌ Checkout error:', error);
        toast({
          title: "Error",
          description: `Failed to create checkout session: ${error.message}`,
          variant: "destructive",
        });
        return;
      }

      if (data?.clientSecret && data?.publishableKey) {
        console.log('✅ Checkout session created successfully');
        console.log('🔍 Setting checkout data:', {
          clientSecret: data.clientSecret,
          publishableKey: data.publishableKey
        });
        setCheckoutData({
          clientSecret: data.clientSecret,
          publishableKey: data.publishableKey
        });
        
        toast({
          title: "Checkout Ready! 💳",
          description: "Secure payment form loaded...",
        });
      } else {
        console.error('❌ No client secret returned:', data);
        console.log('🔍 Detailed data inspection:', {
          hasData: !!data,
          dataKeys: data ? Object.keys(data) : 'no data',
          clientSecret: data?.clientSecret,
          publishableKey: data?.publishableKey,
          fullData: data
        });
        throw new Error('No checkout session data returned from server');
      }
    } catch (error) {
      console.error('❌ Checkout error:', error);
      toast({
        title: "Error",
        description: `Something went wrong: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const openCustomerPortal = async () => {
    try {
      setIsLoading(true);
      console.log('🔄 Opening customer portal...');
      
      const { data, error } = await supabase.functions.invoke('customer-portal');
      
      console.log('📦 Customer portal response:', { data, error });
      
      if (error) {
        console.error('❌ Customer portal error:', error);
        toast({
          title: "Error",
          description: `Failed to open customer portal: ${error.message}`,
          variant: "destructive",
        });
        return;
      }

      if (data?.url) {
        console.log('✅ Customer portal URL received:', data.url);
        // Redirect to customer portal
        window.location.href = data.url;
        
        toast({
          title: "Redirecting to Portal! 🏪",
          description: "Taking you to customer portal...",
        });
      } else {
        console.error('❌ No portal URL returned:', data);
        throw new Error('No portal URL returned from server');
      }
    } catch (error) {
      console.error('❌ Customer portal error:', error);
      toast({
        title: "Error",
        description: `Something went wrong: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const closeCheckout = () => {
    console.log('🔄 closeCheckout called');
    console.trace('Checkout close stack trace');
    setCheckoutData({ clientSecret: null, publishableKey: null });
  };

  return {
    createCheckoutSession,
    openCustomerPortal,
    isLoading,
    checkoutData,
    closeCheckout,
  };
};
