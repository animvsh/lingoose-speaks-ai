
import { Button } from "@/components/ui/button";
import { Home, Phone, BookOpen, Settings } from "lucide-react";

interface AnimatedBottomNavProps {
  currentView: string;
  onNavigate: (view: string) => void;
}

const AnimatedBottomNav = ({ currentView, onNavigate }: AnimatedBottomNavProps) => {
  const navItems = [
    { view: "home", icon: Home, label: "Home" },
    { view: "activity", icon: Phone, label: "Activity" },
    { view: "curriculum", icon: BookOpen, label: "Curriculum" },
    { view: "settings", icon: Settings, label: "Settings" }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-amber-50 border-t border-gray-100 z-50">
      <div className="max-w-md mx-auto px-6 py-4">
        <div className="flex justify-center space-x-4">
          {navItems.map(({ view, icon: Icon, label }) => {
            const isActive = currentView === view;
            
            return (
              <Button
                key={view}
                variant="ghost"
                size="sm"
                onClick={() => onNavigate(view)}
                className={`
                  w-14 h-14 rounded-2xl transition-all duration-300 ease-in-out
                  transform hover:scale-110 hover:shadow-lg
                  ${isActive 
                    ? 'bg-blue-400 text-white shadow-lg scale-105' 
                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                  }
                `}
                aria-label={label}
              >
                <Icon className="w-6 h-6" />
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AnimatedBottomNav;
