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
  const [selectedUnit, setSelectedUnit] = useState<string | null>(null);

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
        return <CheckCircle className="w-8 h-8 text-green-600" />;
      case "in_progress":
        return <Circle className="w-8 h-8 text-blue-600 fill-blue-200" />;
      case "locked":
        return <Lock className="w-8 h-8 text-gray-500" />;
      default:
        return <Circle className="w-8 h-8 text-gray-400" />;
    }
  };

  const getNodeColor = (status: string, progress: number) => {
    if (status === "locked") return "bg-gray-400 border-gray-500";
    if (status === "completed") return "bg-green-500 border-green-600";
    if (progress > 50) return "bg-blue-500 border-blue-600";
    return "bg-yellow-500 border-yellow-600";
  };

  const getConnectorColor = (currentIndex: number, units: any[]) => {
    const currentUnit = units[currentIndex];
    const nextUnit = units[currentIndex + 1];
    
    if (!nextUnit) return "bg-gray-300";
    if (currentUnit.status === "completed") return "bg-green-400";
    if (currentUnit.progress > 0) return "bg-blue-400";
    return "bg-gray-300";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-100 to-orange-100 pb-24">
      <AppBar 
        title="ACTIVITY"
        onBack={() => onNavigate("home")}
        showBackButton={true}
      />

      <div className="px-6 space-y-8">
        {/* Yesterday's Focus Panel */}
        <Card className="bg-gradient-to-br from-blue-400 to-blue-600 border-4 border-blue-800 rounded-3xl overflow-hidden shadow-xl transform hover:scale-[1.02] transition-all duration-200">
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl font-black text-white uppercase tracking-wider flex items-center">
              <div className="w-12 h-12 bg-blue-800 border-4 border-blue-900 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              Yesterday's Focus
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-white border-4 border-blue-300 rounded-2xl p-6 shadow-inner">
              <h3 className="font-black text-blue-900 mb-3 uppercase text-base tracking-wide">What You Focused On:</h3>
              <p className="text-blue-800 font-bold text-lg">Hotel check-in conversations and travel vocabulary</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-green-300 to-green-400 border-4 border-green-600 rounded-2xl p-6 shadow-lg">
                <h4 className="font-black text-green-900 mb-4 uppercase text-sm flex items-center tracking-wide">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  What You Did Well
                </h4>
                <ul className="text-green-800 font-semibold space-y-2">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-green-600 rounded-full mr-3"></span>
                    Clear pronunciation
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-green-600 rounded-full mr-3"></span>
                    Good vocabulary usage
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-green-600 rounded-full mr-3"></span>
                    Confident tone
                  </li>
                </ul>
              </div>
              
              <div className="bg-gradient-to-br from-red-300 to-red-400 border-4 border-red-600 rounded-2xl p-6 shadow-lg">
                <h4 className="font-black text-red-900 mb-4 uppercase text-sm flex items-center tracking-wide">
                  <AlertCircle className="w-5 h-5 mr-2" />
                  Areas to Improve
                </h4>
                <ul className="text-red-800 font-semibold space-y-2">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-red-600 rounded-full mr-3"></span>
                    Speaking pace
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-red-600 rounded-full mr-3"></span>
                    Grammar accuracy
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-red-600 rounded-full mr-3"></span>
                    Natural flow
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Today's Focus Panel */}
        <Card className="bg-gradient-to-br from-orange-400 to-orange-600 border-4 border-orange-800 rounded-3xl overflow-hidden shadow-xl transform hover:scale-[1.02] transition-all duration-200">
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl font-black text-white uppercase tracking-wider flex items-center">
              <div className="w-12 h-12 bg-orange-800 border-4 border-orange-900 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                <Target className="w-6 h-6 text-white" />
              </div>
              Today's Focus
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-white border-4 border-orange-300 rounded-2xl p-6 shadow-inner">
              <h3 className="font-black text-orange-900 mb-3 uppercase text-base tracking-wide">What You'll Practice Today:</h3>
              <p className="text-orange-800 font-bold text-lg mb-6">Ordering food at restaurants and expressing preferences</p>
              <div className="flex flex-wrap gap-3">
                <span className="bg-gradient-to-r from-orange-200 to-orange-300 text-orange-900 px-4 py-2 rounded-full text-sm font-black border-3 border-orange-400 shadow-sm">Food Vocabulary</span>
                <span className="bg-gradient-to-r from-orange-200 to-orange-300 text-orange-900 px-4 py-2 rounded-full text-sm font-black border-3 border-orange-400 shadow-sm">Polite Requests</span>
                <span className="bg-gradient-to-r from-orange-200 to-orange-300 text-orange-900 px-4 py-2 rounded-full text-sm font-black border-3 border-orange-400 shadow-sm">Preferences</span>
              </div>
            </div>
            
            <Button 
              onClick={() => onNavigate("curriculum")}
              className="w-full bg-gradient-to-r from-orange-700 to-orange-800 hover:from-orange-800 hover:to-orange-900 text-white font-black py-6 text-xl rounded-2xl border-4 border-orange-900 shadow-xl transform hover:scale-[1.02] transition-all duration-200 uppercase tracking-wide"
            >
              <Phone className="w-7 h-7 mr-3" />
              START LEARNING
            </Button>
          </CardContent>
        </Card>

        {/* Learning Progress Path */}
        <Card className="bg-gradient-to-br from-purple-400 to-purple-600 border-4 border-purple-800 rounded-3xl overflow-hidden shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl font-black text-white uppercase tracking-wider">
              Learning Progress Path
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="relative">
              {/* Progress Path */}
              <div className="flex flex-col space-y-8">
                {courseOutline.map((unit, index) => (
                  <div key={unit.id} className="relative">
                    <div className="flex items-center space-x-6">
                      {/* Node */}
                      <div 
                        className={`relative flex-shrink-0 w-20 h-20 rounded-full border-4 flex items-center justify-center cursor-pointer transform transition-all duration-300 hover:scale-110 shadow-lg ${getNodeColor(unit.status, unit.progress)} ${
                          selectedUnit === unit.id ? 'ring-4 ring-white ring-opacity-60' : ''
                        }`}
                        onClick={() => setSelectedUnit(selectedUnit === unit.id ? null : unit.id)}
                      >
                        {getStatusIcon(unit.status)}
                        
                        {/* Progress Ring */}
                        {unit.progress > 0 && (
                          <div className="absolute inset-0 rounded-full">
                            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                              <circle
                                cx="50"
                                cy="50"
                                r="45"
                                stroke="rgba(255,255,255,0.3)"
                                strokeWidth="6"
                                fill="transparent"
                              />
                              <circle
                                cx="50"
                                cy="50"
                                r="45"
                                stroke="white"
                                strokeWidth="6"
                                fill="transparent"
                                strokeDasharray={`${unit.progress * 2.83} 283`}
                                strokeLinecap="round"
                              />
                            </svg>
                          </div>
                        )}
                      </div>

                      {/* Unit Info */}
                      <div className="flex-1 bg-white bg-opacity-20 backdrop-blur-sm border-3 border-white border-opacity-30 rounded-2xl p-6 shadow-lg">
                        <h3 className="font-black text-white text-xl mb-2 uppercase tracking-wide">
                          {unit.title}
                        </h3>
                        <div className="flex items-center space-x-4">
                          <div className="flex-1 bg-white bg-opacity-30 h-3 rounded-full">
                            <div 
                              className="h-full bg-white rounded-full transition-all duration-500"
                              style={{ width: `${unit.progress}%` }}
                            ></div>
                          </div>
                          <span className="text-white font-black text-sm bg-white bg-opacity-20 px-3 py-1 rounded-full">
                            {unit.progress}%
                          </span>
                        </div>
                        
                        {unit.status === "locked" && (
                          <p className="text-white text-opacity-80 text-sm mt-2 font-medium">
                            Complete previous units to unlock
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Connector Line */}
                    {index < courseOutline.length - 1 && (
                      <div className="absolute left-10 top-20 w-0.5 h-8 transform -translate-x-0.5">
                        <div className={`w-full h-full rounded-full transition-all duration-500 ${getConnectorColor(index, courseOutline)}`}></div>
                      </div>
                    )}

                    {/* Expanded Skills */}
                    {selectedUnit === unit.id && (
                      <div className="mt-6 ml-26 bg-white bg-opacity-90 backdrop-blur-sm border-3 border-purple-300 rounded-2xl p-6 shadow-xl animate-fade-in">
                        <h4 className="font-black text-purple-900 mb-4 uppercase text-sm tracking-wide">
                          Skills in this unit:
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {unit.skills.map((skill, skillIndex) => (
                            <div 
                              key={skillIndex} 
                              className="flex items-center space-x-3 p-3 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl border-2 border-purple-200 shadow-sm hover:shadow-md transition-all duration-200"
                            >
                              {skill.completed ? (
                                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                              ) : (
                                <Circle className="w-5 h-5 text-gray-500 flex-shrink-0" />
                              )}
                              <span className={`font-semibold text-sm ${skill.completed ? 'text-green-800' : 'text-gray-700'}`}>
                                {skill.name}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ActivityCard;
