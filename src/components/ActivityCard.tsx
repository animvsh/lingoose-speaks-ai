
import { Button } from "@/components/ui/button";
import { Phone, Home, Clock, CheckCircle, BarChart3, Settings, Play, Zap, ArrowLeft } from "lucide-react";
import DuckMascot from "./DuckMascot";

interface ActivityCardProps {
  onNavigate: (view: string) => void;
}

const ActivityCard = ({ onNavigate }: ActivityCardProps) => {
  const handleStartCall = () => {
    setTimeout(() => onNavigate("progress"), 2000);
  };

  return (
    <div className="min-h-screen bg-yellow-100">
      <div className="px-4 pt-6">
        {/* Header with Back Button */}
        <div className="flex items-center justify-between mb-6">
          <Button
            onClick={() => onNavigate("home")}
            className="w-12 h-12 bg-orange-400 hover:bg-orange-500 border-4 border-orange-600 rounded-2xl text-white transition-all duration-200 hover:scale-110 transform hover:-rotate-3"
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <h1 className="text-3xl font-black text-orange-600 uppercase tracking-wider transform -rotate-1">
            Today's Activity
          </h1>
          <div className="w-12 h-12"></div> {/* Spacer */}
        </div>

        <div className="bg-white border-4 border-slate-400 p-8 rounded-3xl shadow-lg mb-8 transform hover:rotate-1 transition-transform duration-200">
          <div className="text-center space-y-6">
            <div className="relative">
              <div className="bg-orange-400 border-4 border-orange-600 text-white px-8 py-4 rounded-3xl shadow-lg">
                <h2 className="text-2xl font-black uppercase tracking-wide">Today's Challenge</h2>
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-400 border-3 border-green-600 rounded-full flex items-center justify-center animate-bounce">
                <Zap className="w-4 h-4 text-white" />
              </div>
            </div>

            <div className="flex justify-center space-x-4 my-8">
              <div className="w-16 h-16 bg-orange-300 border-4 border-orange-600 rounded-2xl flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform">
                <div className="w-10 h-10 bg-orange-500 border-2 border-orange-700 rounded-xl"></div>
              </div>
              <div className="w-16 h-16 bg-pink-300 border-4 border-pink-600 rounded-2xl flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform">
                <div className="w-10 h-10 bg-pink-500 border-2 border-pink-700 rounded-xl"></div>
              </div>
            </div>

            <div className="space-y-6 text-left">
              <div className="bg-orange-300 border-4 border-orange-600 p-6 rounded-3xl transform hover:scale-105 transition-transform duration-200">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-orange-600 border-3 border-orange-800 rounded-xl flex items-center justify-center">
                    <Play className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-orange-900 font-black text-lg uppercase tracking-wide">Scenario: Movie Date Gone Wrong</p>
                </div>
                <p className="text-orange-800 font-bold text-base leading-relaxed">
                  I'll awkwardly pretend to ask you out to a movie. We'll practice casual conversation and reflexive verbs while navigating this hilariously uncomfortable situation.
                </p>
              </div>
              
              <div className="bg-slate-300 border-4 border-slate-600 p-6 rounded-3xl transform hover:scale-105 transition-transform duration-200">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-purple-500 border-3 border-purple-700 rounded-xl flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-slate-900 font-black mb-3 text-lg uppercase tracking-wide">Learning Focus:</p>
                    <div className="flex flex-wrap gap-3">
                      <span className="bg-purple-300 border-3 border-purple-600 text-purple-900 px-4 py-2 rounded-full font-black uppercase tracking-wide">Reflexive Verbs</span>
                      <span className="bg-blue-300 border-3 border-blue-600 text-blue-900 px-4 py-2 rounded-full font-black uppercase tracking-wide">Casual Tone</span>
                      <span className="bg-green-300 border-3 border-green-600 text-green-900 px-4 py-2 rounded-full font-black uppercase tracking-wide">Rejection Phrases</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Button 
              onClick={handleStartCall}
              className="w-full bg-orange-400 hover:bg-orange-500 border-4 border-orange-600 text-white font-black py-6 px-6 rounded-2xl text-lg transition-all duration-200 hover:scale-105 transform hover:-rotate-1"
            >
              <Phone className="w-6 h-6 mr-3" />
              Start Call
            </Button>

            <div className="flex items-center justify-center space-x-2 text-slate-800 bg-white border-3 border-slate-400 rounded-full px-4 py-3 font-bold">
              <Clock className="w-5 h-5" />
              <p className="text-sm font-black uppercase tracking-wide">You'll receive a call in ~30 seconds</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation - Now at bottom of content */}
      <div className="bg-white border-t-4 border-slate-400 px-4 py-4">
        <div className="max-w-md mx-auto">
          <div className="flex justify-center space-x-6">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onNavigate("home")}
              className="w-16 h-16 bg-blue-300 hover:bg-blue-400 border-4 border-blue-600 rounded-2xl text-blue-900 transition-all duration-200 hover:scale-110 transform hover:-rotate-3"
            >
              <Home className="w-6 h-6" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onNavigate("progress")}
              className="w-16 h-16 bg-orange-300 hover:bg-orange-400 border-4 border-orange-600 rounded-2xl text-orange-900 transition-all duration-200 hover:scale-110 transform hover:rotate-3"
            >
              <BarChart3 className="w-6 h-6" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onNavigate("curriculum")}
              className="w-16 h-16 bg-green-300 hover:bg-green-400 border-4 border-green-600 rounded-2xl text-green-900 transition-all duration-200 hover:scale-110 transform hover:-rotate-3"
            >
              <CheckCircle className="w-6 h-6" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onNavigate("settings")}
              className="w-16 h-16 bg-purple-300 hover:bg-purple-400 border-4 border-purple-600 rounded-2xl text-purple-900 transition-all duration-200 hover:scale-110 transform hover:rotate-3"
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
