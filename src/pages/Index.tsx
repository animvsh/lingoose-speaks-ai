
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Phone, CheckCircle, Home, BarChart3, Settings, User, LogOut, Calendar, Clock, Target, Flame } from "lucide-react";
import DuckMascot from "@/components/DuckMascot";
import ActivityCard from "@/components/ActivityCard";
import CurriculumCard from "@/components/CurriculumCard";
import ProgressCard from "@/components/ProgressCard";
import SettingsCard from "@/components/SettingsCard";
import AddToHomeScreen from "@/components/AddToHomeScreen";
import OnboardingFlow from "@/components/OnboardingFlow";
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
      <div className="min-h-screen bg-[#F5F2E8] flex items-center justify-center">
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
  const nativeFluency = Math.min(34 + (totalCalls * 2), 85);
  const streak = 4;
  const dailyProgress = Math.min((totalCalls * 3), 15);
  
  return (
    <div className="min-h-screen bg-[#F5F2E8] pb-24">
      {/* Header */}
      <div className="bg-orange-400 rounded-b-[2rem] p-6 mb-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <DuckMascot className="w-12 h-12 mr-3" />
            <div>
              <h1 className="text-2xl font-black text-white">
                Hi {userProfile?.full_name?.split(' ')[0] || 'there'}! 👋
              </h1>
              <p className="text-orange-100 font-bold text-sm">
                You're {nativeFluency}% to native fluency!
              </p>
            </div>
          </div>
          <Button
            onClick={signOut}
            variant="ghost"
            size="sm"
            className="p-2 text-orange-100 hover:text-white hover:bg-orange-500 rounded-xl"
          >
            <LogOut className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <div className="px-6 space-y-6">
        {/* Primary CTA */}
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-green-400 to-green-500 rounded-[1.5rem] p-6 border-4 border-green-600 transform hover:scale-[1.02] transition-transform">
            <Button 
              onClick={() => onNavigate("activity")}
              className="w-full bg-transparent hover:bg-green-600/20 text-white font-black py-4 text-lg border-0"
            >
              <Phone className="w-6 h-6 mr-3" />
              START CALL
            </Button>
          </div>
          
          <div className="bg-gradient-to-r from-purple-400 to-purple-500 rounded-[1.5rem] p-4 border-4 border-purple-600 transform hover:scale-[1.02] transition-transform">
            <Button 
              variant="ghost"
              className="w-full text-white font-black py-3 hover:bg-purple-600/20 border-0"
            >
              <Calendar className="w-5 h-5 mr-2" />
              SCHEDULE CALL
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-blue-400 to-blue-500 rounded-[1.5rem] p-6 border-4 border-blue-600 text-center transform hover:scale-105 transition-transform">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-3 border-2 border-blue-700">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div className="text-3xl font-black text-white">{nativeFluency}%</div>
            <div className="text-sm text-blue-100 font-bold uppercase tracking-wide">PROGRESS</div>
          </div>

          <div className="bg-gradient-to-br from-pink-400 to-pink-500 rounded-[1.5rem] p-6 border-4 border-pink-600 text-center transform hover:scale-105 transition-transform">
            <div className="w-12 h-12 bg-pink-600 rounded-xl flex items-center justify-center mx-auto mb-3 border-2 border-pink-700">
              <Flame className="w-6 h-6 text-white" />
            </div>
            <div className="text-3xl font-black text-white">{streak}</div>
            <div className="text-sm text-pink-100 font-bold uppercase tracking-wide">DAY STREAK</div>
          </div>
        </div>

        {/* Achievement Card */}
        <div className="bg-gradient-to-r from-green-300 to-green-400 rounded-[1.5rem] p-6 border-4 border-green-500 transform hover:rotate-1 transition-transform">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-green-600 rounded-xl flex items-center justify-center border-3 border-green-700">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-green-800 uppercase tracking-wide">AWESOME!</h3>
              <p className="text-green-700 font-bold">Last call completed successfully!</p>
              <p className="text-sm text-green-600 font-medium">Topic: Movie Date Gone Wrong 🎬</p>
            </div>
          </div>
        </div>

        {/* Daily Goal */}
        <div className="bg-gradient-to-r from-orange-300 to-orange-400 rounded-[1.5rem] p-4 border-4 border-orange-500">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-orange-600 rounded-xl flex items-center justify-center border-2 border-orange-700">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-orange-800 font-black text-lg uppercase">DAILY GOAL</p>
                <p className="text-orange-700 font-bold">{dailyProgress}/15 minutes</p>
              </div>
            </div>
            <div className="w-16 h-3 bg-orange-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-orange-600 rounded-full transition-all duration-500"
                style={{ width: `${Math.min((dailyProgress / 15) * 100, 100)}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation - Updated to include curriculum instead of progress */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t-4 border-slate-300 px-4 py-4 safe-area-bottom">
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
              onClick={() => onNavigate("activity")}
              className="w-16 h-16 bg-green-300 hover:bg-green-400 border-4 border-green-600 rounded-2xl text-green-900 transition-all duration-200 hover:scale-110 transform hover:rotate-3"
            >
              <Phone className="w-6 h-6" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onNavigate("curriculum")}
              className="w-16 h-16 bg-purple-300 hover:bg-purple-400 border-4 border-purple-600 rounded-2xl text-purple-900 transition-all duration-200 hover:scale-110 transform hover:rotate-3"
            >
              <CheckCircle className="w-6 h-6" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onNavigate("settings")}
              className="w-16 h-16 bg-pink-300 hover:bg-pink-400 border-4 border-pink-600 rounded-2xl text-pink-900 transition-all duration-200 hover:scale-110 transform hover:-rotate-3"
            >
              <Settings className="w-6 h-6" />
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
