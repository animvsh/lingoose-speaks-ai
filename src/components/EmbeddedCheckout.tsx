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

  // Create a wrapped setIsLoading to track state changes
  const setIsLoadingWithLogging = useCallback((newValue: boolean) => {
    console.log('🔧 setIsLoading called:', {
      currentValue: isLoading,
      newValue,
      stackTrace: new Error().stack?.split('\n').slice(1, 4).join('\n')
    });
    setIsLoading(newValue);
  }, [isLoading]);

  console.log('🔧 EmbeddedCheckout RENDER:', {
    clientSecret: clientSecret?.substring(0, 20) + '...',
    publishableKey: publishableKey?.substring(0, 20) + '...',
    isLoading,
    error,
    isMountedRef: isMountedRef.current,
    checkoutRefCurrent: !!checkoutRef.current,
    renderTime: new Date().toISOString()
  });

  const handleError = useCallback((errorMsg: string) => {
    console.error('EmbeddedCheckout Error:', errorMsg);
    setError(errorMsg);
    setIsLoadingWithLogging(false);
    setInitializing(false);
    onError?.(errorMsg);
  }, [onError, setIsLoadingWithLogging]);

  const handleRetry = useCallback(async () => {
    console.log('🔄 Retrying checkout initialization');
    setError(null);
    setIsLoadingWithLogging(true);
    isMountedRef.current = false;
    
    // Force destroy and wait
    await destroyCurrentCheckout();
    
    // Small delay to ensure cleanup
    setTimeout(() => {
      // Effect will re-run
    }, 200);
  }, [setIsLoadingWithLogging]);

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
        setIsLoadingWithLogging(false);
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
          console.log('🔧 attemptMount called:', {
            isMounted,
            isMountedRefCurrent: isMountedRef.current,
            checkoutRefExists: !!checkoutRef.current,
            mountAttempts,
            maxMountAttempts
          });

          if (!isMounted || isMountedRef.current) {
            console.log('🚫 Skipping mount - not mounted or already mounted');
            return;
          }
          
          if (checkoutRef.current) {
            try {
              console.log('🎯 Mounting checkout to DOM (attempt', mountAttempts + 1, ')');
              console.log('🔧 DOM element details:', {
                tagName: checkoutRef.current.tagName,
                className: checkoutRef.current.className,
                clientHeight: checkoutRef.current.clientHeight,
                clientWidth: checkoutRef.current.clientWidth,
                children: checkoutRef.current.children.length
              });
              
              checkout.mount(checkoutRef.current);
              isMountedRef.current = true;
              setIsLoadingWithLogging(false);
              console.log('✅ Checkout mounted successfully - isLoading set to false');
              console.log('🔧 Final state check:', {
                isLoading: false,
                isMountedRef: isMountedRef.current,
                domElement: checkoutRef.current.innerHTML?.substring(0, 100)
              });
            } catch (mountError) {
              console.error('❌ Mount error details:', {
                error: mountError,
                errorMessage: mountError instanceof Error ? mountError.message : String(mountError),
                errorStack: mountError instanceof Error ? mountError.stack : undefined,
                attempt: mountAttempts + 1
              });
              if (mountAttempts < maxMountAttempts) {
                mountAttempts++;
                console.log(`🔄 Retrying mount in 200ms (attempt ${mountAttempts}/${maxMountAttempts})`);
                setTimeout(attemptMount, 200);
              } else {
                console.error('❌ All mount attempts failed');
                handleError('Failed to mount checkout after multiple attempts');
              }
            }
          } else {
            console.log('🚫 No DOM element available for mounting');
            if (mountAttempts < maxMountAttempts) {
              mountAttempts++;
              console.log(`🔄 Waiting for DOM element (attempt ${mountAttempts}/${maxMountAttempts})`);
              setTimeout(attemptMount, 200);
            } else {
              console.error('❌ DOM element never became available');
              handleError('DOM element not found after waiting');
            }
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

  return (
    <div className="w-full relative">
      {/* Always render the checkout container for Stripe to mount to */}
      <div 
        ref={checkoutRef} 
        className="min-h-[500px] w-full rounded-lg"
      />
      
      {/* Overlay loading state */}
      {isLoading && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center rounded-lg">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-2"></div>
            <span className="text-sm text-muted-foreground">Loading secure checkout...</span>
          </div>
        </div>
      )}
      
      {/* Overlay error state */}
      {error && (
        <div className="absolute inset-0 bg-background/90 backdrop-blur-sm flex flex-col items-center justify-center p-8 text-center rounded-lg">
          <div className="text-red-500 mb-2">⚠️ Checkout Error</div>
          <div className="text-sm text-muted-foreground mb-4">{error}</div>
          <button 
            onClick={handleRetry}
            className="px-4 py-2 bg-primary text-white rounded text-sm hover:bg-primary/90"
          >
            Retry Checkout
          </button>
        </div>
      )}
    </div>
  );
};