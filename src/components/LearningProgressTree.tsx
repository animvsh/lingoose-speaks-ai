
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle, Lock, Clock, ChevronDown, ChevronRight, Trophy, Star, Target } from "lucide-react";
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
    // Use unit ID to generate consistent progress values
    const hash = unitId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return Math.floor((hash % 50) + 30); // Generate consistent values between 30-80
  };

  const getUnitColor = (index: number) => {
    const colors = [
      { bg: "bg-purple-400", border: "border-purple-500", icon: "bg-purple-600", text: "text-purple-800" },
      { bg: "bg-pink-400", border: "border-pink-500", icon: "bg-pink-600", text: "text-pink-800" },
      { bg: "bg-indigo-400", border: "border-indigo-500", icon: "bg-indigo-600", text: "text-indigo-800" },
      { bg: "bg-teal-400", border: "border-teal-500", icon: "bg-teal-600", text: "text-teal-800" },
    ];
    return colors[index % colors.length];
  };

  if (!selectedOutline || !units) {
    return (
      <div className="bg-gray-200 rounded-3xl p-6 border-4 border-gray-300">
        <div className="text-center text-gray-500">
          <div className="w-8 h-8 bg-gray-300 rounded-full mx-auto mb-2 animate-pulse"></div>
          <p className="text-sm font-bold uppercase">Loading learning path...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-purple-400 rounded-3xl p-6 border-4 border-purple-500">
        <div className="flex items-center">
          <div className="w-14 h-14 bg-purple-600 rounded-2xl flex items-center justify-center mr-4">
            <Target className="w-7 h-7 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white uppercase tracking-wide">LEARNING PROGRESS</h3>
            <p className="text-purple-100 font-medium text-sm">{selectedOutline.name}</p>
          </div>
        </div>
      </div>

      {/* Units */}
      <div className="space-y-4">
        {units.map((unit, index) => {
          const progress = getUnitProgress(unit.id);
          const isExpanded = expandedUnits.has(unit.id);
          const isLocked = index > 0 && getUnitProgress(units[index - 1].id) < 70;
          const colors = getUnitColor(index);
          
          return (
            <div key={unit.id} className="relative">
              <div 
                className={`${colors.bg} rounded-3xl p-6 border-4 ${colors.border} ${
                  "cursor-pointer hover:scale-[1.02] transition-transform"
                }`}
                onClick={() => toggleUnit(unit.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    {/* Progress Circle */}
                    <div className={`w-16 h-16 ${colors.icon} rounded-2xl flex items-center justify-center border-2 ${colors.border}`}>
                      {isLocked ? (
                        <Lock className="w-6 h-6 text-white" />
                      ) : progress === 100 ? (
                        <CheckCircle className="w-6 h-6 text-white" />
                      ) : (
                        <span className="text-white font-bold text-lg">{progress}%</span>
                      )}
                    </div>

                    {/* Unit Info */}
                    <div className="flex-1 min-w-0">
                      <h4 className={`font-bold text-lg ${isLocked ? "text-gray-600" : "text-white"} uppercase tracking-wide`}>
                        {unit.name}
                      </h4>
                      <p className={`text-sm font-medium ${isLocked ? "text-gray-500" : colors.text.replace('800', '100')}`}>
                        {unit.description}
                      </p>
                      
                      {/* Progress Bar */}
                      <div className="mt-3">
                        <div className="w-full bg-white/30 h-2 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-white rounded-full transition-all duration-500"
                            style={{ width: `${progress}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Expand Arrow */}
                  <div className="ml-4 flex items-center">
                    {isExpanded ? (
                      <ChevronDown className="w-6 h-6 text-white" />
                    ) : (
                      <ChevronRight className="w-6 h-6 text-white" />
                    )}
                  </div>
                </div>
              </div>

              {/* Expanded Skills */}
              {isExpanded && (
                <UnitSkills unitId={unit.id} isLocked={isLocked} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const UnitSkills = ({ unitId, isLocked }: { unitId: string; isLocked: boolean }) => {
  const { data: skills } = useSkills(unitId);

  if (!skills) return null;

  const getSkillColor = (index: number) => {
    const colors = [
      "bg-green-300 border-green-400",
      "bg-blue-300 border-blue-400", 
      "bg-yellow-300 border-yellow-400",
      "bg-red-300 border-red-400"
    ];
    return colors[index % colors.length];
  };

  const getSkillProgress = (skillId: string, index: number) => {
    // Generate consistent progress based on skill ID and index
    const hash = skillId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return Math.floor((hash + index * 17) % 60) + 20; // Generate consistent values between 20-80
  };

  return (
    <div className="ml-4 mt-4 space-y-3">
      {skills.map((skill, index) => {
        const progress = getSkillProgress(skill.id, index);
        const isCompleted = progress >= 80;
        const colorClass = getSkillColor(index);
        
        return (
          <div key={skill.id} className={`${colorClass} rounded-2xl p-4 border-2 ${isLocked ? "opacity-60" : ""}`}>
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                isLocked ? "bg-gray-500" : isCompleted ? "bg-green-600" : "bg-gray-600"
              }`}>
                {isLocked ? (
                  <Lock className="w-4 h-4 text-white" />
                ) : isCompleted ? (
                  <CheckCircle className="w-5 h-5 text-white" />
                ) : (
                  <span className="text-sm font-bold text-white">{index + 1}</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h5 className={`font-bold text-sm uppercase tracking-wide ${isLocked ? "text-gray-600" : "text-gray-800"}`}>
                  {skill.name}
                  {isLocked && <span className="text-xs ml-2 text-gray-500">(LOCKED)</span>}
                </h5>
                <div className="w-full bg-white/50 h-2 rounded-full mt-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${
                      isLocked ? "bg-gray-400" : 
                      progress < 50 ? "bg-red-500" : progress < 70 ? "bg-yellow-500" : "bg-green-500"
                    }`}
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
              <span className={`text-sm font-bold ${isLocked ? "text-gray-600" : "text-gray-800"}`}>
                {progress}%
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default LearningProgressTree;
