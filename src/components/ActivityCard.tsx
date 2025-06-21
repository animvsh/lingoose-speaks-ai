
import { Button } from "@/components/ui/button";
import { Phone, Home, Clock, CheckCircle, BarChart3, Settings } from "lucide-react";
import DuckMascot from "./DuckMascot";

interface ActivityCardProps {
  onNavigate: (view: string) => void;
}

const ActivityCard = ({ onNavigate }: ActivityCardProps) => {
  const handleStartCall = () => {
    // Simulate starting a call
    setTimeout(() => onNavigate("progress"), 2000);
  };

  return (
    <div className="bg-white p-8 rounded-3xl shadow-lg w-full h-full flex flex-col">
      <div className="text-center space-y-6 flex-1">
        <div className="bg-orange-500 text-white px-6 py-3 rounded-2xl">
          <h2 className="text-2xl font-bold">Today's Activity</h2>
        </div>

        <div className="flex justify-center space-x-4 my-6">
          <div className="w-12 h-12 bg-amber-800 rounded-full flex items-center justify-center">
            <div className="w-8 h-8 bg-amber-600 rounded-full"></div>
          </div>
          <div className="w-12 h-12 bg-orange-400 rounded-full flex items-center justify-center">
            <div className="w-8 h-8 bg-orange-300 rounded-full"></div>
          </div>
        </div>

        <div className="space-y-4 text-left">
          <div className="bg-orange-50 p-4 rounded-2xl">
            <p className="text-slate-700 font-medium mb-2">Scenario: Movie Date Gone Wrong</p>
            <p className="text-slate-600 text-sm">
              I'll pretend to awkwardly invite you to a movie. We'll practice casual conversation and forming reflexive verbs.
            </p>
          </div>
          
          <div className="bg-slate-50 p-4 rounded-2xl">
            <p className="text-slate-600 text-sm">
              <strong>Focus:</strong> Reflexive verbs • Casual tone • Rejection phrases
            </p>
          </div>
        </div>

        <Button 
          onClick={handleStartCall}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-6 px-6 rounded-2xl text-xl transition-all duration-200 hover:scale-105"
        >
          <Phone className="w-6 h-6 mr-3" />
          Start Call
        </Button>

        <p className="text-xs text-slate-400">You'll receive a call in ~30 seconds</p>
      </div>

      <div className="flex justify-center space-x-8 pt-4 border-t border-slate-100">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => onNavigate("home")}
          className="w-12 h-12 rounded-xl text-slate-400 hover:bg-slate-100"
        >
          <Home className="w-5 h-5" />
        </Button>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => onNavigate("progress")}
          className="w-12 h-12 rounded-xl text-slate-400 hover:bg-slate-100"
        >
          <BarChart3 className="w-5 h-5" />
        </Button>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => onNavigate("curriculum")}
          className="w-12 h-12 rounded-xl text-slate-400 hover:bg-slate-100"
        >
          <CheckCircle className="w-5 h-5" />
        </Button>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => onNavigate("settings")}
          className="w-12 h-12 rounded-xl text-slate-400 hover:bg-slate-100"
        >
          <Settings className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};

export default ActivityCard;
