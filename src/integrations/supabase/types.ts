export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      activities: {
        Row: {
          activity_order: number
          created_at: string | null
          description: string | null
          difficulty_level: string | null
          estimated_duration_minutes: number | null
          id: string
          is_active: boolean | null
          name: string
          prompt: string
          skill_id: string
          updated_at: string | null
        }
        Insert: {
          activity_order?: number
          created_at?: string | null
          description?: string | null
          difficulty_level?: string | null
          estimated_duration_minutes?: number | null
          id?: string
          is_active?: boolean | null
          name: string
          prompt: string
          skill_id: string
          updated_at?: string | null
        }
        Update: {
          activity_order?: number
          created_at?: string | null
          description?: string | null
          difficulty_level?: string | null
          estimated_duration_minutes?: number | null
          id?: string
          is_active?: boolean | null
          name?: string
          prompt?: string
          skill_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "activities_skill_id_fkey"
            columns: ["skill_id"]
            isOneToOne: false
            referencedRelation: "skills"
            referencedColumns: ["id"]
          },
        ]
      }
      adaptive_activities: {
        Row: {
          activity_type: string
          adaptation_reason: string | null
          completed_at: string | null
          conversation_prompts: string[] | null
          created_at: string
          description: string
          difficulty_level: number
          estimated_duration_minutes: number | null
          focus_areas: Json
          id: string
          is_completed: boolean | null
          performance_after: Json | null
          phone_number: string
          practice_scenarios: Json | null
          scheduled_date: string
          strength_areas: string[] | null
          target_metrics: string[]
          target_vocabulary: string[] | null
          title: string
          updated_at: string
          user_id: string
          weakness_areas: string[] | null
        }
        Insert: {
          activity_type: string
          adaptation_reason?: string | null
          completed_at?: string | null
          conversation_prompts?: string[] | null
          created_at?: string
          description: string
          difficulty_level?: number
          estimated_duration_minutes?: number | null
          focus_areas?: Json
          id?: string
          is_completed?: boolean | null
          performance_after?: Json | null
          phone_number: string
          practice_scenarios?: Json | null
          scheduled_date: string
          strength_areas?: string[] | null
          target_metrics: string[]
          target_vocabulary?: string[] | null
          title: string
          updated_at?: string
          user_id: string
          weakness_areas?: string[] | null
        }
        Update: {
          activity_type?: string
          adaptation_reason?: string | null
          completed_at?: string | null
          conversation_prompts?: string[] | null
          created_at?: string
          description?: string
          difficulty_level?: number
          estimated_duration_minutes?: number | null
          focus_areas?: Json
          id?: string
          is_completed?: boolean | null
          performance_after?: Json | null
          phone_number?: string
          practice_scenarios?: Json | null
          scheduled_date?: string
          strength_areas?: string[] | null
          target_metrics?: string[]
          target_vocabulary?: string[] | null
          title?: string
          updated_at?: string
          user_id?: string
          weakness_areas?: string[] | null
        }
        Relationships: []
      }
      agent_audit_logs: {
        Row: {
          action: Database["public"]["Enums"]["agent_action"]
          agent_id: string | null
          created_at: string | null
          details: Json | null
          id: string
          user_id: string
        }
        Insert: {
          action: Database["public"]["Enums"]["agent_action"]
          agent_id?: string | null
          created_at?: string | null
          details?: Json | null
          id?: string
          user_id: string
        }
        Update: {
          action?: Database["public"]["Enums"]["agent_action"]
          agent_id?: string | null
          created_at?: string | null
          details?: Json | null
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "agent_audit_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_behavior_metrics: {
        Row: {
          analysis_details: Json | null
          call_date: string
          callback_usage: number | null
          continuity_score: number | null
          created_at: string
          followup_quality: number | null
          id: string
          improvement_suggestions: string[] | null
          instruction_adherence: number | null
          phone_number: string
          question_density: number | null
          recovery_score: number | null
          repetition_avoidance: number | null
          target_vocab_prompt_rate: number | null
          tone_consistency: number | null
          updated_at: string
          user_fluency_delta: number | null
          user_id: string
          vapi_call_analysis_id: string
        }
        Insert: {
          analysis_details?: Json | null
          call_date?: string
          callback_usage?: number | null
          continuity_score?: number | null
          created_at?: string
          followup_quality?: number | null
          id?: string
          improvement_suggestions?: string[] | null
          instruction_adherence?: number | null
          phone_number: string
          question_density?: number | null
          recovery_score?: number | null
          repetition_avoidance?: number | null
          target_vocab_prompt_rate?: number | null
          tone_consistency?: number | null
          updated_at?: string
          user_fluency_delta?: number | null
          user_id: string
          vapi_call_analysis_id: string
        }
        Update: {
          analysis_details?: Json | null
          call_date?: string
          callback_usage?: number | null
          continuity_score?: number | null
          created_at?: string
          followup_quality?: number | null
          id?: string
          improvement_suggestions?: string[] | null
          instruction_adherence?: number | null
          phone_number?: string
          question_density?: number | null
          recovery_score?: number | null
          repetition_avoidance?: number | null
          target_vocab_prompt_rate?: number | null
          tone_consistency?: number | null
          updated_at?: string
          user_fluency_delta?: number | null
          user_id?: string
          vapi_call_analysis_id?: string
        }
        Relationships: []
      }
      call_logs: {
        Row: {
          call_sid: string | null
          created_at: string | null
          duration: number | null
          id: string
          metadata: Json | null
          phone_number: string
          recording_url: string | null
          status: Database["public"]["Enums"]["call_status"] | null
          transcript: string | null
          user_id: string
        }
        Insert: {
          call_sid?: string | null
          created_at?: string | null
          duration?: number | null
          id?: string
          metadata?: Json | null
          phone_number: string
          recording_url?: string | null
          status?: Database["public"]["Enums"]["call_status"] | null
          transcript?: string | null
          user_id: string
        }
        Update: {
          call_sid?: string | null
          created_at?: string | null
          duration?: number | null
          id?: string
          metadata?: Json | null
          phone_number?: string
          recording_url?: string | null
          status?: Database["public"]["Enums"]["call_status"] | null
          transcript?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "call_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      call_transcripts: {
        Row: {
          call_id: string
          created_at: string | null
          transcript: string
        }
        Insert: {
          call_id: string
          created_at?: string | null
          transcript: string
        }
        Update: {
          call_id?: string
          created_at?: string | null
          transcript?: string
        }
        Relationships: []
      }
      conversations: {
        Row: {
          conversation_data: Json | null
          created_at: string | null
          duration_seconds: number | null
          id: string
          outline_id: string
          skill_id: string | null
          unit_id: string | null
          user_id: string
        }
        Insert: {
          conversation_data?: Json | null
          created_at?: string | null
          duration_seconds?: number | null
          id?: string
          outline_id: string
          skill_id?: string | null
          unit_id?: string | null
          user_id: string
        }
        Update: {
          conversation_data?: Json | null
          created_at?: string | null
          duration_seconds?: number | null
          id?: string
          outline_id?: string
          skill_id?: string | null
          unit_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversations_outline_id_fkey"
            columns: ["outline_id"]
            isOneToOne: false
            referencedRelation: "learning_outlines"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_skill_id_fkey"
            columns: ["skill_id"]
            isOneToOne: false
            referencedRelation: "skills"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "learning_units"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      core_language_metrics: {
        Row: {
          advancement_eligible: boolean | null
          analysis_confidence: number | null
          areas_for_improvement: string[] | null
          average_response_delay_seconds: number | null
          call_date: string
          composite_score: number | null
          correction_count: number | null
          created_at: string
          filler_words_detected: string[] | null
          filler_words_per_minute: number | null
          fluency_progress_delta: number | null
          id: string
          long_pause_count: number | null
          matched_target_words: string[] | null
          pauses_per_minute: number | null
          phone_number: string
          previous_session_scores: Json | null
          response_delays: number[] | null
          self_correction_rate: number | null
          speech_clarity_percent: number | null
          target_vocabulary: string[] | null
          target_vocabulary_usage_percent: number | null
          total_exchanges: number | null
          total_sentences: number | null
          total_words_spoken: number | null
          turn_count: number | null
          unique_vocabulary_count: number | null
          updated_at: string
          user_id: string
          user_speaking_time_seconds: number | null
          vapi_call_analysis_id: string
          words_correctly_transcribed: number | null
          words_per_minute: number | null
          words_used: string[] | null
        }
        Insert: {
          advancement_eligible?: boolean | null
          analysis_confidence?: number | null
          areas_for_improvement?: string[] | null
          average_response_delay_seconds?: number | null
          call_date?: string
          composite_score?: number | null
          correction_count?: number | null
          created_at?: string
          filler_words_detected?: string[] | null
          filler_words_per_minute?: number | null
          fluency_progress_delta?: number | null
          id?: string
          long_pause_count?: number | null
          matched_target_words?: string[] | null
          pauses_per_minute?: number | null
          phone_number: string
          previous_session_scores?: Json | null
          response_delays?: number[] | null
          self_correction_rate?: number | null
          speech_clarity_percent?: number | null
          target_vocabulary?: string[] | null
          target_vocabulary_usage_percent?: number | null
          total_exchanges?: number | null
          total_sentences?: number | null
          total_words_spoken?: number | null
          turn_count?: number | null
          unique_vocabulary_count?: number | null
          updated_at?: string
          user_id: string
          user_speaking_time_seconds?: number | null
          vapi_call_analysis_id: string
          words_correctly_transcribed?: number | null
          words_per_minute?: number | null
          words_used?: string[] | null
        }
        Update: {
          advancement_eligible?: boolean | null
          analysis_confidence?: number | null
          areas_for_improvement?: string[] | null
          average_response_delay_seconds?: number | null
          call_date?: string
          composite_score?: number | null
          correction_count?: number | null
          created_at?: string
          filler_words_detected?: string[] | null
          filler_words_per_minute?: number | null
          fluency_progress_delta?: number | null
          id?: string
          long_pause_count?: number | null
          matched_target_words?: string[] | null
          pauses_per_minute?: number | null
          phone_number?: string
          previous_session_scores?: Json | null
          response_delays?: number[] | null
          self_correction_rate?: number | null
          speech_clarity_percent?: number | null
          target_vocabulary?: string[] | null
          target_vocabulary_usage_percent?: number | null
          total_exchanges?: number | null
          total_sentences?: number | null
          total_words_spoken?: number | null
          turn_count?: number | null
          unique_vocabulary_count?: number | null
          updated_at?: string
          user_id?: string
          user_speaking_time_seconds?: number | null
          vapi_call_analysis_id?: string
          words_correctly_transcribed?: number | null
          words_per_minute?: number | null
          words_used?: string[] | null
        }
        Relationships: []
      }
      course_nodes: {
        Row: {
          course_id: string
          created_at: string | null
          description: string | null
          difficulty: Database["public"]["Enums"]["node_difficulty"] | null
          estimated_duration: number | null
          id: string
          name: string
          node_type: Database["public"]["Enums"]["node_type"]
          position_x: number
          position_y: number
          prerequisites: string[] | null
          updated_at: string | null
        }
        Insert: {
          course_id: string
          created_at?: string | null
          description?: string | null
          difficulty?: Database["public"]["Enums"]["node_difficulty"] | null
          estimated_duration?: number | null
          id?: string
          name: string
          node_type: Database["public"]["Enums"]["node_type"]
          position_x?: number
          position_y?: number
          prerequisites?: string[] | null
          updated_at?: string | null
        }
        Update: {
          course_id?: string
          created_at?: string | null
          description?: string | null
          difficulty?: Database["public"]["Enums"]["node_difficulty"] | null
          estimated_duration?: number | null
          id?: string
          name?: string
          node_type?: Database["public"]["Enums"]["node_type"]
          position_x?: number
          position_y?: number
          prerequisites?: string[] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "course_nodes_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          language: string
          name: string
          total_nodes: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          language?: string
          name: string
          total_nodes?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          language?: string
          name?: string
          total_nodes?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      curriculum_insights: {
        Row: {
          comparison_analysis: Json
          confidence_score: number | null
          created_at: string
          id: string
          insights: Json
          learning_recommendations: Json
          phone_number: string
          updated_at: string
          user_id: string
        }
        Insert: {
          comparison_analysis: Json
          confidence_score?: number | null
          created_at?: string
          id?: string
          insights: Json
          learning_recommendations: Json
          phone_number: string
          updated_at?: string
          user_id: string
        }
        Update: {
          comparison_analysis?: Json
          confidence_score?: number | null
          created_at?: string
          id?: string
          insights?: Json
          learning_recommendations?: Json
          phone_number?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      daily_recommendations: {
        Row: {
          completed: boolean | null
          created_at: string | null
          id: string
          node_id: string
          recommended_date: string
          user_id: string
        }
        Insert: {
          completed?: boolean | null
          created_at?: string | null
          id?: string
          node_id: string
          recommended_date?: string
          user_id: string
        }
        Update: {
          completed?: boolean | null
          created_at?: string | null
          id?: string
          node_id?: string
          recommended_date?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "daily_recommendations_node_id_fkey"
            columns: ["node_id"]
            isOneToOne: false
            referencedRelation: "course_nodes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "daily_recommendations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      fluency_levels: {
        Row: {
          color_code: string | null
          created_at: string
          description: string
          goal_description: string
          id: string
          level_number: number
          name: string
          target_vocabulary_size: number | null
          target_wpm_max: number | null
          target_wpm_min: number | null
          updated_at: string
        }
        Insert: {
          color_code?: string | null
          created_at?: string
          description: string
          goal_description: string
          id?: string
          level_number: number
          name: string
          target_vocabulary_size?: number | null
          target_wpm_max?: number | null
          target_wpm_min?: number | null
          updated_at?: string
        }
        Update: {
          color_code?: string | null
          created_at?: string
          description?: string
          goal_description?: string
          id?: string
          level_number?: number
          name?: string
          target_vocabulary_size?: number | null
          target_wpm_max?: number | null
          target_wpm_min?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      learning_outlines: {
        Row: {
          created_at: string | null
          description: string | null
          difficulty_level: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          difficulty_level?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          difficulty_level?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      learning_units: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          outline_id: string
          unit_order: number
          unlock_threshold: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          outline_id: string
          unit_order: number
          unlock_threshold?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          outline_id?: string
          unit_order?: number
          unlock_threshold?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "learning_units_outline_id_fkey"
            columns: ["outline_id"]
            isOneToOne: false
            referencedRelation: "learning_outlines"
            referencedColumns: ["id"]
          },
        ]
      }
      level_skills: {
        Row: {
          created_at: string
          example_phrases: Json | null
          fluency_level_id: string
          id: string
          skill_category: string
          skill_description: string
          skill_name: string
          skill_order: number
          target_vocabulary: Json | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          example_phrases?: Json | null
          fluency_level_id: string
          id?: string
          skill_category: string
          skill_description: string
          skill_name: string
          skill_order?: number
          target_vocabulary?: Json | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          example_phrases?: Json | null
          fluency_level_id?: string
          id?: string
          skill_category?: string
          skill_description?: string
          skill_name?: string
          skill_order?: number
          target_vocabulary?: Json | null
          updated_at?: string
        }
        Relationships: []
      }
      mini_skills: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          max_score: number | null
          mini_skill_order: number
          name: string
          skill_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          max_score?: number | null
          mini_skill_order: number
          name: string
          skill_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          max_score?: number | null
          mini_skill_order?: number
          name?: string
          skill_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "mini_skills_skill_id_fkey"
            columns: ["skill_id"]
            isOneToOne: false
            referencedRelation: "skills"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          body: string
          created_at: string | null
          id: string
          read_at: string | null
          sent_at: string | null
          title: string
          type: string | null
          user_id: string
        }
        Insert: {
          body: string
          created_at?: string | null
          id?: string
          read_at?: string | null
          sent_at?: string | null
          title: string
          type?: string | null
          user_id: string
        }
        Update: {
          body?: string
          created_at?: string | null
          id?: string
          read_at?: string | null
          sent_at?: string | null
          title?: string
          type?: string | null
          user_id?: string
        }
        Relationships: []
      }
      pronunciation_results: {
        Row: {
          audio_url: string | null
          call_id: string | null
          created_at: string | null
          id: string
          language_id: string | null
          overall_score: number | null
          post_id: string | null
          text_content: string | null
          user_id: string | null
          word_scores: Json | null
        }
        Insert: {
          audio_url?: string | null
          call_id?: string | null
          created_at?: string | null
          id?: string
          language_id?: string | null
          overall_score?: number | null
          post_id?: string | null
          text_content?: string | null
          user_id?: string | null
          word_scores?: Json | null
        }
        Update: {
          audio_url?: string | null
          call_id?: string | null
          created_at?: string | null
          id?: string
          language_id?: string | null
          overall_score?: number | null
          post_id?: string | null
          text_content?: string | null
          user_id?: string | null
          word_scores?: Json | null
        }
        Relationships: []
      }
      security_audit_logs: {
        Row: {
          action: string | null
          created_at: string | null
          details: Json | null
          id: number
          ip_address: string | null
          phone_number: string | null
          user_agent: string | null
        }
        Insert: {
          action?: string | null
          created_at?: string | null
          details?: Json | null
          id?: number
          ip_address?: string | null
          phone_number?: string | null
          user_agent?: string | null
        }
        Update: {
          action?: string | null
          created_at?: string | null
          details?: Json | null
          id?: number
          ip_address?: string | null
          phone_number?: string | null
          user_agent?: string | null
        }
        Relationships: []
      }
      session_context: {
        Row: {
          context: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          context?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          context?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "session_context_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      skill_explanations: {
        Row: {
          created_at: string
          difficulty_tips: string | null
          examples: Json
          explanation: string
          id: string
          skill_id: string
          updated_at: string
          use_cases: Json
        }
        Insert: {
          created_at?: string
          difficulty_tips?: string | null
          examples: Json
          explanation: string
          id?: string
          skill_id: string
          updated_at?: string
          use_cases: Json
        }
        Update: {
          created_at?: string
          difficulty_tips?: string | null
          examples?: Json
          explanation?: string
          id?: string
          skill_id?: string
          updated_at?: string
          use_cases?: Json
        }
        Relationships: [
          {
            foreignKeyName: "skill_explanations_skill_id_fkey"
            columns: ["skill_id"]
            isOneToOne: false
            referencedRelation: "skills"
            referencedColumns: ["id"]
          },
        ]
      }
      skill_test_prompts: {
        Row: {
          created_at: string
          difficulty_modifier: number | null
          expected_vocabulary: Json | null
          id: string
          level_skill_id: string
          prompt_text: string
          prompt_type: string
          success_criteria: Json
        }
        Insert: {
          created_at?: string
          difficulty_modifier?: number | null
          expected_vocabulary?: Json | null
          id?: string
          level_skill_id: string
          prompt_text: string
          prompt_type: string
          success_criteria: Json
        }
        Update: {
          created_at?: string
          difficulty_modifier?: number | null
          expected_vocabulary?: Json | null
          id?: string
          level_skill_id?: string
          prompt_text?: string
          prompt_type?: string
          success_criteria?: Json
        }
        Relationships: []
      }
      skills: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          skill_order: number
          unit_id: string
          unlock_threshold: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          skill_order: number
          unit_id: string
          unlock_threshold?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          skill_order?: number
          unit_id?: string
          unlock_threshold?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "skills_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "learning_units"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          created_at: string | null
          id: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          subscription: Json
          subscription_end: string | null
          subscription_status: string | null
          subscription_tier: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          subscription: Json
          subscription_end?: string | null
          subscription_status?: string | null
          subscription_tier?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          subscription?: Json
          subscription_end?: string | null
          subscription_status?: string | null
          subscription_tier?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      system_prompt_evolution: {
        Row: {
          created_at: string
          current_prompt: string
          effectiveness_score: number | null
          evolution_reason: string | null
          id: string
          improvement_rationale: string | null
          is_active: boolean | null
          phone_number: string
          previous_prompt: string | null
          trigger_metrics: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_prompt: string
          effectiveness_score?: number | null
          evolution_reason?: string | null
          id?: string
          improvement_rationale?: string | null
          is_active?: boolean | null
          phone_number: string
          previous_prompt?: string | null
          trigger_metrics?: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_prompt?: string
          effectiveness_score?: number | null
          evolution_reason?: string | null
          id?: string
          improvement_rationale?: string | null
          is_active?: boolean | null
          phone_number?: string
          previous_prompt?: string | null
          trigger_metrics?: Json
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      system_prompt_templates: {
        Row: {
          created_at: string
          id: string
          is_active: boolean | null
          phone_number: string
          template_content: string
          template_version: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean | null
          phone_number: string
          template_content: string
          template_version?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean | null
          phone_number?: string
          template_content?: string
          template_version?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_activity_ratings: {
        Row: {
          activity_id: string
          completed_at: string | null
          created_at: string | null
          duration_seconds: number | null
          feedback_notes: string | null
          id: string
          rating: number
          skill_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          activity_id: string
          completed_at?: string | null
          created_at?: string | null
          duration_seconds?: number | null
          feedback_notes?: string | null
          id?: string
          rating: number
          skill_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          activity_id?: string
          completed_at?: string | null
          created_at?: string | null
          duration_seconds?: number | null
          feedback_notes?: string | null
          id?: string
          rating?: number
          skill_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_activity_ratings_activity_id_fkey"
            columns: ["activity_id"]
            isOneToOne: false
            referencedRelation: "activities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_activity_ratings_skill_id_fkey"
            columns: ["skill_id"]
            isOneToOne: false
            referencedRelation: "skills"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_activity_ratings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_course_progress: {
        Row: {
          completed_nodes: number | null
          course_id: string
          id: string
          last_activity: string | null
          overall_progress: number | null
          started_at: string | null
          user_id: string
        }
        Insert: {
          completed_nodes?: number | null
          course_id: string
          id?: string
          last_activity?: string | null
          overall_progress?: number | null
          started_at?: string | null
          user_id: string
        }
        Update: {
          completed_nodes?: number | null
          course_id?: string
          id?: string
          last_activity?: string | null
          overall_progress?: number | null
          started_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_course_progress_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_course_progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_fluency_progress: {
        Row: {
          created_at: string
          current_level_id: string
          current_skill_id: string | null
          current_streak_days: number | null
          fluency_composite_score: number | null
          id: string
          last_practice_date: string | null
          level_progress_percentage: number | null
          skills_mastered: number | null
          total_skills_in_level: number | null
          updated_at: string
          user_id: string
          vocabulary_learned_count: number | null
        }
        Insert: {
          created_at?: string
          current_level_id: string
          current_skill_id?: string | null
          current_streak_days?: number | null
          fluency_composite_score?: number | null
          id?: string
          last_practice_date?: string | null
          level_progress_percentage?: number | null
          skills_mastered?: number | null
          total_skills_in_level?: number | null
          updated_at?: string
          user_id: string
          vocabulary_learned_count?: number | null
        }
        Update: {
          created_at?: string
          current_level_id?: string
          current_skill_id?: string | null
          current_streak_days?: number | null
          fluency_composite_score?: number | null
          id?: string
          last_practice_date?: string | null
          level_progress_percentage?: number | null
          skills_mastered?: number | null
          total_skills_in_level?: number | null
          updated_at?: string
          user_id?: string
          vocabulary_learned_count?: number | null
        }
        Relationships: []
      }
      user_level_progression: {
        Row: {
          advancement_blocked_reason: string | null
          created_at: string
          current_level: string
          id: string
          level_start_date: string
          phone_number: string
          sessions_meeting_criteria: number | null
          target_clarity_percent: number | null
          target_filler_rate: number | null
          target_pause_rate: number | null
          target_response_delay: number | null
          target_turn_count: number | null
          target_unique_words: number | null
          target_vocab_usage_percent: number | null
          target_wpm: number | null
          total_sessions_in_level: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          advancement_blocked_reason?: string | null
          created_at?: string
          current_level?: string
          id?: string
          level_start_date?: string
          phone_number: string
          sessions_meeting_criteria?: number | null
          target_clarity_percent?: number | null
          target_filler_rate?: number | null
          target_pause_rate?: number | null
          target_response_delay?: number | null
          target_turn_count?: number | null
          target_unique_words?: number | null
          target_vocab_usage_percent?: number | null
          target_wpm?: number | null
          total_sessions_in_level?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          advancement_blocked_reason?: string | null
          created_at?: string
          current_level?: string
          id?: string
          level_start_date?: string
          phone_number?: string
          sessions_meeting_criteria?: number | null
          target_clarity_percent?: number | null
          target_filler_rate?: number | null
          target_pause_rate?: number | null
          target_response_delay?: number | null
          target_turn_count?: number | null
          target_unique_words?: number | null
          target_vocab_usage_percent?: number | null
          target_wpm?: number | null
          total_sessions_in_level?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_mini_skill_scores: {
        Row: {
          attempts: number | null
          created_at: string | null
          id: string
          last_practiced: string | null
          mini_skill_id: string
          score: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          attempts?: number | null
          created_at?: string | null
          id?: string
          last_practiced?: string | null
          mini_skill_id: string
          score?: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          attempts?: number | null
          created_at?: string | null
          id?: string
          last_practiced?: string | null
          mini_skill_id?: string
          score?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_mini_skill_scores_mini_skill_id_fkey"
            columns: ["mini_skill_id"]
            isOneToOne: false
            referencedRelation: "mini_skills"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_mini_skill_scores_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_node_progress: {
        Row: {
          created_at: string | null
          fluency_percentage: number | null
          id: string
          last_practiced: string | null
          mastered_at: string | null
          node_id: string
          practice_sessions: number | null
          status: Database["public"]["Enums"]["node_status"] | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          fluency_percentage?: number | null
          id?: string
          last_practiced?: string | null
          mastered_at?: string | null
          node_id: string
          practice_sessions?: number | null
          status?: Database["public"]["Enums"]["node_status"] | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          fluency_percentage?: number | null
          id?: string
          last_practiced?: string | null
          mastered_at?: string | null
          node_id?: string
          practice_sessions?: number | null
          status?: Database["public"]["Enums"]["node_status"] | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_node_progress_node_id_fkey"
            columns: ["node_id"]
            isOneToOne: false
            referencedRelation: "course_nodes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_node_progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_outline_progress: {
        Row: {
          created_at: string | null
          current_skill_id: string | null
          current_unit_id: string | null
          id: string
          outline_id: string
          overall_progress_percentage: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          current_skill_id?: string | null
          current_unit_id?: string | null
          id?: string
          outline_id: string
          overall_progress_percentage?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          current_skill_id?: string | null
          current_unit_id?: string | null
          id?: string
          outline_id?: string
          overall_progress_percentage?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_outline_progress_current_skill_id_fkey"
            columns: ["current_skill_id"]
            isOneToOne: false
            referencedRelation: "skills"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_outline_progress_current_unit_id_fkey"
            columns: ["current_unit_id"]
            isOneToOne: false
            referencedRelation: "learning_units"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_outline_progress_outline_id_fkey"
            columns: ["outline_id"]
            isOneToOne: false
            referencedRelation: "learning_outlines"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_outline_progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profiles: {
        Row: {
          auth_user_id: string | null
          created_at: string | null
          fcm_token: string | null
          full_name: string
          id: string
          language: string | null
          last_conversation_summary: string | null
          phone_number: string
          preferred_call_time: string | null
          proficiency_level: number | null
          updated_at: string | null
        }
        Insert: {
          auth_user_id?: string | null
          created_at?: string | null
          fcm_token?: string | null
          full_name: string
          id?: string
          language?: string | null
          last_conversation_summary?: string | null
          phone_number: string
          preferred_call_time?: string | null
          proficiency_level?: number | null
          updated_at?: string | null
        }
        Update: {
          auth_user_id?: string | null
          created_at?: string | null
          fcm_token?: string | null
          full_name?: string
          id?: string
          language?: string | null
          last_conversation_summary?: string | null
          phone_number?: string
          preferred_call_time?: string | null
          proficiency_level?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      user_skill_mastery: {
        Row: {
          attempts_count: number | null
          best_score: number | null
          common_errors: Json | null
          created_at: string
          id: string
          last_practiced: string | null
          level_skill_id: string
          mastered_at: string | null
          mastery_level: number | null
          updated_at: string
          user_id: string
          vocabulary_retention: Json | null
        }
        Insert: {
          attempts_count?: number | null
          best_score?: number | null
          common_errors?: Json | null
          created_at?: string
          id?: string
          last_practiced?: string | null
          level_skill_id: string
          mastered_at?: string | null
          mastery_level?: number | null
          updated_at?: string
          user_id: string
          vocabulary_retention?: Json | null
        }
        Update: {
          attempts_count?: number | null
          best_score?: number | null
          common_errors?: Json | null
          created_at?: string
          id?: string
          last_practiced?: string | null
          level_skill_id?: string
          mastered_at?: string | null
          mastery_level?: number | null
          updated_at?: string
          user_id?: string
          vocabulary_retention?: Json | null
        }
        Relationships: []
      }
      vapi_call_analysis: {
        Row: {
          call_data: Json
          call_duration: number | null
          call_ended_at: string | null
          call_started_at: string | null
          call_status: string | null
          conversation_id: string | null
          created_at: string
          extracted_insights: Json | null
          id: string
          performance_metrics: Json | null
          phone_number: string
          sentiment_analysis: Json | null
          transcript: string | null
          updated_at: string
          user_id: string
          vapi_call_id: string
        }
        Insert: {
          call_data: Json
          call_duration?: number | null
          call_ended_at?: string | null
          call_started_at?: string | null
          call_status?: string | null
          conversation_id?: string | null
          created_at?: string
          extracted_insights?: Json | null
          id?: string
          performance_metrics?: Json | null
          phone_number: string
          sentiment_analysis?: Json | null
          transcript?: string | null
          updated_at?: string
          user_id: string
          vapi_call_id: string
        }
        Update: {
          call_data?: Json
          call_duration?: number | null
          call_ended_at?: string | null
          call_started_at?: string | null
          call_status?: string | null
          conversation_id?: string | null
          created_at?: string
          extracted_insights?: Json | null
          id?: string
          performance_metrics?: Json | null
          phone_number?: string
          sentiment_analysis?: Json | null
          transcript?: string | null
          updated_at?: string
          user_id?: string
          vapi_call_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vapi_call_analysis_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_composite_score: {
        Args: {
          p_wpm: number
          p_unique_words: number
          p_target_vocab_percent: number
          p_filler_rate: number
          p_pause_rate: number
          p_turn_count: number
          p_clarity_percent: number
          p_response_delay: number
          p_self_correction_rate: number
          p_progress_delta: number
        }
        Returns: number
      }
      calculate_skill_progress: {
        Args: { p_user_id: string; p_skill_id: string }
        Returns: number
      }
      calculate_unit_progress: {
        Args: { p_user_id: string; p_unit_id: string }
        Returns: number
      }
      check_available_minutes: {
        Args: { p_phone_number: string }
        Returns: {
          has_minutes: boolean
          minutes_used: number
          minutes_remaining: number
          subscription_status: string
          needs_upgrade: boolean
        }[]
      }
      check_level_advancement: {
        Args: { p_user_id: string; p_phone_number: string }
        Returns: {
          eligible: boolean
          current_level: string
          sessions_qualified: number
          reason: string
        }[]
      }
      create_user: {
        Args: { p_phone_number: string; p_language: string }
        Returns: undefined
      }
      create_user_with_phone: {
        Args: { p_phone_number: string; p_language?: string }
        Returns: string
      }
      is_skill_unlocked: {
        Args: { p_user_id: string; p_skill_id: string }
        Returns: boolean
      }
      is_unit_unlocked: {
        Args: { p_user_id: string; p_unit_id: string }
        Returns: boolean
      }
      setLanguage: {
        Args: { p_language: string; p_phone_number: string }
        Returns: undefined
      }
      update_last_convo: {
        Args: { p_phone_number: string; p_summary: string }
        Returns: undefined
      }
    }
    Enums: {
      agent_action: "created" | "called" | "updated"
      call_status: "completed" | "failed" | "missed" | "in_progress"
      message_role: "user" | "assistant" | "system"
      node_difficulty: "beginner" | "intermediate" | "advanced"
      node_status:
        | "locked"
        | "available"
        | "in_progress"
        | "completed"
        | "mastered"
      node_type:
        | "core_grammar"
        | "survival_language"
        | "social_conversation"
        | "formal_business"
        | "fun_personality"
      persona_type:
        | "goose_strict"
        | "goose_flirty"
        | "goose_chaotic"
        | "goose_supportive"
      proficiency_level: "beginner" | "intermediate" | "advanced"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      agent_action: ["created", "called", "updated"],
      call_status: ["completed", "failed", "missed", "in_progress"],
      message_role: ["user", "assistant", "system"],
      node_difficulty: ["beginner", "intermediate", "advanced"],
      node_status: [
        "locked",
        "available",
        "in_progress",
        "completed",
        "mastered",
      ],
      node_type: [
        "core_grammar",
        "survival_language",
        "social_conversation",
        "formal_business",
        "fun_personality",
      ],
      persona_type: [
        "goose_strict",
        "goose_flirty",
        "goose_chaotic",
        "goose_supportive",
      ],
      proficiency_level: ["beginner", "intermediate", "advanced"],
    },
  },
} as const
