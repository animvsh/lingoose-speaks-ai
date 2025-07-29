import { useEffect, useRef, useState, useCallback } from 'react';
import { 
  getStripe, 
  destroyCurrentCheckout, 
  setCurrentCheckout, 
  getCurrentCheckout,
  isCheckoutInitializing,
  setInitializing,
  getCurrentClientSecret
} from '@/lib/stripe';

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
  const isMountedRef = useRef(false);

  const handleError = useCallback((errorMsg: string) => {
    console.error('EmbeddedCheckout Error:', errorMsg);
    setError(errorMsg);
    setIsLoading(false);
    setInitializing(false);
    onError?.(errorMsg);
  }, [onError]);

  const handleRetry = useCallback(async () => {
    console.log('🔄 Retrying checkout initialization');
    setError(null);
    setIsLoading(true);
    isMountedRef.current = false;
    
    // Force destroy and wait
    await destroyCurrentCheckout();
    
    // Small delay to ensure cleanup
    setTimeout(() => {
      // Effect will re-run
    }, 200);
  }, []);

  useEffect(() => {
    // Exit early if no data or already mounted
    if (!clientSecret || !publishableKey || isMountedRef.current) {
      return;
    }

    // If we already have a checkout with the same client secret, reuse it
    const existingCheckout = getCurrentCheckout();
    const existingClientSecret = getCurrentClientSecret();
    
    if (existingCheckout && existingClientSecret === clientSecret && checkoutRef.current) {
      console.log('✅ Reusing existing checkout instance');
      try {
        existingCheckout.mount(checkoutRef.current);
        isMountedRef.current = true;
        setIsLoading(false);
        return;
      } catch (e) {
        console.log('Failed to reuse existing checkout, creating new one');
        // Continue to create new checkout
      }
    }

    // Prevent multiple simultaneous initializations
    if (isCheckoutInitializing()) {
      console.log('🚫 Checkout already initializing, skipping...');
      return;
    }

    let isMounted = true;
    
    const initializeCheckout = async () => {
      try {
        setInitializing(true);
        console.log('🔄 EmbeddedCheckout: Starting initialization for:', clientSecret.substring(0, 20) + '...');
        
        // CRITICAL: Always destroy any existing checkout first and wait
        await destroyCurrentCheckout();
        
        // Additional safety delay
        await new Promise(resolve => setTimeout(resolve, 100));
        
        const stripe = await getStripe(publishableKey);
        if (!stripe) {
          handleError('Failed to load Stripe');
          return;
        }

        if (!isMounted) {
          setInitializing(false);
          return;
        }

        console.log('🔄 Creating embedded checkout...');
        
        const checkout = await stripe.initEmbeddedCheckout({
          clientSecret,
          onComplete: () => {
            console.log('✅ Stripe checkout completed successfully');
            onComplete?.();
          }
        });

        if (!isMounted) {
          // Cleanup if component unmounted during creation
          try {
            await checkout.destroy();
          } catch (e) {
            console.log('Cleanup during unmount error:', e);
          }
          setInitializing(false);
          return;
        }

        // Store the checkout instance globally
        setCurrentCheckout(checkout, clientSecret);

        // Mount to DOM with retries
        let mountAttempts = 0;
        const maxMountAttempts = 20;
        
        const attemptMount = () => {
          if (!isMounted || isMountedRef.current) return;
          
          if (checkoutRef.current) {
            try {
              console.log('🎯 Mounting checkout to DOM (attempt', mountAttempts + 1, ')');
              checkout.mount(checkoutRef.current);
              isMountedRef.current = true;
              setIsLoading(false);
              console.log('✅ Checkout mounted successfully');
            } catch (mountError) {
              console.error('Mount error:', mountError);
              if (mountAttempts < maxMountAttempts) {
                mountAttempts++;
                setTimeout(attemptMount, 200);
              } else {
                handleError('Failed to mount checkout after multiple attempts');
              }
            }
          } else if (mountAttempts < maxMountAttempts) {
            mountAttempts++;
            setTimeout(attemptMount, 200);
          } else {
            handleError('DOM element not found after waiting');
          }
        };

        attemptMount();

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
      setInitializing(false);
    };
  }, [clientSecret, publishableKey, onComplete, handleError]);

  // Global cleanup on unmount
  useEffect(() => {
    return () => {
      console.log('🧹 Component unmounting - cleaning up');
      isMountedRef.current = false;
      setInitializing(false);
      
      // Don't destroy global checkout on unmount unless this component owns it
      const existingClientSecret = getCurrentClientSecret();
      if (existingClientSecret === clientSecret) {
        destroyCurrentCheckout();
      }
    };
  }, [clientSecret]);

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