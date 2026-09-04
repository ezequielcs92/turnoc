"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";
import { getPublicSupabaseConfig } from "@/lib/supabase/env";

let browserClient: SupabaseClient<Database> | null = null;

export function createBrowserSupabaseClient() {
  const config = getPublicSupabaseConfig();
  if (!config) {
    return null;
  }

  if (!browserClient) {
    browserClient = createBrowserClient<Database>(config.url, config.publishableKey);
  }

  return browserClient;
}
