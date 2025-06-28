
import { useCallback, useEffect, useRef } from 'react';
import { usePostHog } from './usePostHog';
import { useAuth } from '@/contexts/AuthContext';

interface SessionMetrics {
  sessionStart: number;
  pageViews: number;
  interactions: number;
  screenTime: number;
  lastActivity: number;
}

export const useSessionTracking = () => {
  const { capture } = usePostHog();
  const { user } = useAuth();
  const sessionRef = useRef<SessionMetrics>({
    sessionStart: Date.now(),
    pageViews: 0,
    interactions: 0,
    screenTime: 0,
    lastActivity: Date.now()
  });
  const intervalRef = useRef<NodeJS.Timeout>();

  // Track session duration
  useEffect(() => {
    const updateScreenTime = () => {
      const now = Date.now();
      const timeSinceLastActivity = now - sessionRef.current.lastActivity;
      
      // Only count as active time if user was active in last 30 seconds
      if (timeSinceLastActivity < 30000) {
        sessionRef.current.screenTime += 5000; // Add 5 seconds
      }
    };

    intervalRef.current = setInterval(updateScreenTime, 5000);
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Track user activity
  useEffect(() => {
    const handleActivity = () => {
      sessionRef.current.lastActivity = Date.now();
      sessionRef.current.interactions += 1;
    };

    const events = ['click', 'scroll', 'keypress', 'touchstart'];
    events.forEach(event => {
      document.addEventListener(event, handleActivity, { passive: true });
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleActivity);
      });
    };
  }, []);

  const trackPageView = useCallback((screenName: string, properties?: Record<string, any>) => {
    sessionRef.current.pageViews += 1;
    sessionRef.current.lastActivity = Date.now();
    
    capture('session_page_view', {
      screen_name: screenName,
      session_page_count: sessionRef.current.pageViews,
      session_duration_seconds: Math.floor((Date.now() - sessionRef.current.sessionStart) / 1000),
      ...properties
    });
  }, [capture]);

  const trackEngagement = useCallback((action: string, context?: string, value?: number) => {
    sessionRef.current.interactions += 1;
    sessionRef.current.lastActivity = Date.now();
    
    capture('user_engagement', {
      action,
      context,
      value,
      session_interactions: sessionRef.current.interactions,
      session_duration_seconds: Math.floor((Date.now() - sessionRef.current.sessionStart) / 1000)
    });
  }, [capture]);

  const endSession = useCallback(() => {
    const sessionDuration = Math.floor((Date.now() - sessionRef.current.sessionStart) / 1000);
    const activeTime = Math.floor(sessionRef.current.screenTime / 1000);
    
    capture('session_ended', {
      session_duration_seconds: sessionDuration,
      active_time_seconds: activeTime,
      page_views: sessionRef.current.pageViews,
      total_interactions: sessionRef.current.interactions,
      engagement_rate: sessionRef.current.interactions / Math.max(sessionDuration / 60, 1), // interactions per minute
      user_id: user?.id
    });
  }, [capture, user]);

  // End session on page unload
  useEffect(() => {
    const handleBeforeUnload = () => {
      endSession();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      endSession();
    };
  }, [endSession]);

  return {
    trackPageView,
    trackEngagement,
    endSession,
    getSessionMetrics: () => ({
      ...sessionRef.current,
      currentDuration: Math.floor((Date.now() - sessionRef.current.sessionStart) / 1000)
    })
  };
};
