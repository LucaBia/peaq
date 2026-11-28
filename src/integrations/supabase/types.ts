export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      athlete_documents: {
        Row: {
          card_number: string | null
          created_at: string
          doc_type: string
          expires_on: string | null
          id: string
          organization: string | null
          review_note: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: string
          storage_path: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          card_number?: string | null
          created_at?: string
          doc_type: string
          expires_on?: string | null
          id?: string
          organization?: string | null
          review_note?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          storage_path?: string | null
          updated_at?: string
          user_id?: string
        }
        Update: {
          card_number?: string | null
          created_at?: string
          doc_type?: string
          expires_on?: string | null
          id?: string
          organization?: string | null
          review_note?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          storage_path?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      athlete_performance: {
        Row: {
          bike_wkg: number | null
          run_distance_km: number | null
          run_time_seconds: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          bike_wkg?: number | null
          run_distance_km?: number | null
          run_time_seconds?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          bike_wkg?: number | null
          run_distance_km?: number | null
          run_time_seconds?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "athlete_performance_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "athlete_profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      athlete_private: {
        Row: {
          date_of_birth: string
          gender: string
          updated_at: string
          user_id: string
        }
        Insert: {
          date_of_birth: string
          gender: string
          updated_at?: string
          user_id: string
        }
        Update: {
          date_of_birth?: string
          gender?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "athlete_private_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "athlete_profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      athlete_profiles: {
        Row: {
          bib_number: number | null
          bib_variant: string
          city_id: string | null
          created_at: string
          discipline: string | null
          nationality: string | null
          onboarding_completed_at: string | null
          updated_at: string
          user_id: string
          username: string | null
        }
        Insert: {
          bib_number?: number | null
          bib_variant?: string
          city_id?: string | null
          created_at?: string
          discipline?: string | null
          nationality?: string | null
          onboarding_completed_at?: string | null
          updated_at?: string
          user_id: string
          username?: string | null
        }
        Update: {
          bib_number?: number | null
          bib_variant?: string
          city_id?: string | null
          created_at?: string
          discipline?: string | null
          nationality?: string | null
          onboarding_completed_at?: string | null
          updated_at?: string
          user_id?: string
          username?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "athlete_profiles_city_id_fkey"
            columns: ["city_id"]
            isOneToOne: false
            referencedRelation: "cities"
            referencedColumns: ["id"]
          },
        ]
      }
      athlete_progression: {
        Row: {
          events_completed: number
          level: number
          updated_at: string
          user_id: string
          xp: number
        }
        Insert: {
          events_completed?: number
          level?: number
          updated_at?: string
          user_id: string
          xp?: number
        }
        Update: {
          events_completed?: number
          level?: number
          updated_at?: string
          user_id?: string
          xp?: number
        }
        Relationships: [
          {
            foreignKeyName: "athlete_progression_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "athlete_profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      athlete_ratings: {
        Row: {
          created_at: string
          discipline: string
          league: string
          placement_races_completed: number
          placement_races_required: number
          provisional: boolean
          rating: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          discipline: string
          league?: string
          placement_races_completed?: number
          placement_races_required?: number
          provisional?: boolean
          rating?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          discipline?: string
          league?: string
          placement_races_completed?: number
          placement_races_required?: number
          provisional?: boolean
          rating?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "athlete_ratings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "athlete_profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      cities: {
        Row: {
          country_code: string
          id: string
          lat: number | null
          lng: number | null
          name: string
          region: string | null
        }
        Insert: {
          country_code: string
          id: string
          lat?: number | null
          lng?: number | null
          name: string
          region?: string | null
        }
        Update: {
          country_code?: string
          id?: string
          lat?: number | null
          lng?: number | null
          name?: string
          region?: string | null
        }
        Relationships: []
      }
      events: {
        Row: {
          capacity: number | null
          city_id: string | null
          created_at: string
          created_by: string | null
          description: string | null
          discipline: string
          id: string
          location: string | null
          starts_at: string
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          capacity?: number | null
          city_id?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          discipline: string
          id?: string
          location?: string | null
          starts_at: string
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          capacity?: number | null
          city_id?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          discipline?: string
          id?: string
          location?: string | null
          starts_at?: string
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "events_city_id_fkey"
            columns: ["city_id"]
            isOneToOne: false
            referencedRelation: "cities"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_preferences: {
        Row: {
          decided_at: string
          lobby_opening: boolean
          new_events: boolean
          results: boolean
          user_id: string
        }
        Insert: {
          decided_at?: string
          lobby_opening?: boolean
          new_events?: boolean
          results?: boolean
          user_id?: string
        }
        Update: {
          decided_at?: string
          lobby_opening?: boolean
          new_events?: boolean
          results?: boolean
          user_id?: string
        }
        Relationships: []
      }
      onboarding_progress: {
        Row: {
          current_step: number
          draft: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          current_step?: number
          draft?: Json
          updated_at?: string
          user_id?: string
        }
        Update: {
          current_step?: number
          draft?: Json
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      waitlist: {
        Row: {
          consent: boolean
          created_at: string
          discipline: string | null
          email: string
          id: string
          locale: string
        }
        Insert: {
          consent?: boolean
          created_at?: string
          discipline?: string | null
          email: string
          id?: string
          locale?: string
        }
        Update: {
          consent?: boolean
          created_at?: string
          discipline?: string | null
          email?: string
          id?: string
          locale?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      admin_list_admins: {
        Args: never
        Returns: {
          email: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
          username: string
        }[]
      }
      admin_list_athletes: {
        Args: never
        Returns: {
          bib_number: number
          city_id: string
          created_at: string
          discipline: string
          email: string
          nationality: string
          onboarding_completed_at: string
          user_id: string
          username: string
        }[]
      }
      admin_list_documents: {
        Args: { _status?: string }
        Returns: {
          card_number: string
          created_at: string
          doc_type: string
          email: string
          expires_on: string
          id: string
          organization: string
          review_note: string
          reviewed_at: string
          status: string
          storage_path: string
          user_id: string
          username: string
        }[]
      }
      admin_set_admin: {
        Args: { _grant: boolean; _user_id: string }
        Returns: undefined
      }
      bib_status: { Args: { _number: number }; Returns: string }
      claim_bib: { Args: { _number: number }; Returns: number }
      complete_onboarding: { Args: never; Returns: undefined }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      random_available_bib: { Args: never; Returns: number }
      review_document: {
        Args: { _id: string; _note?: string; _status: string }
        Returns: undefined
      }
      save_performance: {
        Args: {
          _bike_wkg: number
          _run_distance_km: number
          _run_time_seconds: number
        }
        Returns: undefined
      }
      save_personal_info: {
        Args: {
          _city_id: string
          _dob: string
          _gender: string
          _nationality: string
          _username: string
        }
        Returns: undefined
      }
      set_discipline: { Args: { _discipline: string }; Returns: undefined }
      username_available: { Args: { _username: string }; Returns: boolean }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
