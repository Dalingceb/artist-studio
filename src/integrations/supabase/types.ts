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
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      ads: {
        Row: {
          created_at: string | null
          created_by: string
          description: string | null
          end_date: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          link_url: string | null
          pages: string[] | null
          position: string
          start_date: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by: string
          description?: string | null
          end_date?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          link_url?: string | null
          pages?: string[] | null
          position?: string
          start_date?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string
          description?: string | null
          end_date?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          link_url?: string | null
          pages?: string[] | null
          position?: string
          start_date?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      artist_portfolio: {
        Row: {
          artist_id: string
          category: string | null
          created_at: string
          description: string | null
          featured: boolean | null
          id: string
          layout_type: string | null
          media_type: string
          media_url: string
          price: string | null
          tags: string | null
          thumbnail_url: string | null
          title: string
          updated_at: string
        }
        Insert: {
          artist_id: string
          category?: string | null
          created_at?: string
          description?: string | null
          featured?: boolean | null
          id?: string
          layout_type?: string | null
          media_type?: string
          media_url: string
          price?: string | null
          tags?: string | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          artist_id?: string
          category?: string | null
          created_at?: string
          description?: string | null
          featured?: boolean | null
          id?: string
          layout_type?: string | null
          media_type?: string
          media_url?: string
          price?: string | null
          tags?: string | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "artist_portfolio_artist_id_fkey"
            columns: ["artist_id"]
            isOneToOne: false
            referencedRelation: "artists"
            referencedColumns: ["id"]
          },
        ]
      }
      artist_reviews: {
        Row: {
          artist_id: string
          comment: string | null
          created_at: string | null
          id: string
          rating: number
          reviewer_id: string
        }
        Insert: {
          artist_id: string
          comment?: string | null
          created_at?: string | null
          id?: string
          rating: number
          reviewer_id: string
        }
        Update: {
          artist_id?: string
          comment?: string | null
          created_at?: string | null
          id?: string
          rating?: number
          reviewer_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "artist_reviews_artist_id_fkey"
            columns: ["artist_id"]
            isOneToOne: false
            referencedRelation: "artists"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "artist_reviews_reviewer_id_fkey"
            columns: ["reviewer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      artists: {
        Row: {
          banner_image: string | null
          bio: string | null
          category: string
          created_at: string | null
          expo_push_token: string | null
          featured: boolean | null
          featured_priority: number | null
          id: string
          location: string
          name: string
          phone: string
          profile_image: string | null
          rating: number | null
          social_links: string | null
          updated_at: string | null
          user_id: string
          website: string | null
        }
        Insert: {
          banner_image?: string | null
          bio?: string | null
          category: string
          created_at?: string | null
          expo_push_token?: string | null
          featured?: boolean | null
          featured_priority?: number | null
          id?: string
          location: string
          name: string
          phone: string
          profile_image?: string | null
          rating?: number | null
          social_links?: string | null
          updated_at?: string | null
          user_id: string
          website?: string | null
        }
        Update: {
          banner_image?: string | null
          bio?: string | null
          category?: string
          created_at?: string | null
          expo_push_token?: string | null
          featured?: boolean | null
          featured_priority?: number | null
          id?: string
          location?: string
          name?: string
          phone?: string
          profile_image?: string | null
          rating?: number | null
          social_links?: string | null
          updated_at?: string | null
          user_id?: string
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "artists_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      bookings: {
        Row: {
          additional_requirements: string | null
          artist_id: string
          booking_purpose: string
          client_id: string
          created_at: string | null
          description: string | null
          event_date: string
          event_time: string | null
          event_title: string
          id: string
          location: string
          phone: string | null
          proposed_price: string
          status: string
          updated_at: string | null
        }
        Insert: {
          additional_requirements?: string | null
          artist_id: string
          booking_purpose: string
          client_id: string
          created_at?: string | null
          description?: string | null
          event_date: string
          event_time?: string | null
          event_title: string
          id?: string
          location: string
          phone?: string | null
          proposed_price: string
          status?: string
          updated_at?: string | null
        }
        Update: {
          additional_requirements?: string | null
          artist_id?: string
          booking_purpose?: string
          client_id?: string
          created_at?: string | null
          description?: string | null
          event_date?: string
          event_time?: string | null
          event_title?: string
          id?: string
          location?: string
          phone?: string | null
          proposed_price?: string
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bookings_artist_id_fkey"
            columns: ["artist_id"]
            isOneToOne: false
            referencedRelation: "artists"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      conversations: {
        Row: {
          created_at: string
          id: string
          job_listing_id: string | null
          last_message: string | null
          profile_image: string | null
          updated_at: string
          user1_id: string | null
          user1_name: string | null
          user2_id: string | null
          user2_name: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          job_listing_id?: string | null
          last_message?: string | null
          profile_image?: string | null
          updated_at?: string
          user1_id?: string | null
          user1_name?: string | null
          user2_id?: string | null
          user2_name?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          job_listing_id?: string | null
          last_message?: string | null
          profile_image?: string | null
          updated_at?: string
          user1_id?: string | null
          user1_name?: string | null
          user2_id?: string | null
          user2_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "conversations_job_listing_id_fkey"
            columns: ["job_listing_id"]
            isOneToOne: false
            referencedRelation: "job_listings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_user1_id_fkey"
            columns: ["user1_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_user2_id_fkey"
            columns: ["user2_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      job_applications: {
        Row: {
          additional_info: string | null
          artist_id: string
          client_id: string | null
          cover_letter: string | null
          created_at: string | null
          id: string
          job_id: string
          proposed_rate: string | null
          status: string
          updated_at: string | null
        }
        Insert: {
          additional_info?: string | null
          artist_id: string
          client_id?: string | null
          cover_letter?: string | null
          created_at?: string | null
          id?: string
          job_id: string
          proposed_rate?: string | null
          status?: string
          updated_at?: string | null
        }
        Update: {
          additional_info?: string | null
          artist_id?: string
          client_id?: string | null
          cover_letter?: string | null
          created_at?: string | null
          id?: string
          job_id?: string
          proposed_rate?: string | null
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "job_applications_artist_id_fkey"
            columns: ["artist_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_applications_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_applications_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "job_listings"
            referencedColumns: ["id"]
          },
        ]
      }
      job_listings: {
        Row: {
          budget_range: string
          category: string
          client_id: string
          created_at: string | null
          description: string
          event_date: string
          event_time: string | null
          id: string
          location: string
          requirements: string
          status: string
          title: string
          updated_at: string | null
        }
        Insert: {
          budget_range: string
          category: string
          client_id: string
          created_at?: string | null
          description: string
          event_date: string
          event_time?: string | null
          id?: string
          location: string
          requirements?: string
          status?: string
          title: string
          updated_at?: string | null
        }
        Update: {
          budget_range?: string
          category?: string
          client_id?: string
          created_at?: string | null
          description?: string
          event_date?: string
          event_time?: string | null
          id?: string
          location?: string
          requirements?: string
          status?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "job_listings_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      learning_resources: {
        Row: {
          author_id: string
          category_id: string | null
          content: string
          created_at: string
          difficulty_level: string | null
          estimated_read_time: number | null
          excerpt: string | null
          featured_image: string | null
          id: string
          status: string
          tags: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          author_id: string
          category_id?: string | null
          content: string
          created_at?: string
          difficulty_level?: string | null
          estimated_read_time?: number | null
          excerpt?: string | null
          featured_image?: string | null
          id?: string
          status?: string
          tags?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          author_id?: string
          category_id?: string | null
          content?: string
          created_at?: string
          difficulty_level?: string | null
          estimated_read_time?: number | null
          excerpt?: string | null
          featured_image?: string | null
          id?: string
          status?: string
          tags?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "learning_resources_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "resource_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          conversation_id: string | null
          created_at: string
          id: string
          is_read: boolean | null
          media_size: number | null
          media_type: string | null
          media_url: string | null
          message: string
          recipient_id: string | null
          sender_id: string | null
          sender_name: string | null
          updated_at: string
        }
        Insert: {
          conversation_id?: string | null
          created_at?: string
          id?: string
          is_read?: boolean | null
          media_size?: number | null
          media_type?: string | null
          media_url?: string | null
          message: string
          recipient_id?: string | null
          sender_id?: string | null
          sender_name?: string | null
          updated_at?: string
        }
        Update: {
          conversation_id?: string | null
          created_at?: string
          id?: string
          is_read?: boolean | null
          media_size?: number | null
          media_type?: string | null
          media_url?: string | null
          message?: string
          recipient_id?: string | null
          sender_id?: string | null
          sender_name?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          full_name: string | null
          id: string
          is_artist: boolean | null
          profile_image: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          full_name?: string | null
          id: string
          is_artist?: boolean | null
          profile_image?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          full_name?: string | null
          id?: string
          is_artist?: boolean | null
          profile_image?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      resource_categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      resource_media: {
        Row: {
          alt_text: string | null
          caption: string | null
          created_at: string
          file_size: number | null
          id: string
          media_type: string
          media_url: string
          resource_id: string | null
        }
        Insert: {
          alt_text?: string | null
          caption?: string | null
          created_at?: string
          file_size?: number | null
          id?: string
          media_type: string
          media_url: string
          resource_id?: string | null
        }
        Update: {
          alt_text?: string | null
          caption?: string | null
          created_at?: string
          file_size?: number | null
          id?: string
          media_type?: string
          media_url?: string
          resource_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "resource_media_resource_id_fkey"
            columns: ["resource_id"]
            isOneToOne: false
            referencedRelation: "learning_resources"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin: { Args: never; Returns: boolean }
      mark_message_as_read: {
        Args: { p_message_id: string }
        Returns: undefined
      }
    }
    Enums: {
      app_role: "admin" | "user"
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
      app_role: ["admin", "user"],
    },
  },
} as const
