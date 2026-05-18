import { createClient, SupabaseClient } from "@supabase/supabase-js";

export const DEMO_CLINICIAN_ID = "00000000-0000-0000-0000-000000000001";
export const DEMO_STUDENT_ID = "00000000-0000-0000-0000-000000000002";

let _db: SupabaseClient | null = null;

export function getDb(): SupabaseClient {
  if (_db) return _db;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    throw new Error(
      "Missing Supabase env vars. Copy .env.local.example to .env.local and fill in values from your Supabase project (see supabase/README.md)."
    );
  }
  _db = createClient(url, serviceKey, { auth: { persistSession: false } });
  return _db;
}

export const db = new Proxy({} as SupabaseClient, {
  get(_, prop) {
    return Reflect.get(getDb(), prop);
  },
});
