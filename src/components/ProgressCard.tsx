
import { Button } from "@/components/ui/button";
import { Home, Clock, CheckCircle, User, BarChart3, Settings, Star, Trophy, ArrowLeft, Phone } from "lucide-react";

interface ProgressCardProps {
  onNavigate: (view: string) => void;
}

const ProgressCard = ({ onNavigate }: ProgressCardProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-yellow-50 pb-24 relative overflow-hidden">
      {/* Cartoon Background Elements */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-pink-300 rounded-full opacity-30 animate-bounce" style={{ animationDelay: '0s', animationDuration: '3s' }}></div>
      <div className="absolute top-32 right-16 w-16 h-16 bg-blue-300 rounded-full opacity-30 animate-bounce" style={{ animationDelay: '1s', animationDuration: '4s' }}></div>
      <div className="absolute top-64 left-1/3 w-12 h-12 bg-green-300 rounded-full opacity-30 animate-bounce" style={{ animationDelay: '2s', animationDuration: '5s' }}></div>

      {/* Header */}
      <div className="px-6 pt-8 pb-6 relative">
        <div className="flex items-center justify-between">
          <div
            onClick={() => onNavigate("home")}
            className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-500 rounded-3xl flex items-center justify-center hover:bg-orange-500 transition-all duration-300 cursor-pointer transform hover:scale-110 hover:rotate-12 shadow-[0_8px_0_0_#ea580c] hover:shadow-[0_4px_0_0_#ea580c] hover:translate-y-1 active:shadow-[0_2px_0_0_#ea580c] active:translate-y-2"
          >
            <ArrowLeft className="w-8 h-8 text-white drop-shadow-lg" />
          </div>
          <h1 className="text-4xl font-black text-orange-500 uppercase tracking-wider drop-shadow-lg transform hover:scale-105 transition-all duration-300">
            PROGRESS 🎉
          </h1>
          <div className="w-16 h-16"></div>
        </div>
      </div>

      <div className="px-6 space-y-8">
        {/* Achievement Banner - Super Cartoonish */}
        <div className="bg-gradient-to-br from-green-400 via-green-500 to-green-600 rounded-[2rem] p-8 border-8 border-white shadow-[0_12px_0_0_#16a34a] hover:shadow-[0_6px_0_0_#16a34a] hover:translate-y-2 transition-all duration-300 transform hover:scale-105 relative overflow-hidden">
          {/* Cartoon sparkles */}
          <div className="absolute top-2 right-2 text-3xl animate-spin" style={{ animationDuration: '3s' }}>✨</div>
          <div className="absolute bottom-2 left-2 text-2xl animate-bounce" style={{ animationDelay: '1s' }}>⭐</div>
          
          <div className="flex items-center space-x-6">
            <div className="w-24 h-24 bg-gradient-to-br from-green-600 to-green-700 rounded-[2rem] flex items-center justify-center shadow-[0_8px_0_0_#15803d] transform rotate-12 hover:rotate-0 transition-all duration-500">
              <Trophy className="w-12 h-12 text-yellow-300 drop-shadow-lg animate-pulse" />
            </div>
            <div>
              <h3 className="text-4xl font-black text-white mb-3 uppercase tracking-wide drop-shadow-lg animate-pulse">AWESOME! 🎊</h3>
              <p className="text-white font-bold text-xl drop-shadow-md">Call completed successfully! 🚀</p>
            </div>
          </div>
        </div>

        {/* Stats Grid - Extra Cartoonish */}
        <div className="grid grid-cols-2 gap-8">
          {/* Talk Time - Purple Card with Cartoon Effects */}
          <div className="bg-gradient-to-br from-purple-400 via-purple-500 to-purple-600 rounded-[2rem] p-8 text-center border-8 border-white shadow-[0_10px_0_0_#9333ea] hover:shadow-[0_5px_0_0_#9333ea] hover:translate-y-2 transition-all duration-300 transform hover:scale-105 hover:rotate-3 relative">
            <div className="absolute -top-3 -right-3 text-2xl animate-spin" style={{ animationDuration: '4s' }}>⏰</div>
            <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-purple-700 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-[0_6px_0_0_#7c3aed] transform hover:rotate-12 transition-all duration-300">
              <Clock className="w-10 h-10 text-white drop-shadow-lg" />
            </div>
            <div className="text-5xl font-black text-white mb-3 drop-shadow-lg animate-bounce" style={{ animationDuration: '2s' }}>8min</div>
            <div className="text-base text-white font-black uppercase tracking-wider drop-shadow-md">TALK TIME ⚡</div>
          </div>
          
          {/* Engagement - Pink Card with Cartoon Effects */}
          <div className="bg-gradient-to-br from-pink-400 via-pink-500 to-pink-600 rounded-[2rem] p-8 text-center border-8 border-white shadow-[0_10px_0_0_#ec4899] hover:shadow-[0_5px_0_0_#ec4899] hover:translate-y-2 transition-all duration-300 transform hover:scale-105 hover:rotate-3 relative">
            <div className="absolute -top-3 -left-3 text-2xl animate-pulse">💖</div>
            <div className="w-20 h-20 bg-gradient-to-br from-pink-600 to-pink-700 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-[0_6px_0_0_#db2777] transform hover:rotate-12 transition-all duration-300">
              <Star className="w-10 h-10 text-yellow-300 drop-shadow-lg animate-spin" style={{ animationDuration: '3s' }} />
            </div>
            <div className="text-5xl font-black text-white mb-3 drop-shadow-lg animate-bounce" style={{ animationDuration: '2.5s' }}>89%</div>
            <div className="text-base text-white font-black uppercase tracking-wider drop-shadow-md">ENGAGEMENT 🌟</div>
          </div>
        </div>

        {/* Goose Feedback Card - Ultra Cartoonish */}
        <div className="bg-gradient-to-br from-orange-300 via-orange-400 to-orange-500 rounded-[2rem] p-8 border-8 border-white shadow-[0_12px_0_0_#ea580c] hover:shadow-[0_6px_0_0_#ea580c] hover:translate-y-2 transition-all duration-300 transform hover:scale-105 relative overflow-hidden">
          {/* Cartoon decorations */}
          <div className="absolute top-4 right-4 text-3xl animate-bounce" style={{ animationDelay: '0.5s' }}>💬</div>
          <div className="absolute bottom-4 right-4 text-2xl animate-pulse">🎯</div>
          
          <div className="flex items-center mb-8">
            <span className="text-4xl mr-4 animate-bounce" style={{ animationDuration: '2s' }}>🦆</span>
            <h3 className="text-3xl font-black text-white uppercase tracking-wide drop-shadow-lg">
              GOOSE FEEDBACK 🗨️
            </h3>
          </div>
          
          <div className="bg-white rounded-[2rem] p-8 mb-8 border-6 border-orange-200 shadow-[0_8px_0_0_#fed7aa] hover:shadow-[0_4px_0_0_#fed7aa] hover:translate-y-1 transition-all duration-300 transform hover:scale-105">
            <p className="text-gray-800 font-bold mb-6 text-lg leading-relaxed">
              We've discussed this before, but "meeting" means bumping into someone by chance. 🤔
            </p>
            <p className="text-gray-800 font-bold text-lg leading-relaxed">
              When you've planned to meet, use the phrase "going to meet someone"! 💡
            </p>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-[2rem] flex items-center justify-center border-6 border-white shadow-[0_6px_0_0_#ea580c] transform hover:rotate-12 transition-all duration-300">
              <User className="w-8 h-8 text-white drop-shadow-lg" />
            </div>
            <div className="flex-1">
              <p className="text-gray-800 font-bold text-base mb-4 bg-gray-100 px-6 py-4 rounded-[1.5rem] border-4 border-gray-200 shadow-[0_4px_0_0_#e5e7eb] transform hover:scale-105 transition-all duration-300">
                "We can meet in front of the cinema..." 🎬
              </p>
              <div className="w-full bg-gray-200 h-6 rounded-full border-4 border-gray-300 shadow-[0_4px_0_0_#d1d5db] overflow-hidden">
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 h-full rounded-full w-3/4 border-2 border-orange-600 animate-pulse shadow-inner"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Continue Button - Super Cartoonish */}
        <Button 
          onClick={() => onNavigate("curriculum")}
          className="w-full bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 hover:from-blue-500 hover:via-blue-600 hover:to-blue-700 text-white font-black py-8 text-2xl rounded-[2rem] border-8 border-white shadow-[0_12px_0_0_#2563eb] hover:shadow-[0_6px_0_0_#2563eb] hover:translate-y-2 transition-all duration-300 transform hover:scale-105 relative overflow-hidden"
        >
          <CheckCircle className="w-8 h-8 mr-4 animate-spin" style={{ animationDuration: '3s' }} />
          CONTINUE LEARNING 🚀✨
          <div className="absolute top-2 right-4 text-2xl animate-bounce" style={{ animationDelay: '1s' }}>🎓</div>
        </Button>
      </div>

      {/* Bottom Navigation - Extra Cartoonish */}
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-white via-orange-50 to-white px-6 py-6 border-t-8 border-orange-200 shadow-[0_-8px_0_0_#fed7aa]">
        <div className="max-w-md mx-auto">
          <div className="flex justify-center space-x-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onNavigate("home")}
              className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 rounded-[2rem] text-white border-6 border-white shadow-[0_6px_0_0_#ea580c] hover:shadow-[0_3px_0_0_#ea580c] hover:translate-y-1 transition-all duration-300 transform hover:scale-110 hover:rotate-12"
            >
              <Home className="w-7 h-7 drop-shadow-lg" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onNavigate("activity")}
              className="w-16 h-16 bg-gradient-to-br from-gray-200 to-gray-300 hover:from-gray-300 hover:to-gray-400 rounded-[2rem] text-gray-600 hover:text-gray-700 border-6 border-white shadow-[0_6px_0_0_#9ca3af] hover:shadow-[0_3px_0_0_#9ca3af] hover:translate-y-1 transition-all duration-300 transform hover:scale-110 hover:rotate-12"
            >
              <Phone className="w-7 h-7" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onNavigate("curriculum")}
              className="w-16 h-16 bg-gradient-to-br from-gray-200 to-gray-300 hover:from-gray-300 hover:to-gray-400 rounded-[2rem] text-gray-600 hover:text-gray-700 border-6 border-white shadow-[0_6px_0_0_#9ca3af] hover:shadow-[0_3px_0_0_#9ca3af] hover:translate-y-1 transition-all duration-300 transform hover:scale-110 hover:rotate-12"
            >
              <CheckCircle className="w-7 h-7" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onNavigate("settings")}
              className="w-16 h-16 bg-gradient-to-br from-gray-200 to-gray-300 hover:from-gray-300 hover:to-gray-400 rounded-[2rem] text-gray-600 hover:text-gray-700 border-6 border-white shadow-[0_6px_0_0_#9ca3af] hover:shadow-[0_3px_0_0_#9ca3af] hover:translate-y-1 transition-all duration-300 transform hover:scale-110 hover:rotate-12"
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
