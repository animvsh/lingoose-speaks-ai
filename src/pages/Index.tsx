import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Phone, CheckCircle, Home, BarChart3, Settings, User, LogOut, Calendar, Clock, Target, Flame, Trophy, Volume2, MessageCircle, Star } from "lucide-react";
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
  
  // Calculate mock progress values
  const totalCalls = callLogs?.length || 0;
  const nativeFluency = Math.min(34 + (totalCalls * 2), 85);
  const weeklyGain = 4;
  const newPhrases = 3;
  const totalMinutes = 7.5;
  
  // Score breakdown
  const pronunciation = 74;
  const vocabulary = 63;
  const flow = 61;
  
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
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-orange-500 p-6 mb-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <DuckMascot className="w-12 h-12 mr-3" />
            <div>
              <h1 className="text-2xl font-black text-white">
                Hi {userProfile?.full_name?.split(' ')[0] || 'there'}! 👋
              </h1>
            </div>
          </div>
          <Button
            onClick={signOut}
            variant="ghost"
            size="sm"
            className="p-3 text-orange-100 hover:text-white hover:bg-white/20 rounded-2xl transition-all duration-200"
          >
            <LogOut className="w-6 h-6" />
          </Button>
        </div>
      </div>

      <div className="px-6 space-y-6">
        {/* Native Fluency Score Card - Hero Element */}
        <div className="bg-white rounded-3xl p-8 text-center border border-gray-200">
          <div className="mb-4">
            <div className={`text-6xl font-black mb-2 ${getFluencyColor(nativeFluency)}`}>
              {nativeFluency}%
            </div>
            <h2 className="text-2xl font-black text-gray-800 mb-2">NATIVE FLUENCY</h2>
            <p className="text-gray-600 font-semibold">Compared to a native speaker based on speech clarity, vocabulary, and flow</p>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 h-4 rounded-full mb-4">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${getFluencyBgColor(nativeFluency)}`}
              style={{ width: `${nativeFluency}%` }}
            ></div>
          </div>
          
          {/* Goose Quote */}
          <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
            <p className="text-gray-700 font-semibold italic">
              "We're {100 - nativeFluency}% away from sounding like a native! Let's gooo!" 🦆
            </p>
          </div>
        </div>

        {/* Daily Speaking Mission */}
        <div className="bg-white rounded-3xl p-6 border border-gray-200">
          <h3 className="text-2xl font-black text-gray-800 mb-3 uppercase tracking-wide">
            📢 Daily Speaking Mission
          </h3>
          <p className="text-lg text-gray-700 font-semibold mb-4">
            Today's challenge: <strong>Talk your way through a hotel check-in 🇪🇸</strong>
          </p>
          <Button 
            onClick={() => onNavigate("activity")}
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-black py-4 text-xl rounded-2xl transition-all duration-200"
          >
            <Phone className="w-6 h-6 mr-3" />
            START CHATTING
          </Button>
        </div>

        {/* Progress Summary */}
        <div className="bg-white rounded-3xl p-6 border border-gray-200">
          <h3 className="text-2xl font-black text-gray-800 mb-4 uppercase tracking-wide">
            📈 Since Last Week
          </h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-3xl font-black text-green-600 mb-1">+{weeklyGain}%</div>
              <div className="text-sm text-gray-600 font-semibold">Fluency Gain</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-black text-blue-600 mb-1">+{newPhrases}</div>
              <div className="text-sm text-gray-600 font-semibold">New Phrases</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-black text-purple-600 mb-1">{totalMinutes}m</div>
              <div className="text-sm text-gray-600 font-semibold">Total Spoken</div>
            </div>
          </div>
        </div>

        {/* Breakdown of Score */}
        <div className="bg-white rounded-3xl p-6 border border-gray-200">
          <h3 className="text-2xl font-black text-gray-800 mb-4 uppercase tracking-wide flex items-center">
            <BarChart3 className="w-6 h-6 mr-3" />
            Score Breakdown
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Volume2 className="w-5 h-5 mr-3 text-blue-500" />
                <span className="font-bold text-gray-800">Pronunciation</span>
              </div>
              <div className="flex items-center">
                <span className="font-black text-lg mr-3">{pronunciation}%</span>
                <div className="w-16 h-3 bg-gray-200 rounded-full">
                  <div className="bg-blue-500 h-full rounded-full" style={{ width: `${pronunciation}%` }}></div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <MessageCircle className="w-5 h-5 mr-3 text-green-500" />
                <span className="font-bold text-gray-800">Vocabulary Variety</span>
              </div>
              <div className="flex items-center">
                <span className="font-black text-lg mr-3">{vocabulary}%</span>
                <div className="w-16 h-3 bg-gray-200 rounded-full">
                  <div className="bg-green-500 h-full rounded-full" style={{ width: `${vocabulary}%` }}></div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Target className="w-5 h-5 mr-3 text-purple-500" />
                <span className="font-bold text-gray-800">Flow & Recovery</span>
              </div>
              <div className="flex items-center">
                <span className="font-black text-lg mr-3">{flow}%</span>
                <div className="w-16 h-3 bg-gray-200 rounded-full">
                  <div className="bg-purple-500 h-full rounded-full" style={{ width: `${flow}%` }}></div>
                </div>
              </div>
            </div>
          </div>
          
          <Button 
            variant="ghost"
            className="w-full mt-4 text-gray-600 hover:text-gray-700 font-bold"
          >
            👀 View Detailed Report
          </Button>
        </div>

        {/* Your Goose Remembers */}
        <div className="bg-white rounded-3xl p-6 border border-gray-200">
          <h3 className="text-2xl font-black text-gray-800 mb-4 uppercase tracking-wide">
            🐣 Your Goose Remembers...
          </h3>
          <div className="bg-orange-50 rounded-2xl p-4 border border-orange-200 mb-4">
            <p className="text-gray-700 font-semibold italic">
              "Yesterday you struggled with gendered nouns in French — want to practice that again?"
            </p>
          </div>
          <div className="flex space-x-3">
            <Button className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-2xl">
              🔁 Retry
            </Button>
            <Button className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-2xl">
              🧠 Teach Me Again
            </Button>
          </div>
        </div>

        {/* Explore & Customize */}
        <div className="bg-white rounded-3xl p-6 border border-gray-200">
          <h3 className="text-2xl font-black text-gray-800 mb-4 uppercase tracking-wide">
            🧰 Explore & Customize
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <Button variant="ghost" className="p-4 h-auto text-left bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-2xl">
              <div>
                <div className="font-bold text-gray-800 mb-1">✨ Pick Your Topic</div>
              </div>
            </Button>
            <Button variant="ghost" className="p-4 h-auto text-left bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-2xl">
              <div>
                <div className="font-bold text-gray-800 mb-1">💬 Change Goose</div>
              </div>
            </Button>
            <Button variant="ghost" className="p-4 h-auto text-left bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-2xl">
              <div>
                <div className="font-bold text-gray-800 mb-1">🌐 New Language</div>
              </div>
            </Button>
            <Button variant="ghost" className="p-4 h-auto text-left bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-2xl">
              <div>
                <div className="font-bold text-gray-800 mb-1">🪄 Custom Challenge</div>
              </div>
            </Button>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-4">
        <div className="max-w-md mx-auto">
          <div className="flex justify-center space-x-6">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onNavigate("home")}
              className="w-16 h-16 bg-orange-500 hover:bg-orange-600 rounded-2xl text-white transition-all duration-200"
            >
              <Home className="w-7 h-7" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onNavigate("activity")}
              className="w-16 h-16 bg-gray-100 hover:bg-gray-200 rounded-2xl text-gray-600 hover:text-gray-700 transition-all duration-200"
            >
              <Phone className="w-7 h-7" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onNavigate("curriculum")}
              className="w-16 h-16 bg-gray-100 hover:bg-gray-200 rounded-2xl text-gray-600 hover:text-gray-700 transition-all duration-200"
            >
              <CheckCircle className="w-7 h-7" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onNavigate("settings")}
              className="w-16 h-16 bg-gray-100 hover:bg-gray-200 rounded-2xl text-gray-600 hover:text-gray-700 transition-all duration-200"
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
