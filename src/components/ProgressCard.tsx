import { Button } from "@/components/ui/button";
import { Home, Clock, CheckCircle, User, Settings, Star, Trophy, ArrowLeft, Phone } from "lucide-react";

interface ProgressCardProps {
  onNavigate: (view: string) => void;
}

const ProgressCard = ({ onNavigate }: ProgressCardProps) => {
  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="px-6 pt-8 pb-6">
        <div className="flex items-center justify-between">
          <Button
            onClick={() => onNavigate("home")}
            className="w-14 h-14 bg-orange-500 hover:bg-orange-600 rounded-2xl text-white shadow-lg"
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <h1 className="text-3xl font-bold text-orange-500 uppercase tracking-wide">
            PROGRESS
          </h1>
          <div className="w-14 h-14"></div>
        </div>
      </div>

      <div className="px-6 space-y-6">
        {/* Achievement Banner */}
        <div className="bg-green-400 rounded-3xl p-6 border-4 border-green-500">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-green-600 rounded-2xl flex items-center justify-center">
              <Trophy className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white mb-1">AWESOME!</h3>
              <p className="text-white font-medium">Call completed successfully!</p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          {/* Talk Time */}
          <div className="bg-purple-400 rounded-3xl p-6 text-center border-4 border-purple-500">
            <div className="w-12 h-12 bg-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <div className="text-3xl font-bold text-white mb-2">8min</div>
            <div className="text-sm text-white font-medium uppercase tracking-wide">TALK TIME</div>
          </div>
          
          {/* Engagement */}
          <div className="bg-pink-400 rounded-3xl p-6 text-center border-4 border-pink-500">
            <div className="w-12 h-12 bg-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Star className="w-6 h-6 text-white" />
            </div>
            <div className="text-3xl font-bold text-white mb-2">89%</div>
            <div className="text-sm text-white font-medium uppercase tracking-wide">ENGAGEMENT</div>
          </div>
        </div>

        {/* Goose Feedback Card */}
        <div className="bg-orange-400 rounded-3xl p-6 border-4 border-orange-500">
          <div className="flex items-center mb-4">
            <span className="text-2xl mr-3">🦆</span>
            <h3 className="text-xl font-bold text-white uppercase tracking-wide">
              GOOSE FEEDBACK
            </h3>
          </div>
          
          <div className="bg-white rounded-2xl p-4 mb-4">
            <p className="text-gray-800 font-medium mb-3">
              We've discussed this before, but "meeting" means bumping into someone by chance.
            </p>
            <p className="text-gray-800 font-medium">
              When you've planned to meet, use the phrase "going to meet someone"!
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-orange-600 rounded-2xl flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-gray-800 font-medium text-sm mb-2 bg-gray-100 px-3 py-2 rounded-xl">
                "We can meet in front of the cinema..."
              </p>
              <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden">
                <div className="bg-orange-500 h-full rounded-full w-3/4"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Continue Button */}
        <Button 
          onClick={() => onNavigate("curriculum")}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 text-lg rounded-3xl"
        >
          <CheckCircle className="w-6 h-6 mr-2" />
          Continue Learning
        </Button>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white px-6 py-4 border-t border-gray-100">
        <div className="max-w-md mx-auto">
          <div className="flex justify-center space-x-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onNavigate("home")}
              className="w-14 h-14 bg-blue-400 rounded-2xl text-white"
            >
              <Home className="w-6 h-6" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onNavigate("activity")}
              className="w-14 h-14 bg-orange-400 rounded-2xl text-white"
            >
              <Phone className="w-6 h-6" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onNavigate("curriculum")}
              className="w-14 h-14 bg-green-400 rounded-2xl text-white"
            >
              <CheckCircle className="w-6 h-6" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onNavigate("settings")}
              className="w-14 h-14 bg-purple-400 rounded-2xl text-white"
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
