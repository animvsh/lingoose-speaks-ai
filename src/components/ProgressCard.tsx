import { Button } from "@/components/ui/button";
import { Home, Clock, CheckCircle, User, BarChart3, Settings, Star, Trophy, ArrowLeft, Phone } from "lucide-react";

interface ProgressCardProps {
  onNavigate: (view: string) => void;
}

const ProgressCard = ({ onNavigate }: ProgressCardProps) => {
  return (
    <div className="min-h-screen bg-[#F5F2E8] pb-24">
      {/* Header */}
      <div className="bg-orange-400 rounded-b-[2rem] px-6 py-8 mb-6">
        <div className="flex items-center justify-between">
          <Button
            onClick={() => onNavigate("home")}
            className="w-12 h-12 bg-orange-500 hover:bg-orange-600 border-3 border-orange-600 rounded-xl text-white transition-all duration-200 hover:scale-110 transform hover:-rotate-3"
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <h1 className="text-4xl font-black text-white uppercase tracking-wider">
            TODAY'S PROGRESS
          </h1>
          <div className="w-12 h-12"></div>
        </div>
      </div>

      <div className="px-6 space-y-6">
        {/* Achievement Banner */}
        <div className="bg-gradient-to-r from-green-400 to-green-500 rounded-[1.5rem] p-6 border-4 border-green-600 transform hover:rotate-1 transition-transform">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-green-600 rounded-xl flex items-center justify-center border-3 border-green-700">
              <Trophy className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-3xl font-black text-white mb-2 uppercase tracking-wide">AWESOME!</h3>
              <p className="text-green-100 font-bold text-lg">Call completed successfully!</p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-purple-400 to-purple-500 rounded-[1.5rem] p-6 border-4 border-purple-600 text-center transform hover:scale-105 transition-transform">
            <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center mx-auto mb-3 border-2 border-purple-700">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <div className="text-4xl font-black text-white">8min</div>
            <div className="text-sm text-purple-100 font-bold uppercase tracking-wide">TALK TIME</div>
          </div>
          
          <div className="bg-gradient-to-br from-pink-400 to-pink-500 rounded-[1.5rem] p-6 border-4 border-pink-600 text-center transform hover:scale-105 transition-transform">
            <div className="w-12 h-12 bg-pink-600 rounded-xl flex items-center justify-center mx-auto mb-3 border-2 border-pink-700">
              <Star className="w-6 h-6 text-white" />
            </div>
            <div className="text-4xl font-black text-white">89%</div>
            <div className="text-sm text-pink-100 font-bold uppercase tracking-wide">ENGAGEMENT</div>
          </div>
        </div>

        {/* Goose Feedback Card */}
        <div className="bg-gradient-to-r from-orange-300 to-orange-400 rounded-[1.5rem] p-6 border-4 border-orange-500 transform hover:-rotate-1 transition-transform">
          <h3 className="text-2xl font-black text-orange-800 mb-4 uppercase tracking-wide flex items-center">
            🦆 GOOSE FEEDBACK
          </h3>
          
          <div className="bg-white rounded-xl p-4 mb-4 border-3 border-orange-400">
            <p className="text-orange-800 font-bold text-sm mb-3">
              We've discussed this before, but "meeting" means bumping into someone by chance.
            </p>
            <p className="text-orange-800 font-bold text-sm">
              When you've planned to meet, use the phrase "going to meet someone"!
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-orange-600 rounded-xl flex items-center justify-center border-2 border-orange-700">
              <User className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-orange-800 font-bold text-sm mb-2">"We can meet in front of the cinema..."</p>
              <div className="w-full bg-orange-200 h-3 rounded-full border-2 border-orange-300">
                <div className="bg-orange-600 h-full rounded-full w-3/4"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Continue Button */}
        <div className="bg-gradient-to-r from-blue-400 to-blue-500 rounded-[1.5rem] p-4 border-4 border-blue-600 transform hover:scale-[1.02] transition-transform">
          <Button 
            onClick={() => onNavigate("curriculum")}
            className="w-full bg-transparent hover:bg-blue-600/20 text-white font-black py-4 text-lg border-0"
          >
            <CheckCircle className="w-6 h-6 mr-3" />
            CONTINUE LEARNING
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProgressCard;
