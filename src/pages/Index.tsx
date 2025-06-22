
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Phone, CheckCircle, Home, Settings, Trophy, Clock, Star, ArrowLeft, Target } from "lucide-react";
import DuckMascot from "@/components/DuckMascot";
import ActivityCard from "@/components/ActivityCard";
import CurriculumCard from "@/components/CurriculumCard";
import FluencyMapCard from "@/components/FluencyMapCard";
import ProgressCard from "@/components/ProgressCard";
import SettingsCard from "@/components/SettingsCard";
import AddToHomeScreen from "@/components/AddToHomeScreen";
import OnboardingFlow from "@/components/OnboardingFlow";
import WelcomeScreen from "@/components/WelcomeScreen";
import SplashScreen from "@/components/SplashScreen";
import { useAuth } from "@/contexts/AuthContext";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useCallLogs } from "@/hooks/useCallLogs";
import { useSwipeNavigation } from "@/hooks/useSwipeNavigation";

const Index = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const { data: userProfile, isLoading: profileLoading } = useUserProfile();
  const { data: callLogs } = useCallLogs();
  
  const [currentView, setCurrentView] = useState("splash");
  const [showAddToHomeScreen, setShowAddToHomeScreen] = useState(false);
  const [hasOnboarded, setHasOnboarded] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [slideDirection, setSlideDirection] = useState<'left' | 'right' | null>(null);
  
  const containerRef = useRef<HTMLDivElement>(null);

  // Define navigation history and current index
  const [navigationHistory, setNavigationHistory] = useState<string[]>([]);
  const [currentHistoryIndex, setCurrentHistoryIndex] = useState(-1);

  const navigatableViews = ["home", "activity", "progress", "curriculum", "fluency-map", "settings"];

  const handleSplashComplete = () => {
    if (!authLoading && !user) {
      window.location.href = '/auth';
    } else if (user && userProfile) {
      const onboardingComplete = localStorage.getItem('lingooseOnboardingComplete');
      
      if (onboardingComplete) {
        setHasOnboarded(true);
        setCurrentView("home");
        setNavigationHistory(["home"]);
        setCurrentHistoryIndex(0);
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
        setNavigationHistory(["home"]);
        setCurrentHistoryIndex(0);
      } else {
        setCurrentView("welcome");
      }
    }
  }, [user, userProfile, currentView]);

  const handleNavigation = (view: string, direction: 'left' | 'right' = 'left') => {
    if (currentView === view) return;
    
    setSlideDirection(direction);
    setIsTransitioning(true);
    
    setTimeout(() => {
      setCurrentView(view);
      
      // Update navigation history for navigatable views
      if (navigatableViews.includes(view)) {
        const newHistory = [...navigationHistory.slice(0, currentHistoryIndex + 1), view];
        setNavigationHistory(newHistory);
        setCurrentHistoryIndex(newHistory.length - 1);
      }
      
      setTimeout(() => {
        setIsTransitioning(false);
        setSlideDirection(null);
      }, 50);
    }, 150);
  };

  const handleSwipeNavigation = (direction: 'left' | 'right') => {
    if (!navigatableViews.includes(currentView)) return;

    if (direction === 'right' && currentHistoryIndex > 0) {
      // Go back in history
      const previousView = navigationHistory[currentHistoryIndex - 1];
      setCurrentHistoryIndex(currentHistoryIndex - 1);
      handleNavigation(previousView, 'right');
    } else if (direction === 'left' && currentHistoryIndex < navigationHistory.length - 1) {
      // Go forward in history
      const nextView = navigationHistory[currentHistoryIndex + 1];
      setCurrentHistoryIndex(currentHistoryIndex + 1);
      handleNavigation(nextView, 'left');
    } else if (direction === 'left') {
      // Navigate to next logical view
      const currentIndex = navigatableViews.indexOf(currentView);
      const nextIndex = (currentIndex + 1) % navigatableViews.length;
      handleNavigation(navigatableViews[nextIndex], 'left');
    }
  };

  // Setup swipe navigation
  useSwipeNavigation(containerRef, handleSwipeNavigation);

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
    setNavigationHistory(["home"]);
    setCurrentHistoryIndex(0);
  };

  const getTransitionClasses = () => {
    if (!isTransitioning) {
      return 'opacity-100 translate-x-0 scale-100';
    }
    
    if (slideDirection === 'left') {
      return 'opacity-0 -translate-x-full scale-95';
    } else if (slideDirection === 'right') {
      return 'opacity-0 translate-x-full scale-95';
    }
    
    return 'opacity-0 scale-95';
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
        case "fluency-map":
          return <FluencyMapView onNavigate={handleNavigation} />;
        case "settings":
          return <SettingsView onNavigate={handleNavigation} />;
        default:
          return <WelcomeScreen onComplete={handleWelcomeComplete} />;
      }
    })();

    return (
      <div 
        className={`transition-all duration-300 ease-in-out transform ${getTransitionClasses()}`}
        style={{ 
          transitionProperty: 'opacity, transform',
          transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)'
        }}
      >
        {viewContent}
      </div>
    );
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-gray-50 overflow-hidden">
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
  onNavigate: (view: string, direction?: 'left' | 'right') => void;
  userProfile: any;
  callLogs: any[];
}) => {
  const { signOut } = useAuth();
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    setTimeout(() => setIsLoaded(true), 20);
  }, []);
  
  const totalCalls = callLogs?.length || 0;
  const nativeFluency = Math.min(34 + (totalCalls * 2), 85);
  
  const getFluencyColor = (score: number) => {
    if (score < 30) return "text-red-500";
    if (score < 60) return "text-orange-500";
    if (score < 90) return "text-yellow-600";
    return "text-green-600";
  };
  
  const getFluencyBgColor = (score: number) => {
    if (score < 30) return "bg-red-400";
    if (score < 60) return "bg-orange-400";
    if (score < 90) return "bg-yellow-400";
    return "bg-green-400";
  };
  
  return (
    <div className="min-h-screen bg-stone-50 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-br from-orange-400 to-orange-500 px-6 py-8 mb-8 rounded-b-3xl">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <DuckMascot className="w-16 h-16 mr-4 transform hover:scale-110 transition-transform duration-200" />
            <div>
              <h1 className="text-2xl font-black text-white drop-shadow-sm">
                Hey {userProfile?.full_name?.split(' ')[0] || 'there'}! 🌟
              </h1>
              <p className="text-orange-100 font-semibold">Ready to learn today?</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 space-y-6">
        {/* Native Fluency Score Card */}
        <div className={`bg-white rounded-3xl p-6 text-center border-4 border-gray-100 hover:border-orange-200 transition-all duration-300 hover:-translate-y-1 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
          <div className="mb-6">
            <div className={`text-5xl font-black mb-3 ${getFluencyColor(nativeFluency)} transition-all duration-300`}>
              {nativeFluency}%
            </div>
            <h2 className="text-xl font-black text-gray-800 mb-2 tracking-tight">NATIVE FLUENCY</h2>
            <p className="text-gray-600 font-semibold text-sm">Speech clarity, vocabulary, and flow</p>
          </div>
          
          <div className="w-full bg-gray-200 h-4 rounded-full mb-6 overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-700 ${getFluencyBgColor(nativeFluency)}`}
              style={{ width: isLoaded ? `${nativeFluency}%` : '0%' }}
            ></div>
          </div>
          
          <div className="bg-orange-50 rounded-2xl p-4 border-2 border-orange-100">
            <p className="text-orange-700 font-bold text-sm">
              "Just {100 - nativeFluency}% away from native level! 🦆✨"
            </p>
          </div>
        </div>

        {/* Today's Challenge */}
        <div className={`bg-gradient-to-br from-blue-400 to-blue-500 rounded-3xl p-6 border-4 border-white hover:border-blue-200 transition-all duration-300 hover:-translate-y-1 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
          <div className="flex items-center mb-4">
            <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center mr-4">
              <Phone className="w-7 h-7 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-black text-white uppercase tracking-tight">
                TODAY'S CHALLENGE
              </h3>
              <p className="text-blue-100 font-semibold text-sm">
                Hotel check-in conversation 🇪🇸
              </p>
            </div>
          </div>
          <Button 
            onClick={() => onNavigate("activity")}
            className="w-full bg-white hover:bg-blue-50 text-blue-600 font-black py-4 text-lg rounded-2xl border-4 border-white hover:border-blue-100 transition-all duration-300 hover:-translate-y-0.5"
          >
            START NOW ⚡
          </Button>
        </div>

        {/* Improvements */}
        <div 
          onClick={() => onNavigate("progress")}
          className={`bg-gradient-to-br from-green-400 to-green-500 rounded-3xl p-6 border-4 border-white hover:border-green-200 cursor-pointer transition-all duration-300 hover:-translate-y-1 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="w-14 h-14 bg-green-600 rounded-2xl flex items-center justify-center mr-4">
                <Trophy className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-black text-white uppercase tracking-tight">
                  IMPROVEMENTS
                </h3>
                <p className="text-green-100 font-semibold text-sm">
                  Since last time
                </p>
              </div>
            </div>
            <ArrowLeft className="w-6 h-6 text-green-100 rotate-180" />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/95 rounded-2xl p-4 text-center border-2 border-white/50">
              <div className="w-8 h-8 bg-purple-400 rounded-xl flex items-center justify-center mx-auto mb-2">
                <Clock className="w-4 h-4 text-white" />
              </div>
              <div className="text-xl font-black text-purple-700">8min</div>
              <div className="text-xs text-purple-600 font-bold">TALK TIME</div>
            </div>
            <div className="bg-white/95 rounded-2xl p-4 text-center border-2 border-white/50">
              <div className="w-8 h-8 bg-pink-400 rounded-xl flex items-center justify-center mx-auto mb-2">
                <Star className="w-4 h-4 text-white" />
              </div>
              <div className="text-xl font-black text-pink-700">89%</div>
              <div className="text-xs text-pink-600 font-bold">ENGAGEMENT</div>
            </div>
          </div>
        </div>

        {/* New Fluency Map Button */}
        <div className={`transition-all duration-300 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
          <Button 
            onClick={() => onNavigate("fluency-map")}
            className="w-full bg-gradient-to-r from-purple-400 to-purple-500 hover:from-purple-500 hover:to-purple-600 text-white font-black py-6 text-xl rounded-3xl border-4 border-white hover:border-purple-200 transition-all duration-300 hover:-translate-y-1 mb-4"
          >
            <Target className="w-8 h-8 mr-3" />
            EXPLORE FLUENCY MAP 🗺️
          </Button>
        </div>

        {/* Start Learning Button */}
        <div className={`transition-all duration-300 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
          <Button 
            onClick={() => onNavigate("curriculum")}
            className="w-full bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white font-black py-6 text-xl rounded-3xl border-4 border-white hover:border-orange-200 transition-all duration-300 hover:-translate-y-1"
          >
            START LEARNING 🚀
          </Button>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white px-6 py-4 border-t-4 border-gray-100">
        <div className="max-w-md mx-auto">
          <div className="flex justify-center space-x-3">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onNavigate("home")}
              className="w-14 h-14 bg-orange-400 hover:bg-orange-500 rounded-2xl text-white border-4 border-white hover:border-orange-200 transition-all duration-300 hover:-translate-y-0.5"
            >
              <Home className="w-6 h-6" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onNavigate("activity")}
              className="w-14 h-14 bg-gray-200 hover:bg-gray-300 rounded-2xl text-gray-600 hover:text-gray-700 border-4 border-white hover:border-gray-200 transition-all duration-300 hover:-translate-y-0.5"
            >
              <Phone className="w-6 h-6" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onNavigate("curriculum")}
              className="w-14 h-14 bg-gray-200 hover:bg-gray-300 rounded-2xl text-gray-600 hover:text-gray-700 border-4 border-white hover:border-gray-200 transition-all duration-300 hover:-translate-y-0.5"
            >
              <CheckCircle className="w-6 h-6" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onNavigate("settings")}
              className="w-14 h-14 bg-gray-200 hover:bg-gray-300 rounded-2xl text-gray-600 hover:text-gray-700 border-4 border-white hover:border-gray-200 transition-all duration-300 hover:-translate-y-0.5"
            >
              <Settings className="w-6 h-6" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ActivityView = ({ onNavigate }: { onNavigate: (view: string, direction?: 'left' | 'right') => void }) => (
  <ActivityCard onNavigate={onNavigate} />
);

const ProgressView = ({ onNavigate }: { onNavigate: (view: string, direction?: 'left' | 'right') => void }) => (
  <ProgressCard onNavigate={onNavigate} />
);

const CurriculumView = ({ onNavigate }: { onNavigate: (view: string, direction?: 'left' | 'right') => void }) => (
  <CurriculumCard onNavigate={onNavigate} />
);

const FluencyMapView = ({ onNavigate }: { onNavigate: (view: string, direction?: 'left' | 'right') => void }) => (
  <FluencyMapCard onNavigate={onNavigate} />
);

const SettingsView = ({ onNavigate }: { onNavigate: (view: string, direction?: 'left' | 'right') => void }) => (
  <SettingsCard onNavigate={onNavigate} />
);

export default Index;
