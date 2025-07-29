import { useEffect, useRef, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';

interface EmbeddedCheckoutProps {
  clientSecret: string;
  publishableKey: string;
  onComplete?: () => void;
  onError?: (error: string) => void;
}

export const EmbeddedCheckout = ({ 
  clientSecret, 
  publishableKey, 
  onComplete,
  onError 
}: EmbeddedCheckoutProps) => {
  const checkoutRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [stripe, setStripe] = useState<any>(null);

  useEffect(() => {
    const initializeStripe = async () => {
      try {
        if (!publishableKey) {
          onError?.('Stripe publishable key not found');
          return;
        }

        const stripeInstance = await loadStripe(publishableKey);
        if (!stripeInstance) {
          onError?.('Failed to load Stripe');
          return;
        }

        setStripe(stripeInstance);

        if (clientSecret && checkoutRef.current) {
          const checkout = await stripeInstance.initEmbeddedCheckout({
            clientSecret,
            onComplete: () => {
              console.log('Stripe checkout completed successfully');
              onComplete?.();
            }
          });

          checkout.mount(checkoutRef.current);
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error initializing Stripe checkout:', error);
        onError?.(error instanceof Error ? error.message : 'Failed to initialize checkout');
        setIsLoading(false);
      }
    };

    initializeStripe();
  }, [clientSecret, publishableKey, onComplete, onError]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-2">Loading secure checkout...</span>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div ref={checkoutRef} className="min-h-[400px]" />
    </div>
  );
};