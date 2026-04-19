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
          id: string; // uuid from auth.users mapping ideally, or direct generated
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
      };
      clubs: {
        Row: {
          id: string; // uuid
          name: string;
          description: string | null;
          founder_id: string; // references users.id
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
      };
      events: {
        Row: {
          id: string; // uuid
          title: string;
          type: "running" | "other";
          city: string | null;
          location: string | null;
          club_id: string | null; // references clubs.id
          creator_id: string; // references users.id
          date: string | null; // timestamp
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

export type User = Database["public"]["Tables"]["users"]["Row"];
export type Club = Database["public"]["Tables"]["clubs"]["Row"];
export type Event = Database["public"]["Tables"]["events"]["Row"];
