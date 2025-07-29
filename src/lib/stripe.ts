import { loadStripe } from '@stripe/stripe-js';

// Global Stripe instance to prevent multiple initializations
let stripePromise: Promise<any> | null = null;
let currentCheckout: any = null;

export const getStripe = (publishableKey: string) => {
  if (!stripePromise) {
    console.log('🔄 Creating new Stripe instance');
    stripePromise = loadStripe(publishableKey);
  }
  return stripePromise;
};

export const destroyCurrentCheckout = () => {
  if (currentCheckout) {
    try {
      console.log('🧹 Destroying current checkout instance');
      currentCheckout.unmount();
    } catch (e) {
      console.log('Cleanup error:', e);
    }
    currentCheckout = null;
  }
};

export const setCurrentCheckout = (checkout: any) => {
  currentCheckout = checkout;
};

export const getCurrentCheckout = () => {
  return currentCheckout;
};