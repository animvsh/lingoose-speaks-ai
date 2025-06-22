import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Phone, CheckCircle, Home, Settings, Trophy, Clock, Star, ArrowLeft } from "lucide-react";
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
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
    <div className="min-h-screen bg-gray-50">
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
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    setTimeout(() => setIsLoaded(true), 100);
  }, []);
  
  // Calculate mock progress values
  const totalCalls = callLogs?.length || 0;
  const nativeFluency = Math.min(34 + (totalCalls * 2), 85);
  
  // Get fluency color based on score
  const getFluencyColor = (score: number) => {
    if (score < 30) return "text-red-500";
    if (score < 60) return "text-orange-500";
    if (score < 90) return "text-yellow-600";
    return "text-green-600";
  };
  
  const getFluencyBgColor = (score: number) => {
    if (score < 30) return "bg-red-500";
    if (score < 60) return "bg-orange-500";
    if (score < 90) return "bg-yellow-500";
    return "bg-green-500";
  };
  
  return (
    <div className="min-h-screen bg-yellow-50 pb-24">
      {/* Header */}
      <div className="bg-orange-400 px-6 py-8 mb-8 rounded-b-3xl">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <DuckMascot className="w-12 h-12 mr-3" />
            <div>
              <h1 className="text-2xl font-black text-white">
                Hi {userProfile?.full_name?.split(' ')[0] || 'there'}! 👋
              </h1>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 space-y-6">
        {/* Native Fluency Score Card - Hero Element */}
        <div className={`bg-white rounded-3xl p-8 text-center shadow-lg border-4 border-gray-200 transform transition-all duration-700 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <div className="mb-4">
            <div className={`text-6xl font-black mb-2 ${getFluencyColor(nativeFluency)} animate-fade-in`}>
              {nativeFluency}%
            </div>
            <h2 className="text-2xl font-black text-gray-800 mb-2">NATIVE FLUENCY</h2>
            <p className="text-gray-600 font-semibold">Compared to a native speaker based on speech clarity, vocabulary, and flow</p>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 h-4 rounded-full mb-4 border-2 border-gray-300">
            <div 
              className={`h-full rounded-full transition-all duration-1000 delay-300 ${getFluencyBgColor(nativeFluency)}`}
              style={{ width: isLoaded ? `${nativeFluency}%` : '0%' }}
            ></div>
          </div>
          
          {/* Goose Quote */}
          <div className="bg-gray-50 rounded-2xl p-4 border-2 border-gray-200">
            <p className="text-gray-700 font-semibold italic">
              "We're {100 - nativeFluency}% away from sounding like a native! Let's gooo!" 🦆
            </p>
          </div>
        </div>

        {/* Today's Challenge */}
        <div className={`bg-blue-300 rounded-3xl p-6 shadow-lg border-4 border-blue-400 transform transition-all duration-700 delay-200 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <div className="flex items-center mb-4">
            <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center mr-4 shadow-md">
              <Phone className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-blue-800 uppercase">
                TODAY'S CHALLENGE
              </h3>
              <p className="text-blue-700 font-bold text-lg">
                Talk your way through a hotel check-in 🇪🇸
              </p>
            </div>
          </div>
          <Button 
            onClick={() => onNavigate("activity")}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 text-xl rounded-2xl shadow-lg border-0"
          >
            START CHALLENGE
          </Button>
        </div>

        {/* Improvements Since Last Time - Clickable Panel */}
        <div 
          onClick={() => onNavigate("progress")}
          className={`bg-green-300 rounded-3xl p-6 shadow-lg border-4 border-green-400 cursor-pointer hover:scale-105 transform transition-all duration-700 delay-400 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center mr-4 shadow-md">
                <Trophy className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-green-800 uppercase">
                  IMPROVEMENTS
                </h3>
                <p className="text-green-700 font-bold text-lg">
                  Since last time
                </p>
              </div>
            </div>
            <ArrowLeft className="w-6 h-6 text-green-700 rotate-180" />
          </div>
          
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="bg-white rounded-2xl p-4 text-center border-2 border-green-200">
              <div className="w-10 h-10 bg-purple-400 rounded-xl flex items-center justify-center mx-auto mb-2">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-black text-purple-700">8min</div>
              <div className="text-sm text-purple-600 font-bold">TALK TIME</div>
            </div>
            <div className="bg-white rounded-2xl p-4 text-center border-2 border-green-200">
              <div className="w-10 h-10 bg-pink-400 rounded-xl flex items-center justify-center mx-auto mb-2">
                <Star className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-black text-pink-700">89%</div>
              <div className="text-sm text-pink-600 font-bold">ENGAGEMENT</div>
            </div>
          </div>
        </div>

        {/* Start Learning Button */}
        <div className={`transform transition-all duration-700 delay-600 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <Button 
            onClick={() => onNavigate("curriculum")}
            className="w-full bg-orange-400 hover:bg-orange-500 text-white font-black py-6 text-2xl rounded-3xl shadow-lg border-4 border-orange-500"
          >
            START LEARNING
          </Button>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t-4 border-gray-200 px-4 py-4 shadow-2xl">
        <div className="max-w-md mx-auto">
          <div className="flex justify-center space-x-6">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onNavigate("home")}
              className="w-16 h-16 bg-orange-400 hover:bg-orange-500 rounded-2xl text-white shadow-lg border-2 border-orange-500"
            >
              <Home className="w-7 h-7" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onNavigate("activity")}
              className="w-16 h-16 bg-gray-100 hover:bg-gray-200 rounded-2xl text-gray-600 hover:text-gray-700 shadow-lg border-2 border-gray-200"
            >
              <Phone className="w-7 h-7" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onNavigate("curriculum")}
              className="w-16 h-16 bg-gray-100 hover:bg-gray-200 rounded-2xl text-gray-600 hover:text-gray-700 shadow-lg border-2 border-gray-200"
            >
              <CheckCircle className="w-7 h-7" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onNavigate("settings")}
              className="w-16 h-16 bg-gray-100 hover:bg-gray-200 rounded-2xl text-gray-600 hover:text-gray-700 shadow-lg border-2 border-gray-200"
            >
              <Settings className="w-7 h-7" />
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
