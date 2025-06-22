
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle, Lock, Clock, ChevronDown, ChevronRight } from "lucide-react";
import { useLearningOutlines } from "@/hooks/useLearningOutlines";
import { useLearningUnits } from "@/hooks/useLearningUnits";
import { useSkills } from "@/hooks/useSkills";
import { useUserProgress } from "@/hooks/useUserProgress";
import { useAuth } from "@/contexts/AuthContext";

const LearningProgressTree = () => {
  const { user } = useAuth();
  const { data: outlines } = useLearningOutlines();
  const [expandedUnits, setExpandedUnits] = useState<Set<string>>(new Set());
  const [selectedOutline] = useState(outlines?.[0]); // Use first outline for demo
  
  const { data: units } = useLearningUnits(selectedOutline?.id || "");
  const { miniSkillScores } = useUserProgress();

  const toggleUnit = (unitId: string) => {
    const newExpanded = new Set(expandedUnits);
    if (newExpanded.has(unitId)) {
      newExpanded.delete(unitId);
    } else {
      newExpanded.add(unitId);
    }
    setExpandedUnits(newExpanded);
  };

  const getUnitProgress = (unitId: string) => {
    // Mock progress calculation - in real app this would use the database functions
    return Math.floor(Math.random() * 100);
  };

  const getProgressColor = (progress: number) => {
    if (progress === 0) return "bg-gray-200";
    if (progress < 50) return "bg-red-400";
    if (progress < 80) return "bg-yellow-400";
    return "bg-green-400";
  };

  const getProgressRing = (progress: number) => {
    const circumference = 2 * Math.PI * 20;
    const strokeDashoffset = circumference - (progress / 100) * circumference;
    
    return (
      <svg className="w-16 h-16 -rotate-90">
        <circle
          cx="32"
          cy="32"
          r="20"
          stroke="currentColor"
          strokeWidth="4"
          fill="transparent"
          className="text-gray-200"
        />
        <circle
          cx="32"
          cy="32"
          r="20"
          stroke="currentColor"
          strokeWidth="4"
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className={progress < 50 ? "text-red-400" : progress < 80 ? "text-yellow-400" : "text-green-400"}
          style={{
            transition: "stroke-dashoffset 0.5s ease-in-out",
          }}
        />
      </svg>
    );
  };

  if (!selectedOutline || !units) {
    return (
      <div className="bg-white rounded-2xl p-6 border border-gray-200">
        <div className="text-center text-gray-500">
          <div className="w-8 h-8 bg-gray-200 rounded-full mx-auto mb-2 animate-pulse"></div>
          <p className="text-sm">Loading learning path...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-200">
      <div className="flex items-center mb-6">
        <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center mr-3">
          <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 01.553-.894L9 2l6 3 6-3v13l-6 3-6-3z" />
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900">Learning Progress</h3>
          <p className="text-sm text-gray-500">{selectedOutline.name}</p>
        </div>
      </div>

      <div className="space-y-4">
        {units.map((unit, index) => {
          const progress = getUnitProgress(unit.id);
          const isExpanded = expandedUnits.has(unit.id);
          const isLocked = index > 0 && getUnitProgress(units[index - 1].id) < 70;
          
          return (
            <div key={unit.id} className="relative">
              {/* Connection Line */}
              {index < units.length - 1 && (
                <div className="absolute left-8 top-16 w-0.5 h-8 bg-gray-200"></div>
              )}
              
              <div 
                className={`flex items-start space-x-4 p-4 rounded-xl border-2 transition-all duration-200 ${
                  isLocked 
                    ? "border-gray-200 bg-gray-50" 
                    : "border-gray-200 hover:border-blue-200 cursor-pointer"
                }`}
                onClick={() => !isLocked && toggleUnit(unit.id)}
              >
                {/* Progress Circle */}
                <div className="relative flex-shrink-0">
                  {getProgressRing(progress)}
                  <div className="absolute inset-0 flex items-center justify-center">
                    {isLocked ? (
                      <Lock className="w-6 h-6 text-gray-400" />
                    ) : progress === 100 ? (
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    ) : (
                      <Clock className="w-6 h-6 text-blue-600" />
                    )}
                  </div>
                </div>

                {/* Unit Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className={`font-semibold ${isLocked ? "text-gray-400" : "text-gray-900"}`}>
                        {unit.name}
                      </h4>
                      <p className={`text-sm ${isLocked ? "text-gray-300" : "text-gray-500"}`}>
                        {unit.description}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`text-sm font-medium ${isLocked ? "text-gray-400" : "text-gray-600"}`}>
                        {progress}%
                      </span>
                      {!isLocked && (
                        isExpanded ? (
                          <ChevronDown className="w-4 h-4 text-gray-400" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-gray-400" />
                        )
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Expanded Skills */}
              {isExpanded && !isLocked && (
                <UnitSkills unitId={unit.id} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const UnitSkills = ({ unitId }: { unitId: string }) => {
  const { data: skills } = useSkills(unitId);

  if (!skills) return null;

  return (
    <div className="ml-12 mt-4 space-y-3">
      {skills.map((skill, index) => {
        const progress = Math.floor(Math.random() * 100);
        const isCompleted = progress === 100;
        
        return (
          <div key={skill.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              isCompleted ? "bg-green-100" : "bg-blue-100"
            }`}>
              {isCompleted ? (
                <CheckCircle className="w-4 h-4 text-green-600" />
              ) : (
                <span className="text-xs font-semibold text-blue-600">{index + 1}</span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h5 className="font-medium text-gray-900 text-sm">{skill.name}</h5>
              <div className="w-full bg-gray-200 h-1.5 rounded-full mt-1">
                <div 
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    progress < 50 ? "bg-red-400" : progress < 80 ? "bg-yellow-400" : "bg-green-400"
                  }`}
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
            <span className="text-xs font-medium text-gray-500">{progress}%</span>
          </div>
        );
      })}
    </div>
  );
};

export default LearningProgressTree;
