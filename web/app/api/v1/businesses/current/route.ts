import { createSupabaseServerClient } from "@/lib/supabase/server";
import { updateBusinessSchema } from "@/lib/validation/businesses";
import { ok, fail, internalError } from "@/server/api/response";
import { requireAuthUserId } from "@/server/auth/require-auth";
import { BusinessesRepository } from "@/server/repositories/businesses.repository";
import { getCurrentBusiness } from "@/server/services/businesses/get-current-business";

export async function GET() {
  try {
    const userId = await requireAuthUserId();
    const business = await getCurrentBusiness(userId);
    return ok(business);
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return fail("UNAUTHORIZED", "Authentication required", undefined, 401);
    }
    return internalError(error, "Could not fetch current business");
  }
}

export async function PATCH(request: Request) {
  try {
    const userId = await requireAuthUserId();
    const body = await request.json();

    const parsed = updateBusinessSchema.safeParse(body);
    if (!parsed.success) {
      return fail("VALIDATION_ERROR", "Invalid business payload", parsed.error.flatten().fieldErrors, 422);
    }

    const supabase = await createSupabaseServerClient();
    const repository = new BusinessesRepository(supabase);
    const business = await repository.updateCurrentByUserId(userId, {
      name: parsed.data.name,
      legalName: parsed.data.legalName || "",
      taxId: parsed.data.taxId || "",
      defaultCurrency: parsed.data.defaultCurrency,
      country: parsed.data.country || "",
    });

    return ok(business);
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return fail("UNAUTHORIZED", "Authentication required", undefined, 401);
    }
    return internalError(error, "Could not update current business");
  }
}
