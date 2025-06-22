
import { Button } from "@/components/ui/button";
import { Home, Clock, CheckCircle, User, BarChart3, Settings, Star, Trophy, ArrowLeft, Phone } from "lucide-react";

interface ProgressCardProps {
  onNavigate: (view: string) => void;
}

const ProgressCard = ({ onNavigate }: ProgressCardProps) => {
  return (
    <div className="min-h-screen bg-[#FFF9E6] pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-300 to-orange-400 rounded-b-[3rem] px-6 py-8 mb-6">
        <div className="flex items-center justify-between">
          <Button
            onClick={() => onNavigate("home")}
            className="w-16 h-16 bg-orange-400 hover:bg-orange-500 rounded-3xl text-white shadow-lg transition-colors duration-200 border-0"
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
        <div className="bg-gradient-to-r from-green-200 to-green-300 rounded-[2.5rem] p-6 shadow-lg">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-green-500 rounded-3xl flex items-center justify-center shadow-md">
              <Trophy className="w-12 h-12 text-white" />
            </div>
            <div>
              <h3 className="text-4xl font-black text-green-800 mb-2 uppercase tracking-wide">AWESOME!</h3>
              <p className="text-green-700 font-bold text-xl">Call completed successfully!</p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-purple-200 to-purple-300 rounded-[2.5rem] p-6 text-center shadow-lg">
            <div className="w-20 h-20 bg-purple-500 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-md">
              <Clock className="w-10 h-10 text-white" />
            </div>
            <div className="text-5xl font-black text-purple-800 mb-2">8min</div>
            <div className="text-lg text-purple-700 font-bold uppercase tracking-wide">TALK TIME</div>
          </div>
          
          <div className="bg-gradient-to-br from-pink-200 to-pink-300 rounded-[2.5rem] p-6 text-center shadow-lg">
            <div className="w-20 h-20 bg-pink-500 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-md">
              <Star className="w-10 h-10 text-white" />
            </div>
            <div className="text-5xl font-black text-pink-800 mb-2">89%</div>
            <div className="text-lg text-pink-700 font-bold uppercase tracking-wide">ENGAGEMENT</div>
          </div>
        </div>

        {/* Goose Feedback Card */}
        <div className="bg-gradient-to-r from-orange-200 to-orange-300 rounded-[2.5rem] p-6 shadow-lg">
          <h3 className="text-3xl font-black text-orange-800 mb-4 uppercase tracking-wide flex items-center">
            🦆 GOOSE FEEDBACK
          </h3>
          
          <div className="bg-white rounded-3xl p-6 mb-4 shadow-md">
            <p className="text-orange-800 font-bold text-lg mb-3">
              We've discussed this before, but "meeting" means bumping into someone by chance.
            </p>
            <p className="text-orange-800 font-bold text-lg">
              When you've planned to meet, use the phrase "going to meet someone"!
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-orange-500 rounded-3xl flex items-center justify-center shadow-md">
              <User className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-orange-800 font-bold text-base mb-3 bg-orange-100 px-4 py-2 rounded-full">"We can meet in front of the cinema..."</p>
              <div className="w-full bg-orange-100 h-6 rounded-full shadow-inner">
                <div className="bg-orange-500 h-full rounded-full w-3/4 shadow-sm"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Continue Button */}
        <div className="bg-gradient-to-r from-blue-200 to-blue-300 rounded-[2.5rem] p-6 shadow-lg">
          <Button 
            onClick={() => onNavigate("curriculum")}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-black py-6 text-xl rounded-3xl shadow-lg transition-colors duration-200 border-0"
          >
            <CheckCircle className="w-8 h-8 mr-4" />
            CONTINUE LEARNING
          </Button>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white px-4 py-4 safe-area-bottom shadow-lg">
        <div className="max-w-md mx-auto">
          <div className="flex justify-center space-x-6">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onNavigate("home")}
              className="w-16 h-16 bg-blue-200 hover:bg-blue-300 rounded-3xl text-blue-800 transition-colors duration-200 shadow-md border-0"
            >
              <Home className="w-7 h-7" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onNavigate("activity")}
              className="w-16 h-16 bg-green-200 hover:bg-green-300 rounded-3xl text-green-800 transition-colors duration-200 shadow-md border-0"
            >
              <Phone className="w-7 h-7" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onNavigate("curriculum")}
              className="w-16 h-16 bg-purple-200 hover:bg-purple-300 rounded-3xl text-purple-800 transition-colors duration-200 shadow-md border-0"
            >
              <CheckCircle className="w-7 h-7" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onNavigate("settings")}
              className="w-16 h-16 bg-pink-200 hover:bg-pink-300 rounded-3xl text-pink-800 transition-colors duration-200 shadow-md border-0"
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
