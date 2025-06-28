
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import WelcomeScreen from "@/components/WelcomeScreen";
import OnboardingFlow from "@/components/OnboardingFlow";
import DashboardStats from "@/components/DashboardStats";
import ActivityCard from "@/components/ActivityCard";
import CurriculumCard from "@/components/CurriculumCard";
import SettingsCard from "@/components/SettingsCard";
import ActivityDetailsView from "@/components/ActivityDetailsView";
import AnimatedBottomNav from "@/components/AnimatedBottomNav";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [currentView, setCurrentView] = useState("welcome");
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [activityDetailsData, setActivityDetailsData] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (user) {
        // Check if user has completed onboarding
        const onboardingComplete = localStorage.getItem(`onboarding_complete_${user.id}`);
        if (onboardingComplete) {
          setIsOnboarded(true);
          setCurrentView("home");
        } else {
          setCurrentView("onboarding");
        }
      } else {
        setCurrentView("welcome");
      }
    }
  }, [user, loading]);

  const handleOnboardingComplete = () => {
    if (user) {
      localStorage.setItem(`onboarding_complete_${user.id}`, "true");
      setIsOnboarded(true);
      setCurrentView("home");
    }
  };

  const handleWelcomeComplete = () => {
    console.log('Welcome completed, navigating to auth');
    // Navigate to the auth page instead of trying to go to onboarding without a user
    navigate('/auth');
  };

  const handleNavigate = (view: string, data?: any) => {
    setIsTransitioning(true);
    
    // Faster transition for better responsiveness
    setTimeout(() => {
      if (view === 'activity-details' && data) {
        setActivityDetailsData(data);
      }
      setCurrentView(view);
      setIsTransitioning(false);
    }, 100); // Reduced from 150ms to 100ms
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-400 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <div className="w-8 h-8 bg-white rounded-full"></div>
          </div>
          <p className="text-gray-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  const renderCurrentView = () => {
    // Faster, more responsive transitions
    const baseClasses = `transition-all duration-200 ease-out ${
      isTransitioning ? 'opacity-0 scale-98' : 'opacity-100 scale-100'
    }`;

    if (currentView === "welcome") {
      return (
        <div className={baseClasses}>
          <WelcomeScreen onComplete={handleWelcomeComplete} />
        </div>
      );
    }

    if (currentView === "onboarding" && !isOnboarded) {
      return (
        <div className={baseClasses}>
          <OnboardingFlow onComplete={handleOnboardingComplete} />
        </div>
      );
    }

    if (currentView === "home") {
      return (
        <div className={baseClasses}>
          <DashboardStats onNavigate={handleNavigate} />
        </div>
      );
    }

    if (currentView === "activity") {
      return (
        <div className={baseClasses}>
          <ActivityCard onNavigate={handleNavigate} />
        </div>
      );
    }

    if (currentView === "activity-details") {
      return (
        <div className={baseClasses}>
          <ActivityDetailsView activity={activityDetailsData} onNavigate={handleNavigate} />
        </div>
      );
    }

    if (currentView === "curriculum") {
      return (
        <div className={baseClasses}>
          <CurriculumCard onNavigate={handleNavigate} />
        </div>
      );
    }

    if (currentView === "settings") {
      return (
        <div className={baseClasses}>
          <SettingsCard onNavigate={handleNavigate} />
        </div>
      );
    }

    return (
      <div className={baseClasses}>
        <DashboardStats onNavigate={handleNavigate} />
      </div>
    );
  };

  const shouldShowBottomNav = isOnboarded && user && currentView !== "welcome" && currentView !== "onboarding";

  return (
    <div className="min-h-screen bg-amber-50 overflow-hidden">
      <div className={shouldShowBottomNav ? "pb-24" : ""}>
        {renderCurrentView()}
      </div>
      
      {shouldShowBottomNav && (
        <AnimatedBottomNav currentView={currentView} onNavigate={handleNavigate} />
      )}
    </div>
  );
};

export default Index;
