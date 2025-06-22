
import { Button } from "@/components/ui/button";
import { Phone, Home, Clock, CheckCircle, BarChart3, Settings, Play, Zap } from "lucide-react";
import DuckMascot from "./DuckMascot";

interface ActivityCardProps {
  onNavigate: (view: string) => void;
}

const ActivityCard = ({ onNavigate }: ActivityCardProps) => {
  const handleStartCall = () => {
    setTimeout(() => onNavigate("progress"), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-pink-50 pb-24">
      <div className="max-w-md mx-auto p-6">
        <div className="bg-white/80 backdrop-blur-lg p-8 rounded-3xl shadow-2xl border border-white/20 h-full flex flex-col">
          <div className="text-center space-y-8 flex-1">
            <div className="relative">
              <div className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-8 py-4 rounded-3xl shadow-lg">
                <h2 className="text-2xl sm:text-3xl font-bold">Today's Activity</h2>
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center animate-pulse">
                <Zap className="w-4 h-4 text-white" />
              </div>
            </div>

            <div className="flex justify-center space-x-4 my-8">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                <div className="w-10 h-10 bg-white/30 rounded-xl backdrop-blur-sm"></div>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                <div className="w-10 h-10 bg-white/30 rounded-xl backdrop-blur-sm"></div>
              </div>
            </div>

            <div className="space-y-6 text-left">
              <div className="bg-gradient-to-br from-orange-50 to-pink-50 p-6 rounded-3xl border-2 border-orange-100 shadow-lg">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-pink-500 rounded-xl flex items-center justify-center">
                    <Play className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-slate-800 font-bold text-lg">Scenario: Movie Date Gone Wrong</p>
                </div>
                <p className="text-slate-600 text-base leading-relaxed">
                  I'll awkwardly pretend to ask you out to a movie. We'll practice casual conversation and reflexive verbs while navigating this hilariously uncomfortable situation.
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-6 rounded-3xl border border-slate-200 shadow-md">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-slate-700 font-semibold mb-2">Learning Focus:</p>
                    <div className="flex flex-wrap gap-2">
                      <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">Reflexive Verbs</span>
                      <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">Casual Tone</span>
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">Rejection Phrases</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Button 
              onClick={handleStartCall}
              className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-bold py-6 px-8 rounded-3xl text-xl transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl shadow-lg"
            >
              <Phone className="w-6 h-6 mr-3" />
              Start Call
            </Button>

            <div className="flex items-center justify-center space-x-2 text-slate-500 bg-white/60 backdrop-blur-sm rounded-full px-4 py-2 border border-slate-200">
              <Clock className="w-4 h-4" />
              <p className="text-sm font-medium">You'll receive a call in ~30 seconds</p>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t border-slate-200 px-4 py-4 safe-area-bottom shadow-2xl">
        <div className="max-w-md mx-auto">
          <div className="flex justify-center space-x-8">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onNavigate("home")}
              className="w-14 h-14 rounded-2xl text-slate-400 hover:bg-orange-50 hover:text-orange-500 transition-all duration-300 hover:scale-110"
            >
              <Home className="w-6 h-6" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onNavigate("progress")}
              className="w-14 h-14 rounded-2xl text-slate-400 hover:bg-blue-50 hover:text-blue-500 transition-all duration-300 hover:scale-110"
            >
              <BarChart3 className="w-6 h-6" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onNavigate("curriculum")}
              className="w-14 h-14 rounded-2xl text-slate-400 hover:bg-green-50 hover:text-green-500 transition-all duration-300 hover:scale-110"
            >
              <CheckCircle className="w-6 h-6" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onNavigate("settings")}
              className="w-14 h-14 rounded-2xl text-slate-400 hover:bg-purple-50 hover:text-purple-500 transition-all duration-300 hover:scale-110"
            >
              <Settings className="w-6 h-6" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityCard;
