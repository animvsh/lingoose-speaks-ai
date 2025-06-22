
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 pb-24">
      <div className="px-6 pt-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div
            onClick={() => onNavigate("home")}
            className="w-16 h-16 bg-orange-500 hover:bg-orange-600 rounded-full flex items-center justify-center shadow-[0_8px_0_0_#ea580c] hover:shadow-[0_4px_0_0_#ea580c] hover:translate-y-1 transition-all duration-150 cursor-pointer active:shadow-[0_2px_0_0_#ea580c] active:translate-y-2"
          >
            <ArrowLeft className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-3xl font-black text-orange-600 uppercase tracking-wider drop-shadow-md">
            CURRICULUM
          </h1>
          <div className="w-16 h-16"></div>
        </div>
      
        {/* Theme Progress Card */}
        <div className="bg-gradient-to-br from-orange-400 to-orange-500 rounded-[2rem] p-8 mb-8 shadow-[0_12px_0_0_#ea580c] border-4 border-orange-600">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-black text-white text-2xl uppercase tracking-wider drop-shadow-lg">France Theme - Week 2</h2>
            <span className="text-sm text-white font-black bg-white/30 px-4 py-2 rounded-2xl border-2 border-white/50 shadow-[0_4px_0_0_rgba(255,255,255,0.3)]">3/5 complete</span>
          </div>
          <div className="w-full bg-white/30 h-5 rounded-full border-2 border-white/50 shadow-[0_4px_0_0_rgba(255,255,255,0.3)]">
            <div className="bg-white h-full rounded-full w-3/5 border-2 border-white/80 shadow-[0_2px_0_0_rgba(255,255,255,0.5)]"></div>
          </div>
        </div>
        
        {/* Curriculum Items */}
        <div className="space-y-6 mb-8">
          {curriculumItems.map((item, index) => (
            <div key={index} className={`flex items-center space-x-6 p-8 rounded-[2rem] shadow-[0_10px_0_0_#e5e7eb] border-4 border-gray-200 transition-all duration-300 ${
              item.completed 
                ? 'bg-white' 
                : 'bg-gray-100 opacity-70'
            }`}>
              <div className="text-sm font-black text-gray-700 w-16 uppercase tracking-wider bg-gray-200 px-4 py-2 rounded-2xl text-center border-2 border-gray-300 shadow-[0_4px_0_0_#d1d5db]">{item.date}</div>
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-[0_6px_0_0_${item.completed ? '#16a34a' : '#9ca3af'}] border-3 ${
                item.completed ? 'bg-green-500 border-green-600' : 'bg-gray-400 border-gray-500'
              }`}>
                <Check className="w-7 h-7 text-white" />
              </div>
              <span className={`font-black flex-1 text-xl uppercase tracking-wider drop-shadow-sm ${
                item.completed ? 'text-gray-800' : 'text-gray-500'
              }`}>{item.topic}</span>
            </div>
          ))}
        </div>

        {/* Upcoming Unlocks */}
        <div className="bg-white rounded-[2rem] p-8 shadow-[0_12px_0_0_#e5e7eb] border-4 border-gray-200">
          <h3 className="font-black text-gray-800 mb-6 flex items-center text-2xl uppercase tracking-wider drop-shadow-sm">
            <Target className="w-8 h-8 mr-4" />
            Upcoming Unlocks
          </h3>
          {upcomingUnlocks.map((unlock, index) => (
            <div key={index} className="mb-6 last:mb-0">
              <div className="flex justify-between mb-4">
                <span className="text-gray-800 font-black uppercase tracking-wider text-lg">{unlock.item}</span>
                <span className="text-gray-700 font-black bg-gray-200 px-4 py-2 rounded-2xl text-base border-2 border-gray-300 shadow-[0_4px_0_0_#d1d5db]">{unlock.progress}%</span>
              </div>
              <div className="w-full bg-gray-300 h-5 rounded-full border-2 border-gray-400 shadow-[0_4px_0_0_#d1d5db]">
                <div 
                  className="bg-orange-500 h-full rounded-full transition-all duration-300 border-2 border-orange-600 shadow-[0_2px_0_0_#ea580c]"
                  style={{ width: `${unlock.progress}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
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
              className="w-16 h-16 bg-purple-500 rounded-2xl text-white shadow-[0_4px_0_0_#9333ea] border-2 border-purple-600"
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

export default CurriculumCard;
