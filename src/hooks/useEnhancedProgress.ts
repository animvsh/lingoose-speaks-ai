import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useFluencyRoadmap } from './useFluencyRoadmap';
import { useLanguageMetrics } from './useLanguageMetrics';
import { useCurriculumAnalytics } from './useCurriculumAnalytics';

export interface SessionPerformanceData {
  id: string;
  user_id: string;
  fluency_level_id: string;
  level_skill_id?: string;
  session_type: string;
  wpm?: number;
  speech_time_ratio?: number;
  unique_vocabulary_count?: number;
  target_vocabulary_hit_rate?: number;
  filler_words_per_minute?: number;
  pauses_per_minute?: number;
  turn_count?: number;
  avg_response_time_seconds?: number;
  self_correction_rate?: number;
  silence_percentage?: number;
  clarity_percentage?: number;
  ai_question_appropriateness?: number;
  ai_wait_time_appropriate?: boolean;
  ai_used_target_vocabulary?: boolean;
  ai_correction_gentleness?: number;
  ai_speech_dominance_ratio?: number;
  skill_improvement_score?: number;
  session_success?: boolean;
  areas_for_improvement?: string[];
  vocabulary_learned?: string[];
  created_at: string;
}

export interface EnhancedProgressData {
  fluencyRoadmap: {
    currentLevel: any;
    userProgress: any;
    levels: any[];
    currentLevelSkills: any[];
  };
  sessionMetrics: {
    recentSessions: SessionPerformanceData[];
    averageMetrics: {
      wpm: number;
      clarity: number;
      vocabularyHitRate: number;
      sessionSuccess: number;
    };
    progressTrends: {
      wpmTrend: number[];
      clarityTrend: number[];
      vocabularyGrowth: number[];
    };
  };
  languageMetrics: any;
  curriculumAnalytics: any;
  skillProgression: {
    masteringSkills: any[];
    strugglingSkills: any[];
    nextMilestones: any[];
  };
}

export const useEnhancedProgress = () => {
  const { user } = useAuth();
  const fluencyData = useFluencyRoadmap();
  const { data: languageMetrics } = useLanguageMetrics();
  const { data: curriculumAnalytics } = useCurriculumAnalytics();

  // Fetch session performance data
  const { data: sessionPerformance, isLoading: sessionsLoading } = useQuery({
    queryKey: ['session-performance', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('No user found');

      const { data, error } = await (supabase as any)
        .from('session_performance')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      return data as SessionPerformanceData[];
    },
    enabled: !!user,
  });

  // Fetch user skill mastery data
  const { data: skillMastery, isLoading: skillsLoading } = useQuery({
    queryKey: ['user-skill-mastery', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('No user found');

      const { data, error } = await (supabase as any)
        .from('user_skill_mastery')
        .select(`
          *,
          level_skills (
            skill_name,
            skill_category,
            skill_description,
            target_vocabulary,
            fluency_levels (name, level_number, color_code)
          )
        `)
        .eq('user_id', user.id)
        .order('last_practiced', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  // Calculate enhanced progress data
  const enhancedData: EnhancedProgressData | null = useMemo(() => {
    if (!fluencyData.levels || fluencyData.isLoading) return null;

    // Calculate average session metrics
    const averageMetrics = sessionPerformance?.length > 0 ? {
      wpm: sessionPerformance.reduce((sum, s) => sum + (s.wpm || 0), 0) / sessionPerformance.length,
      clarity: sessionPerformance.reduce((sum, s) => sum + (s.clarity_percentage || 0), 0) / sessionPerformance.length,
      vocabularyHitRate: sessionPerformance.reduce((sum, s) => sum + (s.target_vocabulary_hit_rate || 0), 0) / sessionPerformance.length,
      sessionSuccess: sessionPerformance.filter(s => s.session_success).length / sessionPerformance.length * 100,
    } : { wpm: 0, clarity: 0, vocabularyHitRate: 0, sessionSuccess: 0 };

    // Calculate progress trends (last 10 sessions)
    const recentTen = sessionPerformance?.slice(0, 10) || [];
    const progressTrends = {
      wpmTrend: recentTen.map(s => s.wpm || 0).reverse(),
      clarityTrend: recentTen.map(s => s.clarity_percentage || 0).reverse(),
      vocabularyGrowth: recentTen.map(s => s.unique_vocabulary_count || 0).reverse(),
    };

    // Identify mastering vs struggling skills
    const masteringSkills = skillMastery?.filter(s => s.mastery_level >= 70) || [];
    const strugglingSkills = skillMastery?.filter(s => s.mastery_level < 40 && s.attempts_count > 2) || [];

    // Calculate next milestones
    const currentLevel = fluencyData.levels?.find(l => l.id === fluencyData.userProgress?.current_level_id);
    const nextMilestones = [];
    
    if (currentLevel && fluencyData.userProgress) {
      const skillsToMaster = (fluencyData.userProgress.total_skills_in_level || 5) - (fluencyData.userProgress.skills_mastered || 0);
      const nextLevel = fluencyData.levels.find(l => l.level_number === currentLevel.level_number + 1);
      
      if (skillsToMaster > 0) {
        nextMilestones.push({
          type: 'skills',
          description: `Master ${skillsToMaster} more skills to complete ${currentLevel.name}`,
          progress: (fluencyData.userProgress.skills_mastered || 0) / (fluencyData.userProgress.total_skills_in_level || 5) * 100
        });
      }
      
      if (nextLevel) {
        nextMilestones.push({
          type: 'level',
          description: `Reach Level ${nextLevel.level_number}: ${nextLevel.name}`,
          wpmTarget: `${nextLevel.target_wpm_min}-${nextLevel.target_wpm_max} WPM`,
          vocabularyTarget: `${nextLevel.target_vocabulary_size} words`
        });
      }
    }

    return {
      fluencyRoadmap: {
        currentLevel: currentLevel,
        userProgress: fluencyData.userProgress,
        levels: fluencyData.levels,
        currentLevelSkills: fluencyData.currentLevelSkills,
      },
      sessionMetrics: {
        recentSessions: sessionPerformance || [],
        averageMetrics,
        progressTrends,
      },
      languageMetrics,
      curriculumAnalytics,
      skillProgression: {
        masteringSkills,
        strugglingSkills,
        nextMilestones,
      },
    };
  }, [fluencyData, sessionPerformance, skillMastery, languageMetrics, curriculumAnalytics]);

  return {
    data: enhancedData,
    isLoading: fluencyData.isLoading || sessionsLoading || skillsLoading,
    refetch: () => {
      // Add refetch logic if needed
    },
  };
};