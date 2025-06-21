
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Home, Clock, CheckCircle, Check } from "lucide-react";
import DuckMascot from "./DuckMascot";

interface CurriculumCardProps {
  onNavigate: (view: string) => void;
}

const CurriculumCard = ({ onNavigate }: CurriculumCardProps) => {
  const curriculumItems = [
    { topic: "Room & board vocabulary", completed: true },
    { topic: "Telling the time", completed: true },
    { topic: "Reflexives", completed: true },
    { topic: "Future tense", completed: true }
  ];

  return (
    <Card className="bg-white p-8 rounded-3xl shadow-lg border-4 border-black">
      <div className="text-center space-y-6">
        <DuckMascot size="md" className="mx-auto" />
        <h1 className="text-4xl font-bold text-slate-800">Curriculum</h1>
        
        <div className="text-left">
          <p className="text-slate-600 font-medium mb-2">Current Unit</p>
          <p className="text-lg font-semibold text-slate-800 mb-4">Week 2 - France Theme</p>
          
          <div className="space-y-3">
            {curriculumItems.map((item, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                  <Check className="w-4 h-4 text-white" />
                </div>
                <span className="text-slate-700 font-medium">{item.topic}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center space-x-8 pt-4">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => onNavigate("welcome")}
            className="w-10 h-10 bg-orange-500 hover:bg-orange-600 rounded-xl text-white"
          >
            <Home className="w-5 h-5" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            className="w-10 h-10 rounded-xl text-slate-400"
          >
            <Clock className="w-5 h-5" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            className="w-10 h-10 rounded-xl text-slate-400"
          >
            <CheckCircle className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default CurriculumCard;
