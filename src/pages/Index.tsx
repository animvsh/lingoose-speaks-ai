
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import WelcomeScreen from "@/components/WelcomeScreen";
import OnboardingFlow from "@/components/OnboardingFlow";
import DashboardStats from "@/components/DashboardStats";
import ActivityCard from "@/components/ActivityCard";
import CurriculumCard from "@/components/CurriculumCard";
import SettingsCard from "@/components/SettingsCard";
import ActivityDetailsView from "@/components/ActivityDetailsView";

const Index = () => {
  const { user, loading } = useAuth();
  const [currentView, setCurrentView] = useState("welcome");
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [activityDetailsData, setActivityDetailsData] = useState(null);

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

  const handleNavigate = (view: string, data?: any) => {
    if (view === 'activity-details' && data) {
      setActivityDetailsData(data);
    }
    setCurrentView(view);
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

  if (currentView === "welcome") {
    return <WelcomeScreen />;
  }

  if (currentView === "onboarding" && !isOnboarded) {
    return <OnboardingFlow onComplete={handleOnboardingComplete} />;
  }

  if (currentView === "home") {
    return <DashboardStats onNavigate={handleNavigate} />;
  }

  if (currentView === "activity") {
    return <ActivityCard onNavigate={handleNavigate} />;
  }

  if (currentView === "activity-details") {
    return <ActivityDetailsView activity={activityDetailsData} onNavigate={handleNavigate} />;
  }

  if (currentView === "curriculum") {
    return <CurriculumCard onNavigate={handleNavigate} />;
  }

  if (currentView === "settings") {
    return <SettingsCard onNavigate={handleNavigate} />;
  }

  return <DashboardStats onNavigate={handleNavigate} />;
};

export default Index;
