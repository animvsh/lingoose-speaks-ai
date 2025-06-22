
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
    <div className="min-h-screen bg-gray-100 pb-24">
      <div className="px-4 pt-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div
            onClick={() => onNavigate("home")}
            className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center shadow-[0_4px_0_0_#ea580c] hover:shadow-[0_2px_0_0_#ea580c] hover:translate-y-0.5 transition-all duration-100 cursor-pointer active:shadow-[0_1px_0_0_#ea580c] active:translate-y-1"
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-black text-orange-500 uppercase tracking-wider">
            CURRICULUM
          </h1>
          <div className="w-12 h-12"></div>
        </div>
      
        {/* Theme Progress Card */}
        <div className="bg-orange-500 rounded-3xl p-6 mb-6 shadow-[0_8px_0_0_#ea580c] hover:shadow-[0_4px_0_0_#ea580c] hover:translate-y-1 transition-all duration-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-black text-white text-xl uppercase tracking-wide">France Theme - Week 2</h2>
            <span className="text-sm text-white font-black bg-white/30 px-3 py-1 rounded-2xl">3/5 complete</span>
          </div>
          <div className="w-full bg-white/30 h-4 rounded-full">
            <div className="bg-white h-full rounded-full w-3/5"></div>
          </div>
        </div>
        
        {/* Curriculum Items */}
        <div className="space-y-4 mb-6">
          {curriculumItems.map((item, index) => (
            <div key={index} className={`flex items-center space-x-4 p-5 rounded-3xl shadow-[0_6px_0_0_#e5e7eb] hover:shadow-[0_3px_0_0_#e5e7eb] hover:translate-y-0.5 transition-all duration-100 ${
              item.completed 
                ? 'bg-white' 
                : 'bg-gray-200 opacity-70'
            }`}>
              <div className="text-sm font-black text-gray-700 w-12 uppercase tracking-wide bg-gray-100 px-3 py-1 rounded-2xl text-center shadow-[0_2px_0_0_#d1d5db]">{item.date}</div>
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shadow-[0_3px_0_0_${item.completed ? '#16a34a' : '#9ca3af'}] ${
                item.completed ? 'bg-green-500' : 'bg-gray-400'
              }`}>
                <Check className="w-5 h-5 text-white" />
              </div>
              <span className={`font-black flex-1 text-base uppercase tracking-wide ${
                item.completed ? 'text-gray-800' : 'text-gray-500'
              }`}>{item.topic}</span>
            </div>
          ))}
        </div>

        {/* Upcoming Unlocks */}
        <div className="bg-white rounded-3xl p-6 shadow-[0_6px_0_0_#e5e7eb] hover:shadow-[0_3px_0_0_#e5e7eb] hover:translate-y-0.5 transition-all duration-100">
          <h3 className="font-black text-gray-800 mb-4 flex items-center text-xl uppercase tracking-wide">
            <Target className="w-6 h-6 mr-3" />
            Upcoming Unlocks
          </h3>
          {upcomingUnlocks.map((unlock, index) => (
            <div key={index} className="mb-4 last:mb-0">
              <div className="flex justify-between mb-3">
                <span className="text-gray-800 font-black uppercase tracking-wide text-base">{unlock.item}</span>
                <span className="text-gray-700 font-black bg-gray-200 px-3 py-1 rounded-2xl text-sm shadow-[0_2px_0_0_#d1d5db]">{unlock.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 h-4 rounded-full shadow-[0_2px_0_0_#d1d5db]">
                <div 
                  className="bg-orange-500 h-full rounded-full transition-all duration-300 shadow-[0_1px_0_0_#ea580c]"
                  style={{ width: `${unlock.progress}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
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
              className="w-12 h-12 bg-purple-500 rounded-2xl text-white shadow-[0_3px_0_0_#9333ea] border-0"
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

export default CurriculumCard;
