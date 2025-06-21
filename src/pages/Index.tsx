import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Phone, CheckCircle, Clock, Home } from "lucide-react";
import DuckMascot from "@/components/DuckMascot";
import ActivityCard from "@/components/ActivityCard";
import CurriculumCard from "@/components/CurriculumCard";
import ProgressCard from "@/components/ProgressCard";
import AddToHomeScreen from "@/components/AddToHomeScreen";

const Index = () => {
  const [currentView, setCurrentView] = useState("welcome");
  const [showAddToHomeScreen, setShowAddToHomeScreen] = useState(false);

  useEffect(() => {
    // Check if it's a mobile device and not already added to home screen
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                        (window.navigator as any).standalone === true;
    
    // Show add to home screen prompt on mobile if not standalone and not shown before
    if (isMobile && !isStandalone && !localStorage.getItem('addToHomeScreenDismissed')) {
      const timer = setTimeout(() => {
        setShowAddToHomeScreen(true);
      }, 2000); // Show after 2 seconds
      
      return () => clearTimeout(timer);
    }
  }, []);

  const handleDismissAddToHomeScreen = () => {
    setShowAddToHomeScreen(false);
    localStorage.setItem('addToHomeScreenDismissed', 'true');
  };

  const renderView = () => {
    switch (currentView) {
      case "welcome":
        return <WelcomeView onNavigate={setCurrentView} />;
      case "activity":
        return <ActivityView onNavigate={setCurrentView} />;
      case "progress":
        return <ProgressView onNavigate={setCurrentView} />;
      case "curriculum":
        return <CurriculumView onNavigate={setCurrentView} />;
      default:
        return <WelcomeView onNavigate={setCurrentView} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      {/* Mobile Frame */}
      <div className="relative">
        {/* Phone Frame */}
        <div className="w-[375px] h-[667px] bg-black rounded-[3rem] p-2 shadow-2xl">
          {/* Screen */}
          <div className="w-full h-full bg-[#F5F2E8] rounded-[2.5rem] overflow-hidden relative">
            {/* Status Bar */}
            <div className="absolute top-0 left-0 right-0 h-6 bg-black/5 z-10 flex justify-between items-center px-6 text-xs font-medium text-slate-700">
              <span>9:41</span>
              <div className="flex items-center space-x-1">
                <div className="w-4 h-2 border border-slate-700 rounded-sm">
                  <div className="w-3 h-1 bg-slate-700 rounded-sm m-0.5"></div>
                </div>
              </div>
            </div>
            
            {/* App Content */}
            <div className="w-full h-full pt-6 pb-4 px-4 flex items-center justify-center">
              <div className="w-full max-w-sm h-full flex items-center justify-center">
                {renderView()}
              </div>
            </div>
          </div>
        </div>
        
        {/* Home Indicator */}
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-white/30 rounded-full"></div>
      </div>
      
      {showAddToHomeScreen && (
        <AddToHomeScreen onDismiss={handleDismissAddToHomeScreen} />
      )}
    </div>
  );
};

const WelcomeView = ({ onNavigate }: { onNavigate: (view: string) => void }) => (
  <Card className="bg-white p-8 rounded-3xl shadow-lg border-4 border-black">
    <div className="text-center space-y-6">
      <DuckMascot className="mx-auto" />
      <h1 className="text-4xl font-bold text-slate-800">Welcome!</h1>
      
      <div className="space-y-4">
        <div className="text-left">
          <p className="text-slate-600 font-medium mb-2">Today's Activity</p>
          <Button 
            onClick={() => onNavigate("activity")}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-6 rounded-2xl flex items-center gap-3 text-lg transition-all duration-200 hover:scale-105"
          >
            <div className="w-8 h-8 bg-orange-400 rounded-lg flex items-center justify-center">
              <Phone className="w-4 h-4" />
            </div>
            Evening Date Idea
          </Button>
        </div>
      </div>

      <div className="flex justify-center space-x-8 pt-4">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => onNavigate("welcome")}
          className="w-10 h-10 bg-orange-500 hover:bg-orange-600 rounded-xl text-white"
        >
          <Home className="w-5 h-5" />
        </Button>
        <Button 
          variant="ghost" 
          size="sm"
          className="w-10 h-10 rounded-xl text-slate-400"
        >
          <Clock className="w-5 h-5" />
        </Button>
        <Button 
          variant="ghost" 
          size="sm"
          className="w-10 h-10 rounded-xl text-slate-400"
        >
          <CheckCircle className="w-5 h-5" />
        </Button>
      </div>
    </div>
  </Card>
);

const ActivityView = ({ onNavigate }: { onNavigate: (view: string) => void }) => (
  <ActivityCard onNavigate={onNavigate} />
);

const ProgressView = ({ onNavigate }: { onNavigate: (view: string) => void }) => (
  <ProgressCard onNavigate={onNavigate} />
);

const CurriculumView = ({ onNavigate }: { onNavigate: (view: string) => void }) => (
  <CurriculumCard onNavigate={onNavigate} />
);

export default Index;
