
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { usePostHog } from "@/hooks/usePostHog";
import { useSessionTracking } from "@/hooks/useSessionTracking";
import { useEngagementTracking } from "@/hooks/useEngagementTracking";
import WelcomeScreen from "@/components/WelcomeScreen";
import OnboardingFlow from "@/components/OnboardingFlow";
import DashboardStats from "@/components/DashboardStats";
import ActivityCard from "@/components/ActivityCard";
import CurriculumCard from "@/components/CurriculumCard";
import SettingsCard from "@/components/SettingsCard";
import ActivityDetailsView from "@/components/ActivityDetailsView";
import AnimatedBottomNav from "@/components/AnimatedBottomNav";
import AddSupervisorForm from "@/components/AddSupervisorForm";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { trackNavigation, trackScreenView, trackOnboardingComplete, identify } = usePostHog();
  const { trackPageView } = useSessionTracking();
  const { trackScreenTime } = useEngagementTracking();
  const [currentView, setCurrentView] = useState("welcome");
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [activityDetailsData, setActivityDetailsData] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (user) {
        // Identify user in PostHog
        identify({
          user_type: 'authenticated',
          onboarding_completed: localStorage.getItem(`onboarding_complete_${user.id}`) ? true : false
        });

        // Check if user has completed onboarding
        const onboardingComplete = localStorage.getItem(`onboarding_complete_${user.id}`);
        if (onboardingComplete) {
          setIsOnboarded(true);
          setCurrentView("home");
          trackScreenView("dashboard");
          trackPageView("dashboard");
        } else {
          setCurrentView("onboarding");
          trackScreenView("onboarding");
          trackPageView("onboarding");
        }
      } else {
        setCurrentView("welcome");
        trackScreenView("welcome");
        trackPageView("welcome");
      }
    }
  }, [user, loading, identify, trackScreenView, trackPageView]);

  const handleOnboardingComplete = () => {
    if (user) {
      localStorage.setItem(`onboarding_complete_${user.id}`, "true");
      setIsOnboarded(true);
      setCurrentView("home");
      trackOnboardingComplete();
      trackScreenView("dashboard");
      trackPageView("dashboard");
    }
  };

  const handleWelcomeComplete = () => {
    console.log('Welcome completed, navigating to auth');
    trackNavigation("welcome", "auth");
    // Navigate to the auth page instead of trying to go to onboarding without a user
    navigate('/auth');
  };

  const handleNavigate = (view: string, data?: any) => {
    const previousView = currentView;
    setIsTransitioning(true);
    
    // Track navigation and screen time
    trackNavigation(previousView, view);
    trackScreenTime(view);
    
    // Enhanced transition with better timing
    setTimeout(() => {
      if (view === 'activity-details' && data) {
        setActivityDetailsData(data);
      }
      setCurrentView(view);
      
      // Stagger the transition completion for smoother effect
      setTimeout(() => {
        setIsTransitioning(false);
      }, 50);
      
      // Track screen view and page view
      trackScreenView(view, data ? { activity_id: data.id } : {});
      trackPageView(view, data ? { activity_id: data.id } : {});
    }, 150);
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
  };

  const renderCurrentView = () => {
    // Enhanced page transitions with scale and fade effects
    const baseClasses = `transition-all duration-300 ease-in-out transform ${
      isTransitioning 
        ? 'opacity-0 scale-95 translate-y-4' 
        : 'opacity-100 scale-100 translate-y-0'
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

    if (currentView === "add-supervisor") {
      return (
        <div className={baseClasses}>
          <AddSupervisorForm onClose={() => handleNavigate("settings")} />
        </div>
      );
    }

    return (
      <div className={baseClasses}>
        <DashboardStats onNavigate={handleNavigate} />
      </div>
    );
  };

  const shouldShowBottomNav = isOnboarded && user && currentView !== "welcome" && currentView !== "onboarding" && currentView !== "add-supervisor";

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
