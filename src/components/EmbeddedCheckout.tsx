import { useEffect, useRef, useState, useCallback } from 'react';
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
  const [isInitialized, setIsInitialized] = useState(false);
  const stripeRef = useRef<any>(null);

  const handleError = useCallback((errorMsg: string) => {
    console.error('EmbeddedCheckout Error:', errorMsg);
    setError(errorMsg);
    setIsLoading(false);
    onError?.(errorMsg);
  }, [onError]);

  useEffect(() => {
    // Prevent multiple initializations
    if (isInitialized || !clientSecret || !publishableKey) {
      return;
    }

    let isMounted = true;
    let checkout: any = null;

    const initializeCheckout = async () => {
      try {
        console.log('EmbeddedCheckout: Initializing once with:', { 
          hasClientSecret: !!clientSecret, 
          hasPublishableKey: !!publishableKey 
        });

        setIsInitialized(true);

        // Load Stripe only once
        if (!stripeRef.current) {
          console.log('EmbeddedCheckout: Loading Stripe...');
          stripeRef.current = await loadStripe(publishableKey);
          
          if (!stripeRef.current) {
            handleError('Failed to load Stripe');
            return;
          }
        }

        if (!isMounted) return;

        console.log('EmbeddedCheckout: Creating embedded checkout...');
        
        checkout = await stripeRef.current.initEmbeddedCheckout({
          clientSecret,
          onComplete: () => {
            console.log('Stripe checkout completed successfully');
            onComplete?.();
          }
        });

        if (!isMounted) return;

        // Wait for DOM element to be ready
        const mountCheckout = () => {
          if (checkoutRef.current && checkout) {
            console.log('EmbeddedCheckout: Mounting to DOM...');
            checkout.mount(checkoutRef.current);
            setIsLoading(false);
            console.log('EmbeddedCheckout: Successfully mounted');
          } else if (isMounted) {
            // Retry after a short delay
            setTimeout(mountCheckout, 50);
          }
        };

        mountCheckout();

      } catch (error) {
        console.error('EmbeddedCheckout initialization error:', error);
        if (isMounted) {
          handleError(error instanceof Error ? error.message : 'Failed to initialize checkout');
        }
      }
    };

    initializeCheckout();

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
  }, [clientSecret, publishableKey, isInitialized, onComplete, handleError]);

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