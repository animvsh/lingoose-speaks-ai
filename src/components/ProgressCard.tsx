
import { Button } from "@/components/ui/button";
import { Home, Clock, CheckCircle, User, BarChart3, Settings, Star, Trophy, ArrowLeft, Phone } from "lucide-react";

interface ProgressCardProps {
  onNavigate: (view: string) => void;
}

const ProgressCard = ({ onNavigate }: ProgressCardProps) => {
  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-br from-orange-400 to-orange-500 rounded-b-3xl px-6 py-8 mb-8 shadow-lg">
        <div className="flex items-center justify-between">
          <Button
            onClick={() => onNavigate("home")}
            className="w-16 h-16 bg-white/20 hover:bg-white/30 rounded-2xl text-white shadow-lg transition-all duration-200 border-0 backdrop-blur-sm"
          >
            <ArrowLeft className="w-8 h-8" />
          </Button>
          <h1 className="text-4xl font-black text-white uppercase tracking-wider">
            PROGRESS
          </h1>
          <div className="w-16 h-16"></div>
        </div>
      </div>

      <div className="px-6 space-y-6">
        {/* Achievement Banner */}
        <div className="bg-white rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-500 rounded-2xl flex items-center justify-center shadow-md">
              <Trophy className="w-12 h-12 text-white" />
            </div>
            <div>
              <h3 className="text-4xl font-black text-gray-800 mb-2 uppercase tracking-wide">AWESOME!</h3>
              <p className="text-gray-600 font-semibold text-xl">Call completed successfully!</p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-white rounded-3xl p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md">
              <Clock className="w-10 h-10 text-white" />
            </div>
            <div className="text-5xl font-black text-gray-800 mb-2">8min</div>
            <div className="text-lg text-gray-600 font-semibold uppercase tracking-wide">TALK TIME</div>
          </div>
          
          <div className="bg-white rounded-3xl p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
            <div className="w-20 h-20 bg-gradient-to-br from-pink-400 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md">
              <Star className="w-10 h-10 text-white" />
            </div>
            <div className="text-5xl font-black text-gray-800 mb-2">89%</div>
            <div className="text-lg text-gray-600 font-semibold uppercase tracking-wide">ENGAGEMENT</div>
          </div>
        </div>

        {/* Goose Feedback Card */}
        <div className="bg-white rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
          <h3 className="text-3xl font-black text-gray-800 mb-4 uppercase tracking-wide flex items-center">
            🦆 GOOSE FEEDBACK
          </h3>
          
          <div className="bg-gray-50 rounded-2xl p-6 mb-4 border border-gray-100">
            <p className="text-gray-700 font-semibold text-lg mb-3">
              We've discussed this before, but "meeting" means bumping into someone by chance.
            </p>
            <p className="text-gray-700 font-semibold text-lg">
              When you've planned to meet, use the phrase "going to meet someone"!
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-md">
              <User className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-gray-700 font-semibold text-base mb-3 bg-gray-100 px-4 py-2 rounded-full border border-gray-200">"We can meet in front of the cinema..."</p>
              <div className="w-full bg-gray-200 h-6 rounded-full border border-gray-300">
                <div className="bg-gradient-to-r from-orange-400 to-orange-500 h-full rounded-full w-3/4 shadow-sm"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Continue Button */}
        <div className="bg-white rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
          <Button 
            onClick={() => onNavigate("curriculum")}
            className="w-full bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-black py-6 text-xl rounded-2xl shadow-lg transition-all duration-200 border-0"
          >
            <CheckCircle className="w-8 h-8 mr-4" />
            CONTINUE LEARNING
          </Button>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-gray-200 px-4 py-4 safe-area-bottom shadow-2xl">
        <div className="max-w-md mx-auto">
          <div className="flex justify-center space-x-6">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onNavigate("home")}
              className="w-16 h-16 bg-gray-100 hover:bg-gray-200 rounded-2xl text-gray-600 hover:text-gray-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Home className="w-7 h-7" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onNavigate("activity")}
              className="w-16 h-16 bg-gray-100 hover:bg-gray-200 rounded-2xl text-gray-600 hover:text-gray-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Phone className="w-7 h-7" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onNavigate("curriculum")}
              className="w-16 h-16 bg-gray-100 hover:bg-gray-200 rounded-2xl text-gray-600 hover:text-gray-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <CheckCircle className="w-7 h-7" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onNavigate("settings")}
              className="w-16 h-16 bg-gray-100 hover:bg-gray-200 rounded-2xl text-gray-600 hover:text-gray-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Settings className="w-7 h-7" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressCard;
