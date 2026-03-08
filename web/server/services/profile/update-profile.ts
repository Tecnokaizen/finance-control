import { createSupabaseServerClient } from "@/lib/supabase/server";
import { updateProfileSchema } from "@/lib/validation/profile";
import { ProfilesRepository } from "@/server/repositories/profiles.repository";

export async function updateProfile(userId: string, input: FormData) {
  const parsed = updateProfileSchema.safeParse({
    fullName: input.get("fullName") || undefined,
    locale: input.get("locale") || undefined,
    defaultCurrency: input.get("defaultCurrency") || undefined,
    timezone: input.get("timezone") || undefined,
  });

  if (!parsed.success) {
    return {
      success: false as const,
      message: "Please review profile fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const supabase = await createSupabaseServerClient();
  const repository = new ProfilesRepository(supabase);

  await repository.upsertByUserId(userId, {
    fullName: parsed.data.fullName,
    locale: parsed.data.locale,
    defaultCurrency: parsed.data.defaultCurrency,
    timezone: parsed.data.timezone,
  });

  return {
    success: true as const,
    message: "Profile updated.",
  };
}
