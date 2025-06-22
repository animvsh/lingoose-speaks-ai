
import { Button } from "@/components/ui/button";
import { Home, CheckCircle, Settings, ArrowLeft, Phone, Target } from "lucide-react";

interface CurriculumCardProps {
  onNavigate: (view: string) => void;
}

const CurriculumCard = ({ onNavigate }: CurriculumCardProps) => {
  const curriculumItems = [
    { topic: "Room & board vocabulary", completed: true, date: "MON" },
    { topic: "Telling the time", completed: true, date: "TUE" },
    { topic: "Reflexives", completed: true, date: "WED" },
    { topic: "Future tense", completed: false, date: "THU" },
    { topic: "Subjunctive mood", completed: false, date: "FRI" }
  ];

  return (
    <div className="min-h-screen bg-yellow-50 pb-24">
      {/* Header */}
      <div className="px-6 pt-8 pb-6">
        <div className="flex items-center justify-between">
          <Button
            onClick={() => onNavigate("home")}
            className="w-14 h-14 bg-orange-500 hover:bg-orange-600 rounded-2xl text-white shadow-lg"
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <h1 className="text-3xl font-bold text-orange-500 uppercase tracking-wide">
            THIS WEEK
          </h1>
          <div className="w-14 h-14"></div>
        </div>
      </div>

      <div className="px-6 space-y-6">
        {/* Theme Progress Card */}
        <div className="bg-orange-400 rounded-3xl p-6 border-4 border-orange-500">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-white text-lg uppercase tracking-wide">France Theme - Week 2</h2>
            <span className="text-sm text-white font-medium bg-white/20 px-3 py-1 rounded-full">3/5 complete</span>
          </div>
          <div className="w-full bg-white/30 h-4 rounded-full overflow-hidden">
            <div className="bg-white h-full rounded-full w-3/5"></div>
          </div>
        </div>
        
        {/* Curriculum Items */}
        <div className="space-y-4">
          {curriculumItems.map((item, index) => (
            <div key={index} className={`flex items-center space-x-4 p-5 rounded-3xl border-4 ${
              item.completed 
                ? 'bg-green-400 border-green-500' 
                : 'bg-gray-300 border-gray-400'
            }`}>
              <div className="text-sm font-bold text-gray-700 w-12 uppercase tracking-wide text-center">{item.date}</div>
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                item.completed ? 'bg-green-600' : 'bg-gray-500'
              }`}>
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <span className={`font-bold flex-1 uppercase tracking-wide ${
                item.completed ? 'text-white' : 'text-gray-600'
              }`}>{item.topic}</span>
            </div>
          ))}
        </div>

        {/* Upcoming Unlocks */}
        <div className="bg-gray-200 rounded-3xl p-6 border-4 border-gray-300">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center text-xl uppercase tracking-wide">
            <Target className="w-6 h-6 mr-3" />
            Upcoming Unlocks
          </h3>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white px-6 py-4 border-t border-gray-100">
        <div className="max-w-md mx-auto">
          <div className="flex justify-center space-x-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onNavigate("home")}
              className="w-14 h-14 bg-blue-400 rounded-2xl text-white"
            >
              <Home className="w-6 h-6" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onNavigate("activity")}
              className="w-14 h-14 bg-orange-400 rounded-2xl text-white"
            >
              <Phone className="w-6 h-6" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onNavigate("curriculum")}
              className="w-14 h-14 bg-green-400 rounded-2xl text-white"
            >
              <CheckCircle className="w-6 h-6" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onNavigate("settings")}
              className="w-14 h-14 bg-purple-400 rounded-2xl text-white"
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
