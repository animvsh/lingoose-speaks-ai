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
  const checkoutInstanceRef = useRef<any>(null);
  const stripeInstanceRef = useRef<any>(null);
  const currentClientSecretRef = useRef<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleError = useCallback((errorMsg: string) => {
    console.error('EmbeddedCheckout Error:', errorMsg);
    setError(errorMsg);
    setIsLoading(false);
    onError?.(errorMsg);
  }, [onError]);

  const destroyExistingCheckout = useCallback(() => {
    if (checkoutInstanceRef.current) {
      try {
        console.log('EmbeddedCheckout: Destroying existing checkout instance');
        checkoutInstanceRef.current.unmount();
        checkoutInstanceRef.current = null;
      } catch (e) {
        console.log('EmbeddedCheckout: Error destroying checkout:', e);
      }
    }
  }, []);

  useEffect(() => {
    // If clientSecret hasn't changed and we already have a checkout, don't reinitialize
    if (currentClientSecretRef.current === clientSecret && checkoutInstanceRef.current) {
      console.log('EmbeddedCheckout: Using existing checkout instance');
      return;
    }

    // If clientSecret changed, destroy existing checkout
    if (currentClientSecretRef.current !== clientSecret) {
      destroyExistingCheckout();
      currentClientSecretRef.current = clientSecret;
    }

    if (!clientSecret || !publishableKey) {
      return;
    }

    let isMounted = true;
    
    const initializeCheckout = async () => {
      try {
        console.log('EmbeddedCheckout: Starting fresh initialization', { 
          clientSecret: clientSecret.substring(0, 20) + '...', 
          publishableKey: publishableKey.substring(0, 20) + '...' 
        });

        setError(null);
        setIsLoading(true);

        // Load Stripe instance if not already loaded
        if (!stripeInstanceRef.current) {
          console.log('EmbeddedCheckout: Loading Stripe...');
          stripeInstanceRef.current = await loadStripe(publishableKey);
          
          if (!stripeInstanceRef.current) {
            handleError('Failed to load Stripe');
            return;
          }
        }

        if (!isMounted) return;

        console.log('EmbeddedCheckout: Creating new embedded checkout...');
        
        // Create new checkout instance
        const newCheckout = await stripeInstanceRef.current.initEmbeddedCheckout({
          clientSecret,
          onComplete: () => {
            console.log('Stripe checkout completed successfully');
            onComplete?.();
          }
        });

        if (!isMounted) return;

        // Store the new checkout instance
        checkoutInstanceRef.current = newCheckout;

        // Mount to DOM
        const mountToDOM = () => {
          if (checkoutRef.current && checkoutInstanceRef.current && isMounted) {
            console.log('EmbeddedCheckout: Mounting to DOM...');
            checkoutInstanceRef.current.mount(checkoutRef.current);
            setIsLoading(false);
            console.log('EmbeddedCheckout: Successfully mounted');
          } else if (isMounted) {
            // Retry after a short delay if DOM not ready
            setTimeout(mountToDOM, 100);
          }
        };

        mountToDOM();

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
    };
  }, [clientSecret, publishableKey, onComplete, handleError, destroyExistingCheckout]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      destroyExistingCheckout();
    };
  }, [destroyExistingCheckout]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <div className="text-red-500 mb-2">⚠️ Checkout Error</div>
        <div className="text-sm text-muted-foreground">{error}</div>
        <button 
          onClick={() => {
            setError(null);
            setIsLoading(true);
            destroyExistingCheckout();
            currentClientSecretRef.current = '';
          }}
          className="mt-2 px-4 py-2 bg-primary text-white rounded text-sm"
        >
          Retry
        </button>
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