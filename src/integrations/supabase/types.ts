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
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      activity_log: {
        Row: {
          action: string
          actor_id: string | null
          created_at: string
          details: Json
          id: number
          target_id: string | null
          target_type: string | null
        }
        Insert: {
          action: string
          actor_id?: string | null
          created_at?: string
          details?: Json
          id?: never
          target_id?: string | null
          target_type?: string | null
        }
        Update: {
          action?: string
          actor_id?: string | null
          created_at?: string
          details?: Json
          id?: never
          target_id?: string | null
          target_type?: string | null
        }
        Relationships: []
      }
      athlete_blocks: {
        Row: {
          blocked_id: string
          blocker_id: string
          created_at: string
        }
        Insert: {
          blocked_id: string
          blocker_id: string
          created_at?: string
        }
        Update: {
          blocked_id?: string
          blocker_id?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "athlete_blocks_blocked_id_fkey"
            columns: ["blocked_id"]
            isOneToOne: false
            referencedRelation: "athlete_profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "athlete_blocks_blocker_id_fkey"
            columns: ["blocker_id"]
            isOneToOne: false
            referencedRelation: "athlete_profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
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
      athlete_reports: {
        Row: {
          created_at: string
          id: string
          reported_id: string
          reporter_id: string
          reviewed_at: string | null
          reviewed_by: string | null
          status: string
        }
        Insert: {
          created_at?: string
          id?: string
          reported_id: string
          reporter_id: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
        }
        Update: {
          created_at?: string
          id?: string
          reported_id?: string
          reporter_id?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "athlete_reports_reported_id_fkey"
            columns: ["reported_id"]
            isOneToOne: false
            referencedRelation: "athlete_profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "athlete_reports_reporter_id_fkey"
            columns: ["reporter_id"]
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
      club_join_requests: {
        Row: {
          club_id: string
          created_at: string
          decided_at: string | null
          decided_by: string | null
          id: string
          status: string
          user_id: string
        }
        Insert: {
          club_id: string
          created_at?: string
          decided_at?: string | null
          decided_by?: string | null
          id?: string
          status?: string
          user_id: string
        }
        Update: {
          club_id?: string
          created_at?: string
          decided_at?: string | null
          decided_by?: string | null
          id?: string
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "club_join_requests_club_id_fkey"
            columns: ["club_id"]
            isOneToOne: false
            referencedRelation: "clubs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "club_join_requests_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "athlete_profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      club_members: {
        Row: {
          club_id: string
          joined_at: string
          role: string
          user_id: string
        }
        Insert: {
          club_id: string
          joined_at?: string
          role?: string
          user_id: string
        }
        Update: {
          club_id?: string
          joined_at?: string
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "club_members_club_id_fkey"
            columns: ["club_id"]
            isOneToOne: false
            referencedRelation: "clubs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "club_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "athlete_profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      club_posts: {
        Row: {
          author_id: string | null
          body: string
          club_id: string
          created_at: string
          hidden: boolean
          id: string
        }
        Insert: {
          author_id?: string | null
          body: string
          club_id: string
          created_at?: string
          hidden?: boolean
          id?: string
        }
        Update: {
          author_id?: string | null
          body?: string
          club_id?: string
          created_at?: string
          hidden?: boolean
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "club_posts_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "athlete_profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "club_posts_club_id_fkey"
            columns: ["club_id"]
            isOneToOne: false
            referencedRelation: "clubs"
            referencedColumns: ["id"]
          },
        ]
      }
      clubs: {
        Row: {
          city_id: string | null
          created_at: string
          created_by: string | null
          id: string
          name: string
          status: string
        }
        Insert: {
          city_id?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          name: string
          status?: string
        }
        Update: {
          city_id?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          name?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "clubs_city_id_fkey"
            columns: ["city_id"]
            isOneToOne: false
            referencedRelation: "cities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "clubs_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "athlete_profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      content_reports: {
        Row: {
          created_at: string
          id: string
          reporter_id: string
          reviewed_at: string | null
          reviewed_by: string | null
          status: string
          target_id: string
          target_type: string
        }
        Insert: {
          created_at?: string
          id?: string
          reporter_id: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          target_id: string
          target_type: string
        }
        Update: {
          created_at?: string
          id?: string
          reporter_id?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          target_id?: string
          target_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "content_reports_reporter_id_fkey"
            columns: ["reporter_id"]
            isOneToOne: false
            referencedRelation: "athlete_profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      event_jobs: {
        Row: {
          created_at: string
          done_at: string | null
          error: string | null
          event_id: string
          id: string
          kind: string
          run_at: string
          status: string
        }
        Insert: {
          created_at?: string
          done_at?: string | null
          error?: string | null
          event_id: string
          id?: string
          kind: string
          run_at: string
          status?: string
        }
        Update: {
          created_at?: string
          done_at?: string | null
          error?: string | null
          event_id?: string
          id?: string
          kind?: string
          run_at?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_jobs_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      event_waves: {
        Row: {
          event_id: string
          id: string
          leagues: string[]
          number: number
          published_at: string | null
          starts_at: string | null
        }
        Insert: {
          event_id: string
          id?: string
          leagues: string[]
          number: number
          published_at?: string | null
          starts_at?: string | null
        }
        Update: {
          event_id?: string
          id?: string
          leagues?: string[]
          number?: number
          published_at?: string | null
          starts_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "event_waves_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          briefing: string | null
          capacity: number | null
          city_id: string | null
          created_at: string
          created_by: string | null
          description: string | null
          discipline: string
          distance_m: number | null
          format: string
          id: string
          image_path: string | null
          invite_only: boolean
          lap_m: number | null
          laps: number | null
          location: string | null
          meeting_point: string | null
          min_participants: number | null
          price_cents: number
          registration_closes_at: string | null
          registration_opens_at: string | null
          rules_version: number | null
          starts_at: string
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          briefing?: string | null
          capacity?: number | null
          city_id?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          discipline: string
          distance_m?: number | null
          format?: string
          id?: string
          image_path?: string | null
          invite_only?: boolean
          lap_m?: number | null
          laps?: number | null
          location?: string | null
          meeting_point?: string | null
          min_participants?: number | null
          price_cents?: number
          registration_closes_at?: string | null
          registration_opens_at?: string | null
          rules_version?: number | null
          starts_at: string
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          briefing?: string | null
          capacity?: number | null
          city_id?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          discipline?: string
          distance_m?: number | null
          format?: string
          id?: string
          image_path?: string | null
          invite_only?: boolean
          lap_m?: number | null
          laps?: number | null
          location?: string | null
          meeting_point?: string | null
          min_participants?: number | null
          price_cents?: number
          registration_closes_at?: string | null
          registration_opens_at?: string | null
          rules_version?: number | null
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
          {
            foreignKeyName: "events_rules_version_fkey"
            columns: ["rules_version"]
            isOneToOne: false
            referencedRelation: "game_rules"
            referencedColumns: ["version"]
          },
        ]
      }
      follows: {
        Row: {
          created_at: string
          followed_id: string
          follower_id: string
        }
        Insert: {
          created_at?: string
          followed_id: string
          follower_id: string
        }
        Update: {
          created_at?: string
          followed_id?: string
          follower_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "follows_followed_id_fkey"
            columns: ["followed_id"]
            isOneToOne: false
            referencedRelation: "athlete_profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "follows_follower_id_fkey"
            columns: ["follower_id"]
            isOneToOne: false
            referencedRelation: "athlete_profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      game_rules: {
        Row: {
          active: boolean
          created_at: string
          created_by: string | null
          note: string | null
          rules: Json
          version: number
        }
        Insert: {
          active?: boolean
          created_at?: string
          created_by?: string | null
          note?: string | null
          rules: Json
          version: number
        }
        Update: {
          active?: boolean
          created_at?: string
          created_by?: string | null
          note?: string | null
          rules?: Json
          version?: number
        }
        Relationships: []
      }
      invite_codes: {
        Row: {
          code: string
          created_at: string
          user_id: string
        }
        Insert: {
          code: string
          created_at?: string
          user_id: string
        }
        Update: {
          code?: string
          created_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "invite_codes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "athlete_profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      invites: {
        Row: {
          created_at: string
          invited_user_id: string
          inviter_id: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          invited_user_id: string
          inviter_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          invited_user_id?: string
          inviter_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "invites_invited_user_id_fkey"
            columns: ["invited_user_id"]
            isOneToOne: true
            referencedRelation: "athlete_profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "invites_inviter_id_fkey"
            columns: ["inviter_id"]
            isOneToOne: false
            referencedRelation: "athlete_profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      lobby_messages: {
        Row: {
          author_id: string | null
          body: string
          created_at: string
          event_id: string
          hidden: boolean
          id: string
          is_announcement: boolean
          pinned: boolean
        }
        Insert: {
          author_id?: string | null
          body: string
          created_at?: string
          event_id: string
          hidden?: boolean
          id?: string
          is_announcement?: boolean
          pinned?: boolean
        }
        Update: {
          author_id?: string | null
          body?: string
          created_at?: string
          event_id?: string
          hidden?: boolean
          id?: string
          is_announcement?: boolean
          pinned?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "lobby_messages_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "athlete_profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "lobby_messages_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
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
      payments: {
        Row: {
          amount_cents: number
          created_at: string
          currency: string
          id: string
          method_label: string | null
          provider: string
          provider_ref: string
          refunded_cents: number
          registration_id: string | null
          status: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          amount_cents: number
          created_at?: string
          currency?: string
          id?: string
          method_label?: string | null
          provider: string
          provider_ref: string
          refunded_cents?: number
          registration_id?: string | null
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          amount_cents?: number
          created_at?: string
          currency?: string
          id?: string
          method_label?: string | null
          provider?: string
          provider_ref?: string
          refunded_cents?: number
          registration_id?: string | null
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_registration_id_fkey"
            columns: ["registration_id"]
            isOneToOne: false
            referencedRelation: "registrations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "athlete_profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      pilot_confirmations: {
        Row: {
          confirmed_at: string
          start_league: string
          updated_at: string
          user_id: string
        }
        Insert: {
          confirmed_at?: string
          start_league: string
          updated_at?: string
          user_id: string
        }
        Update: {
          confirmed_at?: string
          start_league?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "pilot_confirmations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "athlete_profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      race_credits: {
        Row: {
          created_at: string
          expires_at: string | null
          id: string
          kind: string
          source: string
          used_at: string | null
          used_registration_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          expires_at?: string | null
          id?: string
          kind: string
          source: string
          used_at?: string | null
          used_registration_id?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          expires_at?: string | null
          id?: string
          kind?: string
          source?: string
          used_at?: string | null
          used_registration_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "race_credits_used_registration_id_fkey"
            columns: ["used_registration_id"]
            isOneToOne: false
            referencedRelation: "registrations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "race_credits_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "athlete_profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      rating_history: {
        Row: {
          created_at: string
          created_by: string | null
          discipline: string
          event_id: string | null
          id: number
          note: string | null
          rating_after: number
          rating_before: number
          reason: string
          user_id: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          discipline: string
          event_id?: string | null
          id?: never
          note?: string | null
          rating_after: number
          rating_before: number
          reason: string
          user_id: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          discipline?: string
          event_id?: string | null
          id?: never
          note?: string | null
          rating_after?: number
          rating_before?: number
          reason?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "rating_history_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rating_history_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "athlete_profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      registrations: {
        Row: {
          cancelled_at: string | null
          checked_in_at: string | null
          created_at: string
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          event_id: string
          id: string
          league_snapshot: string | null
          offered_until: string | null
          photo_consent: boolean | null
          rating_snapshot: number | null
          source: string
          status: string
          updated_at: string
          user_id: string
          wave_id: string | null
          wave_manual: boolean
        }
        Insert: {
          cancelled_at?: string | null
          checked_in_at?: string | null
          created_at?: string
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          event_id: string
          id?: string
          league_snapshot?: string | null
          offered_until?: string | null
          photo_consent?: boolean | null
          rating_snapshot?: number | null
          source?: string
          status: string
          updated_at?: string
          user_id: string
          wave_id?: string | null
          wave_manual?: boolean
        }
        Update: {
          cancelled_at?: string | null
          checked_in_at?: string | null
          created_at?: string
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          event_id?: string
          id?: string
          league_snapshot?: string | null
          offered_until?: string | null
          photo_consent?: boolean | null
          rating_snapshot?: number | null
          source?: string
          status?: string
          updated_at?: string
          user_id?: string
          wave_id?: string | null
          wave_manual?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "registrations_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "registrations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "athlete_profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "registrations_wave_id_fkey"
            columns: ["wave_id"]
            isOneToOne: false
            referencedRelation: "event_waves"
            referencedColumns: ["id"]
          },
        ]
      }
      reserved_numbers: {
        Row: {
          number: number
          reason: string | null
          status: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          number: number
          reason?: string | null
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          number?: number
          reason?: string | null
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reserved_numbers_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "athlete_profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      results: {
        Row: {
          created_at: string
          discipline: string
          eliminated_lap: number | null
          event_id: string
          finish_time_ms: number | null
          id: string
          position_overall: number | null
          position_wave: number | null
          published_at: string | null
          rating_after: number | null
          rating_before: number | null
          state: string
          status: string
          user_id: string | null
          version: number
          wave_id: string | null
          xp_earned: number | null
        }
        Insert: {
          created_at?: string
          discipline: string
          eliminated_lap?: number | null
          event_id: string
          finish_time_ms?: number | null
          id?: string
          position_overall?: number | null
          position_wave?: number | null
          published_at?: string | null
          rating_after?: number | null
          rating_before?: number | null
          state?: string
          status: string
          user_id?: string | null
          version?: number
          wave_id?: string | null
          xp_earned?: number | null
        }
        Update: {
          created_at?: string
          discipline?: string
          eliminated_lap?: number | null
          event_id?: string
          finish_time_ms?: number | null
          id?: string
          position_overall?: number | null
          position_wave?: number | null
          published_at?: string | null
          rating_after?: number | null
          rating_before?: number | null
          state?: string
          status?: string
          user_id?: string | null
          version?: number
          wave_id?: string | null
          xp_earned?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "results_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "results_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "athlete_profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "results_wave_id_fkey"
            columns: ["wave_id"]
            isOneToOne: false
            referencedRelation: "event_waves"
            referencedColumns: ["id"]
          },
        ]
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
      admin_list_pilot_confirmations: {
        Args: never
        Returns: {
          bib_number: number
          confirmed_at: string
          email: string
          start_league: string
          user_id: string
          username: string
        }[]
      }
      admin_set_admin: {
        Args: { _grant: boolean; _user_id: string }
        Returns: undefined
      }
      athlete_public: {
        Args: { _user_id: string }
        Returns: {
          bib_number: number
          bike_league: string
          bike_rating: number
          city: string
          discipline: string
          followers: number
          following: boolean
          following_count: number
          league: string
          level: number
          races_done: number
          run_league: string
          run_rating: number
          user_id: string
          username: string
          xp: number
        }[]
      }
      athlete_rows: {
        Args: { _ids: string[] }
        Returns: {
          bib_number: number
          city: string
          discipline: string
          following: boolean
          league: string
          user_id: string
          username: string
        }[]
      }
      athlete_visible: { Args: { _user_id: string }; Returns: boolean }
      bib_status: { Args: { _number: number }; Returns: string }
      block_athlete: { Args: { _user_id: string }; Returns: undefined }
      cancel_pilot_presence: { Args: never; Returns: undefined }
      city_ranking: {
        Args: { _city_id: string; _discipline: string }
        Returns: {
          league: string
          rank: number
          rating: number
          user_id: string
          username: string
        }[]
      }
      claim_bib: { Args: { _number: number }; Returns: number }
      complete_onboarding: { Args: never; Returns: undefined }
      confirm_pilot_presence: { Args: { _start: string }; Returns: undefined }
      follow_athlete: { Args: { _user_id: string }; Returns: undefined }
      follow_counts: {
        Args: { _user_id: string }
        Returns: {
          followers: number
          following: number
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      list_followers: {
        Args: { _user_id: string }
        Returns: {
          bib_number: number
          city: string
          discipline: string
          following: boolean
          league: string
          user_id: string
          username: string
        }[]
      }
      list_following: {
        Args: { _user_id: string }
        Returns: {
          bib_number: number
          city: string
          discipline: string
          following: boolean
          league: string
          user_id: string
          username: string
        }[]
      }
      log_activity: {
        Args: {
          _action: string
          _details?: Json
          _target_id?: string
          _target_type?: string
        }
        Returns: undefined
      }
      my_pilot_start: { Args: never; Returns: string }
      random_available_bib: { Args: never; Returns: number }
      report_athlete: { Args: { _user_id: string }; Returns: undefined }
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
      search_athletes: {
        Args: { _q: string }
        Returns: {
          bib_number: number
          city: string
          discipline: string
          following: boolean
          league: string
          user_id: string
          username: string
        }[]
      }
      set_discipline: { Args: { _discipline: string }; Returns: undefined }
      unblock_athlete: { Args: { _user_id: string }; Returns: undefined }
      unfollow_athlete: { Args: { _user_id: string }; Returns: undefined }
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
