
import { Button } from "@/components/ui/button";
import { Home, Clock, CheckCircle, User, BarChart3, Settings, Star, Trophy, ArrowLeft, Phone } from "lucide-react";

interface ProgressCardProps {
  onNavigate: (view: string) => void;
}

const ProgressCard = ({ onNavigate }: ProgressCardProps) => {
  return (
    <div className="min-h-screen bg-orange-50 pb-24">
      {/* Header */}
      <div className="px-6 pt-8 pb-6">
        <div className="flex items-center justify-between">
          <div
            onClick={() => onNavigate("home")}
            className="w-14 h-14 bg-orange-400 rounded-2xl flex items-center justify-center hover:bg-orange-500 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-black text-orange-500 uppercase tracking-wider">
            PROGRESS
          </h1>
          <div className="w-14 h-14"></div>
        </div>
      </div>

      <div className="px-6 space-y-6">
        {/* Achievement Banner - Green Success Card */}
        <div className="bg-gradient-to-br from-green-400 to-green-500 rounded-3xl p-8 border-4 border-green-600">
          <div className="flex items-center space-x-6">
            <div className="w-20 h-20 bg-green-600 rounded-3xl flex items-center justify-center">
              <Trophy className="w-10 h-10 text-white" />
            </div>
            <div>
              <h3 className="text-3xl font-black text-gray-800 mb-2 uppercase tracking-wide">AWESOME!</h3>
              <p className="text-gray-700 font-bold text-lg">Call completed successfully!</p>
            </div>
          </div>
        </div>

        {/* Stats Grid - Purple and Pink Cards */}
        <div className="grid grid-cols-2 gap-6">
          {/* Talk Time - Purple Card */}
          <div className="bg-gradient-to-br from-purple-400 to-purple-500 rounded-3xl p-6 text-center border-4 border-purple-600">
            <div className="w-16 h-16 bg-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-white" />
            </div>
            <div className="text-4xl font-black text-gray-800 mb-2">8min</div>
            <div className="text-sm text-gray-700 font-black uppercase tracking-wider">TALK TIME</div>
          </div>
          
          {/* Engagement - Pink Card */}
          <div className="bg-gradient-to-br from-pink-400 to-pink-500 rounded-3xl p-6 text-center border-4 border-pink-600">
            <div className="w-16 h-16 bg-pink-600 rounded-3xl flex items-center justify-center mx-auto mb-4">
              <Star className="w-8 h-8 text-white" />
            </div>
            <div className="text-4xl font-black text-gray-800 mb-2">89%</div>
            <div className="text-sm text-gray-700 font-black uppercase tracking-wider">ENGAGEMENT</div>
          </div>
        </div>

        {/* Goose Feedback Card - Orange/Peach */}
        <div className="bg-gradient-to-br from-orange-300 to-orange-400 rounded-3xl p-6 border-4 border-orange-500">
          <div className="flex items-center mb-6">
            <span className="text-2xl mr-3">🦆</span>
            <h3 className="text-2xl font-black text-gray-800 uppercase tracking-wide">
              GOOSE FEEDBACK
            </h3>
          </div>
          
          <div className="bg-white rounded-3xl p-6 mb-6 border-2 border-orange-200">
            <p className="text-gray-800 font-bold mb-4 text-base leading-relaxed">
              We've discussed this before, but "meeting" means bumping into someone by chance.
            </p>
            <p className="text-gray-800 font-bold text-base leading-relaxed">
              When you've planned to meet, use the phrase "going to meet someone"!
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 bg-orange-500 rounded-3xl flex items-center justify-center border-2 border-orange-600">
              <User className="w-7 h-7 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-gray-800 font-bold text-sm mb-3 bg-gray-100 px-4 py-3 rounded-2xl border-2 border-gray-200">
                "We can meet in front of the cinema..."
              </p>
              <div className="w-full bg-gray-200 h-4 rounded-full border-2 border-gray-300">
                <div className="bg-orange-500 h-full rounded-full w-3/4 border border-orange-600"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Continue Button */}
        <Button 
          onClick={() => onNavigate("curriculum")}
          className="w-full bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white font-black py-6 text-xl rounded-3xl border-4 border-blue-600 hover:border-blue-700 transition-all duration-200"
        >
          <CheckCircle className="w-6 h-6 mr-3" />
          CONTINUE LEARNING
        </Button>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white px-6 py-4 border-t-4 border-orange-200">
        <div className="max-w-md mx-auto">
          <div className="flex justify-center space-x-3">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onNavigate("home")}
              className="w-14 h-14 bg-orange-400 hover:bg-orange-500 rounded-2xl text-white border-4 border-white hover:border-orange-200 transition-all duration-200"
            >
              <Home className="w-6 h-6" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onNavigate("activity")}
              className="w-14 h-14 bg-gray-200 hover:bg-gray-300 rounded-2xl text-gray-600 hover:text-gray-700 border-4 border-white hover:border-gray-200 transition-all duration-200"
            >
              <Phone className="w-6 h-6" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onNavigate("curriculum")}
              className="w-14 h-14 bg-gray-200 hover:bg-gray-300 rounded-2xl text-gray-600 hover:text-gray-700 border-4 border-white hover:border-gray-200 transition-all duration-200"
            >
              <CheckCircle className="w-6 h-6" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onNavigate("settings")}
              className="w-14 h-14 bg-gray-200 hover:bg-gray-300 rounded-2xl text-gray-600 hover:text-gray-700 border-4 border-white hover:border-gray-200 transition-all duration-200"
            >
              <Settings className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressCard;
