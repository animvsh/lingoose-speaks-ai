
import { Button } from "@/components/ui/button";
import { Home, Clock, CheckCircle, Check, BarChart3, Settings, Calendar, Target } from "lucide-react";
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
    <div className="bg-white p-8 rounded-3xl shadow-lg w-full h-full flex flex-col">
      <div className="text-center space-y-6 flex-1">
        <div className="flex items-center justify-center space-x-3">
          <Calendar className="w-8 h-8 text-orange-500" />
          <h1 className="text-4xl font-bold text-slate-800">This Week</h1>
        </div>
        
        <div className="bg-orange-50 p-4 rounded-2xl text-left">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-semibold text-orange-800">France Theme - Week 2</h2>
            <span className="text-sm text-orange-600">3/5 complete</span>
          </div>
          <div className="w-full bg-orange-200 h-2 rounded-full">
            <div className="bg-orange-500 h-2 rounded-full w-3/5"></div>
          </div>
        </div>
        
        <div className="space-y-3">
          {curriculumItems.map((item, index) => (
            <div key={index} className={`flex items-center space-x-3 p-3 rounded-xl ${
              item.completed ? 'bg-green-50' : 'bg-slate-50'
            }`}>
              <div className="text-xs font-medium text-slate-500 w-8">{item.date}</div>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                item.completed ? 'bg-green-500' : 'bg-slate-300'
              }`}>
                <Check className="w-4 h-4 text-white" />
              </div>
              <span className={`font-medium flex-1 ${
                item.completed ? 'text-green-800' : 'text-slate-600'
              }`}>{item.topic}</span>
            </div>
          ))}
        </div>

        <div className="bg-slate-50 p-4 rounded-2xl text-left">
          <h3 className="font-semibold text-slate-800 mb-3 flex items-center">
            <Target className="w-4 h-4 mr-2" />
            Upcoming Unlocks
          </h3>
          {upcomingUnlocks.map((unlock, index) => (
            <div key={index} className="mb-3 last:mb-0">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-700">{unlock.item}</span>
                <span className="text-slate-500">{unlock.progress}%</span>
              </div>
              <div className="w-full bg-slate-200 h-1.5 rounded-full">
                <div 
                  className="bg-orange-500 h-1.5 rounded-full transition-all duration-300"
                  style={{ width: `${unlock.progress}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center space-x-8 pt-4 border-t border-slate-100">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => onNavigate("home")}
          className="w-12 h-12 rounded-xl text-slate-400 hover:bg-slate-100"
        >
          <Home className="w-5 h-5" />
        </Button>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => onNavigate("progress")}
          className="w-12 h-12 rounded-xl text-slate-400 hover:bg-slate-100"
        >
          <BarChart3 className="w-5 h-5" />
        </Button>
        <Button 
          variant="ghost" 
          size="sm"
          className="w-12 h-12 bg-orange-500 hover:bg-orange-600 rounded-xl text-white"
        >
          <CheckCircle className="w-5 h-5" />
        </Button>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => onNavigate("settings")}
          className="w-12 h-12 rounded-xl text-slate-400 hover:bg-slate-100"
        >
          <Settings className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};

export default CurriculumCard;
