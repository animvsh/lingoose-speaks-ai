import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Target, Trophy, TrendingUp, Clock, BarChart3, CheckCircle, Circle, 
  BookOpen, Zap, Star, Flame, Phone, Users, ArrowRight, Brain, Mic
} from "lucide-react";
import { useEnhancedProgress } from "@/hooks/useEnhancedProgress";
import AppBar from "./AppBar";

interface EnhancedProgressViewProps {
  onNavigate: (view: string) => void;
}

export const EnhancedProgressView = ({ onNavigate }: EnhancedProgressViewProps) => {
  const { data: progressData, isLoading } = useEnhancedProgress();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-amber-50 px-6 pt-6">
        <AppBar title="Progress" onBack={() => onNavigate("home")} showBackButton={true} />
        <div className="text-center mt-8">
          <div className="w-16 h-16 bg-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <BarChart3 className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-600">Loading your comprehensive progress...</p>
        </div>
      </div>
    );
  }

  if (!progressData) {
    return (
      <div className="min-h-screen bg-amber-50 px-6 pt-6">
        <AppBar title="Progress" onBack={() => onNavigate("home")} showBackButton={true} />
        <div className="text-center mt-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Start Your Journey</h2>
          <p className="text-gray-600 mb-6">Begin practicing to see your progress data!</p>
          <Button onClick={() => onNavigate("activity")} className="bg-green-500 hover:bg-green-600">
            Start First Session
          </Button>
        </div>
      </div>
    );
  }

  const { fluencyRoadmap, sessionMetrics, curriculumAnalytics, skillProgression } = progressData;

  return (
    <div className="min-h-screen bg-amber-50 px-6 pt-6 pb-6">
      <AppBar title="Progress Analytics" onBack={() => onNavigate("home")} showBackButton={true} />

      <div className="space-y-6 mt-6">
        {/* Header with Current Level */}
        <Card className="border-4" style={{ borderColor: fluencyRoadmap.currentLevel?.color_code || '#22c55e' }}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div 
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-white"
                  style={{ backgroundColor: fluencyRoadmap.currentLevel?.color_code || '#22c55e' }}
                >
                  <Target className="w-8 h-8" />
                </div>
                <div>
                  <CardTitle className="text-2xl">
                    Level {fluencyRoadmap.currentLevel?.level_number || 1}: {fluencyRoadmap.currentLevel?.name || 'Getting Started'}
                  </CardTitle>
                  <p className="text-gray-600">{fluencyRoadmap.currentLevel?.description}</p>
                </div>
              </div>
              <Badge 
                variant="outline" 
                className="text-lg px-4 py-2"
                style={{ borderColor: fluencyRoadmap.currentLevel?.color_code, color: fluencyRoadmap.currentLevel?.color_code }}
              >
                {fluencyRoadmap.userProgress?.level_progress_percentage || 0}%
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="text-center">
                <div className="font-bold text-lg">{fluencyRoadmap.userProgress?.skills_mastered || 0}/{fluencyRoadmap.userProgress?.total_skills_in_level || 5}</div>
                <div className="text-gray-600">Skills Mastered</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-lg">{fluencyRoadmap.userProgress?.vocabulary_learned_count || 0}</div>
                <div className="text-gray-600">Words Learned</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-lg">{fluencyRoadmap.userProgress?.current_streak_days || 0}</div>
                <div className="text-gray-600">Day Streak</div>
              </div>
            </div>
            <Progress 
              value={fluencyRoadmap.userProgress?.level_progress_percentage || 0} 
              className="mt-4 h-3"
            />
          </CardContent>
        </Card>

        {/* Key Performance Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="border-2 border-blue-200 bg-blue-50">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                  <Mic className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-sm text-blue-600 font-medium">Speaking Speed</div>
                  <div className="text-2xl font-bold text-blue-800">
                    {Math.round(sessionMetrics.averageMetrics.wpm)} WPM
                  </div>
                </div>
              </div>
              <div className="text-xs text-blue-600">
                Target: {fluencyRoadmap.currentLevel?.target_wpm_min}-{fluencyRoadmap.currentLevel?.target_wpm_max} WPM
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-green-200 bg-green-50">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-sm text-green-600 font-medium">Speech Clarity</div>
                  <div className="text-2xl font-bold text-green-800">
                    {Math.round(sessionMetrics.averageMetrics.clarity)}%
                  </div>
                </div>
              </div>
              <div className="text-xs text-green-600">
                AI-powered pronunciation analysis
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-purple-200 bg-purple-50">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-sm text-purple-600 font-medium">Vocabulary Usage</div>
                  <div className="text-2xl font-bold text-purple-800">
                    {Math.round(sessionMetrics.averageMetrics.vocabularyHitRate)}%
                  </div>
                </div>
              </div>
              <div className="text-xs text-purple-600">
                Target words used correctly
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-orange-200 bg-orange-50">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-sm text-orange-600 font-medium">Success Rate</div>
                  <div className="text-2xl font-bold text-orange-800">
                    {Math.round(sessionMetrics.averageMetrics.sessionSuccess)}%
                  </div>
                </div>
              </div>
              <div className="text-xs text-orange-600">
                Successful sessions overall
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Current Level Skills Progress */}
        {fluencyRoadmap.currentLevelSkills && fluencyRoadmap.currentLevelSkills.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Zap className="w-6 h-6 mr-2 text-blue-500" />
                Current Level Skills
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {fluencyRoadmap.currentLevelSkills.map((skill: any, index: number) => (
                  <div key={skill.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-xl">
                    <div>
                      {index < (fluencyRoadmap.userProgress?.skills_mastered || 0) ? (
                        <CheckCircle className="w-6 h-6 text-green-500" />
                      ) : (
                        <Circle className="w-6 h-6 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold">{skill.skill_name}</span>
                        <Badge variant="outline" className="text-xs">
                          {skill.skill_category}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">{skill.skill_description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Skill Progression */}
        {(skillProgression.masteringSkills.length > 0 || skillProgression.strugglingSkills.length > 0) && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="w-6 h-6 mr-2 text-green-500" />
                Skill Progression
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {skillProgression.masteringSkills.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-green-700 mb-2">🎯 Mastering Skills</h4>
                    <div className="space-y-2">
                      {skillProgression.masteringSkills.slice(0, 3).map((skill: any) => (
                        <div key={skill.id} className="flex items-center justify-between p-2 bg-green-50 rounded-lg">
                          <span className="text-sm font-medium">{skill.level_skills?.skill_name}</span>
                          <Badge variant="outline" className="text-green-700 border-green-700">
                            {skill.mastery_level}%
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {skillProgression.strugglingSkills.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-orange-700 mb-2">🎯 Focus Areas</h4>
                    <div className="space-y-2">
                      {skillProgression.strugglingSkills.slice(0, 3).map((skill: any) => (
                        <div key={skill.id} className="flex items-center justify-between p-2 bg-orange-50 rounded-lg">
                          <span className="text-sm font-medium">{skill.level_skills?.skill_name}</span>
                          <Badge variant="outline" className="text-orange-700 border-orange-700">
                            {skill.mastery_level}%
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Next Milestones */}
        {skillProgression.nextMilestones.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="w-6 h-6 mr-2 text-purple-500" />
                Next Milestones
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {skillProgression.nextMilestones.map((milestone: any, index: number) => (
                  <div key={index} className="p-4 bg-purple-50 rounded-xl border-2 border-purple-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-purple-800">{milestone.description}</span>
                      {milestone.type === 'level' && <ArrowRight className="w-5 h-5 text-purple-500" />}
                    </div>
                    {milestone.progress !== undefined && (
                      <Progress value={milestone.progress} className="mb-2" />
                    )}
                    {milestone.wpmTarget && (
                      <div className="text-sm text-purple-600">
                        Target: {milestone.wpmTarget} • {milestone.vocabularyTarget}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Traditional Analytics Integration */}
        {curriculumAnalytics && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="w-6 h-6 mr-2 text-blue-500" />
                Session Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-700">{curriculumAnalytics.totalCalls}</div>
                  <div className="text-sm text-blue-600">Total Sessions</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-700">{curriculumAnalytics.talkTime}</div>
                  <div className="text-sm text-green-600">Practice Time</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <Button 
            onClick={() => onNavigate("roadmap")}
            className="bg-blue-500 hover:bg-blue-600 text-white py-3"
          >
            <Target className="w-4 h-4 mr-2" />
            View Roadmap
          </Button>
          <Button 
            onClick={() => onNavigate("activity")}
            className="bg-green-500 hover:bg-green-600 text-white py-3"
          >
            <Users className="w-4 h-4 mr-2" />
            Practice Now
          </Button>
        </div>
      </div>
    </div>
  );
};