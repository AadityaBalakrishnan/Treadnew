import { createClient } from "@supabase/supabase-js";
import type { Database } from "./models";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Missing Supabase environment variables! Queries will fail.");
}

export const supabase = createClient<Database>(
  supabaseUrl || "",
  supabaseAnonKey || ""
);
