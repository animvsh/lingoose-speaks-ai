
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
    <div className="min-h-screen bg-[#FEFEFE]">
      <div className="px-4 pt-6">
        {/* Header with Back Button */}
        <div className="flex items-center justify-between mb-6">
          <Button
            onClick={() => onNavigate("home")}
            className="w-14 h-14 bg-orange-400 hover:bg-orange-500 border-4 border-orange-600 rounded-3xl text-white transition-colors duration-200"
          >
            <ArrowLeft className="w-7 h-7" />
          </Button>
          <h1 className="text-4xl font-black text-orange-600 uppercase tracking-wider">
            Curriculum
          </h1>
          <div className="w-14 h-14"></div> {/* Spacer */}
        </div>
      
        <div className="bg-gradient-to-r from-orange-300 to-orange-400 border-4 border-orange-600 p-6 rounded-[2rem] mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-black text-orange-900 text-2xl uppercase tracking-wide">France Theme - Week 2</h2>
            <span className="text-sm text-orange-800 font-bold bg-orange-100 px-4 py-2 rounded-full border-3 border-orange-400">3/5 complete</span>
          </div>
          <div className="w-full bg-orange-200 h-5 rounded-full border-3 border-orange-400">
            <div className="bg-gradient-to-r from-orange-600 to-orange-700 h-full rounded-full w-3/5 border-r-2 border-orange-800"></div>
          </div>
        </div>
        
        <div className="space-y-4 mb-8">
          {curriculumItems.map((item, index) => (
            <div key={index} className={`flex items-center space-x-4 p-6 rounded-[2rem] border-4 ${
              item.completed 
                ? 'bg-gradient-to-r from-green-300 to-green-400 border-green-600' 
                : 'bg-gradient-to-r from-slate-300 to-slate-400 border-slate-600'
            } transition-colors duration-200`}>
              <div className="text-sm font-black text-slate-800 w-16 uppercase tracking-wide bg-white px-3 py-2 rounded-full border-2 border-slate-400">{item.date}</div>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 ${
                item.completed ? 'bg-green-600 border-green-800' : 'bg-slate-500 border-slate-700'
              }`}>
                <Check className="w-6 h-6 text-white" />
              </div>
              <span className={`font-black flex-1 text-xl uppercase tracking-wide ${
                item.completed ? 'text-green-900' : 'text-slate-700'
              }`}>{item.topic}</span>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-r from-slate-300 to-slate-400 border-4 border-slate-600 p-6 rounded-[2rem] mb-8">
          <h3 className="font-black text-slate-900 mb-4 flex items-center text-2xl uppercase tracking-wide">
            <Target className="w-8 h-8 mr-3" />
            Upcoming Unlocks
          </h3>
          {upcomingUnlocks.map((unlock, index) => (
            <div key={index} className="mb-4 last:mb-0">
              <div className="flex justify-between text-lg mb-2">
                <span className="text-slate-800 font-black uppercase tracking-wide">{unlock.item}</span>
                <span className="text-slate-700 font-bold bg-slate-100 px-4 py-2 rounded-full border-3 border-slate-400">{unlock.progress}%</span>
              </div>
              <div className="w-full bg-slate-200 h-4 rounded-full border-3 border-slate-400">
                <div 
                  className="bg-gradient-to-r from-orange-500 to-orange-600 h-full rounded-full transition-all duration-300 border-r-2 border-orange-700"
                  style={{ width: `${unlock.progress}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Navigation - Fixed to show all 4 buttons */}
      <div className="bg-white border-t-6 border-slate-400 px-4 py-4">
        <div className="max-w-md mx-auto">
          <div className="flex justify-center space-x-6">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onNavigate("home")}
              className="w-18 h-18 bg-blue-300 hover:bg-blue-400 border-4 border-blue-600 rounded-3xl text-blue-900 transition-colors duration-200"
            >
              <Home className="w-7 h-7" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onNavigate("activity")}
              className="w-18 h-18 bg-green-300 hover:bg-green-400 border-4 border-green-600 rounded-3xl text-green-900 transition-colors duration-200"
            >
              <Phone className="w-7 h-7" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onNavigate("curriculum")}
              className="w-18 h-18 bg-purple-400 hover:bg-purple-500 border-4 border-purple-600 rounded-3xl text-white transition-colors duration-200"
            >
              <CheckCircle className="w-7 h-7" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onNavigate("settings")}
              className="w-18 h-18 bg-pink-300 hover:bg-pink-400 border-4 border-pink-600 rounded-3xl text-pink-900 transition-colors duration-200"
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
