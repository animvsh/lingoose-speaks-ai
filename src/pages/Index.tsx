import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Phone, CheckCircle, Home, BarChart3, Settings, User, LogOut, Calendar, Clock, Target, Flame } from "lucide-react";
import DuckMascot from "@/components/DuckMascot";
import ActivityCard from "@/components/ActivityCard";
import CurriculumCard from "@/components/CurriculumCard";
import ProgressCard from "@/components/ProgressCard";
import AddToHomeScreen from "@/components/AddToHomeScreen";
import OnboardingFlow from "@/components/OnboardingFlow";
import SettingsCard from "@/components/SettingsCard";
import WelcomeScreen from "@/components/WelcomeScreen";
import SplashScreen from "@/components/SplashScreen";
import { useAuth } from "@/contexts/AuthContext";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useCallLogs } from "@/hooks/useCallLogs";

const Index = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const { data: userProfile, isLoading: profileLoading } = useUserProfile();
  const { data: callLogs } = useCallLogs();
  
  const [currentView, setCurrentView] = useState("splash");
  const [showAddToHomeScreen, setShowAddToHomeScreen] = useState(false);
  const [hasOnboarded, setHasOnboarded] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleSplashComplete = () => {
    if (!authLoading && !user) {
      window.location.href = '/auth';
    } else if (user && userProfile) {
      const onboardingComplete = localStorage.getItem('lingooseOnboardingComplete');
      
      if (onboardingComplete) {
        setHasOnboarded(true);
        setCurrentView("home");
      } else {
        setCurrentView("welcome");
      }
    } else {
      setCurrentView("loading");
    }
  };

  useEffect(() => {
    if (!authLoading && !user && currentView !== "splash") {
      window.location.href = '/auth';
    }
  }, [user, authLoading, currentView]);

  useEffect(() => {
    if (user && userProfile && currentView === "loading") {
      const onboardingComplete = localStorage.getItem('lingooseOnboardingComplete');
      
      if (onboardingComplete) {
        setHasOnboarded(true);
        setCurrentView("home");
      } else {
        setCurrentView("welcome");
      }
    }
  }, [user, userProfile, currentView]);

  if (currentView === "splash") {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  if (currentView === "loading" || authLoading || profileLoading) {
    return (
      <div className="min-h-screen bg-yellow-100 flex items-center justify-center">
        <div className="text-center">
          <DuckMascot className="mx-auto mb-4 animate-bounce" />
          <p className="text-slate-700 font-bold text-lg">Loading your account...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const handleNavigation = (view: string) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentView(view);
      setIsTransitioning(false);
    }, 150);
  };

  const handleWelcomeComplete = () => {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                        (window.navigator as any).standalone === true;
    const addToHomeScreenDismissed = localStorage.getItem('addToHomeScreenDismissed');
    
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
          return null;
        case "onboarding":
          return <OnboardingFlow onComplete={handleOnboardingComplete} />;
        case "home":
          return <HomeView onNavigate={handleNavigation} userProfile={userProfile} callLogs={callLogs} />;
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

const HomeView = ({ onNavigate, userProfile, callLogs }: { 
  onNavigate: (view: string) => void;
  userProfile: any;
  callLogs: any[];
}) => {
  const { signOut } = useAuth();
  
  // Calculate mock progress values
  const totalCalls = callLogs?.length || 0;
  const nativeFluency = Math.min(34 + (totalCalls * 2), 85); // Mock progression
  const streak = 4; // Mock streak
  const dailyProgress = Math.min((totalCalls * 3), 15); // Mock daily minutes
  
  return (
    <div className="min-h-screen bg-yellow-100">
      {/* Clean Header */}
      <div className="px-6 py-6">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center">
            <DuckMascot className="w-10 h-10 mr-3" />
            <div>
              <h1 className="text-xl font-bold text-slate-800">
                Hi {userProfile?.full_name?.split(' ')[0] || 'there'} 👋
              </h1>
              <p className="text-sm text-orange-600 font-semibold">
                You're {nativeFluency}% to native fluency!
              </p>
            </div>
          </div>
          <Button
            onClick={signOut}
            variant="ghost"
            size="sm"
            className="p-2 text-slate-500 hover:text-slate-700"
          >
            <LogOut className="w-5 h-5" />
          </Button>
        </div>

        {/* Primary CTA */}
        <div className="mb-8">
          <Button 
            onClick={() => onNavigate("activity")}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-6 px-6 rounded-3xl text-lg shadow-lg mb-4"
          >
            <Phone className="w-6 h-6 mr-3" />
            Start Call
          </Button>
          
          <Button 
            variant="outline"
            className="w-full border-2 border-orange-200 text-orange-700 font-semibold py-4 px-6 rounded-3xl"
          >
            <Calendar className="w-5 h-5 mr-2" />
            Schedule Call
          </Button>
        </div>

        {/* Progress Summary Cards */}
        <div className="space-y-4 mb-8">
          {/* Current Progress Summary */}
          <div className="bg-white rounded-3xl p-6 shadow-lg border border-slate-100">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center">
              <Target className="w-5 h-5 mr-2 text-blue-500" />
              Current Progress
            </h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-black text-blue-600">61%</div>
                <div className="text-xs text-slate-600">Vocabulary</div>
              </div>
              <div>
                <div className="text-2xl font-black text-green-600">52%</div>
                <div className="text-xs text-slate-600">Grammar</div>
              </div>
              <div>
                <div className="text-2xl font-black text-purple-600">44%</div>
                <div className="text-xs text-slate-600">Accent</div>
              </div>
            </div>
          </div>

          {/* Quick Stats Row */}
          <div className="grid grid-cols-2 gap-4">
            {/* Streak Tracker */}
            <div className="bg-white rounded-2xl p-4 shadow-lg border border-slate-100">
              <div className="flex items-center justify-center mb-2">
                <Flame className="w-5 h-5 text-orange-500 mr-2" />
                <span className="font-bold text-slate-800">{streak}-day streak</span>
              </div>
              <div className="text-2xl text-center">🔥</div>
            </div>

            {/* Daily Goal Status */}
            <div className="bg-white rounded-2xl p-4 shadow-lg border border-slate-100">
              <div className="flex items-center justify-center mb-2">
                <Clock className="w-5 h-5 text-green-500 mr-2" />
                <span className="font-bold text-slate-800 text-sm">Daily Goal</span>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-green-600">{dailyProgress}/15</div>
                <div className="text-xs text-slate-600">minutes</div>
              </div>
            </div>
          </div>

          {/* Last Topic Recap */}
          <div className="bg-white rounded-3xl p-4 shadow-lg border border-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">Last call:</p>
                <p className="font-bold text-slate-800">Movie Date Gone Wrong 🎬</p>
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => onNavigate("progress")}
                className="text-orange-600 hover:text-orange-700"
              >
                View Details
              </Button>
            </div>
          </div>

          {/* Notification Preview */}
          <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-2xl p-4 border border-orange-100">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-orange-500 rounded-full mr-3 animate-pulse"></div>
              <p className="text-sm text-orange-800 font-medium">
                Next practice call in 2h
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-4 py-3 safe-area-bottom">
        <div className="max-w-md mx-auto">
          <div className="flex justify-center space-x-8">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onNavigate("home")}
              className="flex flex-col items-center py-2 px-3 text-orange-600"
            >
              <Home className="w-5 h-5 mb-1" />
              <span className="text-xs font-medium">Home</span>
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onNavigate("progress")}
              className="flex flex-col items-center py-2 px-3 text-slate-500 hover:text-slate-700"
            >
              <BarChart3 className="w-5 h-5 mb-1" />
              <span className="text-xs font-medium">Progress</span>
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onNavigate("curriculum")}
              className="flex flex-col items-center py-2 px-3 text-slate-500 hover:text-slate-700"
            >
              <CheckCircle className="w-5 h-5 mb-1" />
              <span className="text-xs font-medium">Topics</span>
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onNavigate("settings")}
              className="flex flex-col items-center py-2 px-3 text-slate-500 hover:text-slate-700"
            >
              <Settings className="w-5 h-5 mb-1" />
              <span className="text-xs font-medium">Settings</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

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
