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
import { EnhancedProgressView } from "@/components/EnhancedProgressView";
import { FluencyRoadmapView } from "@/components/FluencyRoadmapView";
import StripeTestingPanel from "@/components/StripeTestingPanel";
import DesktopExperienceMessage from "@/components/DesktopExperienceMessage";
import ProfileManagementPage from "@/components/ProfileManagementPage";
import AIBehaviorMetricsPanel from "@/components/AIBehaviorMetricsPanel";
import { SystemPromptSettingsPage } from "@/components/SystemPromptSettingsPage";
import LoadingOverlay from "@/components/LoadingOverlay";
import PageTransition from "@/components/PageTransition";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const { user, loading, refreshUser } = useAuth();
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
  const navigationOrder = ["home", "activity", "progress", "settings"];
  
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
      
      console.log('🔍 Index useEffect - Authentication check:', {
        user: user ? user.phone_number : 'NULL',
        isAuthenticated,
        needsOnboarding,
        currentView
      });
      
      if (user) {
        // Existing user with complete profile
        identify({
          user_type: 'authenticated',
           onboarding_completed: localStorage.getItem(`onboarding_complete_${user.phone_number}`) ? true : false
         });

         const onboardingComplete = localStorage.getItem(`onboarding_complete_${user.phone_number}`);
         console.log('🔍 Checking onboarding completion for:', user.phone_number, 'result:', onboardingComplete);
         
         // If user has a profile (meaning they've completed basic setup), they should skip onboarding
         // Only send to onboarding if they explicitly need it (new user flow)
         const needsOnboarding = localStorage.getItem('needs_onboarding');
         
         if (needsOnboarding === 'true') {
           // This is a new user who just verified their phone and needs onboarding
           setCurrentView("onboarding");
           trackScreenView("onboarding");
           trackPageView("onboarding");
         } else {
           // This is an existing user - go to home even if onboarding flag isn't set
           // Set the onboarding flag for future logins if it's not already set
           if (!onboardingComplete) {
             localStorage.setItem(`onboarding_complete_${user.phone_number}`, "true");
           }
           setIsOnboarded(true);
           setCurrentView("home");
           trackScreenView("dashboard");
           trackPageView("dashboard");
         }
      } else if (isAuthenticated === 'true') {
        // Authenticated user - go directly to home
        identify({
          user_type: 'authenticated',
          onboarding_completed: true
        });
        
        setIsOnboarded(true);
        setCurrentView("home");
        trackScreenView("dashboard");
        trackPageView("dashboard");
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
    console.log('🎯 handleOnboardingComplete called');
    
    // Clean up onboarding flags
    localStorage.removeItem('needs_onboarding');
    console.log('🗑️ Removed needs_onboarding flag');
    
    // Check if we now have a user (profile was created during onboarding)
    const userProfile = localStorage.getItem('current_user_profile');
    console.log('📝 userProfile in localStorage:', userProfile ? 'EXISTS' : 'NULL');
    
    if (userProfile) {
      try {
        const profile = JSON.parse(userProfile);
        const onboardingKey = `onboarding_complete_${profile.phone_number}`;
        console.log('🔑 Setting onboarding completion key:', onboardingKey);
        localStorage.setItem(onboardingKey, "true");
        setIsOnboarded(true);
        setCurrentView("home");
        trackOnboardingComplete();
        trackScreenView("dashboard");
        trackPageView("dashboard");
        console.log('✅ Onboarding marked complete for user:', profile.phone_number);
        
        // Force a refresh of the user context to ensure consistency
        refreshUser();
      } catch (error) {
        console.error('❌ Error parsing user profile after onboarding:', error);
      }
    } else if (user) {
      const onboardingKey = `onboarding_complete_${user.phone_number}`;
      console.log('🔑 Setting onboarding completion key for existing user:', onboardingKey);
      localStorage.setItem(onboardingKey, "true");
      setIsOnboarded(true);
      setCurrentView("home");
      trackOnboardingComplete();
      trackScreenView("dashboard");
      trackPageView("dashboard");
      console.log('✅ Onboarding marked complete for existing user:', user.phone_number);
    } else {
      console.log('⚠️ No user found in onboarding complete - this should not happen');
      
      // Fallback: force a page refresh to ensure auth state is correct
      console.log('🔄 Forcing page refresh to sync auth state');
      setTimeout(() => {
        window.location.reload();
      }, 500);
    }
  };

  const handleNavigate = (view: string, data?: any) => {
    console.log('🚀 Index handleNavigate called with view:', view, 'currentView:', currentView);
    console.log('🚀 Index handleNavigate called with view:', view, 'currentView:', currentView);
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
      console.log('🎯 Setting currentView to:', view);
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
    console.log('🎨 renderCurrentView called with currentView:', currentView, 'isOnboarded:', isOnboarded);
    let content;

    if (currentView === "onboarding" && !isOnboarded) {
      content = <WelcomeScreen onComplete={handleOnboardingComplete} onProfileCreated={refreshUser} />;
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
    } else if (currentView === "progress") {
      content = <EnhancedProgressView onNavigate={handleNavigate} />;
    } else if (currentView === "roadmap") {
      content = <FluencyRoadmapView />;
    } else if (currentView === "settings") {
      content = <SettingsCard onNavigate={handleNavigate} />;
    } else if (currentView === "add-supervisor") {
      content = <AddSupervisorForm onClose={() => handleNavigate("settings")} />;
    } else if (currentView === "profile-management") {
      content = <ProfileManagementPage onNavigate={handleNavigate} />;
    } else if (currentView === "ai-behavior-metrics") {
      console.log('🧠 Rendering AIBehaviorMetricsPanel');
      content = <AIBehaviorMetricsPanel onNavigate={handleNavigate} />;
    } else if (currentView === "system-prompt-settings") {
      console.log('🎯 Rendering SystemPromptSettingsPage');
      content = <SystemPromptSettingsPage onNavigate={handleNavigate} />;
    } else {
      console.log('🏠 Rendering default DashboardStats for currentView:', currentView);
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

  const shouldShowBottomNav = isOnboarded && user && currentView !== "onboarding" && currentView !== "add-supervisor" && currentView !== "ai-behavior-metrics" && currentView !== "system-prompt-settings";

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
