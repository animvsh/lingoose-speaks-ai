
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Phone, ChevronDown, ChevronRight, Target, TrendingUp, AlertCircle, CheckCircle, Circle, Lock } from "lucide-react";
import AppBar from "./AppBar";

interface ActivityCardProps {
  onNavigate: (view: string) => void;
}

const ActivityCard = ({ onNavigate }: ActivityCardProps) => {
  const [openUnits, setOpenUnits] = useState<string[]>([]);

  const toggleUnit = (unitId: string) => {
    setOpenUnits(prev => 
      prev.includes(unitId) 
        ? prev.filter(id => id !== unitId)
        : [...prev, unitId]
    );
  };

  const courseOutline = [
    {
      id: "unit1",
      title: "Basic Conversations",
      progress: 75,
      status: "in_progress",
      skills: [
        { name: "Greetings & Introductions", completed: true },
        { name: "Asking for Directions", completed: true },
        { name: "Ordering Food", completed: false },
        { name: "Small Talk", completed: false },
      ]
    },
    {
      id: "unit2", 
      title: "Travel & Transportation",
      progress: 40,
      status: "in_progress",
      skills: [
        { name: "Airport Conversations", completed: true },
        { name: "Hotel Check-in", completed: false },
        { name: "Public Transportation", completed: false },
        { name: "Taxi & Rideshare", completed: false },
      ]
    },
    {
      id: "unit3",
      title: "Business English",
      progress: 0,
      status: "locked",
      skills: [
        { name: "Meeting Etiquette", completed: false },
        { name: "Email Communication", completed: false },
        { name: "Presentations", completed: false },
        { name: "Negotiations", completed: false },
      ]
    },
    {
      id: "unit4",
      title: "Advanced Conversations",
      progress: 0,
      status: "locked",
      skills: [
        { name: "Debates & Discussions", completed: false },
        { name: "Cultural Topics", completed: false },
        { name: "News & Current Events", completed: false },
        { name: "Academic Discussions", completed: false },
      ]
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "in_progress":
        return <Circle className="w-5 h-5 text-blue-500" />;
      case "locked":
        return <Lock className="w-5 h-5 text-gray-400" />;
      default:
        return <Circle className="w-5 h-5 text-gray-300" />;
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress === 0) return "bg-gray-300";
    if (progress < 50) return "bg-red-400";
    if (progress < 80) return "bg-yellow-400";
    return "bg-green-400";
  };

  return (
    <div className="min-h-screen bg-amber-50 pb-24">
      <AppBar 
        title="ACTIVITY"
        onBack={() => onNavigate("home")}
        showBackButton={true}
      />

      <div className="px-6 space-y-6">
        {/* Yesterday's Focus Panel */}
        <Card className="bg-blue-300 border-4 border-blue-600 rounded-2xl overflow-hidden">
          <CardHeader>
            <CardTitle className="text-xl font-black text-blue-900 uppercase tracking-wide flex items-center">
              <div className="w-10 h-10 bg-blue-600 border-3 border-blue-800 rounded-xl flex items-center justify-center mr-3">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              Yesterday's Focus
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-white border-3 border-blue-500 rounded-xl p-4">
                <h3 className="font-bold text-blue-900 mb-2 uppercase text-sm">What You Focused On:</h3>
                <p className="text-blue-800 font-medium">Hotel check-in conversations and travel vocabulary</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-200 border-3 border-green-400 rounded-xl p-4">
                  <h4 className="font-bold text-green-800 mb-2 uppercase text-xs flex items-center">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    What You Did Well
                  </h4>
                  <ul className="text-green-700 text-sm space-y-1">
                    <li>• Clear pronunciation</li>
                    <li>• Good vocabulary usage</li>
                    <li>• Confident tone</li>
                  </ul>
                </div>
                
                <div className="bg-red-200 border-3 border-red-400 rounded-xl p-4">
                  <h4 className="font-bold text-red-800 mb-2 uppercase text-xs flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    Areas to Improve
                  </h4>
                  <ul className="text-red-700 text-sm space-y-1">
                    <li>• Speaking pace</li>
                    <li>• Grammar accuracy</li>
                    <li>• Natural flow</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Today's Focus Panel */}
        <Card className="bg-orange-300 border-4 border-orange-600 rounded-2xl overflow-hidden">
          <CardHeader>
            <CardTitle className="text-xl font-black text-orange-900 uppercase tracking-wide flex items-center">
              <div className="w-10 h-10 bg-orange-600 border-3 border-orange-800 rounded-xl flex items-center justify-center mr-3">
                <Target className="w-5 h-5 text-white" />
              </div>
              Today's Focus
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-white border-3 border-orange-500 rounded-xl p-4 mb-4">
              <h3 className="font-bold text-orange-900 mb-2 uppercase text-sm">What You'll Practice Today:</h3>
              <p className="text-orange-800 font-medium mb-4">Ordering food at restaurants and expressing preferences</p>
              <div className="flex flex-wrap gap-2">
                <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-xs font-bold border-2 border-orange-300">Food Vocabulary</span>
                <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-xs font-bold border-2 border-orange-300">Polite Requests</span>
                <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-xs font-bold border-2 border-orange-300">Preferences</span>
              </div>
            </div>
            
            <Button 
              onClick={() => onNavigate("curriculum")}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-4 text-lg rounded-2xl border-3 border-orange-800"
            >
              <Phone className="w-6 h-6 mr-2" />
              START LEARNING
            </Button>
          </CardContent>
        </Card>

        {/* Course Outline */}
        <Card className="bg-purple-300 border-4 border-purple-600 rounded-2xl overflow-hidden">
          <CardHeader>
            <CardTitle className="text-xl font-black text-purple-900 uppercase tracking-wide">
              Course Outline & Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {courseOutline.map((unit) => (
                <Collapsible
                  key={unit.id}
                  open={openUnits.includes(unit.id)}
                  onOpenChange={() => toggleUnit(unit.id)}
                >
                  <CollapsibleTrigger asChild>
                    <div className="bg-white border-3 border-purple-500 rounded-xl p-4 cursor-pointer hover:bg-purple-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          {getStatusIcon(unit.status)}
                          <div>
                            <h3 className="font-bold text-purple-900 text-sm uppercase">{unit.title}</h3>
                            <div className="flex items-center mt-2">
                              <div className="w-20 bg-gray-200 h-2 rounded-full mr-2">
                                <div 
                                  className={`h-full rounded-full transition-all duration-300 ${getProgressColor(unit.progress)}`}
                                  style={{ width: `${unit.progress}%` }}
                                ></div>
                              </div>
                              <span className="text-xs font-bold text-purple-700">{unit.progress}%</span>
                            </div>
                          </div>
                        </div>
                        {openUnits.includes(unit.id) ? (
                          <ChevronDown className="w-5 h-5 text-purple-700" />
                        ) : (
                          <ChevronRight className="w-5 h-5 text-purple-700" />
                        )}
                      </div>
                    </div>
                  </CollapsibleTrigger>
                  
                  <CollapsibleContent>
                    <div className="mt-2 bg-purple-100 border-3 border-purple-400 rounded-xl p-4">
                      <h4 className="font-bold text-purple-800 mb-3 uppercase text-xs">Skills in this unit:</h4>
                      <div className="space-y-2">
                        {unit.skills.map((skill, index) => (
                          <div key={index} className="flex items-center space-x-3 p-2 bg-white rounded-lg border-2 border-purple-300">
                            {skill.completed ? (
                              <CheckCircle className="w-4 h-4 text-green-500" />
                            ) : (
                              <Circle className="w-4 h-4 text-gray-400" />
                            )}
                            <span className={`font-medium text-sm ${skill.completed ? 'text-green-700' : 'text-gray-600'}`}>
                              {skill.name}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ActivityCard;
