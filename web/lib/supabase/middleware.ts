import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

import { getSupabasePublicEnv } from "@/lib/supabase/shared";

export async function updateSession(request: NextRequest) {
  const response = NextResponse.next({
    request,
  });

  const env = getSupabasePublicEnv();
  if (!env) {
    return response;
  }
  const { url, anonKey } = env;

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        for (const cookie of cookiesToSet) {
          request.cookies.set(cookie.name, cookie.value);
        }

        for (const cookie of cookiesToSet) {
          response.cookies.set(cookie.name, cookie.value, cookie.options);
        }
      },
    },
  });

  await supabase.auth.getUser();

  return response;
}
