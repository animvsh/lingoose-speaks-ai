
import { Button } from "@/components/ui/button";
import { Home, Phone, BookOpen, Settings } from "lucide-react";
import { useEngagementTracking } from "@/hooks/useEngagementTracking";

interface AnimatedBottomNavProps {
  currentView: string;
  onNavigate: (view: string) => void;
}

const AnimatedBottomNav = ({ currentView, onNavigate }: AnimatedBottomNavProps) => {
  const { trackTap } = useEngagementTracking();
  
  const navItems = [
    { view: "home", icon: Home, label: "Home" },
    { view: "activity", icon: Phone, label: "Activity" },
    { view: "curriculum", icon: BookOpen, label: "Curriculum" },
    { view: "settings", icon: Settings, label: "Settings" }
  ];

  const handleNavClick = (view: string, label: string) => {
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
    
    onNavigate(view);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-amber-50 border-t border-gray-100 z-50 safe-area-bottom">
      <div className="max-w-md mx-auto px-6 py-3">
        <div className="flex justify-center space-x-4">
          {navItems.map(({ view, icon: Icon, label }) => {
            const isActive = currentView === view;
            
            return (
              <Button
                key={view}
                variant="ghost"
                size="sm"
                onTouchStart={() => {
                  // Immediate visual feedback on touch
                  if ('vibrate' in navigator) {
                    navigator.vibrate(25);
                  }
                }}
                onClick={() => handleNavClick(view, label)}
                className={`
                  w-14 h-14 rounded-2xl transition-all duration-150 ease-out
                  transform active:scale-95 hover:scale-110 
                  mobile-touch-target select-none
                  ${isActive 
                    ? 'bg-blue-400 text-white scale-105' 
                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300 active:bg-gray-400'
                  }
                `}
                aria-label={label}
              >
                <Icon className={`w-6 h-6 transition-transform duration-150 ${isActive ? 'scale-110' : ''}`} />
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AnimatedBottomNav;
