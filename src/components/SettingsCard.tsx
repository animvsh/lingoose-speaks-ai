
import { Button } from "@/components/ui/button";
import { Settings, User, Bell, HelpCircle, LogOut, ChevronRight, Home, Phone, CheckCircle, ArrowLeft, Shield, Globe, Volume2, Moon, Smartphone, Star, Plus, UserPlus } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import AppBar from "./AppBar";

interface SettingsCardProps {
  onNavigate: (view: string) => void;
}

const SettingsCard = ({ onNavigate }: SettingsCardProps) => {
  const { signOut } = useAuth();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [showAddToHomeScreen, setShowAddToHomeScreen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowAddToHomeScreen(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Check if already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                        (window.navigator as any).standalone === true;
    
    if (!isStandalone) {
      setShowAddToHomeScreen(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const toggleNotifications = () => {
    setNotificationsEnabled(!notificationsEnabled);
  };

  const handleAddToHomeScreen = async () => {
    console.log('Add to home screen clicked from settings');
    
    if (deferredPrompt) {
      try {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        console.log(`User response to install prompt: ${outcome}`);
        
        if (outcome === 'accepted') {
          setShowAddToHomeScreen(false);
          localStorage.setItem('pwaInstalled', 'true');
        }
        
        setDeferredPrompt(null);
      } catch (error) {
        console.error('Error showing install prompt:', error);
      }
    } else {
      // Show manual instructions
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

  return (
    <div className="min-h-screen bg-amber-50 pb-24">
      <AppBar 
        title="SETTINGS" 
        onBack={() => onNavigate("home")} 
        showBackButton={true} 
      />

      <div className="px-6 space-y-6">
        {/* Account Settings */}
        <div className="bg-white rounded-3xl p-6 border-4 border-gray-200">
          <h3 className="text-xl font-bold text-gray-800 mb-4 uppercase tracking-wide">
            Account
          </h3>
          <div 
            className="flex items-center justify-between py-3 border-b border-gray-200 last:border-none cursor-pointer"
            onClick={() => onNavigate("profile-management")}
          >
            <div className="flex items-center">
              <User className="w-5 h-5 mr-3 text-orange-500" />
              <span className="text-gray-700 font-medium">Profile Management</span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-500" />
          </div>
          <div 
            className="flex items-center justify-between py-3 border-b border-gray-200 last:border-none cursor-pointer"
            onClick={() => onNavigate("add-supervisor")}
          >
            <div className="flex items-center">
              <UserPlus className="w-5 h-5 mr-3 text-purple-500" />
              <span className="text-gray-700 font-medium">Add Supervisor</span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-500" />
          </div>
        </div>

        {/* App Settings */}
        <div className="bg-white rounded-3xl p-6 border-4 border-gray-200">
          <h3 className="text-xl font-bold text-gray-800 mb-4 uppercase tracking-wide">
            App Settings
          </h3>
          
          {showAddToHomeScreen && (
            <div className="flex items-center justify-between py-3 border-b border-gray-200 last:border-none">
              <div className="flex items-center">
                <Plus className="w-5 h-5 mr-3 text-green-500" />
                <span className="text-gray-700 font-medium">Add to Home Screen</span>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleAddToHomeScreen}
                className="bg-green-50 text-green-600 border-green-200 hover:bg-green-100"
              >
                Install
              </Button>
            </div>
          )}
          
          <div className="flex items-center justify-between py-3 border-b border-gray-200 last:border-none">
            <div className="flex items-center">
              <Bell className="w-5 h-5 mr-3 text-blue-500" />
              <span className="text-gray-700 font-medium">Notifications</span>
            </div>
            <Button 
              variant="outline" 
              size="icon"
              onClick={toggleNotifications}
            >
              {notificationsEnabled ? "ON" : "OFF"}
            </Button>
          </div>
          <div className="flex items-center justify-between py-3 border-b border-gray-200 last:border-none">
            <div className="flex items-center">
              <Moon className="w-5 h-5 mr-3 text-purple-500" />
              <span className="text-gray-700 font-medium">Dark Mode</span>
            </div>
            <Button 
              variant="outline" 
              size="icon"
              onClick={toggleDarkMode}
            >
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
        <div className="bg-white rounded-3xl p-6 border-4 border-gray-200">
          <h3 className="text-xl font-bold text-gray-800 mb-4 uppercase tracking-wide">
            Support
          </h3>
          <div 
            onClick={() => onNavigate("help-support")}
            className="flex items-center justify-between py-3 border-b border-gray-200 last:border-none cursor-pointer"
          >
            <div className="flex items-center">
              <HelpCircle className="w-5 h-5 mr-3 text-purple-500" />
              <span className="text-gray-700 font-medium">Help & Support</span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-500" />
          </div>
          <div className="flex items-center justify-between py-3 border-b border-gray-200 last:border-none">
            <div className="flex items-center">
              <Shield className="w-5 h-5 mr-3 text-yellow-500" />
              <span className="text-gray-700 font-medium">Privacy Policy</span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-500" />
          </div>
          <div className="flex items-center justify-between py-3 border-b border-gray-200 last:border-none">
            <div className="flex items-center">
              <Star className="w-5 h-5 mr-3 text-orange-500" />
              <span className="text-gray-700 font-medium">Rate Us</span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-500" />
          </div>
        </div>

        {/* Logout */}
        <Button 
          onClick={() => signOut()}
          className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-4 rounded-3xl transition-all duration-200"
        >
          <LogOut className="w-5 h-5 mr-2" />
          Log Out
        </Button>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white px-6 py-4 border-t border-gray-100">
        <div className="max-w-md mx-auto">
          <div className="flex justify-center space-x-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onNavigate("home")}
              className="w-14 h-14 bg-gray-200 rounded-2xl text-gray-600"
            >
              <Home className="w-6 h-6" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onNavigate("activity")}
              className="w-14 h-14 bg-gray-200 rounded-2xl text-gray-600"
            >
              <Phone className="w-6 h-6" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onNavigate("curriculum")}
              className="w-14 h-14 bg-gray-200 rounded-2xl text-gray-600"
            >
              <CheckCircle className="w-6 h-6" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onNavigate("settings")}
              className="w-14 h-14 bg-orange-400 rounded-2xl text-white"
            >
              <Settings className="w-6 h-6" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsCard;
