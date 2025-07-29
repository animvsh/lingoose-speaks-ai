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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    let checkout: any = null;

    const initializeStripe = async () => {
      try {
        console.log('EmbeddedCheckout: Starting initialization', { clientSecret: !!clientSecret, publishableKey: !!publishableKey });

        if (!publishableKey) {
          const errorMsg = 'Stripe publishable key not found';
          setError(errorMsg);
          onError?.(errorMsg);
          return;
        }

        if (!clientSecret) {
          const errorMsg = 'Client secret not found';
          setError(errorMsg);
          onError?.(errorMsg);
          return;
        }

        console.log('EmbeddedCheckout: Loading Stripe...');
        const stripeInstance = await loadStripe(publishableKey);
        if (!stripeInstance) {
          const errorMsg = 'Failed to load Stripe';
          setError(errorMsg);
          onError?.(errorMsg);
          return;
        }

        if (!isMounted) return;

        console.log('EmbeddedCheckout: Stripe loaded, waiting for DOM...');
        
        // Wait for DOM element to be available
        let attempts = 0;
        const maxAttempts = 50;
        const waitForElement = () => {
          if (!isMounted) return;
          
          if (checkoutRef.current) {
            console.log('EmbeddedCheckout: DOM element found, initializing checkout...');
            initializeCheckout(stripeInstance);
          } else if (attempts < maxAttempts) {
            attempts++;
            setTimeout(waitForElement, 100);
          } else {
            const errorMsg = 'DOM element not found after waiting';
            console.error('EmbeddedCheckout:', errorMsg);
            setError(errorMsg);
            onError?.(errorMsg);
            setIsLoading(false);
          }
        };

        waitForElement();

      } catch (error) {
        console.error('Error in initializeStripe:', error);
        if (isMounted) {
          const errorMsg = error instanceof Error ? error.message : 'Failed to initialize checkout';
          setError(errorMsg);
          onError?.(errorMsg);
          setIsLoading(false);
        }
      }
    };

    const initializeCheckout = async (stripeInstance: any) => {
      try {
        console.log('EmbeddedCheckout: Creating embedded checkout...');
        checkout = await stripeInstance.initEmbeddedCheckout({
          clientSecret,
          onComplete: () => {
            console.log('Stripe checkout completed successfully');
            onComplete?.();
          }
        });

        if (!isMounted) return;

        console.log('EmbeddedCheckout: Mounting checkout to DOM...');
        if (checkoutRef.current) {
          checkout.mount(checkoutRef.current);
          console.log('EmbeddedCheckout: Checkout mounted successfully');
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error in initializeCheckout:', error);
        if (isMounted) {
          const errorMsg = error instanceof Error ? error.message : 'Failed to mount checkout';
          setError(errorMsg);
          onError?.(errorMsg);
          setIsLoading(false);
        }
      }
    };

    if (clientSecret && publishableKey) {
      initializeStripe();
    }

    return () => {
      isMounted = false;
      if (checkout) {
        try {
          checkout.unmount();
        } catch (e) {
          console.log('Cleanup error:', e);
        }
      }
    };
  }, [clientSecret, publishableKey, onComplete, onError]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <div className="text-red-500 mb-2">⚠️ Checkout Error</div>
        <div className="text-sm text-muted-foreground">{error}</div>
      </div>
    );
  }

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
      <div 
        ref={checkoutRef} 
        className="min-h-[500px] w-full rounded-lg"
      />
    </div>
  );
};