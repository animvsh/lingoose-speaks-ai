
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
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="px-4 pt-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button
            onClick={() => onNavigate("home")}
            className="w-14 h-14 bg-orange-500 hover:bg-orange-600 rounded-full text-white shadow-lg transition-all duration-200"
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <h1 className="text-3xl font-black text-orange-500 uppercase tracking-wide">
            CURRICULUM
          </h1>
          <div className="w-14 h-14"></div>
        </div>
      
        {/* Theme Progress Card */}
        <div className="bg-orange-500 rounded-3xl p-6 mb-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-black text-white text-xl uppercase tracking-wide">France Theme - Week 2</h2>
            <span className="text-sm text-white font-semibold bg-white/20 px-3 py-1 rounded-full">3/5 complete</span>
          </div>
          <div className="w-full bg-white/20 h-3 rounded-full">
            <div className="bg-white h-full rounded-full w-3/5 shadow-sm"></div>
          </div>
        </div>
        
        {/* Curriculum Items */}
        <div className="space-y-4 mb-6">
          {curriculumItems.map((item, index) => (
            <div key={index} className={`flex items-center space-x-4 p-6 rounded-3xl shadow-lg transition-all duration-300 ${
              item.completed 
                ? 'bg-white border border-gray-100' 
                : 'bg-white border border-gray-100 opacity-60'
            }`}>
              <div className="text-sm font-bold text-gray-600 w-12 uppercase tracking-wide bg-gray-100 px-2 py-1 rounded-full text-center">{item.date}</div>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md ${
                item.completed ? 'bg-green-500' : 'bg-gray-300'
              }`}>
                <Check className="w-5 h-5 text-white" />
              </div>
              <span className={`font-bold flex-1 text-lg uppercase tracking-wide ${
                item.completed ? 'text-gray-800' : 'text-gray-500'
              }`}>{item.topic}</span>
            </div>
          ))}
        </div>

        {/* Upcoming Unlocks */}
        <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100">
          <h3 className="font-black text-gray-800 mb-4 flex items-center text-xl uppercase tracking-wide">
            <Target className="w-6 h-6 mr-3" />
            Upcoming Unlocks
          </h3>
          {upcomingUnlocks.map((unlock, index) => (
            <div key={index} className="mb-4 last:mb-0">
              <div className="flex justify-between mb-2">
                <span className="text-gray-700 font-bold uppercase tracking-wide">{unlock.item}</span>
                <span className="text-gray-600 font-semibold bg-gray-100 px-3 py-1 rounded-full text-sm">{unlock.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 h-3 rounded-full">
                <div 
                  className="bg-orange-500 h-full rounded-full transition-all duration-300"
                  style={{ width: `${unlock.progress}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white px-4 py-4 shadow-lg border-t border-gray-200">
        <div className="max-w-md mx-auto">
          <div className="flex justify-center space-x-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onNavigate("home")}
              className="w-14 h-14 bg-gray-100 hover:bg-gray-200 rounded-2xl text-gray-600 transition-all duration-200 shadow-md"
            >
              <Home className="w-6 h-6" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onNavigate("activity")}
              className="w-14 h-14 bg-gray-100 hover:bg-gray-200 rounded-2xl text-gray-600 transition-all duration-200 shadow-md"
            >
              <Phone className="w-6 h-6" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onNavigate("curriculum")}
              className="w-14 h-14 bg-purple-500 rounded-2xl text-white shadow-md"
            >
              <CheckCircle className="w-6 h-6" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onNavigate("settings")}
              className="w-14 h-14 bg-gray-100 hover:bg-gray-200 rounded-2xl text-gray-600 transition-all duration-200 shadow-md"
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
