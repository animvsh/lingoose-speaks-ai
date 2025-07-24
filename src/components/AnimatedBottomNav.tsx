
import { Button } from "@/components/ui/button";
import { Home, Phone, BookOpen, Settings } from "lucide-react";
import { useEngagementTracking } from "@/hooks/useEngagementTracking";

interface AnimatedBottomNavProps {
  currentView: string;
  onNavigate: (view: string) => void;
}

const AnimatedBottomNav = ({ currentView, onNavigate }: AnimatedBottomNavProps) => {
  console.log('🚀🚀🚀 AnimatedBottomNav RENDERED with currentView:', currentView);
  const { trackTap } = useEngagementTracking();
  
  const navItems = [
    { view: "home", icon: Home, label: "Home" },
    { view: "activity", icon: Phone, label: "Activity" },
    { view: "progress", icon: BookOpen, label: "Progress" },
    { view: "settings", icon: Settings, label: "Settings" }
  ];

  const handleNavClick = (view: string, label: string) => {
    console.log('📱📱📱 AnimatedBottomNav handleNavClick called with view:', view, 'label:', label);
    
    // Add haptic feedback for mobile devices
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
    
    // Track the tap interaction
    trackTap('bottom_nav', 'navigation', {
      target_screen: view,
      previous_screen: currentView,
      nav_label: label
    });
    
    console.log('📱📱📱 About to call onNavigate with:', view);
    onNavigate(view);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 hindi-bg border-t-2 border-handdrawn z-[9999] safe-area-bottom font-nunito pointer-events-auto"
         style={{ pointerEvents: 'auto' }}
         onClick={(e) => {
           console.log('🚨🚨🚨 CONTAINER CLICKED');
           e.stopPropagation();
         }}
    >
      <div className="max-w-md mx-auto px-4 py-3">
        <div className="flex justify-center space-x-3">
          {navItems.map(({ view, icon: Icon, label }) => {
            const isActive = currentView === view;
            
            return (
              <Button
                key={view}
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  console.log('🔥🔥🔥 BUTTON CLICKED:', view, label);
                  e.preventDefault();
                  e.stopPropagation();
                  handleNavClick(view, label);
                }}
                className={`
                  w-16 h-16 rounded-3xl border-2 border-handdrawn transition-all duration-150 ease-out
                  transform active:scale-95 hover:scale-105 hover-lift
                  mobile-touch-target select-none shadow-lg font-nunito cursor-pointer
                  ${isActive 
                    ? 'bg-primary text-white scale-105 border-primary shadow-xl' 
                    : 'bg-white/90 text-brown-700 hover:bg-secondary active:bg-primary/20'
                  }
                `}
                aria-label={label}
              >
                <Icon className={`w-7 h-7 transition-transform duration-150 ${isActive ? 'scale-110' : ''}`} />
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AnimatedBottomNav;
