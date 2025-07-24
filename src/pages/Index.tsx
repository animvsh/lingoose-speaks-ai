import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { usePostHog } from "@/hooks/usePostHog";
import { useSessionTracking } from "@/hooks/useSessionTracking";
import { useEngagementTracking } from "@/hooks/useEngagementTracking";
import { useSwipeNavigation } from "@/hooks/useSwipeNavigation";
import { useIsDesktop } from "@/hooks/use-mobile";
import WelcomeScreen from "@/components/WelcomeScreen";
import DashboardStats from "@/components/DashboardStats";
import ActivityCard from "@/components/ActivityCard";
import CurriculumCard from "@/components/CurriculumCard";
import SettingsCard from "@/components/SettingsCard";
import ActivityDetailsView from "@/components/ActivityDetailsView";
import AnimatedBottomNav from "@/components/AnimatedBottomNav";
import AddSupervisorForm from "@/components/AddSupervisorForm";
import ProUpgradeCard from "@/components/ProUpgradeCard";
import StripeTestingPanel from "@/components/StripeTestingPanel";
import DesktopExperienceMessage from "@/components/DesktopExperienceMessage";
import ProfileManagementPage from "@/components/ProfileManagementPage";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const isDesktop = useIsDesktop();
  const { trackNavigation, trackScreenView, trackOnboardingComplete, identify } = usePostHog();
  const { trackPageView } = useSessionTracking();
  const { trackScreenTime, trackSwipe } = useEngagementTracking();
  const [currentView, setCurrentView] = useState("onboarding");
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [activityDetailsData, setActivityDetailsData] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showTestingPanel, setShowTestingPanel] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);

  // Define navigation order for swipe gestures
  const navigationOrder = ["home", "activity", "curriculum", "settings"];
  
  const handleSwipe = (direction: 'left' | 'right') => {
    if (currentView === "onboarding" || currentView === "add-supervisor" || currentView === "activity-details") {
      return; // Don't allow swiping on these screens
    }

    trackSwipe(direction, currentView);
    
    const currentIndex = navigationOrder.indexOf(currentView);
    if (currentIndex === -1) return;

    let newIndex;
    if (direction === 'left') {
      // Swipe left = go to next screen
      newIndex = (currentIndex + 1) % navigationOrder.length;
    } else {
      // Swipe right = go to previous screen
      newIndex = currentIndex === 0 ? navigationOrder.length - 1 : currentIndex - 1;
    }
    
    const newView = navigationOrder[newIndex];
    handleNavigate(newView);
  };

  // Setup swipe navigation
  useSwipeNavigation(containerRef, handleSwipe);

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
        // Only redirect to auth if loading is complete and user is definitively null
        // Add a small delay to prevent blank screens during auth state changes
        setTimeout(() => {
          if (!user && !loading) {
            navigate('/');
          }
        }, 100);
      }
    }
  }, [user, loading, identify, trackScreenView, trackPageView, navigate]);

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


  // Show desktop message if user is authenticated, onboarded, and on desktop
  if (user && isOnboarded && isDesktop) {
    return <DesktopExperienceMessage />;
  }

  const renderCurrentView = () => {
    // Enhanced page transitions with scale and fade effects
    const baseClasses = `w-full transition-all duration-300 ease-in-out transform ${
      isTransitioning 
        ? 'opacity-0 scale-95 translate-y-4' 
        : 'opacity-100 scale-100 translate-y-0'
    }`;

    if (currentView === "onboarding" && !isOnboarded) {
      return (
        <div className={baseClasses}>
          <WelcomeScreen onComplete={handleOnboardingComplete} />
        </div>
      );
    }

    if (currentView === "home") {
      return (
        <div className={baseClasses}>
          <div className="w-full space-y-4">
            {/* Toggle button for testing panel */}
            {user && (
              <div className="flex justify-end p-4">
                <button
                  onClick={() => setShowTestingPanel(!showTestingPanel)}
                  className="text-sm bg-purple-100 hover:bg-purple-200 text-purple-800 px-3 py-1 rounded-full transition-colors"
                >
                  {showTestingPanel ? 'Hide' : 'Show'} Stripe Testing
                </button>
              </div>
            )}
            
            {/* Testing Panel */}
            {showTestingPanel && user && (
              <div className="w-full px-4">
                <StripeTestingPanel />
              </div>
            )}
            
            <DashboardStats onNavigate={handleNavigate} />
          </div>
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

    if (currentView === "profile-management") {
      return (
        <div className={baseClasses}>
          <ProfileManagementPage onNavigate={handleNavigate} />
        </div>
      );
    }

    return (
      <div className={baseClasses}>
        <DashboardStats onNavigate={handleNavigate} />
      </div>
    );
  };

  const shouldShowBottomNav = isOnboarded && user && currentView !== "onboarding" && currentView !== "add-supervisor";

  // Don't render anything if we're in a loading state without a user
  if (loading || (!user && !isDesktop)) {
    return (
      <div className="min-h-screen w-full hindi-bg flex items-center justify-center font-nunito">
        <div className="text-center">
          <div className="w-16 h-16 rounded-3xl border-2 border-handdrawn bg-white flex items-center justify-center mx-auto mb-4 animate-gentle-float shadow-lg">
            <div className="w-8 h-8 bg-primary rounded-full animate-pulse"></div>
          </div>
          <p className="text-brown-700 font-bold font-nunito">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="min-h-screen w-full hindi-bg overflow-hidden font-nunito">
      <div className={`w-full ${shouldShowBottomNav ? "pb-24" : ""}`}>
        {renderCurrentView()}
      </div>
      
      {shouldShowBottomNav && (
        <AnimatedBottomNav currentView={currentView} onNavigate={handleNavigate} />
      )}
    </div>
  );
};

export default Index;
