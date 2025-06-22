
import { Button } from "@/components/ui/button";
import { Home, Clock, CheckCircle, User, BarChart3, Settings, Star, Trophy, ArrowLeft, Phone } from "lucide-react";

interface ProgressCardProps {
  onNavigate: (view: string) => void;
}

const ProgressCard = ({ onNavigate }: ProgressCardProps) => {
  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="px-4 pt-6 mb-8">
        <div className="flex items-center justify-between">
          <Button
            onClick={() => onNavigate("home")}
            className="w-14 h-14 bg-orange-500 hover:bg-orange-600 rounded-full text-white shadow-lg transition-all duration-200"
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <h1 className="text-3xl font-black text-orange-500 uppercase tracking-wide">
            PROGRESS
          </h1>
          <div className="w-14 h-14"></div>
        </div>
      </div>

      <div className="px-4 space-y-6">
        {/* Achievement Banner */}
        <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center shadow-md">
              <Trophy className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-gray-800 mb-1 uppercase tracking-wide">AWESOME!</h3>
              <p className="text-gray-600 font-semibold">Call completed successfully!</p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-3xl p-6 text-center shadow-lg border border-gray-100">
            <div className="w-16 h-16 bg-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md">
              <Clock className="w-8 h-8 text-white" />
            </div>
            <div className="text-3xl font-black text-gray-800 mb-2">8min</div>
            <div className="text-sm text-gray-600 font-semibold uppercase tracking-wide">TALK TIME</div>
          </div>
          
          <div className="bg-white rounded-3xl p-6 text-center shadow-lg border border-gray-100">
            <div className="w-16 h-16 bg-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md">
              <Star className="w-8 h-8 text-white" />
            </div>
            <div className="text-3xl font-black text-gray-800 mb-2">89%</div>
            <div className="text-sm text-gray-600 font-semibold uppercase tracking-wide">ENGAGEMENT</div>
          </div>
        </div>

        {/* Goose Feedback Card */}
        <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100">
          <h3 className="text-xl font-black text-gray-800 mb-4 uppercase tracking-wide flex items-center">
            🦆 GOOSE FEEDBACK
          </h3>
          
          <div className="bg-gray-50 rounded-2xl p-4 mb-4">
            <p className="text-gray-700 font-semibold mb-3">
              We've discussed this before, but "meeting" means bumping into someone by chance.
            </p>
            <p className="text-gray-700 font-semibold">
              When you've planned to meet, use the phrase "going to meet someone"!
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 bg-orange-500 rounded-2xl flex items-center justify-center shadow-md">
              <User className="w-7 h-7 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-gray-700 font-semibold text-sm mb-3 bg-gray-100 px-3 py-2 rounded-full">"We can meet in front of the cinema..."</p>
              <div className="w-full bg-gray-200 h-3 rounded-full">
                <div className="bg-orange-500 h-full rounded-full w-3/4"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Continue Button */}
        <Button 
          onClick={() => onNavigate("curriculum")}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-black py-6 text-xl rounded-3xl shadow-lg transition-all duration-200"
        >
          <CheckCircle className="w-6 h-6 mr-3" />
          CONTINUE LEARNING
        </Button>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white px-4 py-4 shadow-lg border-t border-gray-200">
        <div className="max-w-md mx-auto">
          <div className="flex justify-center space-x-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onNavigate("home")}
              className="w-14 h-14 bg-gray-100 hover:bg-gray-200 rounded-2xl text-gray-600 transition-all duration-200 shadow-md"
            >
              <Home className="w-6 h-6" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onNavigate("activity")}
              className="w-14 h-14 bg-gray-100 hover:bg-gray-200 rounded-2xl text-gray-600 transition-all duration-200 shadow-md"
            >
              <Phone className="w-6 h-6" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onNavigate("curriculum")}
              className="w-14 h-14 bg-gray-100 hover:bg-gray-200 rounded-2xl text-gray-600 transition-all duration-200 shadow-md"
            >
              <CheckCircle className="w-6 h-6" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onNavigate("settings")}
              className="w-14 h-14 bg-gray-100 hover:bg-gray-200 rounded-2xl text-gray-600 transition-all duration-200 shadow-md"
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
