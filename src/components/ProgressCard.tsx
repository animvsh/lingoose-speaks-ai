
import { Button } from "@/components/ui/button";
import { Home, Clock, CheckCircle, User, BarChart3, Settings, Star, Trophy, ArrowLeft, Phone } from "lucide-react";

interface ProgressCardProps {
  onNavigate: (view: string) => void;
}

const ProgressCard = ({ onNavigate }: ProgressCardProps) => {
  return (
    <div className="min-h-screen bg-gray-100 pb-24">
      {/* Header */}
      <div className="px-4 pt-8 mb-8">
        <div className="flex items-center justify-between">
          <div
            onClick={() => onNavigate("home")}
            className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center shadow-[0_4px_0_0_#ea580c] hover:shadow-[0_2px_0_0_#ea580c] hover:translate-y-0.5 transition-all duration-100 cursor-pointer active:shadow-[0_1px_0_0_#ea580c] active:translate-y-1"
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-black text-orange-500 uppercase tracking-wider">
            PROGRESS
          </h1>
          <div className="w-12 h-12"></div>
        </div>
      </div>

      <div className="px-4 space-y-6">
        {/* Achievement Banner */}
        <div className="bg-white rounded-3xl p-6 shadow-[0_6px_0_0_#e5e7eb] hover:shadow-[0_3px_0_0_#e5e7eb] hover:translate-y-0.5 transition-all duration-100">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-green-500 rounded-3xl flex items-center justify-center shadow-[0_4px_0_0_#16a34a]">
              <Trophy className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-gray-800 mb-1 uppercase tracking-wide">AWESOME!</h3>
              <p className="text-gray-700 font-bold text-base">Call completed successfully!</p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-3xl p-6 text-center shadow-[0_6px_0_0_#e5e7eb] hover:shadow-[0_3px_0_0_#e5e7eb] hover:translate-y-0.5 transition-all duration-100">
            <div className="w-16 h-16 bg-purple-500 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-[0_4px_0_0_#9333ea]">
              <Clock className="w-8 h-8 text-white" />
            </div>
            <div className="text-3xl font-black text-gray-800 mb-2">8min</div>
            <div className="text-xs text-gray-600 font-black uppercase tracking-wider">TALK TIME</div>
          </div>
          
          <div className="bg-white rounded-3xl p-6 text-center shadow-[0_6px_0_0_#e5e7eb] hover:shadow-[0_3px_0_0_#e5e7eb] hover:translate-y-0.5 transition-all duration-100">
            <div className="w-16 h-16 bg-pink-500 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-[0_4px_0_0_#ec4899]">
              <Star className="w-8 h-8 text-white" />
            </div>
            <div className="text-3xl font-black text-gray-800 mb-2">89%</div>
            <div className="text-xs text-gray-600 font-black uppercase tracking-wider">ENGAGEMENT</div>
          </div>
        </div>

        {/* Goose Feedback Card */}
        <div className="bg-white rounded-3xl p-6 shadow-[0_6px_0_0_#e5e7eb] hover:shadow-[0_3px_0_0_#e5e7eb] hover:translate-y-0.5 transition-all duration-100">
          <h3 className="text-xl font-black text-gray-800 mb-4 uppercase tracking-wide flex items-center">
            🦆 GOOSE FEEDBACK
          </h3>
          
          <div className="bg-yellow-200 rounded-3xl p-5 mb-4 shadow-[0_3px_0_0_#fbbf24]">
            <p className="text-gray-800 font-bold mb-3 text-base">
              We've discussed this before, but "meeting" means bumping into someone by chance.
            </p>
            <p className="text-gray-800 font-bold text-base">
              When you've planned to meet, use the phrase "going to meet someone"!
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 bg-orange-500 rounded-3xl flex items-center justify-center shadow-[0_3px_0_0_#ea580c]">
              <User className="w-7 h-7 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-gray-800 font-bold text-sm mb-3 bg-gray-200 px-4 py-2 rounded-2xl shadow-[0_2px_0_0_#d1d5db]">"We can meet in front of the cinema..."</p>
              <div className="w-full bg-gray-200 h-3 rounded-full shadow-[0_2px_0_0_#d1d5db]">
                <div className="bg-orange-500 h-full rounded-full w-3/4 shadow-[0_1px_0_0_#ea580c]"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Continue Button */}
        <Button 
          onClick={() => onNavigate("curriculum")}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-black py-6 text-xl rounded-3xl shadow-[0_6px_0_0_#2563eb] hover:shadow-[0_3px_0_0_#2563eb] hover:translate-y-0.5 active:shadow-[0_1px_0_0_#2563eb] active:translate-y-1 transition-all duration-100 border-0"
        >
          <CheckCircle className="w-6 h-6 mr-3" />
          CONTINUE LEARNING
        </Button>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white px-4 py-4 shadow-[0_-4px_0_0_#e5e7eb]">
        <div className="max-w-md mx-auto">
          <div className="flex justify-center space-x-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onNavigate("home")}
              className="w-12 h-12 bg-gray-200 hover:bg-gray-300 rounded-2xl text-gray-600 transition-all duration-100 shadow-[0_3px_0_0_#9ca3af] hover:shadow-[0_1px_0_0_#9ca3af] hover:translate-y-0.5 border-0"
            >
              <Home className="w-5 h-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onNavigate("activity")}
              className="w-12 h-12 bg-gray-200 hover:bg-gray-300 rounded-2xl text-gray-600 transition-all duration-100 shadow-[0_3px_0_0_#9ca3af] hover:shadow-[0_1px_0_0_#9ca3af] hover:translate-y-0.5 border-0"
            >
              <Phone className="w-5 h-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onNavigate("curriculum")}
              className="w-12 h-12 bg-gray-200 hover:bg-gray-300 rounded-2xl text-gray-600 transition-all duration-100 shadow-[0_3px_0_0_#9ca3af] hover:shadow-[0_1px_0_0_#9ca3af] hover:translate-y-0.5 border-0"
            >
              <CheckCircle className="w-5 h-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onNavigate("settings")}
              className="w-12 h-12 bg-gray-200 hover:bg-gray-300 rounded-2xl text-gray-600 transition-all duration-100 shadow-[0_3px_0_0_#9ca3af] hover:shadow-[0_1px_0_0_#9ca3af] hover:translate-y-0.5 border-0"
            >
              <Settings className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressCard;
