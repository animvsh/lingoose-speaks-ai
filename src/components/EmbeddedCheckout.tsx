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
        console.log('EmbeddedCheckout: Starting initialization with:', { 
          hasClientSecret: !!clientSecret, 
          hasPublishableKey: !!publishableKey 
        });

        if (!publishableKey) {
          console.error('EmbeddedCheckout: No publishable key provided');
          onError?.('Stripe publishable key not found');
          return;
        }

        if (!clientSecret) {
          console.error('EmbeddedCheckout: No client secret provided');
          onError?.('Client secret not found');
          return;
        }

        console.log('EmbeddedCheckout: Loading Stripe...');
        const stripeInstance = await loadStripe(publishableKey);
        if (!stripeInstance) {
          console.error('EmbeddedCheckout: Failed to load Stripe instance');
          onError?.('Failed to load Stripe');
          return;
        }

        console.log('EmbeddedCheckout: Stripe loaded successfully');
        setStripe(stripeInstance);

        if (checkoutRef.current) {
          console.log('EmbeddedCheckout: Initializing embedded checkout...');
          const checkout = await stripeInstance.initEmbeddedCheckout({
            clientSecret,
            onComplete: () => {
              console.log('Stripe checkout completed successfully');
              onComplete?.();
            }
          });

          console.log('EmbeddedCheckout: Mounting checkout to DOM element');
          checkout.mount(checkoutRef.current);
          console.log('EmbeddedCheckout: Checkout mounted successfully');
          setIsLoading(false);
        } else {
          console.error('EmbeddedCheckout: Checkout ref not available');
          onError?.('Checkout container not ready');
        }
      } catch (error) {
        console.error('Error initializing Stripe checkout:', error);
        onError?.(error instanceof Error ? error.message : 'Failed to initialize checkout');
        setIsLoading(false);
      }
    };

    if (clientSecret && publishableKey) {
      initializeStripe();
    }
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
    <div className="w-full bg-background">
      <div ref={checkoutRef} className="min-h-[500px] w-full overflow-hidden" />
    </div>
  );
};