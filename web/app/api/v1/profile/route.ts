import { createSupabaseServerClient } from "@/lib/supabase/server";
import { updateProfileSchema } from "@/lib/validation/profile";
import { ok, fail, internalError } from "@/server/api/response";
import { requireAuthUserId } from "@/server/auth/require-auth";
import { ProfilesRepository } from "@/server/repositories/profiles.repository";
import { getCurrentProfile } from "@/server/services/profile/get-current-profile";

export async function GET() {
  try {
    const userId = await requireAuthUserId();
    const profile = await getCurrentProfile(userId);
    return ok(profile);
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return fail("UNAUTHORIZED", "Authentication required", undefined, 401);
    }
    return internalError(error, "Could not fetch profile");
  }
}

export async function PATCH(request: Request) {
  try {
    const userId = await requireAuthUserId();
    const body = await request.json();

    const parsed = updateProfileSchema.safeParse(body);
    if (!parsed.success) {
      return fail("VALIDATION_ERROR", "Invalid profile payload", parsed.error.flatten().fieldErrors, 422);
    }

    const supabase = await createSupabaseServerClient();
    const repository = new ProfilesRepository(supabase);
    const profile = await repository.upsertByUserId(userId, {
      fullName: parsed.data.fullName,
      locale: parsed.data.locale,
      defaultCurrency: parsed.data.defaultCurrency,
      timezone: parsed.data.timezone,
    });

    return ok(profile);
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return fail("UNAUTHORIZED", "Authentication required", undefined, 401);
    }
    return internalError(error, "Could not update profile");
  }
}
