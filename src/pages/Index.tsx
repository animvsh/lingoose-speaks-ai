
import { useState, useEffect } from "react";
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
    }, 50); // Super fast transitions
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
        case "fluency-map":
          return <FluencyMapView onNavigate={handleNavigation} />;
        case "settings":
          return <SettingsView onNavigate={handleNavigation} />;
        default:
          return <WelcomeScreen onComplete={handleWelcomeComplete} />;
      }
    })();

    return (
      <div className={`transition-all duration-100 ${isTransitioning ? 'opacity-0 scale-99' : 'opacity-100 scale-100'}`}>
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
    setTimeout(() => setIsLoaded(true), 20); // Super fast load
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
    <div className="min-h-screen bg-gray-100 pb-20">
      {/* Header */}
      <div className="bg-orange-500 px-4 py-5 mb-6 rounded-b-3xl shadow-[0_6px_0_0_#ea580c]">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <DuckMascot className="w-8 h-8 mr-3" />
            <div>
              <h1 className="text-lg font-black text-white">
                Hi {userProfile?.full_name?.split(' ')[0] || 'there'}! 👋
              </h1>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 space-y-4">
        {/* Native Fluency Score Card */}
        <div className={`bg-white rounded-3xl p-5 text-center shadow-[0_6px_0_0_#e5e7eb] hover:shadow-[0_3px_0_0_#e5e7eb] hover:translate-y-0.5 transition-all duration-100 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'}`}>
          <div className="mb-4">
            <div className={`text-4xl font-black mb-2 ${getFluencyColor(nativeFluency)} transition-all duration-300`}>
              {nativeFluency}%
            </div>
            <h2 className="text-lg font-black text-gray-800 mb-2 tracking-tight">NATIVE FLUENCY</h2>
            <p className="text-gray-600 font-medium text-sm">Speech clarity, vocabulary, and flow</p>
          </div>
          
          <div className="w-full bg-gray-200 h-3 rounded-full mb-4 shadow-[0_2px_0_0_#d1d5db]">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${getFluencyBgColor(nativeFluency)} shadow-[0_1px_0_0_rgba(0,0,0,0.2)]`}
              style={{ width: isLoaded ? `${nativeFluency}%` : '0%' }}
            ></div>
          </div>
          
          <div className="bg-gray-100 rounded-2xl p-3 shadow-[0_2px_0_0_#d1d5db]">
            <p className="text-gray-700 font-medium text-sm italic">
              "Just {100 - nativeFluency}% away from native level! 🦆"
            </p>
          </div>
        </div>

        {/* Today's Challenge */}
        <div className={`bg-blue-500 rounded-3xl p-5 shadow-[0_6px_0_0_#2563eb] hover:shadow-[0_3px_0_0_#2563eb] hover:translate-y-0.5 transition-all duration-100 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'}`}>
          <div className="flex items-center mb-3">
            <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center mr-3 shadow-[0_2px_0_0_#1d4ed8]">
              <Phone className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-base font-black text-white uppercase tracking-tight">
                TODAY'S CHALLENGE
              </h3>
              <p className="text-blue-100 font-medium text-sm">
                Hotel check-in conversation 🇪🇸
              </p>
            </div>
          </div>
          <Button 
            onClick={() => onNavigate("activity")}
            className="w-full bg-white hover:bg-gray-50 text-blue-600 font-black py-3 text-base rounded-2xl shadow-[0_3px_0_0_#e5e7eb] hover:shadow-[0_1px_0_0_#e5e7eb] hover:translate-y-0.5 transition-all duration-100 border-0"
          >
            START NOW
          </Button>
        </div>

        {/* Improvements */}
        <div 
          onClick={() => onNavigate("progress")}
          className={`bg-green-500 rounded-3xl p-5 shadow-[0_6px_0_0_#16a34a] hover:shadow-[0_3px_0_0_#16a34a] hover:translate-y-0.5 cursor-pointer transition-all duration-100 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'}`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-green-600 rounded-2xl flex items-center justify-center mr-3 shadow-[0_2px_0_0_#15803d]">
                <Trophy className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-base font-black text-white uppercase tracking-tight">
                  IMPROVEMENTS
                </h3>
                <p className="text-green-100 font-medium text-sm">
                  Since last time
                </p>
              </div>
            </div>
            <ArrowLeft className="w-4 h-4 text-green-100 rotate-180" />
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/90 rounded-2xl p-3 text-center shadow-[0_2px_0_0_rgba(255,255,255,0.3)]">
              <div className="w-6 h-6 bg-purple-500 rounded-lg flex items-center justify-center mx-auto mb-1 shadow-[0_1px_0_0_#9333ea]">
                <Clock className="w-3 h-3 text-white" />
              </div>
              <div className="text-lg font-black text-purple-700">8min</div>
              <div className="text-xs text-purple-600 font-bold">TALK TIME</div>
            </div>
            <div className="bg-white/90 rounded-2xl p-3 text-center shadow-[0_2px_0_0_rgba(255,255,255,0.3)]">
              <div className="w-6 h-6 bg-pink-500 rounded-lg flex items-center justify-center mx-auto mb-1 shadow-[0_1px_0_0_#ec4899]">
                <Star className="w-3 h-3 text-white" />
              </div>
              <div className="text-lg font-black text-pink-700">89%</div>
              <div className="text-xs text-pink-600 font-bold">ENGAGEMENT</div>
            </div>
          </div>
        </div>

        {/* New Fluency Map Button */}
        <div className={`transition-all duration-100 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'}`}>
          <Button 
            onClick={() => onNavigate("fluency-map")}
            className="w-full bg-purple-500 hover:bg-purple-600 text-white font-black py-5 text-lg rounded-3xl shadow-[0_6px_0_0_#9333ea] hover:shadow-[0_3px_0_0_#9333ea] hover:translate-y-0.5 transition-all duration-100 border-0 mb-3"
          >
            <Target className="w-6 h-6 mr-2" />
            EXPLORE FLUENCY MAP
          </Button>
        </div>

        {/* Start Learning Button */}
        <div className={`transition-all duration-100 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'}`}>
          <Button 
            onClick={() => onNavigate("curriculum")}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-black py-5 text-lg rounded-3xl shadow-[0_6px_0_0_#ea580c] hover:shadow-[0_3px_0_0_#ea580c] hover:translate-y-0.5 transition-all duration-100 border-0"
          >
            START LEARNING
          </Button>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white px-4 py-3 shadow-[0_-4px_0_0_#e5e7eb]">
        <div className="max-w-md mx-auto">
          <div className="flex justify-center space-x-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onNavigate("home")}
              className="w-12 h-12 bg-orange-500 rounded-2xl text-white shadow-[0_3px_0_0_#ea580c] border-0"
            >
              <Home className="w-5 h-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onNavigate("activity")}
              className="w-12 h-12 bg-gray-200 hover:bg-gray-300 rounded-2xl text-gray-600 hover:text-gray-700 shadow-[0_3px_0_0_#9ca3af] hover:shadow-[0_1px_0_0_#9ca3af] hover:translate-y-0.5 border-0 transition-all duration-100"
            >
              <Phone className="w-5 h-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onNavigate("curriculum")}
              className="w-12 h-12 bg-gray-200 hover:bg-gray-300 rounded-2xl text-gray-600 hover:text-gray-700 shadow-[0_3px_0_0_#9ca3af] hover:shadow-[0_1px_0_0_#9ca3af] hover:translate-y-0.5 border-0 transition-all duration-100"
            >
              <CheckCircle className="w-5 h-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onNavigate("settings")}
              className="w-12 h-12 bg-gray-200 hover:bg-gray-300 rounded-2xl text-gray-600 hover:text-gray-700 shadow-[0_3px_0_0_#9ca3af] hover:shadow-[0_1px_0_0_#9ca3af] hover:translate-y-0.5 border-0 transition-all duration-100"
            >
              <Settings className="w-5 h-5" />
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

const FluencyMapView = ({ onNavigate }: { onNavigate: (view: string) => void }) => (
  <FluencyMapCard onNavigate={onNavigate} />
);

const SettingsView = ({ onNavigate }: { onNavigate: (view: string) => void }) => (
  <SettingsCard onNavigate={onNavigate} />
);

export default Index;
