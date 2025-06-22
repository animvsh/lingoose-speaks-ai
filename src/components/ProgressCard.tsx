
import { Button } from "@/components/ui/button";
import { Home, Clock, CheckCircle, User, BarChart3, Settings, Star, Trophy, ArrowLeft, Phone } from "lucide-react";

interface ProgressCardProps {
  onNavigate: (view: string) => void;
}

const ProgressCard = ({ onNavigate }: ProgressCardProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 pb-24">
      {/* Header */}
      <div className="px-6 pt-8 mb-10">
        <div className="flex items-center justify-between">
          <div
            onClick={() => onNavigate("home")}
            className="w-16 h-16 bg-orange-500 hover:bg-orange-600 rounded-full flex items-center justify-center shadow-[0_8px_0_0_#ea580c] hover:shadow-[0_4px_0_0_#ea580c] hover:translate-y-1 transition-all duration-150 cursor-pointer active:shadow-[0_2px_0_0_#ea580c] active:translate-y-2"
          >
            <ArrowLeft className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-3xl font-black text-orange-600 uppercase tracking-wider drop-shadow-md">
            PROGRESS
          </h1>
          <div className="w-16 h-16"></div>
        </div>
      </div>

      <div className="px-6 space-y-8">
        {/* Achievement Banner */}
        <div className="bg-white rounded-[2rem] p-8 shadow-[0_12px_0_0_#e5e7eb] border-4 border-gray-200">
          <div className="flex items-center space-x-6">
            <div className="w-20 h-20 bg-green-500 rounded-3xl flex items-center justify-center shadow-[0_8px_0_0_#16a34a] border-4 border-green-600">
              <Trophy className="w-10 h-10 text-white" />
            </div>
            <div>
              <h3 className="text-3xl font-black text-gray-800 mb-2 uppercase tracking-wider drop-shadow-sm">AWESOME!</h3>
              <p className="text-gray-700 font-bold text-lg">Call completed successfully!</p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-white rounded-[2rem] p-8 text-center shadow-[0_12px_0_0_#e5e7eb] border-4 border-gray-200">
            <div className="w-20 h-20 bg-purple-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-[0_8px_0_0_#9333ea] border-4 border-purple-600">
              <Clock className="w-10 h-10 text-white" />
            </div>
            <div className="text-4xl font-black text-gray-800 mb-3 drop-shadow-sm">8min</div>
            <div className="text-sm text-gray-600 font-black uppercase tracking-wider">TALK TIME</div>
          </div>
          
          <div className="bg-white rounded-[2rem] p-8 text-center shadow-[0_12px_0_0_#e5e7eb] border-4 border-gray-200">
            <div className="w-20 h-20 bg-pink-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-[0_8px_0_0_#ec4899] border-4 border-pink-600">
              <Star className="w-10 h-10 text-white" />
            </div>
            <div className="text-4xl font-black text-gray-800 mb-3 drop-shadow-sm">89%</div>
            <div className="text-sm text-gray-600 font-black uppercase tracking-wider">ENGAGEMENT</div>
          </div>
        </div>

        {/* Goose Feedback Card */}
        <div className="bg-white rounded-[2rem] p-8 shadow-[0_12px_0_0_#e5e7eb] border-4 border-gray-200">
          <h3 className="text-2xl font-black text-gray-800 mb-6 uppercase tracking-wider flex items-center drop-shadow-sm">
            🦆 GOOSE FEEDBACK
          </h3>
          
          <div className="bg-yellow-100 rounded-[1.5rem] p-6 mb-6 border-3 border-yellow-200 shadow-[0_6px_0_0_#fbbf24]">
            <p className="text-gray-800 font-bold mb-4 text-lg">
              We've discussed this before, but "meeting" means bumping into someone by chance.
            </p>
            <p className="text-gray-800 font-bold text-lg">
              When you've planned to meet, use the phrase "going to meet someone"!
            </p>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="w-18 h-18 bg-orange-500 rounded-3xl flex items-center justify-center shadow-[0_6px_0_0_#ea580c] border-3 border-orange-600">
              <User className="w-9 h-9 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-gray-800 font-bold text-base mb-4 bg-gray-200 px-6 py-3 rounded-2xl border-2 border-gray-300 shadow-[0_4px_0_0_#d1d5db]">"We can meet in front of the cinema..."</p>
              <div className="w-full bg-gray-300 h-4 rounded-full border-2 border-gray-400 shadow-[0_4px_0_0_#d1d5db]">
                <div className="bg-orange-500 h-full rounded-full w-3/4 border-2 border-orange-600 shadow-[0_2px_0_0_#ea580c]"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Continue Button */}
        <Button 
          onClick={() => onNavigate("curriculum")}
          className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-black py-8 text-2xl rounded-[2rem] shadow-[0_8px_0_0_#2563eb] hover:shadow-[0_4px_0_0_#2563eb] hover:translate-y-1 active:shadow-[0_2px_0_0_#2563eb] active:translate-y-2 transition-all duration-150 border-4 border-blue-700"
        >
          <CheckCircle className="w-8 h-8 mr-4" />
          CONTINUE LEARNING
        </Button>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white px-6 py-6 shadow-[0_-8px_32px_rgba(0,0,0,0.1)] border-t-4 border-gray-200">
        <div className="max-w-md mx-auto">
          <div className="flex justify-center space-x-6">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onNavigate("home")}
              className="w-16 h-16 bg-gray-200 hover:bg-gray-300 rounded-2xl text-gray-600 transition-all duration-150 shadow-[0_4px_0_0_#9ca3af] hover:shadow-[0_2px_0_0_#9ca3af] hover:translate-y-0.5 border-2 border-gray-300"
            >
              <Home className="w-7 h-7" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onNavigate("activity")}
              className="w-16 h-16 bg-gray-200 hover:bg-gray-300 rounded-2xl text-gray-600 transition-all duration-150 shadow-[0_4px_0_0_#9ca3af] hover:shadow-[0_2px_0_0_#9ca3af] hover:translate-y-0.5 border-2 border-gray-300"
            >
              <Phone className="w-7 h-7" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onNavigate("curriculum")}
              className="w-16 h-16 bg-gray-200 hover:bg-gray-300 rounded-2xl text-gray-600 transition-all duration-150 shadow-[0_4px_0_0_#9ca3af] hover:shadow-[0_2px_0_0_#9ca3af] hover:translate-y-0.5 border-2 border-gray-300"
            >
              <CheckCircle className="w-7 h-7" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onNavigate("settings")}
              className="w-16 h-16 bg-gray-200 hover:bg-gray-300 rounded-2xl text-gray-600 transition-all duration-150 shadow-[0_4px_0_0_#9ca3af] hover:shadow-[0_2px_0_0_#9ca3af] hover:translate-y-0.5 border-2 border-gray-300"
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
