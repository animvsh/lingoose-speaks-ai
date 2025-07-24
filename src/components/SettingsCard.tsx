import { Button } from "@/components/ui/button";
import { Settings, User, Bell, HelpCircle, LogOut, ChevronRight, Home, Phone, CheckCircle, ArrowLeft, Shield, Globe, Volume2, Moon, Smartphone, Star, Plus, UserPlus, Bug, Activity, Brain } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { usePostHog } from "@/hooks/usePostHog";
import { posthogService } from "@/services/posthog";
import { useNavigate } from "react-router-dom";
import AppBar from "./AppBar";
import ProUpgradeCard from "./ProUpgradeCard";
import { useSubscriptionCheck } from "@/hooks/useSubscriptionCheck";
import { useSubscriptionStatus } from "@/hooks/useSubscriptionStatus";

interface SettingsCardProps {
  onNavigate: (view: string) => void;
}

const SettingsCard = ({
  onNavigate
}: SettingsCardProps) => {
  const navigate = useNavigate();
  const {
    signOut
  } = useAuth();
  const {
    capture,
    testWebhook,
    isInitialized,
    trackSettingsInteraction,
    trackFeatureUsage,
    trackAuthEvent
  } = usePostHog();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [showAddToHomeScreen, setShowAddToHomeScreen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [lastTestEvent, setLastTestEvent] = useState<string>('');
  const [webhookUrl, setWebhookUrl] = useState<string>('');
  const { data: subscription } = useSubscriptionCheck();
  const { data: subscriptionStatus } = useSubscriptionStatus();

  // Calculate free trial day
  let trialDay = null;
  if (subscription?.trial_start_date) {
    const start = new Date(subscription.trial_start_date);
    const now = new Date();
    const diff = Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    trialDay = Math.min(diff + 1, 3); // Day 1, 2, or 3
  }

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowAddToHomeScreen(true);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Check if already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone === true;
    if (!isStandalone) {
      setShowAddToHomeScreen(true);
    }
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    trackSettingsInteraction('toggle', 'dark_mode', newMode);
  };

  const toggleNotifications = () => {
    const newState = !notificationsEnabled;
    setNotificationsEnabled(newState);
    trackSettingsInteraction('toggle', 'notifications', newState);
  };

  const handleTestEvent = () => {
    const timestamp = new Date().toLocaleTimeString();
    const eventName = 'debug_test_event';
    capture(eventName, {
      test_timestamp: timestamp,
      source: 'settings_debug_panel'
    });
    setLastTestEvent(`${eventName} at ${timestamp}`);
    console.log('PostHog test event sent:', eventName, timestamp);
    trackFeatureUsage('debug_panel', 'test_event');
  };

  const handleManualEvent = () => {
    const timestamp = new Date().toLocaleTimeString();

    // Direct PostHog service call like your example
    if (posthogService) {
      posthogService.capture('my event', 'manual_test_user', {
        property: 'value',
        timestamp: timestamp,
        source: 'manual_debug_test'
      });
      setLastTestEvent(`'my event' with property: 'value' at ${timestamp}`);
      console.log('Manual PostHog event sent: my event', {
        property: 'value',
        timestamp
      });
      trackFeatureUsage('debug_panel', 'manual_event');
    } else {
      console.warn('PostHog service not available');
      setLastTestEvent('PostHog service not available');
    }
  };

  const handleWebhookTest = () => {
    if (!webhookUrl) {
      alert('Please enter a webhook.site URL first');
      return;
    }
    const timestamp = new Date().toLocaleTimeString();
    testWebhook(webhookUrl);
    setLastTestEvent(`Webhook test sent to ${webhookUrl} at ${timestamp}`);
    console.log('Webhook test sent to:', webhookUrl);
    trackFeatureUsage('debug_panel', 'webhook_test', {
      webhook_url: webhookUrl
    });
  };

  const handleAddToHomeScreen = async () => {
    console.log('Add to home screen clicked from settings');
    trackFeatureUsage('pwa', 'add_to_homescreen_attempt');
    if (deferredPrompt) {
      try {
        deferredPrompt.prompt();
        const {
          outcome
        } = await deferredPrompt.userChoice;
        console.log(`User response to install prompt: ${outcome}`);
        trackFeatureUsage('pwa', 'install_prompt_response', {
          outcome
        });
        if (outcome === 'accepted') {
          setShowAddToHomeScreen(false);
          localStorage.setItem('pwaInstalled', 'true');
          trackFeatureUsage('pwa', 'installed_successfully');
        }
        setDeferredPrompt(null);
      } catch (error) {
        console.error('Error showing install prompt:', error);
        trackFeatureUsage('pwa', 'install_error', {
          error: error.message
        });
      }
    } else {
      // Show manual instructions
      trackFeatureUsage('pwa', 'manual_instructions_shown');
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      const isAndroid = /Android/.test(navigator.userAgent);
      let instructions = '';
      if (isIOS) {
        instructions = 'To add this app to your home screen:\n\n1. Tap the Share button (⎋)\n2. Select "Add to Home Screen"\n3. Tap "Add"';
      } else if (isAndroid) {
        instructions = 'To add this app to your home screen:\n\n1. Tap the menu (⋮)\n2. Select "Add to Home screen" or "Install app"\n3. Tap "Add" or "Install"';
      } else {
        instructions = 'To add this app:\n\n1. Open your browser menu\n2. Look for "Add to Home Screen" or "Install"\n3. Follow the prompts';
      }
      alert(instructions);
    }
  };

  const handleLogout = async () => {
    trackAuthEvent('logout');
    await signOut();
    // Don't navigate - the Landing page will detect the user is null and show landing content
  };

  const handleNavigationClick = (destination: string, feature?: string) => {
    console.log('🎯 SettingsCard navigation clicked:', destination, feature);
    if (feature) {
      trackFeatureUsage('settings_navigation', feature);
    }
    console.log('🎯 Calling onNavigate with:', destination);
    onNavigate(destination);
  };

  return <div className="min-h-screen hindi-bg pb-24 font-nunito">
      <AppBar title="Settings" onBack={() => onNavigate("home")} />

      <div className="px-4 pt-4">
        {/* Pro Upgrade Card always visible */}
        <div className="mb-6">
          <ProUpgradeCard />
          {subscription?.subscription_tier === 'free_trial' && trialDay && (
            <div className="mt-4 text-center bg-white rounded-3xl border-2 border-handdrawn p-4 shadow-lg">
              <div className="text-blue-700 font-black text-lg">
                Free Trial: Day {trialDay}/3 🎯
              </div>
              <div className="text-blue-600 font-bold">
                {subscriptionStatus?.minutes_remaining?.toFixed(1) ?? 0} minutes left
              </div>
            </div>
          )}
        </div>

        <div className="w-full space-y-6">
          {/* Account Settings */}
          <div className="w-full rounded-3xl border-2 border-handdrawn bg-white/90 p-6 shadow-lg">
            <h3 className="text-xl font-black text-brown-900 mb-6 uppercase tracking-wide flex items-center">
              <User className="w-6 h-6 mr-3 text-primary" />
              Account
            </h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between py-4 px-4 bg-orange-50 rounded-2xl border-2 border-orange-200 cursor-pointer hover:bg-orange-100 transition-all duration-200 hover:scale-[1.02]" onClick={() => handleNavigationClick("profile-management", "profile_management")}>
                <div className="flex items-center">
                  <User className="w-5 h-5 mr-3 text-orange-500" />
                  <span className="text-brown-700 font-bold">Profile Management</span>
                </div>
                <ChevronRight className="w-5 h-5 text-orange-500" />
              </div>
              <div className="flex items-center justify-between py-4 px-4 bg-purple-50 rounded-2xl border-2 border-purple-200 cursor-pointer hover:bg-purple-100 transition-all duration-200 hover:scale-[1.02]" onClick={() => handleNavigationClick("add-supervisor", "add_supervisor")}>
                <div className="flex items-center">
                  <UserPlus className="w-5 h-5 mr-3 text-purple-500" />
                  <span className="text-brown-700 font-bold">Add Supervisor</span>
                </div>
                <ChevronRight className="w-5 h-5 text-purple-500" />
              </div>
            </div>
          </div>

          {/* AI Behavior Analytics */}
          <div className="w-full rounded-3xl border-2 border-handdrawn bg-white/90 p-6 shadow-lg">
            <h3 className="text-xl font-black text-brown-900 mb-6 uppercase tracking-wide flex items-center">
              <Brain className="w-6 h-6 mr-3 text-blue-500" />
              AI Behavior Analytics
            </h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between py-4 px-4 bg-blue-50 rounded-2xl border-2 border-blue-200 cursor-pointer hover:bg-blue-100 transition-all duration-200 hover:scale-[1.02]" onClick={() => handleNavigationClick("ai-behavior-metrics", "ai_behavior_metrics")}>
                <div className="flex items-center">
                  <Brain className="w-5 h-5 mr-3 text-blue-500" />
                  <span className="text-brown-700 font-bold">Performance Metrics</span>
                </div>
                <ChevronRight className="w-5 h-5 text-blue-500" />
              </div>
            </div>
          </div>

          {/* Analytics Debug Section */}
          <div className="w-full rounded-3xl border-2 border-handdrawn bg-white/90 p-6 shadow-lg">
            <h3 className="text-xl font-black text-brown-900 mb-6 uppercase tracking-wide flex items-center">
              <Activity className="w-6 h-6 mr-3 text-green-500" />
              Analytics Debug ⚡
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between py-4 px-4 bg-green-50 rounded-2xl border-2 border-green-200">
                <div className="flex items-center">
                  <Activity className="w-5 h-5 mr-3 text-green-500" />
                  <span className="text-brown-700 font-bold">PostHog Status</span>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-black ${isInitialized ? 'bg-green-100 text-green-700 border-2 border-green-300' : 'bg-red-100 text-red-700 border-2 border-red-300'}`}>
                  {isInitialized ? 'Connected ✅' : 'Not Connected ❌'}
                </span>
              </div>
              
              <div className="space-y-3 bg-orange-50 rounded-2xl border-2 border-orange-200 p-4">
                <div className="flex items-center space-x-2">
                  <input 
                    type="text" 
                    placeholder="Enter webhook.site URL for testing" 
                    value={webhookUrl} 
                    onChange={e => setWebhookUrl(e.target.value)} 
                    className="flex-1 px-4 py-3 border-2 border-orange-300 rounded-xl text-sm font-semibold focus:border-orange-400 focus:outline-none" 
                  />
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleWebhookTest} 
                    disabled={!isInitialized || !webhookUrl} 
                    className="bg-orange-100 text-orange-700 border-2 border-orange-300 hover:bg-orange-200 font-bold px-4 py-3 rounded-xl"
                  >
                    Test Webhook
                  </Button>
                </div>
                <p className="text-xs text-brown-600 font-medium">
                  Go to webhook.site, copy the URL, and paste it above to test if your integration code works
                </p>
              </div>
              
              <div className="flex items-center justify-between py-4 px-4 bg-blue-50 rounded-2xl border-2 border-blue-200">
                <div className="flex items-center">
                  <Bug className="w-5 h-5 mr-3 text-blue-500" />
                  <span className="text-brown-700 font-bold">Hook Test Event</span>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleTestEvent} 
                  disabled={!isInitialized} 
                  className="bg-blue-100 text-blue-700 border-2 border-blue-300 hover:bg-blue-200 disabled:opacity-50 font-bold px-4 py-2 rounded-xl"
                >
                  Send Hook Test
                </Button>
              </div>
              
              <div className="flex items-center justify-between py-4 px-4 bg-purple-50 rounded-2xl border-2 border-purple-200">
                <div className="flex items-center">
                  <Settings className="w-5 h-5 mr-3 text-purple-500" />
                  <span className="text-brown-700 font-bold">Manual Event Test</span>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleManualEvent} 
                  disabled={!isInitialized} 
                  className="bg-purple-100 text-purple-700 border-2 border-purple-300 hover:bg-purple-200 disabled:opacity-50 font-bold px-4 py-2 rounded-xl"
                >
                  Send Manual Event
                </Button>
              </div>
              
              {lastTestEvent && <div className="bg-gray-50 rounded-2xl border-2 border-gray-200 p-4">
                  <p className="text-sm text-brown-700 font-bold">
                    <strong>Last test event:</strong> {lastTestEvent}
                  </p>
                  <p className="text-xs text-brown-600 mt-1 font-medium">
                    Check browser console for detailed logs
                  </p>
                </div>}
              
              <div className="bg-yellow-50 rounded-2xl border-2 border-yellow-200 p-4">
                <p className="text-sm text-yellow-800 font-black">
                  <strong>Troubleshooting Steps:</strong>
                </p>
                <ul className="text-xs text-yellow-700 mt-2 space-y-1 font-medium">
                  <li>1. Test with webhook.site URL above</li>
                  <li>2. Check browser console for errors</li>
                  <li>3. Disable ad blockers</li>
                  <li>4. Check Network tab in DevTools</li>
                </ul>
              </div>
            </div>
          </div>

          {/* App Settings */}
          <div className="w-full rounded-3xl border-2 border-handdrawn bg-white/90 p-6 shadow-lg">
            <h3 className="text-xl font-black text-brown-900 mb-6 uppercase tracking-wide flex items-center">
              <Settings className="w-6 h-6 mr-3 text-blue-500" />
              App Settings
            </h3>
            
            <div className="space-y-2">
              {showAddToHomeScreen && <div className="flex items-center justify-between py-4 px-4 bg-green-50 rounded-2xl border-2 border-green-200">
                  <div className="flex items-center">
                    <Plus className="w-5 h-5 mr-3 text-green-500" />
                    <span className="text-brown-700 font-bold">Add to Home Screen</span>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleAddToHomeScreen} 
                    className="bg-green-100 text-green-700 border-2 border-green-300 hover:bg-green-200 font-bold px-4 py-2 rounded-xl"
                  >
                    Install
                  </Button>
                </div>}
              
              <div className="flex items-center justify-between py-4 px-4 bg-blue-50 rounded-2xl border-2 border-blue-200">
                <div className="flex items-center">
                  <Bell className="w-5 h-5 mr-3 text-blue-500" />
                  <span className="text-brown-700 font-bold">Notifications</span>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={toggleNotifications}
                  className={`font-black px-4 py-2 rounded-xl border-2 ${notificationsEnabled ? 'bg-green-100 text-green-700 border-green-300 hover:bg-green-200' : 'bg-red-100 text-red-700 border-red-300 hover:bg-red-200'}`}
                >
                  {notificationsEnabled ? "ON ✅" : "OFF ❌"}
                </Button>
              </div>
              
              <div className="flex items-center justify-between py-4 px-4 bg-purple-50 rounded-2xl border-2 border-purple-200">
                <div className="flex items-center">
                  <Moon className="w-5 h-5 mr-3 text-purple-500" />
                  <span className="text-brown-700 font-bold">Dark Mode</span>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={toggleDarkMode}
                  className={`font-black px-4 py-2 rounded-xl border-2 ${isDarkMode ? 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200' : 'bg-yellow-100 text-yellow-700 border-yellow-300 hover:bg-yellow-200'}`}
                >
                  {isDarkMode ? "ON 🌙" : "OFF ☀️"}
                </Button>
              </div>
              
              <div className="flex items-center justify-between py-4 px-4 bg-green-50 rounded-2xl border-2 border-green-200 cursor-pointer hover:bg-green-100 transition-all duration-200 hover:scale-[1.02]">
                <div className="flex items-center">
                  <Globe className="w-5 h-5 mr-3 text-green-500" />
                  <span className="text-brown-700 font-bold">Language</span>
                </div>
                <ChevronRight className="w-5 h-5 text-green-500" />
              </div>
              
              <div className="flex items-center justify-between py-4 px-4 bg-orange-50 rounded-2xl border-2 border-orange-200 cursor-pointer hover:bg-orange-100 transition-all duration-200 hover:scale-[1.02]">
                <div className="flex items-center">
                  <Volume2 className="w-5 h-5 mr-3 text-orange-500" />
                  <span className="text-brown-700 font-bold">Audio Settings</span>
                </div>
                <ChevronRight className="w-5 h-5 text-orange-500" />
              </div>
              
              <div className="flex items-center justify-between py-4 px-4 bg-teal-50 rounded-2xl border-2 border-teal-200 cursor-pointer hover:bg-teal-100 transition-all duration-200 hover:scale-[1.02]">
                <div className="flex items-center">
                  <Smartphone className="w-5 h-5 mr-3 text-teal-500" />
                  <span className="text-brown-700 font-bold">Accessibility</span>
                </div>
                <ChevronRight className="w-5 h-5 text-teal-500" />
              </div>
            </div>
          </div>

          {/* Support & About */}
          <div className="w-full rounded-3xl border-2 border-handdrawn bg-white/90 p-6 shadow-lg">
            <h3 className="text-xl font-black text-brown-900 mb-6 uppercase tracking-wide flex items-center">
              <HelpCircle className="w-6 h-6 mr-3 text-purple-500" />
              Support
            </h3>
            
            <div className="space-y-2">
              <div onClick={() => handleNavigationClick("help-support", "help_support")} className="flex items-center justify-between py-4 px-4 bg-purple-50 rounded-2xl border-2 border-purple-200 cursor-pointer hover:bg-purple-100 transition-all duration-200 hover:scale-[1.02]">
                <div className="flex items-center">
                  <HelpCircle className="w-5 h-5 mr-3 text-purple-500" />
                  <span className="text-brown-700 font-bold">Help & Support</span>
                </div>
                <ChevronRight className="w-5 h-5 text-purple-500" />
              </div>
              
              <div className="flex items-center justify-between py-4 px-4 bg-yellow-50 rounded-2xl border-2 border-yellow-200 cursor-pointer hover:bg-yellow-100 transition-all duration-200 hover:scale-[1.02]">
                <div className="flex items-center">
                  <Shield className="w-5 h-5 mr-3 text-yellow-500" />
                  <span className="text-brown-700 font-bold">Privacy Policy</span>
                </div>
                <ChevronRight className="w-5 h-5 text-yellow-500" />
              </div>
              
              <div className="flex items-center justify-between py-4 px-4 bg-orange-50 rounded-2xl border-2 border-orange-200 cursor-pointer hover:bg-orange-100 transition-all duration-200 hover:scale-[1.02]">
                <div className="flex items-center">
                  <Star className="w-5 h-5 mr-3 text-orange-500" />
                  <span className="text-brown-700 font-bold">Rate Us</span>
                </div>
                <ChevronRight className="w-5 h-5 text-orange-500" />
              </div>
              
              <div className="flex items-center justify-between py-4 px-4 bg-green-50 rounded-2xl border-2 border-green-200">
                <div className="flex items-center">
                  <Phone className="w-5 h-5 mr-3 text-green-500" />
                  <span className="text-brown-700 font-bold">Call the Founder</span>
                </div>
                <a href="tel:+1234567890" className="text-green-700 font-black underline hover:text-green-900 bg-green-100 px-3 py-1 rounded-xl border border-green-300">
                  📞 Call
                </a>
              </div>
            </div>
          </div>

          {/* Logout */}
          <div className="w-full">
            <Button 
              onClick={handleLogout} 
              className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-black py-6 text-lg rounded-3xl border-2 border-handdrawn shadow-lg transition-all duration-200 hover:scale-105 transform hover:-rotate-1"
            >
              <LogOut className="w-5 h-5 mr-2" />
              Log Out
            </Button>
          </div>
        </div>
      </div>
    </div>;
};

export default SettingsCard;
