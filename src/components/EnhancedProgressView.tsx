import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Target, Trophy, TrendingUp, Clock, BarChart3, CheckCircle, Circle, 
  BookOpen, Zap, Star, Flame, Phone, Users, ArrowRight, Brain, Mic,
  Timer, Award, TrendingDown
} from "lucide-react";
import { useEnhancedProgress } from "@/hooks/useEnhancedProgress";
import { useLatestCoreMetrics } from "@/hooks/useSkillAnalysis";
import AppBar from "./AppBar";

interface EnhancedProgressViewProps {
  onNavigate: (view: string) => void;
}

export const EnhancedProgressView = ({ onNavigate }: EnhancedProgressViewProps) => {
  const { data: progressData, isLoading } = useEnhancedProgress();
  const { data: latestMetrics } = useLatestCoreMetrics();

  if (isLoading) {
    return (
      <div className="min-h-screen hindi-bg pb-24 font-nunito">
        <AppBar title="Progress" onBack={() => onNavigate("home")} showBackButton={true} />
        <div className="px-4 pt-4">
          <div className="text-center mt-8">
            <div className="w-16 h-16 bg-orange-100 rounded-3xl flex items-center justify-center mx-auto mb-4 animate-pulse border-2 border-handdrawn">
              <BarChart3 className="w-8 h-8 text-orange-500" />
            </div>
            <p className="text-brown-700 font-bold">Loading your comprehensive progress...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!progressData) {
    return (
      <div className="min-h-screen hindi-bg pb-24 font-nunito">
        <AppBar title="Progress" onBack={() => onNavigate("home")} showBackButton={true} />
        <div className="px-4 pt-4">
          <div className="w-full rounded-3xl border-2 border-handdrawn bg-white/90 p-6 shadow-lg text-center">
            <h2 className="text-xl font-black text-brown-900 mb-4 uppercase tracking-wide">Start Your Journey</h2>
            <p className="text-brown-700 font-bold mb-6">Begin practicing to see your progress data!</p>
            <Button 
              onClick={() => onNavigate("activity")} 
              className="warm-button font-black text-lg px-8 py-4 text-white shadow-lg rounded-3xl border-2 border-handdrawn"
            >
              <Phone className="w-5 h-5 mr-2" />
              Start First Session
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const { fluencyRoadmap, sessionMetrics, curriculumAnalytics, skillProgression } = progressData;

  return (
    <div className="min-h-screen hindi-bg pb-24 font-nunito">
      <AppBar title="Progress Analytics" onBack={() => onNavigate("home")} showBackButton={true} />

      <div className="px-4 pt-4 space-y-6">
        {/* Current Level Overview */}
        <div className="w-full rounded-3xl border-2 border-handdrawn bg-white/90 p-6 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div 
                className="w-16 h-16 rounded-3xl flex items-center justify-center text-white border-2 border-white shadow-lg"
                style={{ backgroundColor: fluencyRoadmap.currentLevel?.color_code || '#22c55e' }}
              >
                <Target className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-xl font-black text-brown-900 uppercase tracking-wide">
                  Level {fluencyRoadmap.currentLevel?.level_number || 1}: {fluencyRoadmap.currentLevel?.name || 'Getting Started'}
                </h2>
                <p className="text-brown-700 font-bold">{fluencyRoadmap.currentLevel?.description}</p>
              </div>
            </div>
            <Badge 
              className="text-lg px-4 py-2 font-black border-2"
              style={{ 
                borderColor: fluencyRoadmap.currentLevel?.color_code, 
                color: fluencyRoadmap.currentLevel?.color_code,
                backgroundColor: `${fluencyRoadmap.currentLevel?.color_code}15`
              }}
            >
              {fluencyRoadmap.userProgress?.level_progress_percentage || 0}%
            </Badge>
          </div>
          
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center p-3 bg-green-50 rounded-2xl border-2 border-green-200">
              <div className="font-black text-xl text-green-700">{fluencyRoadmap.userProgress?.skills_mastered || 0}/{fluencyRoadmap.userProgress?.total_skills_in_level || 5}</div>
              <div className="text-green-600 font-bold text-sm">Skills Mastered</div>
            </div>
            <div className="text-center p-3 bg-blue-50 rounded-2xl border-2 border-blue-200">
              <div className="font-black text-xl text-blue-700">{fluencyRoadmap.userProgress?.vocabulary_learned_count || 0}</div>
              <div className="text-blue-600 font-bold text-sm">Words Learned</div>
            </div>
            <div className="text-center p-3 bg-orange-50 rounded-2xl border-2 border-orange-200">
              <div className="font-black text-xl text-orange-700">{fluencyRoadmap.userProgress?.current_streak_days || 0}</div>
              <div className="text-orange-600 font-bold text-sm">Day Streak</div>
            </div>
          </div>
          
          <Progress 
            value={fluencyRoadmap.userProgress?.level_progress_percentage || 0} 
            className="h-4 bg-gray-200 rounded-full border-2 border-gray-300"
          />
        </div>

        {/* Core Performance Metrics */}
        {latestMetrics && (
          <div className="w-full rounded-3xl border-2 border-handdrawn bg-white/90 p-6 shadow-lg">
            <h3 className="text-xl font-black text-brown-900 mb-6 uppercase tracking-wide flex items-center">
              <BarChart3 className="w-6 h-6 mr-3 text-blue-500" />
              Latest Session Metrics
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center justify-between py-4 px-4 bg-blue-50 rounded-2xl border-2 border-blue-200">
                <div className="flex items-center">
                  <Mic className="w-5 h-5 mr-3 text-blue-500" />
                  <div>
                    <div className="text-blue-600 font-bold text-sm">Speaking Speed</div>
                    <div className="text-brown-700 font-black text-lg">{Math.round(latestMetrics.words_per_minute)} WPM</div>
                  </div>
                </div>
                <Badge className={`font-black ${latestMetrics.words_per_minute >= 90 ? 'bg-green-100 text-green-700 border-2 border-green-300' : 'bg-orange-100 text-orange-700 border-2 border-orange-300'}`}>
                  {latestMetrics.words_per_minute >= 90 ? '✅ Good' : '⚠ Practice'}
                </Badge>
              </div>

              <div className="flex items-center justify-between py-4 px-4 bg-green-50 rounded-2xl border-2 border-green-200">
                <div className="flex items-center">
                  <Brain className="w-5 h-5 mr-3 text-green-500" />
                  <div>
                    <div className="text-green-600 font-bold text-sm">Speech Clarity</div>
                    <div className="text-brown-700 font-black text-lg">{Math.round(latestMetrics.speech_clarity_percent)}%</div>
                  </div>
                </div>
                <Badge className={`font-black ${latestMetrics.speech_clarity_percent >= 90 ? 'bg-green-100 text-green-700 border-2 border-green-300' : 'bg-orange-100 text-orange-700 border-2 border-orange-300'}`}>
                  {latestMetrics.speech_clarity_percent >= 90 ? '✅ Clear' : '⚠ Practice'}
                </Badge>
              </div>

              <div className="flex items-center justify-between py-4 px-4 bg-purple-50 rounded-2xl border-2 border-purple-200">
                <div className="flex items-center">
                  <BookOpen className="w-5 h-5 mr-3 text-purple-500" />
                  <div>
                    <div className="text-purple-600 font-bold text-sm">Vocabulary Usage</div>
                    <div className="text-brown-700 font-black text-lg">{Math.round(latestMetrics.target_vocabulary_usage_percent)}%</div>
                  </div>
                </div>
                <Badge className={`font-black ${latestMetrics.target_vocabulary_usage_percent >= 70 ? 'bg-green-100 text-green-700 border-2 border-green-300' : 'bg-orange-100 text-orange-700 border-2 border-orange-300'}`}>
                  {latestMetrics.target_vocabulary_usage_percent >= 70 ? '✅ Strong' : '⚠ Expand'}
                </Badge>
              </div>

              <div className="flex items-center justify-between py-4 px-4 bg-orange-50 rounded-2xl border-2 border-orange-200">
                <div className="flex items-center">
                  <Users className="w-5 h-5 mr-3 text-orange-500" />
                  <div>
                    <div className="text-orange-600 font-bold text-sm">Conversation Flow</div>
                    <div className="text-brown-700 font-black text-lg">{latestMetrics.turn_count} exchanges</div>
                  </div>
                </div>
                <Badge className={`font-black ${latestMetrics.turn_count >= 8 ? 'bg-green-100 text-green-700 border-2 border-green-300' : 'bg-orange-100 text-orange-700 border-2 border-orange-300'}`}>
                  {latestMetrics.turn_count >= 8 ? '✅ Engaging' : '⚠ Interact'}
                </Badge>
              </div>
            </div>

            {/* Composite Score */}
            <div className="mt-4 text-center p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border-2 border-blue-200">
              <div className="text-3xl font-black text-blue-700">{Math.round(latestMetrics.composite_score)}/100</div>
              <div className="text-blue-600 font-bold uppercase tracking-wide">Composite Fluency Score</div>
              {latestMetrics.advancement_eligible && (
                <div className="mt-2 text-green-600 font-black text-sm">🎉 Ready for Level Advancement!</div>
              )}
            </div>
          </div>
        )}

        {/* Areas for Improvement */}
        {latestMetrics?.areas_for_improvement && latestMetrics.areas_for_improvement.length > 0 && (
          <div className="w-full rounded-3xl border-2 border-handdrawn bg-white/90 p-6 shadow-lg">
            <h3 className="text-xl font-black text-brown-900 mb-6 uppercase tracking-wide flex items-center">
              <Target className="w-6 h-6 mr-3 text-orange-500" />
              Focus Areas
            </h3>
            
            <div className="space-y-2">
              {latestMetrics.areas_for_improvement.map((area, index) => (
                <div key={index} className="flex items-center justify-between py-3 px-4 bg-orange-50 rounded-2xl border-2 border-orange-200">
                  <div className="flex items-center">
                    <TrendingDown className="w-5 h-5 mr-3 text-orange-500" />
                    <span className="text-brown-700 font-bold">{area.replace('_', ' ').toUpperCase()}</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-orange-500" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Current Level Skills Progress */}
        {fluencyRoadmap.currentLevelSkills && fluencyRoadmap.currentLevelSkills.length > 0 && (
          <div className="w-full rounded-3xl border-2 border-handdrawn bg-white/90 p-6 shadow-lg">
            <h3 className="text-xl font-black text-brown-900 mb-6 uppercase tracking-wide flex items-center">
              <Zap className="w-6 h-6 mr-3 text-blue-500" />
              Current Level Skills
            </h3>
            
            <div className="space-y-3">
              {fluencyRoadmap.currentLevelSkills.map((skill: any, index: number) => (
                <div key={skill.id} className="flex items-center space-x-4 p-4 bg-blue-50 rounded-2xl border-2 border-blue-200">
                  <div>
                    {index < (fluencyRoadmap.userProgress?.skills_mastered || 0) ? (
                      <CheckCircle className="w-6 h-6 text-green-500" />
                    ) : (
                      <Circle className="w-6 h-6 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-black text-brown-900">{skill.skill_name}</span>
                      <Badge className="text-xs font-bold bg-blue-100 text-blue-700 border border-blue-300">
                        {skill.skill_category}
                      </Badge>
                    </div>
                    <p className="text-sm text-brown-700 font-medium">{skill.skill_description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skill Progression */}
        {(skillProgression.masteringSkills.length > 0 || skillProgression.strugglingSkills.length > 0) && (
          <div className="w-full rounded-3xl border-2 border-handdrawn bg-white/90 p-6 shadow-lg">
            <h3 className="text-xl font-black text-brown-900 mb-6 uppercase tracking-wide flex items-center">
              <TrendingUp className="w-6 h-6 mr-3 text-green-500" />
              Skill Progression
            </h3>
            
            <div className="space-y-4">
              {skillProgression.masteringSkills.length > 0 && (
                <div>
                  <h4 className="font-black text-green-700 mb-3 uppercase tracking-wide">🎯 Mastering Skills</h4>
                  <div className="space-y-2">
                    {skillProgression.masteringSkills.slice(0, 3).map((skill: any) => (
                      <div key={skill.id} className="flex items-center justify-between p-3 bg-green-50 rounded-2xl border-2 border-green-200">
                        <span className="text-brown-700 font-bold">{skill.level_skills?.skill_name}</span>
                        <Badge className="font-black bg-green-100 text-green-700 border-2 border-green-300">
                          {skill.mastery_level}%
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {skillProgression.strugglingSkills.length > 0 && (
                <div>
                  <h4 className="font-black text-orange-700 mb-3 uppercase tracking-wide">🎯 Focus Areas</h4>
                  <div className="space-y-2">
                    {skillProgression.strugglingSkills.slice(0, 3).map((skill: any) => (
                      <div key={skill.id} className="flex items-center justify-between p-3 bg-orange-50 rounded-2xl border-2 border-orange-200">
                        <span className="text-brown-700 font-bold">{skill.level_skills?.skill_name}</span>
                        <Badge className="font-black bg-orange-100 text-orange-700 border-2 border-orange-300">
                          {skill.mastery_level}%
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Next Milestones */}
        {skillProgression.nextMilestones.length > 0 && (
          <div className="w-full rounded-3xl border-2 border-handdrawn bg-white/90 p-6 shadow-lg">
            <h3 className="text-xl font-black text-brown-900 mb-6 uppercase tracking-wide flex items-center">
              <Target className="w-6 h-6 mr-3 text-purple-500" />
              Next Milestones
            </h3>
            
            <div className="space-y-3">
              {skillProgression.nextMilestones.map((milestone: any, index: number) => (
                <div key={index} className="p-4 bg-purple-50 rounded-2xl border-2 border-purple-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-black text-purple-800">{milestone.description}</span>
                    {milestone.type === 'level' && <ArrowRight className="w-5 h-5 text-purple-500" />}
                  </div>
                  {milestone.progress !== undefined && (
                    <Progress value={milestone.progress} className="mb-2 h-3 bg-purple-200 rounded-full" />
                  )}
                  {milestone.wpmTarget && (
                    <div className="text-sm text-purple-600 font-bold">
                      Target: {milestone.wpmTarget} • {milestone.vocabularyTarget}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Session Analytics */}
        {curriculumAnalytics && (
          <div className="w-full rounded-3xl border-2 border-handdrawn bg-white/90 p-6 shadow-lg">
            <h3 className="text-xl font-black text-brown-900 mb-6 uppercase tracking-wide flex items-center">
              <BarChart3 className="w-6 h-6 mr-3 text-blue-500" />
              Session Analytics
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-2xl border-2 border-blue-200">
                <div className="text-3xl font-black text-blue-700">{curriculumAnalytics.totalCalls}</div>
                <div className="text-blue-600 font-bold uppercase tracking-wide">Total Sessions</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-2xl border-2 border-green-200">
                <div className="text-3xl font-black text-green-700">{curriculumAnalytics.talkTime}</div>
                <div className="text-green-600 font-bold uppercase tracking-wide">Practice Time</div>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <Button 
            onClick={() => onNavigate("roadmap")}
            className="bg-white hover:bg-blue-50 text-blue-700 border-2 border-blue-300 hover:border-blue-400 py-4 font-black text-lg rounded-3xl transition-all duration-200 hover:scale-[1.02] shadow-lg"
          >
            <Target className="w-5 h-5 mr-2" />
            View Roadmap
          </Button>
          <Button 
            onClick={() => onNavigate("activity")}
            className="warm-button font-black text-lg py-4 text-white shadow-lg rounded-3xl border-2 border-handdrawn transition-all duration-200 hover:scale-[1.02]"
          >
            <Phone className="w-5 h-5 mr-2" />
            Practice Now
          </Button>
        </div>
      </div>
    </div>
  );
};