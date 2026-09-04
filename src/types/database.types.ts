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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      app_users: {
        Row: {
          active: boolean
          created_at: string
          display_name: string
          role: Database["public"]["Enums"]["app_role"]
          updated_at: string
          user_id: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          display_name: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
          user_id: string
        }
        Update: {
          active?: boolean
          created_at?: string
          display_name?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      artist_media: {
        Row: {
          artist_id: string
          media_id: string
          sort_order: number
          usage: string
        }
        Insert: {
          artist_id: string
          media_id: string
          sort_order?: number
          usage?: string
        }
        Update: {
          artist_id?: string
          media_id?: string
          sort_order?: number
          usage?: string
        }
        Relationships: [
          {
            foreignKeyName: "artist_media_artist_id_fkey"
            columns: ["artist_id"]
            isOneToOne: false
            referencedRelation: "artists"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "artist_media_media_id_fkey"
            columns: ["media_id"]
            isOneToOne: false
            referencedRelation: "media_assets"
            referencedColumns: ["id"]
          },
        ]
      }
      artists: {
        Row: {
          bio: string
          contact_email: string | null
          contact_public: boolean
          created_at: string
          created_by: string | null
          cv_url: string | null
          disciplines: string[]
          excerpt: string
          experience: string[]
          id: string
          name: string
          publish_at: string | null
          seo_description: string | null
          seo_title: string | null
          slug: string
          social_links: Json
          stage_name: string | null
          status: Database["public"]["Enums"]["content_status"]
          training: string[]
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          bio?: string
          contact_email?: string | null
          contact_public?: boolean
          created_at?: string
          created_by?: string | null
          cv_url?: string | null
          disciplines?: string[]
          excerpt?: string
          experience?: string[]
          id?: string
          name: string
          publish_at?: string | null
          seo_description?: string | null
          seo_title?: string | null
          slug: string
          social_links?: Json
          stage_name?: string | null
          status?: Database["public"]["Enums"]["content_status"]
          training?: string[]
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          bio?: string
          contact_email?: string | null
          contact_public?: boolean
          created_at?: string
          created_by?: string | null
          cv_url?: string | null
          disciplines?: string[]
          excerpt?: string
          experience?: string[]
          id?: string
          name?: string
          publish_at?: string | null
          seo_description?: string | null
          seo_title?: string | null
          slug?: string
          social_links?: Json
          stage_name?: string | null
          status?: Database["public"]["Enums"]["content_status"]
          training?: string[]
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      events: {
        Row: {
          artist_id: string | null
          city: string
          created_at: string
          created_by: string | null
          description: string
          ends_at: string | null
          excerpt: string
          external_url: string | null
          id: string
          kind: Database["public"]["Enums"]["event_kind"]
          project_id: string | null
          publish_at: string | null
          seo_description: string | null
          seo_title: string | null
          slug: string
          starts_at: string
          status: Database["public"]["Enums"]["content_status"]
          title: string
          updated_at: string
          updated_by: string | null
          venue: string
        }
        Insert: {
          artist_id?: string | null
          city?: string
          created_at?: string
          created_by?: string | null
          description?: string
          ends_at?: string | null
          excerpt?: string
          external_url?: string | null
          id?: string
          kind?: Database["public"]["Enums"]["event_kind"]
          project_id?: string | null
          publish_at?: string | null
          seo_description?: string | null
          seo_title?: string | null
          slug: string
          starts_at: string
          status?: Database["public"]["Enums"]["content_status"]
          title: string
          updated_at?: string
          updated_by?: string | null
          venue?: string
        }
        Update: {
          artist_id?: string | null
          city?: string
          created_at?: string
          created_by?: string | null
          description?: string
          ends_at?: string | null
          excerpt?: string
          external_url?: string | null
          id?: string
          kind?: Database["public"]["Enums"]["event_kind"]
          project_id?: string | null
          publish_at?: string | null
          seo_description?: string | null
          seo_title?: string | null
          slug?: string
          starts_at?: string
          status?: Database["public"]["Enums"]["content_status"]
          title?: string
          updated_at?: string
          updated_by?: string | null
          venue?: string
        }
        Relationships: [
          {
            foreignKeyName: "events_artist_id_fkey"
            columns: ["artist_id"]
            isOneToOne: false
            referencedRelation: "artists"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      form_submissions: {
        Row: {
          assigned_to: string | null
          consent: boolean
          created_at: string
          email: string
          honeypot: string
          id: string
          kind: Database["public"]["Enums"]["form_kind"]
          message: string
          name: string
          organization: string
          payload: Json
          phone: string
          status: Database["public"]["Enums"]["form_status"]
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          consent: boolean
          created_at?: string
          email: string
          honeypot?: string
          id?: string
          kind: Database["public"]["Enums"]["form_kind"]
          message?: string
          name?: string
          organization?: string
          payload?: Json
          phone?: string
          status?: Database["public"]["Enums"]["form_status"]
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          consent?: boolean
          created_at?: string
          email?: string
          honeypot?: string
          id?: string
          kind?: Database["public"]["Enums"]["form_kind"]
          message?: string
          name?: string
          organization?: string
          payload?: Json
          phone?: string
          status?: Database["public"]["Enums"]["form_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "form_submissions_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "app_users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      home_features: {
        Row: {
          created_at: string
          created_by: string | null
          entity_id: string | null
          entity_type: string | null
          eyebrow: string
          href: string
          id: string
          publish_at: string | null
          slot: string
          sort_order: number
          status: Database["public"]["Enums"]["content_status"]
          summary: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          entity_id?: string | null
          entity_type?: string | null
          eyebrow?: string
          href?: string
          id?: string
          publish_at?: string | null
          slot: string
          sort_order?: number
          status?: Database["public"]["Enums"]["content_status"]
          summary?: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          entity_id?: string | null
          entity_type?: string | null
          eyebrow?: string
          href?: string
          id?: string
          publish_at?: string | null
          slot?: string
          sort_order?: number
          status?: Database["public"]["Enums"]["content_status"]
          summary?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      media_assets: {
        Row: {
          alt_text: string
          bucket_id: string
          caption: string
          created_at: string
          created_by: string | null
          credit: string
          duration_seconds: number | null
          height: number | null
          id: string
          kind: Database["public"]["Enums"]["media_kind"]
          object_path: string
          publish_at: string | null
          status: Database["public"]["Enums"]["content_status"]
          title: string
          updated_at: string
          updated_by: string | null
          width: number | null
        }
        Insert: {
          alt_text?: string
          bucket_id: string
          caption?: string
          created_at?: string
          created_by?: string | null
          credit?: string
          duration_seconds?: number | null
          height?: number | null
          id?: string
          kind?: Database["public"]["Enums"]["media_kind"]
          object_path: string
          publish_at?: string | null
          status?: Database["public"]["Enums"]["content_status"]
          title: string
          updated_at?: string
          updated_by?: string | null
          width?: number | null
        }
        Update: {
          alt_text?: string
          bucket_id?: string
          caption?: string
          created_at?: string
          created_by?: string | null
          credit?: string
          duration_seconds?: number | null
          height?: number | null
          id?: string
          kind?: Database["public"]["Enums"]["media_kind"]
          object_path?: string
          publish_at?: string | null
          status?: Database["public"]["Enums"]["content_status"]
          title?: string
          updated_at?: string
          updated_by?: string | null
          width?: number | null
        }
        Relationships: []
      }
      post_media: {
        Row: {
          media_id: string
          post_id: string
          sort_order: number
          usage: string
        }
        Insert: {
          media_id: string
          post_id: string
          sort_order?: number
          usage?: string
        }
        Update: {
          media_id?: string
          post_id?: string
          sort_order?: number
          usage?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_media_media_id_fkey"
            columns: ["media_id"]
            isOneToOne: false
            referencedRelation: "media_assets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_media_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      posts: {
        Row: {
          artist_id: string | null
          body: string
          closes_at: string | null
          created_at: string
          created_by: string | null
          cta_label: string | null
          cta_url: string | null
          excerpt: string
          id: string
          kind: Database["public"]["Enums"]["post_kind"]
          project_id: string | null
          publish_at: string | null
          seo_description: string | null
          seo_title: string | null
          slug: string
          status: Database["public"]["Enums"]["content_status"]
          tags: string[]
          title: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          artist_id?: string | null
          body?: string
          closes_at?: string | null
          created_at?: string
          created_by?: string | null
          cta_label?: string | null
          cta_url?: string | null
          excerpt?: string
          id?: string
          kind?: Database["public"]["Enums"]["post_kind"]
          project_id?: string | null
          publish_at?: string | null
          seo_description?: string | null
          seo_title?: string | null
          slug: string
          status?: Database["public"]["Enums"]["content_status"]
          tags?: string[]
          title: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          artist_id?: string | null
          body?: string
          closes_at?: string | null
          created_at?: string
          created_by?: string | null
          cta_label?: string | null
          cta_url?: string | null
          excerpt?: string
          id?: string
          kind?: Database["public"]["Enums"]["post_kind"]
          project_id?: string | null
          publish_at?: string | null
          seo_description?: string | null
          seo_title?: string | null
          slug?: string
          status?: Database["public"]["Enums"]["content_status"]
          tags?: string[]
          title?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "posts_artist_id_fkey"
            columns: ["artist_id"]
            isOneToOne: false
            referencedRelation: "artists"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "posts_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_artists: {
        Row: {
          artist_id: string
          created_at: string
          project_id: string
          role_name: string
          sort_order: number
        }
        Insert: {
          artist_id: string
          created_at?: string
          project_id: string
          role_name?: string
          sort_order?: number
        }
        Update: {
          artist_id?: string
          created_at?: string
          project_id?: string
          role_name?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "project_artists_artist_id_fkey"
            columns: ["artist_id"]
            isOneToOne: false
            referencedRelation: "artists"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_artists_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_media: {
        Row: {
          media_id: string
          project_id: string
          sort_order: number
          usage: string
        }
        Insert: {
          media_id: string
          project_id: string
          sort_order?: number
          usage?: string
        }
        Update: {
          media_id?: string
          project_id?: string
          sort_order?: number
          usage?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_media_media_id_fkey"
            columns: ["media_id"]
            isOneToOne: false
            referencedRelation: "media_assets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_media_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          artistic_sheet: Json
          awards: string[]
          booking_enabled: boolean
          created_at: string
          created_by: string | null
          excerpt: string
          id: string
          press_mentions: Json
          publish_at: string | null
          seo_description: string | null
          seo_title: string | null
          slug: string
          state: Database["public"]["Enums"]["project_state"]
          status: Database["public"]["Enums"]["content_status"]
          synopsis: string
          technical_sheet: Json
          title: string
          updated_at: string
          updated_by: string | null
          year_end: number | null
          year_start: number | null
        }
        Insert: {
          artistic_sheet?: Json
          awards?: string[]
          booking_enabled?: boolean
          created_at?: string
          created_by?: string | null
          excerpt?: string
          id?: string
          press_mentions?: Json
          publish_at?: string | null
          seo_description?: string | null
          seo_title?: string | null
          slug: string
          state?: Database["public"]["Enums"]["project_state"]
          status?: Database["public"]["Enums"]["content_status"]
          synopsis?: string
          technical_sheet?: Json
          title: string
          updated_at?: string
          updated_by?: string | null
          year_end?: number | null
          year_start?: number | null
        }
        Update: {
          artistic_sheet?: Json
          awards?: string[]
          booking_enabled?: boolean
          created_at?: string
          created_by?: string | null
          excerpt?: string
          id?: string
          press_mentions?: Json
          publish_at?: string | null
          seo_description?: string | null
          seo_title?: string | null
          slug?: string
          state?: Database["public"]["Enums"]["project_state"]
          status?: Database["public"]["Enums"]["content_status"]
          synopsis?: string
          technical_sheet?: Json
          title?: string
          updated_at?: string
          updated_by?: string | null
          year_end?: number | null
          year_start?: number | null
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          is_public: boolean
          key: string
          updated_at: string
          updated_by: string | null
          value: Json
        }
        Insert: {
          is_public?: boolean
          key: string
          updated_at?: string
          updated_by?: string | null
          value?: Json
        }
        Update: {
          is_public?: boolean
          key?: string
          updated_at?: string
          updated_by?: string | null
          value?: Json
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
      app_role: "admin" | "editor"
      content_status: "draft" | "scheduled" | "published" | "archived"
      event_kind: "performance" | "workshop" | "festival" | "talk" | "other"
      form_kind:
        | "contact"
        | "booking"
        | "press"
        | "community_proposal"
        | "newsletter"
      form_status: "new" | "reviewing" | "resolved" | "spam"
      media_kind: "image" | "video" | "audio" | "document"
      post_kind:
        | "news"
        | "blog"
        | "interview"
        | "backstage"
        | "call"
        | "communique"
        | "resource"
      project_state: "current" | "upcoming" | "archive"
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
      app_role: ["admin", "editor"],
      content_status: ["draft", "scheduled", "published", "archived"],
      event_kind: ["performance", "workshop", "festival", "talk", "other"],
      form_kind: [
        "contact",
        "booking",
        "press",
        "community_proposal",
        "newsletter",
      ],
      form_status: ["new", "reviewing", "resolved", "spam"],
      media_kind: ["image", "video", "audio", "document"],
      post_kind: [
        "news",
        "blog",
        "interview",
        "backstage",
        "call",
        "communique",
        "resource",
      ],
      project_state: ["current", "upcoming", "archive"],
    },
  },
} as const
