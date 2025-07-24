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
import LoadingOverlay from "@/components/LoadingOverlay";
import PageTransition from "@/components/PageTransition";
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
      const isAuthenticated = localStorage.getItem('phone_authenticated');
      const needsOnboarding = localStorage.getItem('needs_onboarding');
      
      if (user) {
        // Existing user with complete profile
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
      } else if (isAuthenticated === 'true' && needsOnboarding === 'true') {
        // New user who is authenticated but needs onboarding
        identify({
          user_type: 'new_authenticated',
          onboarding_completed: false
        });
        
        setCurrentView("onboarding");
        trackScreenView("onboarding");
        trackPageView("onboarding");
      } else if (isAuthenticated === 'true') {
        // Authenticated user but no profile yet - stay in the app and show onboarding
        identify({
          user_type: 'authenticated_no_profile',
          onboarding_completed: false
        });
        
        setCurrentView("onboarding");
        trackScreenView("onboarding");
        trackPageView("onboarding");
      } else {
        // Only redirect to auth if loading is complete and user is definitively null
        // Add a small delay to prevent blank screens during auth state changes
        setTimeout(() => {
          if (!user && !loading && isAuthenticated !== 'true') {
            navigate('/');
          }
        }, 100);
      }
    }
  }, [user, loading, identify, trackScreenView, trackPageView, navigate]);

  const handleOnboardingComplete = () => {
    // Clean up onboarding flags
    localStorage.removeItem('needs_onboarding');
    
    // Check if we now have a user (profile was created during onboarding)
    const userProfile = localStorage.getItem('current_user_profile');
    if (userProfile) {
      try {
        const profile = JSON.parse(userProfile);
        localStorage.setItem(`onboarding_complete_${profile.id}`, "true");
        setIsOnboarded(true);
        setCurrentView("home");
        trackOnboardingComplete();
        trackScreenView("dashboard");
        trackPageView("dashboard");
        
        // Force a page reload to refresh the auth context
        setTimeout(() => {
          window.location.reload();
        }, 100);
      } catch (error) {
        console.error('Error parsing user profile after onboarding:', error);
        // Force a page reload anyway to refresh the auth context
        window.location.reload();
      }
    } else if (user) {
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
    let content;

    if (currentView === "onboarding" && !isOnboarded) {
      content = <WelcomeScreen onComplete={handleOnboardingComplete} />;
    } else if (currentView === "home") {
      content = (
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
      );
    } else if (currentView === "activity") {
      content = <ActivityCard onNavigate={handleNavigate} />;
    } else if (currentView === "activity-details") {
      content = <ActivityDetailsView activity={activityDetailsData} onNavigate={handleNavigate} />;
    } else if (currentView === "curriculum") {
      content = <CurriculumCard onNavigate={handleNavigate} />;
    } else if (currentView === "settings") {
      content = <SettingsCard onNavigate={handleNavigate} />;
    } else if (currentView === "add-supervisor") {
      content = <AddSupervisorForm onClose={() => handleNavigate("settings")} />;
    } else if (currentView === "profile-management") {
      content = <ProfileManagementPage onNavigate={handleNavigate} />;
    } else {
      content = <DashboardStats onNavigate={handleNavigate} />;
    }

    return (
      <PageTransition 
        isTransitioning={isTransitioning} 
        transitionKey={currentView}
      >
        <div className="w-full">
          {content}
        </div>
      </PageTransition>
    );
  };

  const shouldShowBottomNav = isOnboarded && user && currentView !== "onboarding" && currentView !== "add-supervisor";

  // Don't render anything if we're in a loading state
  if (loading) {
    return <LoadingOverlay isLoading={true} variant="gentle">{null}</LoadingOverlay>;
  }
  
  // If not authenticated and not on desktop, don't render the app
  const isAuthenticated = localStorage.getItem('phone_authenticated');
  if (!user && !isAuthenticated && !isDesktop) {
    return <LoadingOverlay isLoading={true} variant="gentle">{null}</LoadingOverlay>;
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
