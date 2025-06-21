
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Phone, Home, Clock, CheckCircle } from "lucide-react";
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
    <Card className="bg-white p-8 rounded-3xl shadow-lg border-4 border-black">
      <div className="text-center space-y-6">
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
          <p className="text-slate-700">
            I'll pretend to awkwardly invite you to a movie.
          </p>
          <p className="text-slate-700">
            We'll practice casual conversation and forming reflexive verbs.
          </p>
        </div>

        <Button 
          onClick={handleStartCall}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-6 rounded-2xl text-xl transition-all duration-200 hover:scale-105"
        >
          Start Call
        </Button>

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
};

export default ActivityCard;
