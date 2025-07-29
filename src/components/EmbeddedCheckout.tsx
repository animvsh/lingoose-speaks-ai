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
    let isMounted = true;

    const initializeStripe = async () => {
      try {
        console.log('EmbeddedCheckout: Starting initialization');

        if (!publishableKey) {
          onError?.('Stripe publishable key not found');
          return;
        }

        if (!clientSecret) {
          onError?.('Client secret not found');
          return;
        }

        console.log('EmbeddedCheckout: Loading Stripe...');
        const stripeInstance = await loadStripe(publishableKey);
        if (!stripeInstance) {
          onError?.('Failed to load Stripe');
          return;
        }

        if (!isMounted) return;

        console.log('EmbeddedCheckout: Stripe loaded, initializing checkout...');
        setStripe(stripeInstance);

        const checkout = await stripeInstance.initEmbeddedCheckout({
          clientSecret,
          onComplete: () => {
            console.log('Stripe checkout completed successfully');
            onComplete?.();
          }
        });

        if (!isMounted) return;

        console.log('EmbeddedCheckout: Mounting checkout...');
        if (checkoutRef.current) {
          checkout.mount(checkoutRef.current);
          console.log('EmbeddedCheckout: Checkout mounted successfully');
          setIsLoading(false);
        } else {
          console.error('EmbeddedCheckout: DOM element not found');
          onError?.('Failed to mount checkout');
        }
      } catch (error) {
        console.error('Error initializing Stripe checkout:', error);
        if (isMounted) {
          onError?.(error instanceof Error ? error.message : 'Failed to initialize checkout');
          setIsLoading(false);
        }
      }
    };

    // Small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      if (isMounted && clientSecret && publishableKey) {
        initializeStripe();
      }
    }, 100);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
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
      <div ref={checkoutRef} className="min-h-[400px] w-full" />
    </div>
  );
};