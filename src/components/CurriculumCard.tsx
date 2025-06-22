
import { Button } from "@/components/ui/button";
import { Home, Clock, CheckCircle, Check, BarChart3, Settings, Calendar, Target, ArrowLeft, Phone } from "lucide-react";
import DuckMascot from "./DuckMascot";

interface CurriculumCardProps {
  onNavigate: (view: string) => void;
}

const CurriculumCard = ({ onNavigate }: CurriculumCardProps) => {
  const curriculumItems = [
    { topic: "Room & board vocabulary", completed: true, date: "Mon" },
    { topic: "Telling the time", completed: true, date: "Tue" },
    { topic: "Reflexives", completed: true, date: "Wed" },
    { topic: "Future tense", completed: false, date: "Thu" },
    { topic: "Subjunctive mood", completed: false, date: "Fri" }
  ];

  const upcomingUnlocks = [
    { item: "Goth Goose Skin", progress: 75 },
    { item: "Advanced Grammar Mode", progress: 40 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 pb-24 relative overflow-hidden">
      {/* Cartoon Background Elements */}
      <div className="absolute top-12 left-6 w-20 h-20 bg-purple-300 rounded-full opacity-30 animate-bounce" style={{ animationDelay: '0s', animationDuration: '3s' }}></div>
      <div className="absolute top-32 right-8 w-16 h-16 bg-pink-300 rounded-full opacity-30 animate-bounce" style={{ animationDelay: '1s', animationDuration: '4s' }}></div>
      <div className="absolute top-64 left-1/3 w-12 h-12 bg-blue-300 rounded-full opacity-30 animate-bounce" style={{ animationDelay: '2s', animationDuration: '5s' }}></div>

      <div className="px-6 pt-8">
        {/* Header - Ultra Cartoonish */}
        <div className="flex items-center justify-between mb-10">
          <div
            onClick={() => onNavigate("home")}
            className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-[2rem] flex items-center justify-center shadow-[0_8px_0_0_#ea580c] hover:shadow-[0_4px_0_0_#ea580c] hover:translate-y-2 transition-all duration-300 cursor-pointer active:shadow-[0_2px_0_0_#ea580c] active:translate-y-3 transform hover:scale-110 hover:rotate-12"
          >
            <ArrowLeft className="w-8 h-8 text-white drop-shadow-lg" />
          </div>
          <h1 className="text-3xl font-black text-orange-500 uppercase tracking-wider drop-shadow-lg transform hover:scale-105 transition-all duration-300">
            CURRICULUM 📚
          </h1>
          <div className="w-16 h-16"></div>
        </div>
      
        {/* Theme Progress Card - Super Cartoonish */}
        <div className="bg-gradient-to-br from-orange-500 via-orange-600 to-red-500 rounded-[2rem] p-8 mb-8 shadow-[0_12px_0_0_#ea580c] hover:shadow-[0_6px_0_0_#ea580c] hover:translate-y-2 transition-all duration-300 transform hover:scale-105 border-8 border-white relative overflow-hidden">
          <div className="absolute top-4 right-4 text-3xl animate-spin" style={{ animationDuration: '4s' }}>🇫🇷</div>
          <div className="absolute bottom-4 left-4 text-2xl animate-bounce">✨</div>
          
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-black text-white text-2xl uppercase tracking-wide drop-shadow-lg">France Theme - Week 2 🗼</h2>
            <span className="text-lg text-white font-black bg-white/30 px-6 py-3 rounded-[2rem] shadow-[0_4px_0_0_rgba(255,255,255,0.2)] border-4 border-white/50">3/5 complete ⭐</span>
          </div>
          <div className="w-full bg-white/30 h-6 rounded-full border-4 border-white/50 overflow-hidden shadow-inner">
            <div className="bg-white h-full rounded-full w-3/5 animate-pulse shadow-[0_2px_0_0_rgba(255,255,255,0.5)]"></div>
          </div>
        </div>
        
        {/* Curriculum Items - Extra Cartoonish */}
        <div className="space-y-6 mb-8">
          {curriculumItems.map((item, index) => (
            <div key={index} className={`flex items-center space-x-6 p-6 rounded-[2rem] shadow-[0_8px_0_0_#e5e7eb] hover:shadow-[0_4px_0_0_#e5e7eb] hover:translate-y-1 transition-all duration-300 transform hover:scale-105 border-6 border-white ${
              item.completed 
                ? 'bg-gradient-to-r from-white to-green-50' 
                : 'bg-gradient-to-r from-gray-200 to-gray-300 opacity-70'
            }`}>
              <div className="text-base font-black text-gray-700 w-16 uppercase tracking-wide bg-gradient-to-r from-gray-100 to-gray-200 px-4 py-3 rounded-[2rem] text-center shadow-[0_4px_0_0_#d1d5db] border-4 border-white transform hover:rotate-12 transition-all duration-300">{item.date}</div>
              <div className={`w-12 h-12 rounded-[2rem] flex items-center justify-center shadow-[0_6px_0_0_${item.completed ? '#16a34a' : '#9ca3af'}] border-4 border-white transform hover:rotate-12 transition-all duration-300 ${
                item.completed ? 'bg-gradient-to-br from-green-500 to-green-600 animate-pulse' : 'bg-gradient-to-br from-gray-400 to-gray-500'
              }`}>
                <Check className="w-6 h-6 text-white drop-shadow-lg" />
              </div>
              <span className={`font-black flex-1 text-lg uppercase tracking-wide drop-shadow-sm ${
                item.completed ? 'text-gray-800' : 'text-gray-500'
              }`}>{item.topic} {item.completed ? '✅' : '⏳'}</span>
            </div>
          ))}
        </div>

        {/* Upcoming Unlocks - Super Cartoonish */}
        <div className="bg-white rounded-[2rem] p-8 shadow-[0_10px_0_0_#e5e7eb] hover:shadow-[0_5px_0_0_#e5e7eb] hover:translate-y-2 transition-all duration-300 transform hover:scale-105 border-6 border-purple-200 relative overflow-hidden">
          <div className="absolute top-4 right-4 text-2xl animate-pulse">🎁</div>
          <div className="absolute bottom-4 left-4 text-2xl animate-bounce" style={{ animationDelay: '1s' }}>🔓</div>
          
          <h3 className="font-black text-gray-800 mb-6 flex items-center text-2xl uppercase tracking-wide drop-shadow-sm">
            <Target className="w-8 h-8 mr-4 animate-spin" style={{ animationDuration: '3s' }} />
            Upcoming Unlocks 🚀
          </h3>
          {upcomingUnlocks.map((unlock, index) => (
            <div key={index} className="mb-6 last:mb-0">
              <div className="flex justify-between mb-4">
                <span className="text-gray-800 font-black uppercase tracking-wide text-lg drop-shadow-sm">{unlock.item} 🎯</span>
                <span className="text-gray-700 font-black bg-gradient-to-r from-gray-200 to-gray-300 px-6 py-3 rounded-[2rem] text-base shadow-[0_4px_0_0_#d1d5db] border-4 border-white transform hover:scale-110 transition-all duration-300">{unlock.progress}% ⚡</span>
              </div>
              <div className="w-full bg-gradient-to-r from-gray-200 to-gray-300 h-6 rounded-full shadow-[0_4px_0_0_#d1d5db] border-4 border-gray-300 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-orange-500 to-orange-600 h-full rounded-full transition-all duration-700 shadow-[0_2px_0_0_#ea580c] animate-pulse"
                  style={{ width: `${unlock.progress}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Navigation - Extra Cartoonish */}
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-white via-purple-50 to-white px-6 py-6 border-t-8 border-purple-200 shadow-[0_-8px_0_0_#e9d5ff]">
        <div className="max-w-md mx-auto">
          <div className="flex justify-center space-x-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onNavigate("home")}
              className="w-16 h-16 bg-gradient-to-br from-gray-200 to-gray-300 hover:from-gray-300 hover:to-gray-400 rounded-[2rem] text-gray-600 transition-all duration-300 shadow-[0_6px_0_0_#9ca3af] hover:shadow-[0_3px_0_0_#9ca3af] hover:translate-y-1 border-6 border-white transform hover:scale-110 hover:rotate-12"
            >
              <Home className="w-6 h-6" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onNavigate("activity")}
              className="w-16 h-16 bg-gradient-to-br from-gray-200 to-gray-300 hover:from-gray-300 hover:to-gray-400 rounded-[2rem] text-gray-600 transition-all duration-300 shadow-[0_6px_0_0_#9ca3af] hover:shadow-[0_3px_0_0_#9ca3af] hover:translate-y-1 border-6 border-white transform hover:scale-110 hover:rotate-12"
            >
              <Phone className="w-6 h-6" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onNavigate("curriculum")}
              className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-[2rem] text-white shadow-[0_6px_0_0_#9333ea] border-6 border-white transform scale-110"
            >
              <CheckCircle className="w-6 h-6 drop-shadow-lg" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onNavigate("settings")}
              className="w-16 h-16 bg-gradient-to-br from-gray-200 to-gray-300 hover:from-gray-300 hover:to-gray-400 rounded-[2rem] text-gray-600 transition-all duration-300 shadow-[0_6px_0_0_#9ca3af] hover:shadow-[0_3px_0_0_#9ca3af] hover:translate-y-1 border-6 border-white transform hover:scale-110 hover:rotate-12"
            >
              <Settings className="w-6 h-6" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurriculumCard;
