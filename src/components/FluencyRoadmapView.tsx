import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Circle, Target, Trophy, Zap, BookOpen } from "lucide-react";
import { useFluencyRoadmap } from "@/hooks/useFluencyRoadmap";
import { useEffect } from "react";

export const FluencyRoadmapView = () => {
  const { levels, userProgress, currentLevelSkills, isLoading, initializeUserProgress } = useFluencyRoadmap();

  useEffect(() => {
    if (levels && levels.length > 0) {
      initializeUserProgress();
    }
  }, [levels]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-amber-50 px-6 pt-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Target className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-600">Loading your fluency roadmap...</p>
        </div>
      </div>
    );
  }

  const getCurrentLevel = () => {
    if (!userProgress || !levels) return levels?.[0];
    return levels.find(level => level.id === userProgress.current_level_id) || levels[0];
  };

  const currentLevel = getCurrentLevel();
  const levelIcon = {
    1: <Circle className="w-5 h-5" />,
    2: <BookOpen className="w-5 h-5" />,
    3: <Zap className="w-5 h-5" />,
    4: <Trophy className="w-5 h-5" />
  };

  return (
    <div className="min-h-screen bg-amber-50 px-6 pt-6 pb-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          🧭 BOL FLUENCY ROADMAP
        </h1>
        <p className="text-gray-600 text-lg">
          Your personalized Hindi speaking journey
        </p>
      </div>

      {/* Current Level Overview */}
      {currentLevel && (
        <Card className="mb-6 border-4" style={{ borderColor: currentLevel.color_code }}>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div 
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-white"
                  style={{ backgroundColor: currentLevel.color_code }}
                >
                  {levelIcon[currentLevel.level_number as keyof typeof levelIcon]}
                </div>
                <div>
                  <CardTitle className="text-xl text-gray-800">
                    Level {currentLevel.level_number}: {currentLevel.name}
                  </CardTitle>
                  <p className="text-gray-600 text-sm">{currentLevel.description}</p>
                </div>
              </div>
              <Badge 
                variant="outline" 
                className="text-lg px-3 py-1"
                style={{ borderColor: currentLevel.color_code, color: currentLevel.color_code }}
              >
                {userProgress?.level_progress_percentage || 0}%
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-gray-700 mb-2">
                  <strong>Goal:</strong> {currentLevel.goal_description}
                </p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Target WPM:</span>
                    <span className="ml-2 font-bold text-gray-800">
                      {currentLevel.target_wpm_min}-{currentLevel.target_wpm_max}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Vocabulary:</span>
                    <span className="ml-2 font-bold text-gray-800">
                      {currentLevel.target_vocabulary_size} words
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Progress</span>
                  <span>{userProgress?.skills_mastered || 0} / {userProgress?.total_skills_in_level || 3} skills</span>
                </div>
                <Progress 
                  value={userProgress?.level_progress_percentage || 0} 
                  className="h-3"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Current Level Skills */}
      {currentLevelSkills && currentLevelSkills.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            📚 Skills to Master
          </h2>
          <div className="space-y-4">
            {currentLevelSkills.map((skill, index) => (
              <Card key={skill.id} className="border-2 border-gray-200">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-4">
                    <div className="mt-1">
                      {index < (userProgress?.skills_mastered || 0) ? (
                        <CheckCircle className="w-6 h-6 text-green-500" />
                      ) : (
                        <Circle className="w-6 h-6 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-bold text-gray-800">{skill.skill_name}</h3>
                        <Badge variant="outline" className="text-xs">
                          {skill.skill_category}
                        </Badge>
                      </div>
                      <p className="text-gray-600 text-sm mb-3">
                        {skill.skill_description}
                      </p>
                      
                      {/* Target Vocabulary */}
                      {skill.target_vocabulary && skill.target_vocabulary.length > 0 && (
                        <div className="mb-2">
                          <span className="text-xs text-gray-500 uppercase tracking-wide">
                            Key Words:
                          </span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {skill.target_vocabulary.slice(0, 5).map((word, idx) => (
                              <Badge key={idx} variant="secondary" className="text-xs">
                                {word}
                              </Badge>
                            ))}
                            {skill.target_vocabulary.length > 5 && (
                              <Badge variant="secondary" className="text-xs">
                                +{skill.target_vocabulary.length - 5} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}
                      
                      {/* Example Phrases */}
                      {skill.example_phrases && skill.example_phrases.length > 0 && (
                        <div>
                          <span className="text-xs text-gray-500 uppercase tracking-wide">
                            Example:
                          </span>
                          <p className="text-sm text-gray-700 italic mt-1">
                            "{skill.example_phrases[0]}"
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* All Levels Overview */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          🏆 Complete Roadmap
        </h2>
        <div className="space-y-4">
          {levels?.map((level) => {
            const isCurrentLevel = level.id === userProgress?.current_level_id;
            const isCompleted = userProgress && 
              levels.findIndex(l => l.id === userProgress.current_level_id) > 
              levels.findIndex(l => l.id === level.id);
            
            return (
              <Card 
                key={level.id} 
                className={`border-2 transition-all ${
                  isCurrentLevel ? 'border-4 shadow-lg' : 
                  isCompleted ? 'border-green-200 bg-green-50' : 'border-gray-200'
                }`}
                style={isCurrentLevel ? { borderColor: level.color_code } : {}}
              >
                <CardContent className="p-4">
                  <div className="flex items-center space-x-4">
                    <div 
                      className="w-12 h-12 rounded-2xl flex items-center justify-center text-white"
                      style={{ backgroundColor: level.color_code }}
                    >
                      {levelIcon[level.level_number as keyof typeof levelIcon]}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-gray-800">
                          Level {level.level_number}: {level.name}
                        </h3>
                        {isCompleted && <CheckCircle className="w-5 h-5 text-green-500" />}
                        {isCurrentLevel && (
                          <Badge 
                            style={{ backgroundColor: level.color_code }} 
                            className="text-white"
                          >
                            Current
                          </Badge>
                        )}
                      </div>
                      <p className="text-gray-600 text-sm mt-1">
                        {level.goal_description}
                      </p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500 mt-2">
                        <span>WPM: {level.target_wpm_min}-{level.target_wpm_max}</span>
                        <span>•</span>
                        <span>Vocab: {level.target_vocabulary_size} words</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};