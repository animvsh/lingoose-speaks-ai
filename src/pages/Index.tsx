
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
  const [isTransitioning, setIsTransitioning] = useState(false);

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

  const handleNavigation = (view: string) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentView(view);
      setIsTransitioning(false);
    }, 150);
  };

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
    const viewContent = (() => {
      switch (currentView) {
        case "welcome":
          return <WelcomeScreen onComplete={handleWelcomeComplete} />;
        case "add-to-home":
          return null; // AddToHomeScreen overlay handles this
        case "onboarding":
          return <OnboardingFlow onComplete={handleOnboardingComplete} />;
        case "home":
          return <HomeView onNavigate={handleNavigation} />;
        case "activity":
          return <ActivityView onNavigate={handleNavigation} />;
        case "progress":
          return <ProgressView onNavigate={handleNavigation} />;
        case "curriculum":
          return <CurriculumView onNavigate={handleNavigation} />;
        case "settings":
          return <SettingsView onNavigate={handleNavigation} />;
        default:
          return <WelcomeScreen onComplete={handleWelcomeComplete} />;
      }
    })();

    return (
      <div className={`transition-all duration-300 ${isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
        {viewContent}
      </div>
    );
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
  <div className="min-h-screen bg-yellow-100">
    {/* Scrollable Content Container with bottom padding for navbar */}
    <div className="pb-32">
      <div className="px-4 pt-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="relative inline-block">
            <DuckMascot className="mx-auto mb-4 hover:scale-110 transition-transform duration-300" />
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-400 border-2 border-green-600 rounded-full flex items-center justify-center animate-bounce">
              <span className="text-xs font-black">✓</span>
            </div>
          </div>
          <h1 className="text-4xl font-black text-orange-600 mb-3 uppercase tracking-wider transform -rotate-1">
            Welcome Back!
          </h1>
          <p className="text-slate-800 font-bold text-lg">Ready for today's Hindi adventure?</p>
        </div>

        {/* Dashboard Content */}
        <DashboardStats />
        <WeeklyChart />
        <RecentFeedback />
        <GoalProgress />

        {/* Quick Action */}
        <div className="mb-8">
          <Button 
            onClick={() => onNavigate("activity")}
            className="w-full bg-orange-400 hover:bg-orange-500 border-4 border-orange-600 text-white font-black py-6 px-6 rounded-2xl text-lg transition-all duration-200 hover:scale-105 transform hover:-rotate-1"
          >
            <Phone className="w-6 h-6 mr-3" />
            Start Your Daily Call
          </Button>
          <div className="text-center text-sm text-slate-800 mt-3 bg-white border-3 border-slate-400 rounded-full px-4 py-2 font-bold">
            🔥 12 day streak • Next milestone: 15 days
          </div>
        </div>
      </div>
    </div>

    {/* Fixed Bottom Navigation - Cartoon style */}
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t-4 border-slate-400 px-4 py-4">
      <div className="max-w-md mx-auto">
        <div className="flex justify-center space-x-6">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => onNavigate("home")}
            className="w-16 h-16 bg-orange-400 hover:bg-orange-500 border-4 border-orange-600 rounded-2xl text-white transition-all duration-200 hover:scale-110 transform hover:-rotate-3"
          >
            <Home className="w-6 h-6" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => onNavigate("progress")}
            className="w-16 h-16 bg-blue-300 hover:bg-blue-400 border-4 border-blue-600 rounded-2xl text-blue-900 transition-all duration-200 hover:scale-110 transform hover:rotate-3"
          >
            <BarChart3 className="w-6 h-6" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => onNavigate("curriculum")}
            className="w-16 h-16 bg-green-300 hover:bg-green-400 border-4 border-green-600 rounded-2xl text-green-900 transition-all duration-200 hover:scale-110 transform hover:-rotate-3"
          >
            <CheckCircle className="w-6 h-6" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => onNavigate("settings")}
            className="w-16 h-16 bg-purple-300 hover:bg-purple-400 border-4 border-purple-600 rounded-2xl text-purple-900 transition-all duration-200 hover:scale-110 transform hover:rotate-3"
          >
            <Settings className="w-6 h-6" />
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
