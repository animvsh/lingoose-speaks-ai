
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Phone, Target, TrendingUp, AlertCircle, CheckCircle, Circle, Lock, ChevronDown, ChevronRight, Loader2 } from "lucide-react";
import AppBar from "./AppBar";
import { useLearningOutlines } from "@/hooks/useLearningOutlines";
import { useLearningUnits } from "@/hooks/useLearningUnits";
import { useSkills } from "@/hooks/useSkills";
import { useUserProgress } from "@/hooks/useUserProgress";
import { useAuth } from "@/contexts/AuthContext";

interface ActivityCardProps {
  onNavigate: (view: string) => void;
}

const ActivityCard = ({ onNavigate }: ActivityCardProps) => {
  const { user } = useAuth();
  const [selectedUnit, setSelectedUnit] = useState<string | null>(null);
  const [expandedUnits, setExpandedUnits] = useState<{ [key: string]: any }>({});

  const { data: outlines, isLoading: outlinesLoading } = useLearningOutlines();
  const currentOutline = outlines?.[0]; // Using first outline for now

  const { data: units, isLoading: unitsLoading } = useLearningUnits(currentOutline?.id || '');
  const { miniSkillScores } = useUserProgress(currentOutline?.id);

  // Load skills for expanded units
  const expandedUnitIds = Object.keys(expandedUnits);
  
  useEffect(() => {
    if (selectedUnit && units) {
      const unit = units.find(u => u.id === selectedUnit);
      if (unit && !expandedUnits[selectedUnit]) {
        setExpandedUnits(prev => ({ ...prev, [selectedUnit]: { loading: true } }));
      }
    }
  }, [selectedUnit, units]);

  // Calculate progress for each unit based on user scores
  const calculateUnitProgress = (unitId: string) => {
    if (!miniSkillScores) return 0;
    
    const unitScores = miniSkillScores.filter(score => 
      score.mini_skills?.skills?.unit_id === unitId
    );
    
    if (unitScores.length === 0) return 0;
    
    const avgScore = unitScores.reduce((sum, score) => sum + score.score, 0) / unitScores.length;
    return Math.round(avgScore);
  };

  const getUnitStatus = (unit: any, index: number) => {
    const progress = calculateUnitProgress(unit.id);
    
    if (progress >= 90) return "completed";
    if (progress > 0 || index === 0) return "in_progress";
    
    // Check if previous unit meets unlock threshold
    if (index > 0 && units) {
      const prevUnit = units[index - 1];
      const prevProgress = calculateUnitProgress(prevUnit.id);
      return prevProgress >= (unit.unlock_threshold || 75) ? "in_progress" : "locked";
    }
    
    return "locked";
  };

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

  if (outlinesLoading || unitsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pb-24">
        <AppBar 
          title="ACTIVITY"
          onBack={() => onNavigate("home")}
          showBackButton={true}
        />
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 pb-24">
        <AppBar 
          title="ACTIVITY"
          onBack={() => onNavigate("home")}
          showBackButton={true}
        />
        <div className="px-6 pt-6">
          <Card className="bg-white border border-gray-200 rounded-lg shadow-sm">
            <CardContent className="p-6 text-center">
              <p className="text-gray-600 mb-4">Please sign in to track your learning progress.</p>
              <Button onClick={() => onNavigate("auth")} className="bg-blue-600 hover:bg-blue-700">
                Sign In
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

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
              {currentOutline && (
                <span className="text-sm font-normal text-gray-600 block mt-1">
                  {currentOutline.name}
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              {units?.map((unit, index) => {
                const progress = calculateUnitProgress(unit.id);
                const status = getUnitStatus(unit, index);
                
                return (
                  <div key={unit.id} className="relative">
                    <div className="flex items-start space-x-4">
                      {/* Node */}
                      <div 
                        className={`relative flex-shrink-0 w-14 h-14 rounded-full border-2 flex items-center justify-center cursor-pointer transition-all duration-200 hover:shadow-md ${getNodeColor(status, progress)} ${
                          selectedUnit === unit.id ? 'ring-2 ring-blue-500 ring-offset-2' : ''
                        }`}
                        onClick={() => setSelectedUnit(selectedUnit === unit.id ? null : unit.id)}
                      >
                        {getStatusIcon(status)}
                        
                        {/* Progress Ring */}
                        {progress > 0 && (
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
                                strokeDasharray={`${progress * 2.83} 283`}
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
                            {unit.name}
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
                              style={{ width: `${progress}%` }}
                            ></div>
                          </div>
                          <span className="text-gray-600 text-sm font-medium">
                            {progress}%
                          </span>
                        </div>
                        
                        {status === "locked" && (
                          <p className="text-gray-500 text-sm mt-2">
                            Complete previous units to unlock
                          </p>
                        )}
                        
                        {unit.description && (
                          <p className="text-gray-600 text-sm mt-2">
                            {unit.description}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Connector Line */}
                    {index < (units?.length || 0) - 1 && (
                      <div className="absolute left-7 top-14 w-0.5 h-6 bg-gray-200"></div>
                    )}

                    {/* Expanded Skills Detail */}
                    {selectedUnit === unit.id && (
                      <div className="mt-4 ml-18 bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                        <SkillsDetail unitId={unit.id} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Separate component for skills detail to manage loading state
const SkillsDetail = ({ unitId }: { unitId: string }) => {
  const { data: skills, isLoading } = useSkills(unitId);
  const { miniSkillScores } = useUserProgress();

  const calculateSkillProgress = (skillId: string) => {
    if (!miniSkillScores) return 0;
    
    const skillScores = miniSkillScores.filter(score => 
      score.mini_skills?.skill_id === skillId
    );
    
    if (skillScores.length === 0) return 0;
    
    const avgScore = skillScores.reduce((sum, score) => sum + score.score, 0) / skillScores.length;
    return Math.round(avgScore);
  };

  const getMasteryColor = (mastery: number) => {
    if (mastery >= 80) return "bg-green-500";
    if (mastery >= 60) return "bg-blue-500";
    if (mastery >= 40) return "bg-orange-500";
    return "bg-gray-400";
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-4">
        <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div>
      <h4 className="font-medium text-gray-900 mb-4">
        Skills in this Unit
      </h4>
      <div className="space-y-3">
        {skills?.map((skill, skillIndex) => {
          const progress = calculateSkillProgress(skill.id);
          const completed = progress >= 80;
          
          return (
            <div 
              key={skill.id} 
              className="bg-gray-50 rounded-lg p-3"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  {completed ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : (
                    <Circle className="w-4 h-4 text-gray-400" />
                  )}
                  <span className={`font-medium text-sm ${completed ? 'text-green-800' : 'text-gray-700'}`}>
                    {skill.name}
                  </span>
                </div>
              </div>
              
              {skill.description && (
                <p className="text-xs text-gray-600 mb-2">{skill.description}</p>
              )}
              
              {/* Mastery Progress */}
              <div className="flex items-center space-x-3">
                <div className="flex-1 bg-gray-200 h-1.5 rounded-full">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${getMasteryColor(progress)}`}
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <span className="text-xs font-medium text-gray-600">
                  {progress}% mastered
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ActivityCard;
