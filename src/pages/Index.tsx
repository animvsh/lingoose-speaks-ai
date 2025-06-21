import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Phone, CheckCircle, Clock, Home, BarChart3, Settings, User } from "lucide-react";
import DuckMascot from "@/components/DuckMascot";
import ActivityCard from "@/components/ActivityCard";
import CurriculumCard from "@/components/CurriculumCard";
import ProgressCard from "@/components/ProgressCard";
import AddToHomeScreen from "@/components/AddToHomeScreen";
import OnboardingFlow from "@/components/OnboardingFlow";
import SettingsCard from "@/components/SettingsCard";
import WelcomeScreen from "@/components/WelcomeScreen";

const Index = () => {
  const [currentView, setCurrentView] = useState("welcome");
  const [showAddToHomeScreen, setShowAddToHomeScreen] = useState(false);
  const [hasOnboarded, setHasOnboarded] = useState(false);

  useEffect(() => {
    // Check if user has already onboarded
    const onboardingComplete = localStorage.getItem('lingooseOnboardingComplete');
    
    if (onboardingComplete) {
      setHasOnboarded(true);
      setCurrentView("home");
    } else {
      setCurrentView("welcome");
    }
  }, []);

  const handleWelcomeComplete = () => {
    // Check if it's a mobile device and not already added to home screen
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                        (window.navigator as any).standalone === true;
    const addToHomeScreenDismissed = localStorage.getItem('addToHomeScreenDismissed');
    
    // Show add to home screen prompt if conditions are met
    if (isMobile && !isStandalone && !addToHomeScreenDismissed) {
      setCurrentView("add-to-home");
      setShowAddToHomeScreen(true);
    } else {
      setCurrentView("onboarding");
    }
  };

  const handleDismissAddToHomeScreen = () => {
    setShowAddToHomeScreen(false);
    localStorage.setItem('addToHomeScreenDismissed', 'true');
    setCurrentView("onboarding");
  };

  const handleOnboardingComplete = () => {
    localStorage.setItem('lingooseOnboardingComplete', 'true');
    setHasOnboarded(true);
    setCurrentView("home");
  };

  const renderView = () => {
    switch (currentView) {
      case "welcome":
        return <WelcomeScreen onComplete={handleWelcomeComplete} />;
      case "add-to-home":
        return null; // AddToHomeScreen overlay handles this
      case "onboarding":
        return <OnboardingFlow onComplete={handleOnboardingComplete} />;
      case "home":
        return <HomeView onNavigate={setCurrentView} />;
      case "activity":
        return <ActivityView onNavigate={setCurrentView} />;
      case "progress":
        return <ProgressView onNavigate={setCurrentView} />;
      case "curriculum":
        return <CurriculumView onNavigate={setCurrentView} />;
      case "settings":
        return <SettingsView onNavigate={setCurrentView} />;
      default:
        return <WelcomeScreen onComplete={handleWelcomeComplete} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F2E8] flex items-center justify-center p-4">
      {/* Fullscreen App Content */}
      <div className="w-full max-w-md h-screen flex items-center justify-center">
        <div className="w-full h-full max-h-[667px] flex items-center justify-center">
          {renderView()}
        </div>
      </div>
      
      {showAddToHomeScreen && (
        <AddToHomeScreen onDismiss={handleDismissAddToHomeScreen} />
      )}
    </div>
  );
};

const HomeView = ({ onNavigate }: { onNavigate: (view: string) => void }) => (
  <div className="bg-white p-8 rounded-3xl shadow-lg w-full h-full flex flex-col">
    <div className="text-center space-y-6 flex-1">
      <DuckMascot className="mx-auto" />
      <div>
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Lingoose में आपका स्वागत है!</h1>
        <p className="text-slate-600">"नमस्ते, लेकिन थोड़ी अजीब तरीके से"</p>
      </div>
      
      <div className="space-y-4">
        <div className="bg-orange-50 p-4 rounded-2xl">
          <div className="flex justify-between items-center mb-2">
            <span className="text-slate-600 font-medium">आज की प्रवाहता</span>
            <span className="text-orange-500 font-bold">67%</span>
          </div>
          <div className="w-full bg-orange-200 h-2 rounded-full">
            <div className="bg-orange-500 h-2 rounded-full w-2/3"></div>
          </div>
        </div>

        <Button 
          onClick={() => onNavigate("activity")}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-6 px-6 rounded-2xl text-xl transition-all duration-200 hover:scale-105"
        >
          <Phone className="w-6 h-6 mr-3" />
          मुझे अभी कॉल करें
        </Button>

        <div className="text-sm text-slate-500">
          🔥 7 दिन की स्ट्रीक • 2 कॉल में अगला अनलॉक
        </div>
      </div>
    </div>

    <div className="flex justify-center space-x-8 pt-4 border-t border-slate-100">
      <Button 
        variant="ghost" 
        size="sm"
        onClick={() => onNavigate("home")}
        className="w-12 h-12 bg-orange-500 hover:bg-orange-600 rounded-xl text-white"
      >
        <Home className="w-5 h-5" />
      </Button>
      <Button 
        variant="ghost" 
        size="sm"
        onClick={() => onNavigate("progress")}
        className="w-12 h-12 rounded-xl text-slate-400 hover:bg-slate-100"
      >
        <BarChart3 className="w-5 h-5" />
      </Button>
      <Button 
        variant="ghost" 
        size="sm"
        onClick={() => onNavigate("curriculum")}
        className="w-12 h-12 rounded-xl text-slate-400 hover:bg-slate-100"
      >
        <CheckCircle className="w-5 h-5" />
      </Button>
      <Button 
        variant="ghost" 
        size="sm"
        onClick={() => onNavigate("settings")}
        className="w-12 h-12 rounded-xl text-slate-400 hover:bg-slate-100"
      >
        <Settings className="w-5 h-5" />
      </Button>
    </div>
  </div>
);

const ActivityView = ({ onNavigate }: { onNavigate: (view: string) => void }) => (
  <ActivityCard onNavigate={onNavigate} />
);

const ProgressView = ({ onNavigate }: { onNavigate: (view: string) => void }) => (
  <ProgressCard onNavigate={onNavigate} />
);

const CurriculumView = ({ onNavigate }: { onNavigate: (view: string) => void }) => (
  <CurriculumCard onNavigate={onNavigate} />
);

const SettingsView = ({ onNavigate }: { onNavigate: (view: string) => void }) => (
  <SettingsCard onNavigate={onNavigate} />
);

export default Index;
