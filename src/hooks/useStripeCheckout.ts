
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useStripeCheckout = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [modalData, setModalData] = useState<{ isOpen: boolean; url: string | null; title: string }>({
    isOpen: false,
    url: null,
    title: ""
  });
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
        // Open Stripe checkout in modal
        setModalData({
          isOpen: true,
          url: data.url,
          title: "Stripe Checkout"
        });
        
        toast({
          title: "Checkout Created! 💳",
          description: "Stripe checkout opened...",
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
        // Open customer portal in modal
        setModalData({
          isOpen: true,
          url: data.url,
          title: "Stripe Customer Portal"
        });
        
        toast({
          title: "Portal Opened! 🏪",
          description: "Stripe customer portal opened...",
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

  const closeModal = () => {
    setModalData({ isOpen: false, url: null, title: "" });
  };

  return {
    createCheckoutSession,
    openCustomerPortal,
    isLoading,
    modalData,
    closeModal,
  };
};
