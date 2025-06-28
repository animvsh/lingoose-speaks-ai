
import { useCallback } from 'react';
import { posthogService } from '@/services/posthog';
import { useAuth } from '@/contexts/AuthContext';

export const usePostHog = () => {
  const { user } = useAuth();

  const capture = useCallback(async (event: string, properties?: Record<string, any>) => {
    if (!posthogService) {
      console.warn('PostHog not initialized');
      return false;
    }

    const distinctId = user?.id || user?.phone_number || 'anonymous';
    
    try {
      const success = await posthogService.capture(event, distinctId, {
        user_id: user?.id,
        phone_number: user?.phone_number,
        full_name: user?.full_name,
        ...properties
      });

      if (!success) {
        console.warn(`Failed to send PostHog event: ${event}`);
      }
      
      return success;
    } catch (error) {
      console.error('PostHog capture error:', error);
      return false;
    }
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

  const identify = useCallback(async (properties?: Record<string, any>) => {
    if (!posthogService || !user) {
      console.warn('PostHog not initialized or user not available');
      return false;
    }

    const distinctId = user.id || user.phone_number;
    return await posthogService.identify(distinctId, {
      user_id: user.id,
      phone_number: user.phone_number,
      full_name: user.full_name,
      language: user.language,
      created_at: user.created_at,
      ...properties
    });
  }, [user]);

  const pageView = useCallback(async (properties?: Record<string, any>) => {
    if (!posthogService) {
      console.warn('PostHog not initialized');
      return false;
    }

    const distinctId = user?.id || user?.phone_number || 'anonymous';
    return await posthogService.pageView(distinctId, {
      user_id: user?.id,
      phone_number: user?.phone_number,
      full_name: user?.full_name,
      ...properties
    });
  }, [user]);

  // Learning & Practice Events
  const trackPracticeStart = useCallback((activityData: any) => {
    capture('practice_started', {
      activity_id: activityData.id,
      activity_name: activityData.name,
      activity_description: activityData.description,
      estimated_duration: activityData.estimated_duration_minutes,
      skills_tested: activityData.skills?.map((s: any) => s.name).join(', '),
      source: 'dashboard'
    });
  }, [capture]);

  const trackPracticeComplete = useCallback((activityData: any, duration: number, rating?: number) => {
    capture('practice_completed', {
      activity_id: activityData.id,
      activity_name: activityData.name,
      duration_seconds: duration,
      rating: rating,
      completion_rate: 100,
      source: 'practice_session'
    });
  }, [capture]);

  const trackActivityRegenerate = useCallback((oldActivity: any, newActivity?: any) => {
    capture('activity_regenerated', {
      old_activity_id: oldActivity.id,
      old_activity_name: oldActivity.name,
      new_activity_id: newActivity?.id,
      new_activity_name: newActivity?.name,
      source: 'dashboard'
    });
  }, [capture]);

  // Navigation & UI Events
  const trackNavigation = useCallback((from: string, to: string) => {
    capture('navigation', {
      from_screen: from,
      to_screen: to,
      navigation_type: 'bottom_nav'
    });
  }, [capture]);

  const trackScreenView = useCallback((screenName: string, properties?: Record<string, any>) => {
    capture('screen_view', {
      screen_name: screenName,
      ...properties
    });
  }, [capture]);

  // Analytics & Progress Events
  const trackAnalyticsView = useCallback((analyticsType: string, data?: any) => {
    capture('analytics_viewed', {
      analytics_type: analyticsType,
      fluency_score: data?.fluencyScore,
      total_calls: data?.totalCalls,
      current_streak: data?.currentStreak,
      this_week_calls: data?.thisWeekCalls
    });
  }, [capture]);

  const trackProgressView = useCallback((progressData?: any) => {
    capture('progress_viewed', {
      total_sessions: progressData?.totalSessions,
      average_rating: progressData?.averageRating,
      completed_this_week: progressData?.completedThisWeek
    });
  }, [capture]);

  // Settings & Configuration Events
  const trackSettingsInteraction = useCallback((action: string, setting?: string, value?: any) => {
    capture('settings_interaction', {
      action: action,
      setting: setting,
      value: value
    });
  }, [capture]);

  // Authentication Events
  const trackAuthEvent = useCallback((event: string, method?: string) => {
    capture(`auth_${event}`, {
      auth_method: method,
      timestamp: new Date().toISOString()
    });
  }, [capture]);

  // Onboarding Events
  const trackOnboardingStep = useCallback((step: string, stepNumber: number, completed: boolean = false) => {
    capture('onboarding_step', {
      step_name: step,
      step_number: stepNumber,
      completed: completed,
      timestamp: new Date().toISOString()
    });
  }, [capture]);

  const trackOnboardingComplete = useCallback(() => {
    capture('onboarding_completed', {
      completion_time: new Date().toISOString()
    });
  }, [capture]);

  // Error & Debug Events
  const trackError = useCallback((error: string, context?: string, additionalData?: any) => {
    capture('error_occurred', {
      error_message: error,
      error_context: context,
      additional_data: additionalData,
      timestamp: new Date().toISOString()
    });
  }, [capture]);

  // Feature Usage Events
  const trackFeatureUsage = useCallback((feature: string, action: string, properties?: Record<string, any>) => {
    capture('feature_used', {
      feature_name: feature,
      action: action,
      ...properties
    });
  }, [capture]);

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

  const getDebugInfo = useCallback(() => {
    return posthogService?.getDebugInfo() || { error: 'PostHog not initialized' };
  }, []);

  return {
    capture,
    captureQueued,
    identify,
    pageView,
    
    // Learning & Practice
    trackPracticeStart,
    trackPracticeComplete,
    trackActivityRegenerate,
    
    // Navigation & UI
    trackNavigation,
    trackScreenView,
    
    // Analytics & Progress
    trackAnalyticsView,
    trackProgressView,
    
    // Settings & Configuration
    trackSettingsInteraction,
    
    // Authentication
    trackAuthEvent,
    
    // Onboarding
    trackOnboardingStep,
    trackOnboardingComplete,
    
    // Errors & Debug
    trackError,
    
    // Feature Usage
    trackFeatureUsage,
    
    // Debug
    testWebhook,
    getDebugInfo,
    isInitialized: posthogService?.getInitializationStatus() ?? false
  };
};
