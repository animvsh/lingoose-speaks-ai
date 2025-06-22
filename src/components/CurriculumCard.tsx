
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
    <div className="min-h-screen bg-gray-50">
      <div className="px-4 pt-6">
        {/* Header with Back Button */}
        <div className="flex items-center justify-between mb-6">
          <Button
            onClick={() => onNavigate("home")}
            className="w-14 h-14 bg-gradient-to-br from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 rounded-2xl text-white transition-all duration-200 shadow-lg"
          >
            <ArrowLeft className="w-7 h-7" />
          </Button>
          <h1 className="text-4xl font-black text-gray-800 uppercase tracking-wider">
            Curriculum
          </h1>
          <div className="w-14 h-14"></div> {/* Spacer */}
        </div>
      
        <div className="bg-gradient-to-br from-orange-400 to-orange-500 p-6 rounded-3xl mb-8 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-black text-white text-2xl uppercase tracking-wide">France Theme - Week 2</h2>
            <span className="text-sm text-white font-semibold bg-white/20 px-4 py-2 rounded-full backdrop-blur-sm">3/5 complete</span>
          </div>
          <div className="w-full bg-white/20 h-5 rounded-full backdrop-blur-sm">
            <div className="bg-white h-full rounded-full w-3/5 shadow-sm"></div>
          </div>
        </div>
        
        <div className="space-y-4 mb-8">
          {curriculumItems.map((item, index) => (
            <div key={index} className={`flex items-center space-x-4 p-6 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 border ${
              item.completed 
                ? 'bg-white border-green-200 hover:border-green-300' 
                : 'bg-white border-gray-200 hover:border-gray-300'
            }`}>
              <div className="text-sm font-bold text-gray-600 w-16 uppercase tracking-wide bg-gray-100 px-3 py-2 rounded-full border border-gray-200">{item.date}</div>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md ${
                item.completed ? 'bg-gradient-to-br from-green-400 to-green-500' : 'bg-gray-300'
              }`}>
                <Check className="w-6 h-6 text-white" />
              </div>
              <span className={`font-black flex-1 text-xl uppercase tracking-wide ${
                item.completed ? 'text-gray-800' : 'text-gray-500'
              }`}>{item.topic}</span>
            </div>
          ))}
        </div>

        <div className="bg-white p-6 rounded-3xl mb-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200">
          <h3 className="font-black text-gray-800 mb-4 flex items-center text-2xl uppercase tracking-wide">
            <Target className="w-8 h-8 mr-3" />
            Upcoming Unlocks
          </h3>
          {upcomingUnlocks.map((unlock, index) => (
            <div key={index} className="mb-4 last:mb-0">
              <div className="flex justify-between text-lg mb-2">
                <span className="text-gray-700 font-black uppercase tracking-wide">{unlock.item}</span>
                <span className="text-gray-600 font-semibold bg-gray-100 px-4 py-2 rounded-full border border-gray-200">{unlock.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 h-4 rounded-full border border-gray-300">
                <div 
                  className="bg-gradient-to-r from-orange-400 to-orange-500 h-full rounded-full transition-all duration-300 shadow-sm"
                  style={{ width: `${unlock.progress}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="bg-white/90 backdrop-blur-md border-t border-gray-200 px-4 py-4 shadow-2xl">
        <div className="max-w-md mx-auto">
          <div className="flex justify-center space-x-6">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onNavigate("home")}
              className="w-16 h-16 bg-gray-100 hover:bg-gray-200 rounded-2xl text-gray-600 hover:text-gray-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Home className="w-7 h-7" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onNavigate("activity")}
              className="w-16 h-16 bg-gray-100 hover:bg-gray-200 rounded-2xl text-gray-600 hover:text-gray-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Phone className="w-7 h-7" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onNavigate("curriculum")}
              className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-500 hover:from-purple-500 hover:to-purple-600 rounded-2xl text-white transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <CheckCircle className="w-7 h-7" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onNavigate("settings")}
              className="w-16 h-16 bg-gray-100 hover:bg-gray-200 rounded-2xl text-gray-600 hover:text-gray-700 transition-all duration-200 shadow-lg hover:shadow-xl"
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
