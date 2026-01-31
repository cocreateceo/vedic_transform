export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string | null;
          phone: string | null;
          full_name: string | null;
          avatar_url: string | null;
          timezone: string;
          wake_up_goal: string;
          created_at: string;
          updated_at: string;
          onboarding_completed: boolean;
          notification_preferences: Json;
        };
        Insert: {
          id: string;
          email?: string | null;
          phone?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          timezone?: string;
          wake_up_goal?: string;
          created_at?: string;
          updated_at?: string;
          onboarding_completed?: boolean;
          notification_preferences?: Json;
        };
        Update: {
          id?: string;
          email?: string | null;
          phone?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          timezone?: string;
          wake_up_goal?: string;
          created_at?: string;
          updated_at?: string;
          onboarding_completed?: boolean;
          notification_preferences?: Json;
        };
      };
      pillars: {
        Row: {
          id: number;
          slug: string;
          name: string;
          sanskrit_name: string | null;
          description: string | null;
          icon: string;
          color: string;
          order_index: number;
          category: "body" | "mind" | "spirit";
          default_duration_minutes: number;
          karma_points_base: number;
          created_at: string;
        };
        Insert: {
          id?: number;
          slug: string;
          name: string;
          sanskrit_name?: string | null;
          description?: string | null;
          icon: string;
          color: string;
          order_index: number;
          category: "body" | "mind" | "spirit";
          default_duration_minutes?: number;
          karma_points_base?: number;
          created_at?: string;
        };
        Update: {
          id?: number;
          slug?: string;
          name?: string;
          sanskrit_name?: string | null;
          description?: string | null;
          icon?: string;
          color?: string;
          order_index?: number;
          category?: "body" | "mind" | "spirit";
          default_duration_minutes?: number;
          karma_points_base?: number;
          created_at?: string;
        };
      };
      journeys: {
        Row: {
          id: string;
          user_id: string;
          start_date: string;
          end_date: string;
          is_active: boolean;
          completed_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          start_date: string;
          is_active?: boolean;
          completed_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          start_date?: string;
          is_active?: boolean;
          completed_at?: string | null;
          created_at?: string;
        };
      };
      daily_checkins: {
        Row: {
          id: string;
          user_id: string;
          journey_id: string;
          pillar_id: number;
          checkin_date: string;
          completed: boolean;
          completed_at: string | null;
          duration_minutes: number | null;
          notes: string | null;
          metadata: Json;
          karma_earned: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          journey_id: string;
          pillar_id: number;
          checkin_date?: string;
          completed?: boolean;
          completed_at?: string | null;
          duration_minutes?: number | null;
          notes?: string | null;
          metadata?: Json;
          karma_earned?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          journey_id?: string;
          pillar_id?: number;
          checkin_date?: string;
          completed?: boolean;
          completed_at?: string | null;
          duration_minutes?: number | null;
          notes?: string | null;
          metadata?: Json;
          karma_earned?: number;
          created_at?: string;
        };
      };
      karma_transactions: {
        Row: {
          id: string;
          user_id: string;
          points: number;
          transaction_type: "earned" | "bonus" | "milestone" | "streak";
          description: string | null;
          reference_type: string | null;
          reference_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          points: number;
          transaction_type: "earned" | "bonus" | "milestone" | "streak";
          description?: string | null;
          reference_type?: string | null;
          reference_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          points?: number;
          transaction_type?: "earned" | "bonus" | "milestone" | "streak";
          description?: string | null;
          reference_type?: string | null;
          reference_id?: string | null;
          created_at?: string;
        };
      };
      streaks: {
        Row: {
          id: string;
          user_id: string;
          journey_id: string;
          current_streak: number;
          longest_streak: number;
          last_checkin_date: string | null;
          streak_started_at: string | null;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          journey_id: string;
          current_streak?: number;
          longest_streak?: number;
          last_checkin_date?: string | null;
          streak_started_at?: string | null;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          journey_id?: string;
          current_streak?: number;
          longest_streak?: number;
          last_checkin_date?: string | null;
          streak_started_at?: string | null;
          updated_at?: string;
        };
      };
      badges: {
        Row: {
          id: number;
          slug: string;
          name: string;
          description: string | null;
          icon_url: string | null;
          requirement_type: "days" | "streak" | "pillar" | "karma" | "special";
          requirement_value: number;
          karma_bonus: number;
          created_at: string;
        };
        Insert: {
          id?: number;
          slug: string;
          name: string;
          description?: string | null;
          icon_url?: string | null;
          requirement_type: "days" | "streak" | "pillar" | "karma" | "special";
          requirement_value: number;
          karma_bonus?: number;
          created_at?: string;
        };
        Update: {
          id?: number;
          slug?: string;
          name?: string;
          description?: string | null;
          icon_url?: string | null;
          requirement_type?: "days" | "streak" | "pillar" | "karma" | "special";
          requirement_value?: number;
          karma_bonus?: number;
          created_at?: string;
        };
      };
      user_badges: {
        Row: {
          id: string;
          user_id: string;
          badge_id: number;
          earned_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          badge_id: number;
          earned_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          badge_id?: number;
          earned_at?: string;
        };
      };
      gratitude_entries: {
        Row: {
          id: string;
          user_id: string;
          checkin_id: string | null;
          entry_date: string;
          gratitude_1: string | null;
          gratitude_2: string | null;
          gratitude_3: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          checkin_id?: string | null;
          entry_date?: string;
          gratitude_1?: string | null;
          gratitude_2?: string | null;
          gratitude_3?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          checkin_id?: string | null;
          entry_date?: string;
          gratitude_1?: string | null;
          gratitude_2?: string | null;
          gratitude_3?: string | null;
          created_at?: string;
        };
      };
      intentions: {
        Row: {
          id: string;
          user_id: string;
          checkin_id: string | null;
          intention_date: string;
          intention_text: string;
          sentiment_score: number | null;
          fulfilled: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          checkin_id?: string | null;
          intention_date?: string;
          intention_text: string;
          sentiment_score?: number | null;
          fulfilled?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          checkin_id?: string | null;
          intention_date?: string;
          intention_text?: string;
          sentiment_score?: number | null;
          fulfilled?: boolean;
          created_at?: string;
        };
      };
      mood_logs: {
        Row: {
          id: string;
          user_id: string;
          log_date: string;
          time_of_day: "morning" | "afternoon" | "evening";
          mood_score: number;
          energy_level: number;
          stress_level: number;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          log_date?: string;
          time_of_day: "morning" | "afternoon" | "evening";
          mood_score: number;
          energy_level: number;
          stress_level: number;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          log_date?: string;
          time_of_day?: "morning" | "afternoon" | "evening";
          mood_score?: number;
          energy_level?: number;
          stress_level?: number;
          notes?: string | null;
          created_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
