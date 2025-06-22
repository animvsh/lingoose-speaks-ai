export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
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
      pronunciation_results: {
        Row: {
          audio_url: string | null
          created_at: string | null
          details: Json | null
          id: string
          language: string | null
          overall_score: number | null
          post_id: string | null
          text: string | null
        }
        Insert: {
          audio_url?: string | null
          created_at?: string | null
          details?: Json | null
          id?: string
          language?: string | null
          overall_score?: number | null
          post_id?: string | null
          text?: string | null
        }
        Update: {
          audio_url?: string | null
          created_at?: string | null
          details?: Json | null
          id?: string
          language?: string | null
          overall_score?: number | null
          post_id?: string | null
          text?: string | null
        }
        Relationships: []
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
          subscription: Json
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          subscription: Json
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          subscription?: Json
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
          full_name: string
          id: string
          language: string | null
          last_conversation_summary: string | null
          phone_number: string
          preferred_call_time: string | null
          updated_at: string | null
        }
        Insert: {
          auth_user_id?: string | null
          created_at?: string | null
          full_name: string
          id?: string
          language?: string | null
          last_conversation_summary?: string | null
          phone_number: string
          preferred_call_time?: string | null
          updated_at?: string | null
        }
        Update: {
          auth_user_id?: string | null
          created_at?: string | null
          full_name?: string
          id?: string
          language?: string | null
          last_conversation_summary?: string | null
          phone_number?: string
          preferred_call_time?: string | null
          updated_at?: string | null
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
      calculate_skill_progress: {
        Args: { p_user_id: string; p_skill_id: string }
        Returns: number
      }
      calculate_unit_progress: {
        Args: { p_user_id: string; p_unit_id: string }
        Returns: number
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
      update_conversation_summary: {
        Args: { p_user_id: string; p_summary: string }
        Returns: undefined
      }
      update_last_convo: {
        Args: { p_phone_number: string; p_summary: string }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
