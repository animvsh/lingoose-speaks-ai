
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
import NavigationTransition from "@/components/NavigationTransition";
import AppBar from "@/components/AppBar";

const Index = () => {
  const { user, loading } = useAuth();
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
    setCurrentView("onboarding");
  };

  const handleNavigate = (view: string, data?: any) => {
    setIsTransitioning(true);
    
    // Immediate haptic feedback
    if ('vibrate' in navigator) {
      navigator.vibrate(25);
    }
    
    // Ultra-fast transition for maximum responsiveness
    setTimeout(() => {
      if (view === 'activity-details' && data) {
        setActivityDetailsData(data);
      }
      setCurrentView(view);
      setIsTransitioning(false);
    }, 50);
  };

  const handleBackNavigation = () => {
    if (currentView === 'activity-details') {
      setCurrentView('activity');
    } else if (currentView !== 'home') {
      setCurrentView('home');
    }
  };

  const getAppBarTitle = () => {
    switch (currentView) {
      case 'activity':
        return 'Activity';
      case 'activity-details':
        return 'Call Details';
      case 'curriculum':
        return 'Curriculum';
      case 'settings':
        return 'Settings';
      default:
        return 'Dashboard';
    }
  };

  const shouldShowAppBar = () => {
    return isOnboarded && user && 
           currentView !== "welcome" && 
           currentView !== "onboarding" && 
           currentView !== "home";
  };

  const shouldShowBottomNav = isOnboarded && user && currentView !== "welcome" && currentView !== "onboarding";

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
    if (currentView === "welcome") {
      return (
        <NavigationTransition isVisible={!isTransitioning} direction="fade">
          <WelcomeScreen onComplete={handleWelcomeComplete} />
        </NavigationTransition>
      );
    }

    if (currentView === "onboarding" && !isOnboarded) {
      return (
        <NavigationTransition isVisible={!isTransitioning} direction="slide-right">
          <OnboardingFlow onComplete={handleOnboardingComplete} />
        </NavigationTransition>
      );
    }

    if (currentView === "home") {
      return (
        <NavigationTransition isVisible={!isTransitioning} direction="fade">
          <DashboardStats onNavigate={handleNavigate} />
        </NavigationTransition>
      );
    }

    if (currentView === "activity") {
      return (
        <NavigationTransition isVisible={!isTransitioning} direction="slide-left">
          <ActivityCard onNavigate={handleNavigate} />
        </NavigationTransition>
      );
    }

    if (currentView === "activity-details") {
      return (
        <NavigationTransition isVisible={!isTransitioning} direction="scale">
          <ActivityDetailsView activity={activityDetailsData} onNavigate={handleNavigate} />
        </NavigationTransition>
      );
    }

    if (currentView === "curriculum") {
      return (
        <NavigationTransition isVisible={!isTransitioning} direction="slide-right">
          <CurriculumCard onNavigate={handleNavigate} />
        </NavigationTransition>
      );
    }

    if (currentView === "settings") {
      return (
        <NavigationTransition isVisible={!isTransitioning} direction="slide-left">
          <SettingsCard onNavigate={handleNavigate} />
        </NavigationTransition>
      );
    }

    return (
      <NavigationTransition isVisible={!isTransitioning} direction="fade">
        <DashboardStats onNavigate={handleNavigate} />
      </NavigationTransition>
    );
  };

  return (
    <div className="min-h-screen bg-amber-50">      
      {/* Main Content with proper bottom spacing */}
      <div className={`min-h-screen ${shouldShowBottomNav ? "pb-24" : ""} ${shouldShowAppBar() ? "pb-24" : ""}`}>
        {renderCurrentView()}
      </div>
      
      {/* App Bar - fixed at bottom when needed */}
      {shouldShowAppBar() && (
        <AppBar 
          title={getAppBarTitle()}
          onBack={handleBackNavigation}
          showBackButton={currentView !== 'home'}
          showLogo={false}
        />
      )}
      
      {/* Bottom Navigation - only show when app bar is not shown */}
      {shouldShowBottomNav && !shouldShowAppBar() && (
        <AnimatedBottomNav currentView={currentView} onNavigate={handleNavigate} />
      )}
    </div>
  );
};

export default Index;
