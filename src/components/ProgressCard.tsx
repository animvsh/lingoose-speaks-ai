
import { Button } from "@/components/ui/button";
import { Home, Clock, CheckCircle, User, BarChart3, Settings, Star, Trophy, ArrowLeft } from "lucide-react";

interface ProgressCardProps {
  onNavigate: (view: string) => void;
}

const ProgressCard = ({ onNavigate }: ProgressCardProps) => {
  return (
    <div className="min-h-screen bg-yellow-100">
      {/* Scrollable Content Container with bottom padding for navbar */}
      <div className="pb-32">
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
              Progress
            </h1>
            <div className="w-12 h-12"></div> {/* Spacer */}
          </div>

          {/* Achievement Banner - Cartoon style */}
          <div className="bg-green-300 border-4 border-green-600 rounded-2xl overflow-hidden mb-6 transform hover:rotate-1 transition-transform duration-200">
            <div className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-green-600 border-3 border-green-800 rounded-2xl flex items-center justify-center">
                  <Trophy className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-black text-green-900 mb-2 uppercase tracking-wide">Awesome!</h3>
                  <p className="text-green-800 font-bold text-lg">Call completed successfully!</p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-purple-300 border-4 border-purple-600 p-4 rounded-2xl text-center transform hover:scale-105 transition-transform duration-200">
              <div className="w-12 h-12 bg-purple-600 border-3 border-purple-800 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div className="text-3xl font-black text-purple-900">8min</div>
              <div className="text-sm text-purple-800 font-bold uppercase">Talk Time</div>
            </div>
            <div className="bg-pink-300 border-4 border-pink-600 p-4 rounded-2xl text-center transform hover:scale-105 transition-transform duration-200">
              <div className="w-12 h-12 bg-pink-600 border-3 border-pink-800 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Star className="w-6 h-6 text-white" />
              </div>
              <div className="text-3xl font-black text-pink-900">89%</div>
              <div className="text-sm text-pink-800 font-bold uppercase">Engagement</div>
            </div>
          </div>

          {/* Feedback Card */}
          <div className="bg-orange-300 border-4 border-orange-600 rounded-2xl overflow-hidden mb-6 transform hover:-rotate-1 transition-transform duration-200">
            <div className="p-6">
              <h3 className="text-xl font-black text-orange-900 mb-4 uppercase tracking-wide flex items-center">
                🦆 Goose Feedback
              </h3>
              <div className="bg-white border-3 border-orange-500 rounded-xl p-4 mb-4">
                <p className="text-orange-800 font-bold text-sm mb-2">
                  We've discussed this before, but "meeting" means bumping into someone by chance.
                </p>
                <p className="text-orange-800 font-bold text-sm">
                  When you've planned to meet, use the phrase "going to meet someone"!
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <User className="w-8 h-8 text-orange-900" />
                <div className="flex-1">
                  <p className="text-orange-900 font-bold text-sm mb-2">"We can meet in front of the cinema..."</p>
                  <div className="w-full bg-orange-200 h-3 rounded-full">
                    <div className="bg-orange-600 h-3 rounded-full w-3/4"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Continue Button */}
          <Button 
            onClick={() => onNavigate("curriculum")}
            className="w-full bg-orange-400 hover:bg-orange-500 border-4 border-orange-600 text-white font-black py-6 px-6 rounded-2xl text-lg transition-all duration-200 hover:scale-105 transform hover:-rotate-1"
          >
            <CheckCircle className="w-6 h-6 mr-3" />
            Continue Learning
          </Button>
        </div>
      </div>

      {/* Fixed Bottom Navigation - Cartoon style */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t-4 border-slate-400 px-4 py-4">
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
              className="w-16 h-16 bg-orange-400 hover:bg-orange-500 border-4 border-orange-600 rounded-2xl text-white transition-all duration-200 hover:scale-110 transform hover:rotate-3"
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

export default ProgressCard;
