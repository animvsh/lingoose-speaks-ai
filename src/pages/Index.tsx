import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Phone, CheckCircle, Home, BarChart3, Settings, User } from "lucide-react";
import DuckMascot from "@/components/DuckMascot";
import ActivityCard from "@/components/ActivityCard";
import CurriculumCard from "@/components/CurriculumCard";
import ProgressCard from "@/components/ProgressCard";
import AddToHomeScreen from "@/components/AddToHomeScreen";
import OnboardingFlow from "@/components/OnboardingFlow";
import SettingsCard from "@/components/SettingsCard";
import WelcomeScreen from "@/components/WelcomeScreen";
import DashboardStats from "@/components/DashboardStats";
import WeeklyChart from "@/components/WeeklyChart";
import RecentFeedback from "@/components/RecentFeedback";
import GoalProgress from "@/components/GoalProgress";

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
    <div className="min-h-screen bg-[#F5F2E8]">
      <div className="w-full max-w-md mx-auto">
        {renderView()}
      </div>
      
      {showAddToHomeScreen && (
        <AddToHomeScreen onDismiss={handleDismissAddToHomeScreen} />
      )}
    </div>
  );
};

const HomeView = ({ onNavigate }: { onNavigate: (view: string) => void }) => (
  <div className="min-h-screen bg-white">
    <div className="px-4 pt-6 pb-20">
      {/* Header */}
      <div className="text-center mb-6">
        <DuckMascot className="mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-slate-800 mb-1">Analytics Dashboard</h1>
        <p className="text-slate-600">Your Hindi learning journey</p>
      </div>

      {/* Dashboard Content */}
      <DashboardStats />
      <WeeklyChart />
      <RecentFeedback />
      <GoalProgress />

      {/* Quick Action */}
      <div className="mb-6">
        <Button 
          onClick={() => onNavigate("activity")}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-6 rounded-2xl text-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
        >
          <Phone className="w-5 h-5 mr-3" />
          Start Your Daily Call
        </Button>
        <div className="text-center text-sm text-slate-500 mt-2">
          🔥 12 day streak • Next milestone: 15 days
        </div>
      </div>
    </div>

    {/* Bottom Navigation */}
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 px-4 py-3 safe-area-bottom">
      <div className="max-w-md mx-auto">
        <div className="flex justify-center space-x-8">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => onNavigate("home")}
            className="w-12 h-12 bg-orange-500 hover:bg-orange-600 rounded-xl text-white transition-all duration-200 hover:scale-105"
          >
            <Home className="w-5 h-5" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => onNavigate("progress")}
            className="w-12 h-12 rounded-xl text-slate-400 hover:bg-slate-100 transition-all duration-200 hover:scale-105"
          >
            <BarChart3 className="w-5 h-5" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => onNavigate("curriculum")}
            className="w-12 h-12 rounded-xl text-slate-400 hover:bg-slate-100 transition-all duration-200 hover:scale-105"
          >
            <CheckCircle className="w-5 h-5" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => onNavigate("settings")}
            className="w-12 h-12 rounded-xl text-slate-400 hover:bg-slate-100 transition-all duration-200 hover:scale-105"
          >
            <Settings className="w-5 h-5" />
          </Button>
        </div>
      </div>
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
