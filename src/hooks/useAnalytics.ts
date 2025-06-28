
import { usePostHog } from 'posthog-js/react';

export const useAnalytics = () => {
  let posthog;
  
  try {
    posthog = usePostHog();
  } catch (error) {
    // PostHog might not be available, fallback to null
    posthog = null;
  }

  const trackEvent = (eventName: string, properties?: Record<string, any>) => {
    if (posthog && typeof posthog.capture === 'function') {
      try {
        posthog.capture(eventName, properties);
      } catch (error) {
        console.warn('Failed to track event:', error);
      }
    }
  };

  const identifyUser = (userId: string, properties?: Record<string, any>) => {
    if (posthog && typeof posthog.identify === 'function') {
      try {
        posthog.identify(userId, properties);
      } catch (error) {
        console.warn('Failed to identify user:', error);
      }
    }
  };

  const setUserProperties = (properties: Record<string, any>) => {
    if (posthog && typeof posthog.setPersonProperties === 'function') {
      try {
        posthog.setPersonProperties(properties);
      } catch (error) {
        console.warn('Failed to set user properties:', error);
      }
    }
  };

  const trackPageView = (pageName?: string) => {
    if (posthog && typeof posthog.capture === 'function') {
      try {
        posthog.capture('$pageview', { page: pageName });
      } catch (error) {
        console.warn('Failed to track page view:', error);
      }
    }
  };

  return {
    trackEvent,
    identifyUser,
    setUserProperties,
    trackPageView,
    posthog
  };
};
