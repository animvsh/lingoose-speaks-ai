
import { useCallback } from 'react';
import { usePostHog } from './usePostHog';
import { useAuth } from '@/contexts/AuthContext';

interface LearningSession {
  activityId: string;
  activityName: string;
  startTime: number;
  difficulty: string;
  skillsTargeted: string[];
}

interface LearningOutcome {
  sessionId: string;
  duration: number;
  completed: boolean;
  rating?: number;
  skillsImproved: string[];
  struggledWith: string[];
  confidenceLevel: number;
}

export const useLearningAnalytics = () => {
  const { capture } = usePostHog();
  const { user } = useAuth();

  const trackLearningSessionStart = useCallback((session: LearningSession) => {
    const sessionId = `${session.activityId}-${Date.now()}`;
    
    capture('learning_session_started', {
      session_id: sessionId,
      activity_id: session.activityId,
      activity_name: session.activityName,
      difficulty_level: session.difficulty,
      skills_targeted: session.skillsTargeted.join(', '),
      skills_count: session.skillsTargeted.length,
      start_time: new Date(session.startTime).toISOString(),
      user_id: user?.id
    });
    
    return sessionId;
  }, [capture, user]);

  const trackLearningProgress = useCallback((
    sessionId: string, 
    skillName: string, 
    beforeScore: number, 
    afterScore: number,
    attempts: number
  ) => {
    const improvement = afterScore - beforeScore;
    
    capture('learning_progress_update', {
      session_id: sessionId,
      skill_name: skillName,
      before_score: beforeScore,
      after_score: afterScore,
      improvement: improvement,
      attempts: attempts,
      improvement_rate: attempts > 0 ? improvement / attempts : 0,
      mastery_level: afterScore >= 80 ? 'mastered' : afterScore >= 60 ? 'proficient' : 'learning',
      timestamp: new Date().toISOString()
    });
  }, [capture]);

  const trackLearningSessionEnd = useCallback((outcome: LearningOutcome) => {
    capture('learning_session_completed', {
      session_id: outcome.sessionId,
      duration_seconds: outcome.duration,
      completion_status: outcome.completed ? 'completed' : 'abandoned',
      user_rating: outcome.rating,
      skills_improved: outcome.skillsImproved.join(', '),
      skills_struggled: outcome.struggledWith.join(', '),
      confidence_level: outcome.confidenceLevel,
      success_rate: outcome.skillsImproved.length / Math.max(outcome.skillsImproved.length + outcome.struggledWith.length, 1),
      engagement_quality: outcome.duration > 300 ? 'high' : outcome.duration > 120 ? 'medium' : 'low',
      timestamp: new Date().toISOString()
    });
  }, [capture]);

  const trackSkillMastery = useCallback((skillName: string, masteryLevel: number, sessionsToMaster: number) => {
    capture('skill_mastery_achieved', {
      skill_name: skillName,
      mastery_level: masteryLevel,
      sessions_to_master: sessionsToMaster,
      achievement_date: new Date().toISOString(),
      user_id: user?.id
    });
  }, [capture, user]);

  const trackLearningStreak = useCallback((streakDays: number, streakType: 'practice' | 'perfect_score' | 'improvement') => {
    capture('learning_streak_milestone', {
      streak_days: streakDays,
      streak_type: streakType,
      milestone_reached: streakDays % 7 === 0 ? 'weekly' : streakDays % 30 === 0 ? 'monthly' : 'daily',
      achievement_date: new Date().toISOString(),
      user_id: user?.id
    });
  }, [capture, user]);

  const trackDifficultyAdjustment = useCallback((
    fromDifficulty: string, 
    toDifficulty: string, 
    reason: 'too_easy' | 'too_hard' | 'user_request' | 'performance_based'
  ) => {
    capture('difficulty_adjustment', {
      from_difficulty: fromDifficulty,
      to_difficulty: toDifficulty,
      adjustment_reason: reason,
      adjustment_direction: toDifficulty > fromDifficulty ? 'increase' : 'decrease',
      timestamp: new Date().toISOString(),
      user_id: user?.id
    });
  }, [capture, user]);

  return {
    trackLearningSessionStart,
    trackLearningProgress,
    trackLearningSessionEnd,
    trackSkillMastery,
    trackLearningStreak,
    trackDifficultyAdjustment
  };
};
