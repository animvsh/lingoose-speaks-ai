
import { Button } from "@/components/ui/button";
import { Home, Clock, CheckCircle, User, BarChart3, Settings, Star, Trophy } from "lucide-react";

interface ProgressCardProps {
  onNavigate: (view: string) => void;
}

const ProgressCard = ({ onNavigate }: ProgressCardProps) => {
  return (
    <div className="bg-white p-8 rounded-3xl shadow-lg w-full h-full flex flex-col">
      <div className="text-center space-y-6 flex-1">
        <div className="flex items-center justify-center space-x-2">
          <Star className="w-8 h-8 text-yellow-500 fill-current" />
          <h1 className="text-4xl font-bold text-slate-800">Great job!</h1>
          <Star className="w-8 h-8 text-yellow-500 fill-current" />
        </div>
        
        <div className="bg-green-50 p-4 rounded-2xl">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Trophy className="w-5 h-5 text-green-600" />
            <span className="font-semibold text-green-800">Call Completed!</span>
          </div>
          <div className="text-sm text-green-600">8 minutes • 89% engagement</div>
        </div>

        <div className="space-y-4 text-left">
          <div className="bg-orange-50 p-4 rounded-2xl">
            <h3 className="font-semibold text-orange-800 mb-2">🦆 Goose Feedback</h3>
            <p className="text-orange-700 text-sm mb-2">
              We've already discussed this once, but 'rencontrer' means to meet someone by chance.
            </p>
            <p className="text-orange-700 text-sm">
              Use the phrase 'retrouver quelqu'un' instead when planning to meet!
            </p>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl">
            <h3 className="font-semibold text-slate-800 mb-2">📝 What you said:</h3>
            <div className="flex items-center space-x-3">
              <User className="w-6 h-6 text-orange-500" />
              <div className="flex-1">
                <p className="text-orange-500 font-medium text-sm">"On peut se rencontrer devant le cinema..."</p>
                <div className="w-full bg-orange-200 h-2 rounded-full mt-2">
                  <div className="bg-orange-500 h-2 rounded-full w-3/4"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Button 
          onClick={() => onNavigate("curriculum")}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-6 rounded-2xl text-xl transition-all duration-200 hover:scale-105"
        >
          Continue Learning
        </Button>
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
          className="w-12 h-12 bg-orange-500 hover:bg-orange-600 rounded-xl text-white"
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

export default ProgressCard;
