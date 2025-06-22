
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Phone, Target, TrendingUp, AlertCircle, CheckCircle, Circle, Lock, ChevronDown, ChevronRight } from "lucide-react";
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
        { name: "Greetings & Introductions", completed: true, mastery: 90, practiceHours: 3.5 },
        { name: "Asking for Directions", completed: true, mastery: 85, practiceHours: 2.8 },
        { name: "Ordering Food", completed: false, mastery: 60, practiceHours: 1.2 },
        { name: "Small Talk", completed: false, mastery: 45, practiceHours: 0.8 },
      ]
    },
    {
      id: "unit2", 
      title: "Travel & Transportation",
      progress: 40,
      status: "in_progress",
      skills: [
        { name: "Airport Conversations", completed: true, mastery: 78, practiceHours: 2.1 },
        { name: "Hotel Check-in", completed: false, mastery: 55, practiceHours: 1.0 },
        { name: "Public Transportation", completed: false, mastery: 30, practiceHours: 0.5 },
        { name: "Taxi & Rideshare", completed: false, mastery: 20, practiceHours: 0.3 },
      ]
    },
    {
      id: "unit3",
      title: "Business English",
      progress: 0,
      status: "locked",
      skills: [
        { name: "Meeting Etiquette", completed: false, mastery: 0, practiceHours: 0 },
        { name: "Email Communication", completed: false, mastery: 0, practiceHours: 0 },
        { name: "Presentations", completed: false, mastery: 0, practiceHours: 0 },
        { name: "Negotiations", completed: false, mastery: 0, practiceHours: 0 },
      ]
    },
    {
      id: "unit4",
      title: "Advanced Conversations",
      progress: 0,
      status: "locked",
      skills: [
        { name: "Debates & Discussions", completed: false, mastery: 0, practiceHours: 0 },
        { name: "Cultural Topics", completed: false, mastery: 0, practiceHours: 0 },
        { name: "News & Current Events", completed: false, mastery: 0, practiceHours: 0 },
        { name: "Academic Discussions", completed: false, mastery: 0, practiceHours: 0 },
      ]
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-6 h-6 text-green-600" />;
      case "in_progress":
        return <Circle className="w-6 h-6 text-blue-600 fill-blue-200" />;
      case "locked":
        return <Lock className="w-6 h-6 text-gray-400" />;
      default:
        return <Circle className="w-6 h-6 text-gray-400" />;
    }
  };

  const getNodeColor = (status: string, progress: number) => {
    if (status === "locked") return "bg-gray-100 border-gray-300";
    if (status === "completed") return "bg-green-50 border-green-300";
    if (progress > 50) return "bg-blue-50 border-blue-300";
    return "bg-orange-50 border-orange-300";
  };

  const getMasteryColor = (mastery: number) => {
    if (mastery >= 80) return "bg-green-500";
    if (mastery >= 60) return "bg-blue-500";
    if (mastery >= 40) return "bg-orange-500";
    return "bg-gray-400";
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <AppBar 
        title="ACTIVITY"
        onBack={() => onNavigate("home")}
        showBackButton={true}
      />

      <div className="px-6 space-y-6">
        {/* Yesterday's Focus Panel */}
        <Card className="bg-white border border-gray-200 rounded-lg shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                <TrendingUp className="w-5 h-5 text-blue-600" />
              </div>
              Yesterday's Focus
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-2">What You Focused On:</h3>
              <p className="text-gray-700">Hotel check-in conversations and travel vocabulary</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-medium text-green-900 mb-3 flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  What You Did Well
                </h4>
                <ul className="text-green-800 text-sm space-y-1">
                  <li className="flex items-center">
                    <span className="w-1.5 h-1.5 bg-green-600 rounded-full mr-2"></span>
                    Clear pronunciation
                  </li>
                  <li className="flex items-center">
                    <span className="w-1.5 h-1.5 bg-green-600 rounded-full mr-2"></span>
                    Good vocabulary usage
                  </li>
                  <li className="flex items-center">
                    <span className="w-1.5 h-1.5 bg-green-600 rounded-full mr-2"></span>
                    Confident tone
                  </li>
                </ul>
              </div>
              
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h4 className="font-medium text-red-900 mb-3 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  Areas to Improve
                </h4>
                <ul className="text-red-800 text-sm space-y-1">
                  <li className="flex items-center">
                    <span className="w-1.5 h-1.5 bg-red-600 rounded-full mr-2"></span>
                    Speaking pace
                  </li>
                  <li className="flex items-center">
                    <span className="w-1.5 h-1.5 bg-red-600 rounded-full mr-2"></span>
                    Grammar accuracy
                  </li>
                  <li className="flex items-center">
                    <span className="w-1.5 h-1.5 bg-red-600 rounded-full mr-2"></span>
                    Natural flow
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Today's Focus Panel */}
        <Card className="bg-white border border-gray-200 rounded-lg shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
                <Target className="w-5 h-5 text-orange-600" />
              </div>
              Today's Focus
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-2">What You'll Practice Today:</h3>
              <p className="text-gray-700 mb-4">Ordering food at restaurants and expressing preferences</p>
              <div className="flex flex-wrap gap-2">
                <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">Food Vocabulary</span>
                <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">Polite Requests</span>
                <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">Preferences</span>
              </div>
            </div>
            
            <Button 
              onClick={() => onNavigate("curriculum")}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-3 rounded-lg"
            >
              <Phone className="w-5 h-5 mr-2" />
              START LEARNING
            </Button>
          </CardContent>
        </Card>

        {/* Learning Progress Path */}
        <Card className="bg-white border border-gray-200 rounded-lg shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">
              Learning Progress Path
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              {courseOutline.map((unit, index) => (
                <div key={unit.id} className="relative">
                  <div className="flex items-start space-x-4">
                    {/* Node */}
                    <div 
                      className={`relative flex-shrink-0 w-14 h-14 rounded-full border-2 flex items-center justify-center cursor-pointer transition-all duration-200 hover:shadow-md ${getNodeColor(unit.status, unit.progress)} ${
                        selectedUnit === unit.id ? 'ring-2 ring-blue-500 ring-offset-2' : ''
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
                              stroke="rgba(0,0,0,0.1)"
                              strokeWidth="4"
                              fill="transparent"
                            />
                            <circle
                              cx="50"
                              cy="50"
                              r="45"
                              stroke="currentColor"
                              strokeWidth="4"
                              fill="transparent"
                              strokeDasharray={`${unit.progress * 2.83} 283`}
                              strokeLinecap="round"
                              className="text-blue-600"
                            />
                          </svg>
                        </div>
                      )}
                    </div>

                    {/* Unit Info */}
                    <div className="flex-1 bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-gray-900">
                          {unit.title}
                        </h3>
                        {selectedUnit === unit.id ? (
                          <ChevronDown className="w-4 h-4 text-gray-500" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-gray-500" />
                        )}
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="flex-1 bg-gray-200 h-2 rounded-full">
                          <div 
                            className="h-full bg-blue-600 rounded-full transition-all duration-500"
                            style={{ width: `${unit.progress}%` }}
                          ></div>
                        </div>
                        <span className="text-gray-600 text-sm font-medium">
                          {unit.progress}%
                        </span>
                      </div>
                      
                      {unit.status === "locked" && (
                        <p className="text-gray-500 text-sm mt-2">
                          Complete previous units to unlock
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Connector Line */}
                  {index < courseOutline.length - 1 && (
                    <div className="absolute left-7 top-14 w-0.5 h-6 bg-gray-200"></div>
                  )}

                  {/* Expanded Skills Detail */}
                  {selectedUnit === unit.id && (
                    <div className="mt-4 ml-18 bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                      <h4 className="font-medium text-gray-900 mb-4">
                        Skills & Mastery in {unit.title}
                      </h4>
                      <div className="space-y-3">
                        {unit.skills.map((skill, skillIndex) => (
                          <div 
                            key={skillIndex} 
                            className="bg-gray-50 rounded-lg p-3"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center space-x-2">
                                {skill.completed ? (
                                  <CheckCircle className="w-4 h-4 text-green-600" />
                                ) : (
                                  <Circle className="w-4 h-4 text-gray-400" />
                                )}
                                <span className={`font-medium text-sm ${skill.completed ? 'text-green-800' : 'text-gray-700'}`}>
                                  {skill.name}
                                </span>
                              </div>
                              <span className="text-xs text-gray-500">
                                {skill.practiceHours}h practiced
                              </span>
                            </div>
                            
                            {/* Mastery Progress */}
                            <div className="flex items-center space-x-3">
                              <div className="flex-1 bg-gray-200 h-1.5 rounded-full">
                                <div 
                                  className={`h-full rounded-full transition-all duration-500 ${getMasteryColor(skill.mastery)}`}
                                  style={{ width: `${skill.mastery}%` }}
                                ></div>
                              </div>
                              <span className="text-xs font-medium text-gray-600">
                                {skill.mastery}% mastered
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ActivityCard;
