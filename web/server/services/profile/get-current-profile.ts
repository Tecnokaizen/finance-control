import { createSupabaseServerClient } from "@/lib/supabase/server";
import { ProfilesRepository } from "@/server/repositories/profiles.repository";
import type { ProfileDto } from "@/types/profile";

const DEFAULT_CURRENCY = process.env.NEXT_PUBLIC_DEFAULT_CURRENCY ?? "EUR";
const DEFAULT_TIMEZONE = process.env.NEXT_PUBLIC_DEFAULT_TIMEZONE ?? "Europe/Madrid";

export async function getCurrentProfile(userId: string): Promise<ProfileDto> {
  const supabase = await createSupabaseServerClient();
  const repository = new ProfilesRepository(supabase);

  const existing = await repository.getByUserId(userId);
  if (existing) {
    return existing;
  }

  return repository.upsertByUserId(userId, {
    fullName: "",
    locale: "es",
    defaultCurrency: DEFAULT_CURRENCY,
    timezone: DEFAULT_TIMEZONE,
  });
}
