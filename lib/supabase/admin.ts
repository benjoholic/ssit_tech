import { createClient } from "@supabase/supabase-js";

/**
 * Server-only Supabase client with service role key.
 * Use for auth.admin (e.g. listUsers). Never expose this client to the browser.
 * Set SUPABASE_SERVICE_ROLE_KEY in .env.local (without NEXT_PUBLIC_) for security.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error(
      "Missing SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_URL. Required for admin operations."
    );
  }

  return createClient(url, serviceRoleKey);
}
