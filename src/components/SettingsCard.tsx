import { Button } from "@/components/ui/button";
import { Settings, User, Bell, HelpCircle, LogOut, ChevronRight, Home, Phone, CheckCircle, ArrowLeft, Shield, Globe, Volume2, Moon, Smartphone, Star, Plus, UserPlus, Bug, Activity } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { usePostHog } from "@/hooks/usePostHog";
import { posthogService } from "@/services/posthog";
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

  const handleLogout = () => {
    trackAuthEvent('logout');
    signOut();
  };

  const handleNavigationClick = (destination: string, feature?: string) => {
    if (feature) {
      trackFeatureUsage('settings_navigation', feature);
    }
    onNavigate(destination);
  };

  return <div className="min-h-screen bg-amber-50 pb-24">
      <AppBar title="Settings" onBack={() => onNavigate("home")} />

      {/* Pro Upgrade Card always visible */}
      <div className="mb-6">
        <ProUpgradeCard />
        {subscription?.subscription_tier === 'free_trial' && trialDay && (
          <div className="mt-2 text-center text-blue-700 font-bold text-lg">
            Free Trial: Day {trialDay}/3 &mdash; {subscriptionStatus?.minutes_remaining?.toFixed(1) ?? 0} days left
          </div>
        )}
      </div>

      <div className="w-full space-y-6">
        {/* Account Settings */}
        <div className="w-full bg-white p-6 border-4 border-gray-200">
          <h3 className="text-xl font-bold text-gray-800 mb-4 uppercase tracking-wide">
            Account
          </h3>
          <div className="flex items-center justify-between py-3 border-b border-gray-200 last:border-none cursor-pointer" onClick={() => handleNavigationClick("profile-management", "profile_management")}>
            <div className="flex items-center">
              <User className="w-5 h-5 mr-3 text-orange-500" />
              <span className="text-gray-700 font-medium">Profile Management</span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-500" />
          </div>
          <div className="flex items-center justify-between py-3 border-b border-gray-200 last:border-none cursor-pointer" onClick={() => handleNavigationClick("add-supervisor", "add_supervisor")}>
            <div className="flex items-center">
              <UserPlus className="w-5 h-5 mr-3 text-purple-500" />
              <span className="text-gray-700 font-medium">Add Supervisor</span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-500" />
          </div>
        </div>

        {/* Analytics Debug Section */}
        <div className="w-full bg-white p-6 border-4 border-gray-200">
          <h3 className="text-xl font-bold text-gray-800 mb-4 uppercase tracking-wide">
            Analytics Debug ⚡
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-gray-200">
              <div className="flex items-center">
                <Activity className="w-5 h-5 mr-3 text-green-500" />
                <span className="text-gray-700 font-medium">PostHog Status</span>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${isInitialized ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {isInitialized ? 'Connected' : 'Not Connected'}
              </span>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <input type="text" placeholder="Enter webhook.site URL for testing" value={webhookUrl} onChange={e => setWebhookUrl(e.target.value)} className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                <Button variant="outline" size="sm" onClick={handleWebhookTest} disabled={!isInitialized || !webhookUrl} className="bg-orange-50 text-orange-600 border-orange-200 hover:bg-orange-100">
                  Test Webhook
                </Button>
              </div>
              <p className="text-xs text-gray-500">
                Go to webhook.site, copy the URL, and paste it above to test if your integration code works
              </p>
            </div>
            
            <div className="flex items-center justify-between py-3 border-b border-gray-200">
              <div className="flex items-center">
                <Bug className="w-5 h-5 mr-3 text-blue-500" />
                <span className="text-gray-700 font-medium">Hook Test Event</span>
              </div>
              <Button variant="outline" size="sm" onClick={handleTestEvent} disabled={!isInitialized} className="bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100 disabled:opacity-50">
                Send Hook Test
              </Button>
            </div>
            
            <div className="flex items-center justify-between py-3 border-b border-gray-200">
              <div className="flex items-center">
                <Settings className="w-5 h-5 mr-3 text-purple-500" />
                <span className="text-gray-700 font-medium">Manual Event Test</span>
              </div>
              <Button variant="outline" size="sm" onClick={handleManualEvent} disabled={!isInitialized} className="bg-purple-50 text-purple-600 border-purple-200 hover:bg-purple-100 disabled:opacity-50">
                Send Manual Event
              </Button>
            </div>
            
            {lastTestEvent && <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-sm text-gray-600">
                  <strong>Last test event:</strong> {lastTestEvent}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Check browser console for detailed logs
                </p>
              </div>}
            
            <div className="bg-yellow-50 rounded-lg p-3">
              <p className="text-sm text-yellow-800">
                <strong>Troubleshooting Steps:</strong>
              </p>
              <ul className="text-xs text-yellow-700 mt-1 space-y-1">
                <li>1. Test with webhook.site URL above</li>
                <li>2. Check browser console for errors</li>
                <li>3. Disable ad blockers</li>
                <li>4. Check Network tab in DevTools</li>
              </ul>
            </div>
          </div>
        </div>

        {/* App Settings */}
        <div className="w-full bg-white p-6 border-4 border-gray-200">
          <h3 className="text-xl font-bold text-gray-800 mb-4 uppercase tracking-wide">
            App Settings
          </h3>
          
          {showAddToHomeScreen && <div className="flex items-center justify-between py-3 border-b border-gray-200 last:border-none">
              <div className="flex items-center">
                <Plus className="w-5 h-5 mr-3 text-green-500" />
                <span className="text-gray-700 font-medium">Add to Home Screen</span>
              </div>
              <Button variant="outline" size="sm" onClick={handleAddToHomeScreen} className="bg-green-50 text-green-600 border-green-200 hover:bg-green-100">
                Install
              </Button>
            </div>}
          
          <div className="flex items-center justify-between py-3 border-b border-gray-200 last:border-none">
            <div className="flex items-center">
              <Bell className="w-5 h-5 mr-3 text-blue-500" />
              <span className="text-gray-700 font-medium">Notifications</span>
            </div>
            <Button variant="outline" size="icon" onClick={toggleNotifications}>
              {notificationsEnabled ? "ON" : "OFF"}
            </Button>
          </div>
          <div className="flex items-center justify-between py-3 border-b border-gray-200 last:border-none">
            <div className="flex items-center">
              <Moon className="w-5 h-5 mr-3 text-purple-500" />
              <span className="text-gray-700 font-medium">Dark Mode</span>
            </div>
            <Button variant="outline" size="icon" onClick={toggleDarkMode}>
              {isDarkMode ? "ON" : "OFF"}
            </Button>
          </div>
          <div className="flex items-center justify-between py-3 border-b border-gray-200 last:border-none">
            <div className="flex items-center">
              <Globe className="w-5 h-5 mr-3 text-green-500" />
              <span className="text-gray-700 font-medium">Language</span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-500" />
          </div>
          <div className="flex items-center justify-between py-3 border-b border-gray-200 last:border-none">
            <div className="flex items-center">
              <Volume2 className="w-5 h-5 mr-3 text-orange-500" />
              <span className="text-gray-700 font-medium">Audio Settings</span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-500" />
          </div>
          <div className="flex items-center justify-between py-3 border-b border-gray-200 last:border-none">
            <div className="flex items-center">
              <Smartphone className="w-5 h-5 mr-3 text-teal-500" />
              <span className="text-gray-700 font-medium">Accessibility</span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-500" />
          </div>
        </div>

        {/* Support & About */}
        <div className="w-full bg-white p-6 border-4 border-gray-200">
          <h3 className="text-xl font-bold text-gray-800 mb-4 uppercase tracking-wide">
            Support
          </h3>
          <div onClick={() => handleNavigationClick("help-support", "help_support")} className="flex items-center justify-between py-3 border-b border-gray-200 last:border-none cursor-pointer">
            <div className="flex items-center">
              <HelpCircle className="w-5 h-5 mr-3 text-purple-500" />
              <span className="text-gray-700 font-medium">Help & Support</span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-500" />
          </div>
          <div className="flex items-center justify-between py-3 border-b border-gray-200 last:border-none cursor-pointer">
            <div className="flex items-center">
              <Shield className="w-5 h-5 mr-3 text-yellow-500" />
              <span className="text-gray-700 font-medium">Privacy Policy</span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-500" />
          </div>
          <div className="flex items-center justify-between py-3 border-b border-gray-200 last:border-none cursor-pointer">
            <div className="flex items-center">
              <Star className="w-5 h-5 mr-3 text-orange-500" />
              <span className="text-gray-700 font-medium">Rate Us</span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-500" />
          </div>
          <div className="flex items-center justify-between py-3 border-b border-gray-200 last:border-none">
            <div className="flex items-center">
              <Phone className="w-5 h-5 mr-3 text-green-500" />
              <span className="text-gray-700 font-medium">Call the Founder</span>
            </div>
            <a href="tel:+1234567890" className="text-green-700 font-bold underline hover:text-green-900">Call</a>
          </div>
        </div>

        {/* Logout */}
        <div className="w-full px-6">
          <Button onClick={handleLogout} className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-4 rounded-3xl transition-all duration-200">
            <LogOut className="w-5 h-5 mr-2" />
            Log Out
          </Button>
        </div>
      </div>

      {/* Bottom Navigation */}
      
    </div>;
};

export default SettingsCard;
