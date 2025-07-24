import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useFCMNotifications = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSupported, setIsSupported] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fcmToken, setFcmToken] = useState<string | null>(null);

  // Your FCM config (replace with your actual config)
  const FCM_CONFIG = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com", 
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID",
    vapidKey: "YOUR_VAPID_KEY"
  };

  useEffect(() => {
    // Check if browser supports notifications and service workers
    if ('Notification' in window && 'serviceWorker' in navigator && 'PushManager' in window) {
      setIsSupported(true);
      checkExistingSubscription();
    }
  }, [user]);

  const checkExistingSubscription = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('fcm_token')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      
      if (data?.fcm_token) {
        setFcmToken(data.fcm_token);
        setIsSubscribed(true);
      }
    } catch (error) {
      console.error('Error checking subscription:', error);
    }
  };

  const requestPermission = async () => {
    if (!isSupported) {
      toast({
        title: "❌ Not Supported",
        description: "Push notifications are not supported in this browser.",
        variant: "destructive",
      });
      return false;
    }

    const permission = await Notification.requestPermission();
    return permission === 'granted';
  };

  const initializeFCM = async () => {
    // For now, we'll use a simpler web push implementation
    // In production, you would import and initialize Firebase here
    
    // Register service worker
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        console.log('Service Worker registered:', registration);
        return registration;
      } catch (error) {
        console.error('Service Worker registration failed:', error);
        throw error;
      }
    }
    throw new Error('Service Worker not supported');
  };

  const subscribe = async () => {
    if (!user) {
      toast({
        title: "❌ Authentication Required",
        description: "Please sign in to enable notifications.",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    try {
      const hasPermission = await requestPermission();
      if (!hasPermission) {
        throw new Error('Notification permission denied');
      }

      const registration = await initializeFCM();
      
      // Generate a simple token for demo (in production, use FCM)
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: 'BEl62iUYgUivxIkv69yViEuiBIa40HticCXiWiUfZqv2XSWvRLmoCb7AK4zQgm8WmpKRaLxkkJJ0sHhHjTMRvU4'
      });

      const token = JSON.stringify(subscription);

      // Save FCM token to user profile
      const { error } = await supabase
        .from('user_profiles')
        .update({ fcm_token: token })
        .eq('id', user.id);

      if (error) throw error;

      setFcmToken(token);
      setIsSubscribed(true);
      
      toast({
        title: "✅ Notifications Enabled",
        description: "You will now receive push notifications.",
      });
    } catch (error: any) {
      console.error('Subscription error:', error);
      toast({
        title: "❌ Subscription Failed",
        description: error.message || "Failed to subscribe to notifications.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const unsubscribe = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Remove FCM token from user profile
      const { error } = await supabase
        .from('user_profiles')
        .update({ fcm_token: null })
        .eq('id', user.id);

      if (error) throw error;

      // Unsubscribe from service worker
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.getSubscription();
        if (subscription) {
          await subscription.unsubscribe();
        }
      }

      setFcmToken(null);
      setIsSubscribed(false);
      
      toast({
        title: "✅ Unsubscribed",
        description: "You will no longer receive push notifications.",
      });
    } catch (error: any) {
      console.error('Unsubscribe error:', error);
      toast({
        title: "❌ Unsubscribe Failed",
        description: error.message || "Failed to unsubscribe from notifications.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const sendTestNotification = async (type: 'lesson' | 'achievement' | 'reminder') => {
    if (!user || !fcmToken) {
      toast({
        title: "❌ Not Subscribed",
        description: "Please enable notifications first.",
        variant: "destructive",
      });
      return;
    }

    const messages = {
      lesson: {
        title: "🎯 New Lesson Available!",
        body: "Your next lesson is ready. Let's continue your learning journey!"
      },
      achievement: {
        title: "🏆 Achievement Unlocked!",
        body: "Congratulations! You've completed 5 lessons this week!"
      },
      reminder: {
        title: "📚 Daily Reminder",
        body: "Don't forget your practice today. Just 10 minutes can make a difference!"
      }
    };

    try {
      // Call our edge function to send the notification
      const { error } = await supabase.functions.invoke('send-push-notification', {
        body: {
          user_id: user.id,
          title: messages[type].title,
          body: messages[type].body,
          type
        }
      });

      if (error) throw error;

      toast({
        title: "✅ Test Sent",
        description: `Test ${type} notification sent!`,
      });
    } catch (error: any) {
      console.error('Test notification error:', error);
      
      // Fallback to local notification for testing
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(messages[type].title, {
          body: messages[type].body,
          icon: '/favicon.ico',
        });
        
        toast({
          title: "✅ Local Test Sent",
          description: `Local test ${type} notification sent!`,
        });
      } else {
        toast({
          title: "❌ Test Failed",
          description: "Could not send test notification.",
          variant: "destructive",
        });
      }
    }
  };

  return {
    isSupported,
    isSubscribed,
    loading,
    fcmToken,
    subscribe,
    unsubscribe,
    sendTestNotification,
    requestPermission
  };
};