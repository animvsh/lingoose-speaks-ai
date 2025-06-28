
import { usePostHog } from 'posthog-js/react';

export const useAnalytics = () => {
  const posthog = usePostHog();

  const trackEvent = (eventName: string, properties?: Record<string, any>) => {
    if (posthog) {
      posthog.capture(eventName, properties);
    }
  };

  const identifyUser = (userId: string, properties?: Record<string, any>) => {
    if (posthog) {
      posthog.identify(userId, properties);
    }
  };

  const setUserProperties = (properties: Record<string, any>) => {
    if (posthog) {
      posthog.setPersonProperties(properties);
    }
  };

  const trackPageView = (pageName?: string) => {
    if (posthog) {
      posthog.capture('$pageview', { page: pageName });
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
