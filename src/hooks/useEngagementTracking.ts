
import { useCallback, useEffect, useRef } from 'react';
import { usePostHog } from './usePostHog';
import { useAuth } from '@/contexts/AuthContext';

interface EngagementMetrics {
  tapsToday: number;
  swipesToday: number;
  scrollDistance: number;
  timeSpentPerScreen: Record<string, number>;
  lastResetDate: string;
}

export const useEngagementTracking = () => {
  const { capture } = usePostHog();
  const { user } = useAuth();
  const metricsRef = useRef<EngagementMetrics>({
    tapsToday: 0,
    swipesToday: 0,
    scrollDistance: 0,
    timeSpentPerScreen: {},
    lastResetDate: new Date().toDateString()
  });
  const screenStartTime = useRef<number>(Date.now());
  const currentScreen = useRef<string>('');

  // Reset daily metrics
  useEffect(() => {
    const today = new Date().toDateString();
    if (metricsRef.current.lastResetDate !== today) {
      metricsRef.current.tapsToday = 0;
      metricsRef.current.swipesToday = 0;
      metricsRef.current.lastResetDate = today;
    }
  }, []);

  const trackTap = useCallback((element: string, screen: string, properties?: Record<string, any>) => {
    metricsRef.current.tapsToday += 1;
    
    capture('tap_interaction', {
      element,
      screen,
      daily_tap_count: metricsRef.current.tapsToday,
      timestamp: new Date().toISOString(),
      ...properties
    });
  }, [capture]);

  const trackSwipe = useCallback((direction: 'left' | 'right' | 'up' | 'down', screen: string) => {
    metricsRef.current.swipesToday += 1;
    
    capture('swipe_interaction', {
      direction,
      screen,
      daily_swipe_count: metricsRef.current.swipesToday,
      timestamp: new Date().toISOString()
    });
  }, [capture]);

  const trackScroll = useCallback((distance: number, screen: string) => {
    metricsRef.current.scrollDistance += distance;
    
    // Only track significant scroll events to avoid spam
    if (distance > 100) {
      capture('scroll_interaction', {
        distance,
        screen,
        total_scroll_distance: metricsRef.current.scrollDistance,
        timestamp: new Date().toISOString()
      });
    }
  }, [capture]);

  const trackScreenTime = useCallback((screenName: string) => {
    // Record time spent on previous screen
    if (currentScreen.current) {
      const timeSpent = Date.now() - screenStartTime.current;
      metricsRef.current.timeSpentPerScreen[currentScreen.current] = 
        (metricsRef.current.timeSpentPerScreen[currentScreen.current] || 0) + timeSpent;
      
      capture('screen_time', {
        screen: currentScreen.current,
        time_spent_seconds: Math.floor(timeSpent / 1000),
        total_time_on_screen: Math.floor(metricsRef.current.timeSpentPerScreen[currentScreen.current] / 1000)
      });
    }
    
    // Start tracking new screen
    currentScreen.current = screenName;
    screenStartTime.current = Date.now();
  }, [capture]);

  const trackDailyEngagement = useCallback(() => {
    const today = new Date().toDateString();
    
    capture('daily_engagement_summary', {
      date: today,
      total_taps: metricsRef.current.tapsToday,
      total_swipes: metricsRef.current.swipesToday,
      total_scroll_distance: metricsRef.current.scrollDistance,
      screens_visited: Object.keys(metricsRef.current.timeSpentPerScreen).length,
      total_screen_time: Object.values(metricsRef.current.timeSpentPerScreen).reduce((a, b) => a + b, 0),
      user_id: user?.id
    });
  }, [capture, user]);

  return {
    trackTap,
    trackSwipe,
    trackScroll,
    trackScreenTime,
    trackDailyEngagement,
    getEngagementMetrics: () => metricsRef.current
  };
};
