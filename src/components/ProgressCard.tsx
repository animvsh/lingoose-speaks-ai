
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Home, Clock, CheckCircle, User } from "lucide-react";

interface ProgressCardProps {
  onNavigate: (view: string) => void;
}

const ProgressCard = ({ onNavigate }: ProgressCardProps) => {
  return (
    <Card className="bg-white p-8 rounded-3xl shadow-lg border-4 border-black">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold text-slate-800">Great job!</h1>
        
        <div className="space-y-4 text-left">
          <p className="text-slate-700">
            We've already discussed this once, but 'rencontrer' means to meet someone by chance.
          </p>
          <p className="text-slate-700">
            Use the phrase 'retrouver quelqu'un' instead.
          </p>
        </div>

        <div className="flex items-center space-x-3 bg-gray-50 p-4 rounded-2xl">
          <User className="w-6 h-6 text-orange-500" />
          <div className="text-left flex-1">
            <p className="text-orange-500 font-bold">On peut se rencontrer devant le cinema...</p>
            <div className="w-full bg-orange-200 h-2 rounded-full mt-2">
              <div className="bg-orange-500 h-2 rounded-full w-3/4"></div>
            </div>
          </div>
        </div>

        <Button 
          onClick={() => onNavigate("curriculum")}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-6 rounded-2xl text-xl transition-all duration-200 hover:scale-105"
        >
          Continue
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

export default ProgressCard;
