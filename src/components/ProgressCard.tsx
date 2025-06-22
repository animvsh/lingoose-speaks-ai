
import { Button } from "@/components/ui/button";
import { Home, Clock, CheckCircle, User, BarChart3, Settings, Star, Trophy, ArrowLeft, Phone } from "lucide-react";

interface ProgressCardProps {
  onNavigate: (view: string) => void;
}

const ProgressCard = ({ onNavigate }: ProgressCardProps) => {
  return (
    <div className="min-h-screen bg-[#F5F2E8] pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-400 to-orange-500 rounded-b-[2.5rem] px-6 py-8 mb-6 shadow-xl border-b-8 border-orange-600">
        <div className="flex items-center justify-between">
          <Button
            onClick={() => onNavigate("home")}
            className="w-14 h-14 bg-orange-500 hover:bg-orange-600 border-4 border-orange-600 rounded-3xl text-white transition-all duration-200 hover:scale-110 transform hover:-rotate-3 shadow-lg"
          >
            <ArrowLeft className="w-7 h-7" />
          </Button>
          <h1 className="text-4xl font-black text-white uppercase tracking-wider drop-shadow-lg">
            TODAY'S PROGRESS
          </h1>
          <div className="w-14 h-14"></div>
        </div>
      </div>

      <div className="px-6 space-y-6">
        {/* Achievement Banner */}
        <div className="bg-gradient-to-r from-green-400 to-green-500 rounded-[2rem] p-6 border-4 border-green-600 transform hover:rotate-1 transition-transform shadow-xl hover:shadow-green-300/50">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-green-600 rounded-2xl flex items-center justify-center border-4 border-green-700 shadow-lg">
              <Trophy className="w-10 h-10 text-white" />
            </div>
            <div>
              <h3 className="text-4xl font-black text-white mb-2 uppercase tracking-wide drop-shadow-lg">AWESOME!</h3>
              <p className="text-green-100 font-bold text-xl bg-green-600/30 px-3 py-1 rounded-full">Call completed successfully!</p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-purple-400 to-purple-500 rounded-[2rem] p-6 border-4 border-purple-600 text-center transform hover:scale-105 transition-transform shadow-xl hover:shadow-purple-300/50">
            <div className="w-16 h-16 bg-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 border-3 border-purple-700 shadow-lg">
              <Clock className="w-8 h-8 text-white" />
            </div>
            <div className="text-5xl font-black text-white drop-shadow-lg">8min</div>
            <div className="text-sm text-purple-100 font-bold uppercase tracking-wide bg-purple-600/30 px-2 py-1 rounded-full mt-2">TALK TIME</div>
          </div>
          
          <div className="bg-gradient-to-br from-pink-400 to-pink-500 rounded-[2rem] p-6 border-4 border-pink-600 text-center transform hover:scale-105 transition-transform shadow-xl hover:shadow-pink-300/50">
            <div className="w-16 h-16 bg-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4 border-3 border-pink-700 shadow-lg">
              <Star className="w-8 h-8 text-white" />
            </div>
            <div className="text-5xl font-black text-white drop-shadow-lg">89%</div>
            <div className="text-sm text-pink-100 font-bold uppercase tracking-wide bg-pink-600/30 px-2 py-1 rounded-full mt-2">ENGAGEMENT</div>
          </div>
        </div>

        {/* Goose Feedback Card */}
        <div className="bg-gradient-to-r from-orange-300 to-orange-400 rounded-[2rem] p-6 border-4 border-orange-500 transform hover:-rotate-1 transition-transform shadow-xl hover:shadow-orange-300/50">
          <h3 className="text-3xl font-black text-orange-800 mb-4 uppercase tracking-wide flex items-center drop-shadow-sm">
            🦆 GOOSE FEEDBACK
          </h3>
          
          <div className="bg-white rounded-2xl p-6 mb-4 border-4 border-orange-400 shadow-lg">
            <p className="text-orange-800 font-bold text-base mb-3">
              We've discussed this before, but "meeting" means bumping into someone by chance.
            </p>
            <p className="text-orange-800 font-bold text-base">
              When you've planned to meet, use the phrase "going to meet someone"!
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="w-16 h-16 bg-orange-600 rounded-2xl flex items-center justify-center border-3 border-orange-700 shadow-lg">
              <User className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-orange-800 font-bold text-base mb-3 bg-orange-200/50 px-3 py-1 rounded-full">"We can meet in front of the cinema..."</p>
              <div className="w-full bg-orange-200 h-4 rounded-full border-3 border-orange-300 shadow-inner">
                <div className="bg-gradient-to-r from-orange-600 to-orange-700 h-full rounded-full w-3/4 shadow-lg"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Continue Button */}
        <div className="bg-gradient-to-r from-blue-400 to-blue-500 rounded-[2rem] p-4 border-4 border-blue-600 transform hover:scale-[1.02] transition-transform shadow-xl hover:shadow-blue-300/50">
          <Button 
            onClick={() => onNavigate("curriculum")}
            className="w-full bg-transparent hover:bg-blue-600/20 text-white font-black py-6 text-xl border-0 tracking-wide"
          >
            <CheckCircle className="w-8 h-8 mr-4" />
            CONTINUE LEARNING
          </Button>
        </div>
      </div>

      {/* Bottom Navigation - Fixed to show all 4 buttons */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t-6 border-slate-400 px-4 py-4 safe-area-bottom shadow-2xl">
        <div className="max-w-md mx-auto">
          <div className="flex justify-center space-x-6">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onNavigate("home")}
              className="w-18 h-18 bg-blue-300 hover:bg-blue-400 border-4 border-blue-600 rounded-3xl text-blue-900 transition-all duration-200 hover:scale-110 transform hover:-rotate-3 shadow-lg"
            >
              <Home className="w-7 h-7" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onNavigate("activity")}
              className="w-18 h-18 bg-green-300 hover:bg-green-400 border-4 border-green-600 rounded-3xl text-green-900 transition-all duration-200 hover:scale-110 transform hover:rotate-3 shadow-lg"
            >
              <Phone className="w-7 h-7" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onNavigate("curriculum")}
              className="w-18 h-18 bg-purple-300 hover:bg-purple-400 border-4 border-purple-600 rounded-3xl text-purple-900 transition-all duration-200 hover:scale-110 transform hover:rotate-3 shadow-lg"
            >
              <CheckCircle className="w-7 h-7" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onNavigate("settings")}
              className="w-18 h-18 bg-pink-300 hover:bg-pink-400 border-4 border-pink-600 rounded-3xl text-pink-900 transition-all duration-200 hover:scale-110 transform hover:-rotate-3 shadow-lg"
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
