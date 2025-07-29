
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useStripeCheckout = () => {
  const [isLoading, setIsLoading] = useState(false);
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

      if (data?.url) {
        console.log('✅ Checkout URL received:', data.url);
        // Open Stripe checkout in a popup window
        const popup = window.open(
          data.url, 
          'stripe-checkout',
          'width=600,height=700,scrollbars=yes,resizable=yes,toolbar=no,menubar=no,location=no,directories=no,status=no'
        );
        
        // Focus the popup if it was successfully opened
        if (popup) {
          popup.focus();
        }
        
        toast({
          title: "Checkout Created! 💳",
          description: "Stripe checkout opened in popup window...",
        });
      } else {
        console.error('❌ No checkout URL returned:', data);
        throw new Error('No checkout URL returned from server');
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
        // Open customer portal in a popup window
        const popup = window.open(
          data.url, 
          'stripe-portal',
          'width=800,height=700,scrollbars=yes,resizable=yes,toolbar=no,menubar=no,location=no,directories=no,status=no'
        );
        
        // Focus the popup if it was successfully opened
        if (popup) {
          popup.focus();
        }
        
        toast({
          title: "Portal Opened! 🏪",
          description: "Stripe customer portal opened in popup window...",
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

  return {
    createCheckoutSession,
    openCustomerPortal,
    isLoading,
  };
};
