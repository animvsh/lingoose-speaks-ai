import { loadStripe } from '@stripe/stripe-js';

// Global state to prevent multiple instances
let stripePromise: Promise<any> | null = null;
let currentCheckout: any = null;
let isInitializing = false;
let currentClientSecret = '';

export const getStripe = (publishableKey: string) => {
  if (!stripePromise) {
    console.log('🔄 Creating new Stripe instance');
    stripePromise = loadStripe(publishableKey);
  }
  return stripePromise;
};

export const destroyCurrentCheckout = async () => {
  if (currentCheckout) {
    try {
      console.log('🧹 Destroying current checkout instance');
      await currentCheckout.destroy();
    } catch (e) {
      console.log('Cleanup error (ignoring):', e);
    }
    currentCheckout = null;
    currentClientSecret = '';
  }
  isInitializing = false;
};

export const setCurrentCheckout = (checkout: any, clientSecret: string) => {
  currentCheckout = checkout;
  currentClientSecret = clientSecret;
  isInitializing = false;
};

export const getCurrentCheckout = () => {
  return currentCheckout;
};

export const isCheckoutInitializing = () => {
  return isInitializing;
};

export const setInitializing = (value: boolean) => {
  isInitializing = value;
};

export const getCurrentClientSecret = () => {
  return currentClientSecret;
};