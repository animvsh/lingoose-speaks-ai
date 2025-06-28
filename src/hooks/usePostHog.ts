
import { useCallback } from 'react';
import { posthogService } from '@/services/posthog';
import { useAuth } from '@/contexts/AuthContext';

export const usePostHog = () => {
  const { user } = useAuth();

  const capture = useCallback((event: string, properties?: Record<string, any>) => {
    if (!posthogService) {
      console.warn('PostHog not initialized');
      return;
    }

    const distinctId = user?.id || user?.phone_number || 'anonymous';
    posthogService.capture(event, distinctId, {
      user_id: user?.id,
      phone_number: user?.phone_number,
      full_name: user?.full_name,
      ...properties
    });
  }, [user]);

  const captureQueued = useCallback((event: string, properties?: Record<string, any>) => {
    if (!posthogService) {
      console.warn('PostHog not initialized');
      return;
    }

    const distinctId = user?.id || user?.phone_number || 'anonymous';
    posthogService.captureQueued(event, distinctId, {
      user_id: user?.id,
      phone_number: user?.phone_number,
      full_name: user?.full_name,
      ...properties
    });
  }, [user]);

  const identify = useCallback((properties?: Record<string, any>) => {
    if (!posthogService || !user) {
      console.warn('PostHog not initialized or user not available');
      return;
    }

    const distinctId = user.id || user.phone_number;
    posthogService.identify(distinctId, {
      user_id: user.id,
      phone_number: user.phone_number,
      full_name: user.full_name,
      language: user.language,
      created_at: user.created_at,
      ...properties
    });
  }, [user]);

  const pageView = useCallback((properties?: Record<string, any>) => {
    if (!posthogService) {
      console.warn('PostHog not initialized');
      return;
    }

    const distinctId = user?.id || user?.phone_number || 'anonymous';
    posthogService.pageView(distinctId, {
      user_id: user?.id,
      phone_number: user?.phone_number,
      full_name: user?.full_name,
      ...properties
    });
  }, [user]);

  const testWebhook = useCallback((webhookUrl: string) => {
    if (!posthogService) {
      console.warn('PostHog not initialized');
      return;
    }

    const distinctId = user?.id || user?.phone_number || 'webhook_test_user';
    posthogService.testWithWebhook(webhookUrl, 'webhook_test_event', distinctId, {
      user_id: user?.id,
      phone_number: user?.phone_number,
      full_name: user?.full_name,
      test_source: 'settings_debug_panel'
    });
  }, [user]);

  return {
    capture,
    captureQueued,
    identify,
    pageView,
    testWebhook,
    isInitialized: posthogService?.getInitializationStatus() ?? false
  };
};
