import { redirect } from "next/navigation";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { hasSupabasePublicEnv } from "@/lib/supabase/shared";

export default async function HomePage() {
  if (!hasSupabasePublicEnv()) {
    redirect("/login?reason=missing_env");
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
  }

  redirect("/login");
}
