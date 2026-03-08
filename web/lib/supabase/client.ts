"use client";

import { createBrowserClient } from "@supabase/ssr";

import { requireSupabasePublicEnv } from "@/lib/supabase/shared";

export function createSupabaseBrowserClient() {
  const { url, anonKey } = requireSupabasePublicEnv();

  return createBrowserClient(url, anonKey);
}
