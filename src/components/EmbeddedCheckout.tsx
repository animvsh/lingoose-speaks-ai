import { useEffect, useRef, useState, useCallback } from 'react';
import { getStripe, destroyCurrentCheckout, setCurrentCheckout } from '@/lib/stripe';

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
  const mountedRef = useRef(false);

  const handleError = useCallback((errorMsg: string) => {
    console.error('EmbeddedCheckout Error:', errorMsg);
    setError(errorMsg);
    setIsLoading(false);
    onError?.(errorMsg);
  }, [onError]);

  const handleRetry = useCallback(() => {
    console.log('🔄 Retrying checkout initialization');
    setError(null);
    setIsLoading(true);
    mountedRef.current = false;
    // Destroy any existing checkout before retry
    destroyCurrentCheckout();
    
    // Force a small delay to ensure cleanup is complete
    setTimeout(() => {
      // The effect will re-run and create a new checkout
    }, 100);
  }, []);

  useEffect(() => {
    if (!clientSecret || !publishableKey || mountedRef.current) {
      return;
    }

    let isMounted = true;
    
    const initializeCheckout = async () => {
      try {
        console.log('🔄 EmbeddedCheckout: Starting initialization');
        
        // CRITICAL: Always destroy any existing checkout first
        destroyCurrentCheckout();
        
        const stripe = await getStripe(publishableKey);
        if (!stripe) {
          handleError('Failed to load Stripe');
          return;
        }

        if (!isMounted) return;

        console.log('🔄 Creating embedded checkout with clientSecret:', clientSecret.substring(0, 20) + '...');
        
        const checkout = await stripe.initEmbeddedCheckout({
          clientSecret,
          onComplete: () => {
            console.log('✅ Stripe checkout completed successfully');
            onComplete?.();
          }
        });

        if (!isMounted) return;

        // Store the checkout instance globally
        setCurrentCheckout(checkout);

        // Wait for DOM to be ready and mount
        const mountToDOM = () => {
          if (checkoutRef.current && isMounted && !mountedRef.current) {
            console.log('🎯 Mounting checkout to DOM');
            checkout.mount(checkoutRef.current);
            mountedRef.current = true;
            setIsLoading(false);
            console.log('✅ Checkout mounted successfully');
          } else if (isMounted && !mountedRef.current) {
            setTimeout(mountToDOM, 100);
          }
        };

        mountToDOM();

      } catch (error) {
        console.error('❌ EmbeddedCheckout initialization error:', error);
        if (isMounted) {
          handleError(error instanceof Error ? error.message : 'Failed to initialize checkout');
        }
      }
    };

    initializeCheckout();

    return () => {
      isMounted = false;
    };
  }, [clientSecret, publishableKey, onComplete, handleError]);

  // Cleanup on unmount - CRITICAL for preventing multiple instances
  useEffect(() => {
    return () => {
      console.log('🧹 Component unmounting - destroying checkout');
      destroyCurrentCheckout();
      mountedRef.current = false;
    };
  }, []);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <div className="text-red-500 mb-2">⚠️ Checkout Error</div>
        <div className="text-sm text-muted-foreground mb-4">{error}</div>
        <button 
          onClick={handleRetry}
          className="px-4 py-2 bg-primary text-white rounded text-sm hover:bg-primary/90"
        >
          Retry Checkout
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