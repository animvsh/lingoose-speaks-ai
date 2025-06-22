
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useNotifications = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSupported, setIsSupported] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if notifications are supported
    if ('Notification' in window && 'serviceWorker' in navigator && 'PushManager' in window) {
      setIsSupported(true);
      
      // Check if already subscribed
      navigator.serviceWorker.ready.then(async (registration) => {
        const subscription = await registration.pushManager.getSubscription();
        setIsSubscribed(!!subscription);
      });
    }
  }, []);

  const requestPermission = async () => {
    if (!isSupported) {
      toast({
        title: "❌ Not Supported",
        description: "Push notifications are not supported in this browser.",
        variant: "destructive",
        className: "border-2 border-red-400 bg-red-50 text-red-800",
      });
      return false;
    }

    const permission = await Notification.requestPermission();
    return permission === 'granted';
  };

  const subscribe = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const hasPermission = await requestPermission();
      if (!hasPermission) {
        throw new Error('Notification permission denied');
      }

      const registration = await navigator.serviceWorker.ready;
      
      // Generate VAPID keys in production - for demo using placeholder
      const vapidPublicKey = 'BEl62iUYgUivxIkv69yViEuiBIa40HticCXiWiUfZqv2XSWvRLmoCb7AK4zQgm8WmpKRaLxkkJJ0sHhHjTMRvU4';
      
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: vapidPublicKey
      });

      // Save subscription to database - cast to Json type
      const { error } = await supabase
        .from('subscriptions')
        .insert({
          user_id: user.id,
          subscription: subscription.toJSON() as any
        });

      if (error) throw error;

      setIsSubscribed(true);
      toast({
        title: "✅ Subscribed",
        description: "You will now receive push notifications.",
        className: "border-2 border-green-400 bg-green-50 text-green-800",
      });
    } catch (error: any) {
      toast({
        title: "❌ Subscription Failed",
        description: error.message || "Failed to subscribe to notifications.",
        variant: "destructive",
        className: "border-2 border-red-400 bg-red-50 text-red-800",
      });
    } finally {
      setLoading(false);
    }
  };

  const unsubscribe = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      
      if (subscription) {
        await subscription.unsubscribe();
      }

      // Remove from database
      const { error } = await supabase
        .from('subscriptions')
        .delete()
        .eq('user_id', user.id);

      if (error) throw error;

      setIsSubscribed(false);
      toast({
        title: "✅ Unsubscribed",
        description: "You will no longer receive push notifications.",
        className: "border-2 border-green-400 bg-green-50 text-green-800",
      });
    } catch (error: any) {
      toast({
        title: "❌ Unsubscribe Failed",
        description: error.message || "Failed to unsubscribe from notifications.",
        variant: "destructive",
        className: "border-2 border-red-400 bg-red-50 text-red-800",
      });
    } finally {
      setLoading(false);
    }
  };

  const sendTestNotification = async (type: 'lesson' | 'achievement' | 'reminder') => {
    const messages = {
      lesson: {
        title: "🎯 New Lesson Available!",
        body: "Your next French lesson is ready. Let's continue your learning journey!"
      },
      achievement: {
        title: "🏆 Achievement Unlocked!",
        body: "Congratulations! You've completed 5 lessons this week!"
      },
      reminder: {
        title: "📚 Daily Reminder",
        body: "Don't forget your French practice today. Just 10 minutes can make a difference!"
      }
    };

    const message = messages[type];
    
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(message.title, {
        body: message.body,
        icon: '/favicon.ico',
        badge: '/favicon.ico'
      });
      
      toast({
        title: "✅ Test Sent",
        description: `Test ${type} notification sent!`,
        className: "border-2 border-green-400 bg-green-50 text-green-800",
      });
    } else {
      toast({
        title: "❌ Permission Required",
        description: "Please enable notifications first.",
        variant: "destructive",
        className: "border-2 border-red-400 bg-red-50 text-red-800",
      });
    }
  };

  return {
    isSupported,
    isSubscribed,
    loading,
    subscribe,
    unsubscribe,
    sendTestNotification,
    requestPermission
  };
};
