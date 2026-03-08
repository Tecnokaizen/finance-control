import { createSupabaseServerClient } from "@/lib/supabase/server";
import { categorySchema } from "@/lib/validation/categories";
import { ok, fail, internalError } from "@/server/api/response";
import { requireAuthUserId } from "@/server/auth/require-auth";
import { requireCurrentBusinessId } from "@/server/auth/require-business";
import { CategoriesRepository } from "@/server/repositories/categories.repository";

export async function GET() {
  try {
    const userId = await requireAuthUserId();
    const businessId = await requireCurrentBusinessId(userId);

    const supabase = await createSupabaseServerClient();
    const repository = new CategoriesRepository(supabase);

    return ok(await repository.listByBusinessId(businessId));
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return fail("UNAUTHORIZED", "Authentication required", undefined, 401);
    }
    return internalError(error, "Could not list categories");
  }
}

export async function POST(request: Request) {
  try {
    const userId = await requireAuthUserId();
    const businessId = await requireCurrentBusinessId(userId);
    const body = await request.json();
    const parsed = categorySchema.safeParse(body);

    if (!parsed.success) {
      return fail("VALIDATION_ERROR", "Invalid category payload", parsed.error.flatten().fieldErrors, 422);
    }

    const supabase = await createSupabaseServerClient();
    const repository = new CategoriesRepository(supabase);

    return ok(await repository.create(businessId, parsed.data));
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return fail("UNAUTHORIZED", "Authentication required", undefined, 401);
    }
    return internalError(error, "Could not create category");
  }
}
