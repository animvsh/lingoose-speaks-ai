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
      conversations: {
        Row: {
          call_log_id: string | null
          created_at: string | null
          id: string
          message: string
          metadata: Json | null
          role: Database["public"]["Enums"]["message_role"]
          updated_at: string | null
          user_id: string
        }
        Insert: {
          call_log_id?: string | null
          created_at?: string | null
          id?: string
          message: string
          metadata?: Json | null
          role: Database["public"]["Enums"]["message_role"]
          updated_at?: string | null
          user_id: string
        }
        Update: {
          call_log_id?: string | null
          created_at?: string | null
          id?: string
          message?: string
          metadata?: Json | null
          role?: Database["public"]["Enums"]["message_role"]
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversations_call_log_id_fkey"
            columns: ["call_log_id"]
            isOneToOne: false
            referencedRelation: "call_logs"
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
      user_profiles: {
        Row: {
          created_at: string | null
          full_name: string
          id: string
          language_goal: string | null
          persona: Database["public"]["Enums"]["persona_type"] | null
          phone_number: string
          proficiency_level:
            | Database["public"]["Enums"]["proficiency_level"]
            | null
          updated_at: string | null
          voice_preferences: Json | null
        }
        Insert: {
          created_at?: string | null
          full_name: string
          id: string
          language_goal?: string | null
          persona?: Database["public"]["Enums"]["persona_type"] | null
          phone_number: string
          proficiency_level?:
            | Database["public"]["Enums"]["proficiency_level"]
            | null
          updated_at?: string | null
          voice_preferences?: Json | null
        }
        Update: {
          created_at?: string | null
          full_name?: string
          id?: string
          language_goal?: string | null
          persona?: Database["public"]["Enums"]["persona_type"] | null
          phone_number?: string
          proficiency_level?:
            | Database["public"]["Enums"]["proficiency_level"]
            | null
          updated_at?: string | null
          voice_preferences?: Json | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      agent_action: "created" | "called" | "updated"
      call_status: "completed" | "failed" | "missed" | "in_progress"
      message_role: "user" | "assistant" | "system"
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
    Enums: {
      agent_action: ["created", "called", "updated"],
      call_status: ["completed", "failed", "missed", "in_progress"],
      message_role: ["user", "assistant", "system"],
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
