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
      users: {
        Row: {
          id: string;
          name: string | null;
          email: string;
          role: "user" | "club_admin" | "org_admin";
          created_at: string;
        };
        Insert: {
          id?: string;
          name?: string | null;
          email: string;
          role?: "user" | "club_admin" | "org_admin";
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string | null;
          email?: string;
          role?: "user" | "club_admin" | "org_admin";
          created_at?: string;
        };
        Relationships: [];
      };
      clubs: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          founder_id: string;
          is_private: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          founder_id: string;
          is_private?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          founder_id?: string;
          is_private?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      events: {
        Row: {
          id: string;
          title: string;
          type: "running" | "other";
          city: string | null;
          location: string | null;
          club_id: string | null;
          creator_id: string;
          date: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          type?: "running" | "other";
          city?: string | null;
          location?: string | null;
          club_id?: string | null;
          creator_id: string;
          date?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          type?: "running" | "other";
          city?: string | null;
          location?: string | null;
          club_id?: string | null;
          creator_id?: string;
          date?: string | null;
          created_at?: string;
        };
        Relationships: [];
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
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

export type User = Database["public"]["Tables"]["users"]["Row"];
export type Club = Database["public"]["Tables"]["clubs"]["Row"];
export type Event = Database["public"]["Tables"]["events"]["Row"];
