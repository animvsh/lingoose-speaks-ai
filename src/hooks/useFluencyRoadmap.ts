import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface FluencyLevel {
  id: string;
  level_number: number;
  name: string;
  description: string;
  goal_description: string;
  target_wpm_min: number;
  target_wpm_max: number;
  target_vocabulary_size: number;
  color_code: string;
}

export interface LevelSkill {
  id: string;
  fluency_level_id: string;
  skill_category: string;
  skill_name: string;
  skill_description: string;
  target_vocabulary: string[];
  example_phrases: string[];
  skill_order: number;
}

export interface UserFluencyProgress {
  id: string;
  user_id: string;
  current_level_id: string;
  current_skill_id?: string;
  level_progress_percentage: number;
  skills_mastered: number;
  total_skills_in_level: number;
  fluency_composite_score: number;
  vocabulary_learned_count: number;
  current_streak_days: number;
  last_practice_date?: string;
}

export const useFluencyRoadmap = () => {
  const { user } = useAuth();

  // Fetch all fluency levels
  const { data: levels, isLoading: levelsLoading } = useQuery({
    queryKey: ['fluency-levels'],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from('fluency_levels')
        .select('*')
        .order('level_number', { ascending: true });

      if (error) throw error;
      return data as FluencyLevel[];
    },
  });

  // Fetch user's current progress
  const { data: userProgress, isLoading: progressLoading } = useQuery({
    queryKey: ['user-fluency-progress', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('No user found');

      const { data, error } = await (supabase as any)
        .from('user_fluency_progress')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;
      return data as UserFluencyProgress | null;
    },
    enabled: !!user,
  });

  // Fetch skills for current level
  const { data: currentLevelSkills, isLoading: skillsLoading } = useQuery({
    queryKey: ['level-skills', userProgress?.current_level_id],
    queryFn: async () => {
      if (!userProgress?.current_level_id) return [];

      const { data, error } = await (supabase as any)
        .from('level_skills')
        .select('*')
        .eq('fluency_level_id', userProgress.current_level_id)
        .order('skill_order', { ascending: true });

      if (error) throw error;
      return data as LevelSkill[];
    },
    enabled: !!userProgress?.current_level_id,
  });

  // Initialize user progress if not exists
  const initializeUserProgress = async () => {
    if (!user || !levels || levels.length === 0) return;

    // Check if user already has progress
    if (userProgress) return;

    // Create initial progress at Level 1
    const firstLevel = levels[0];
    const { error } = await (supabase as any)
      .from('user_fluency_progress')
      .insert({
        user_id: user.id,
        current_level_id: firstLevel.id,
        level_progress_percentage: 0,
        skills_mastered: 0,
        total_skills_in_level: 3, // Each level has 3 skills
        fluency_composite_score: 0,
        vocabulary_learned_count: 0,
        current_streak_days: 0,
      });

    if (error) {
      console.error('Error initializing user progress:', error);
    }
  };

  return {
    levels,
    userProgress,
    currentLevelSkills,
    isLoading: levelsLoading || progressLoading || skillsLoading,
    initializeUserProgress,
  };
};