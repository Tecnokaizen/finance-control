import { createSupabaseServerClient } from "@/lib/supabase/server";
import { thirdPartySchema } from "@/lib/validation/third-parties";
import { ok, fail, internalError } from "@/server/api/response";
import { requireAuthUserId } from "@/server/auth/require-auth";
import { requireCurrentBusinessId } from "@/server/auth/require-business";
import { ThirdPartiesRepository } from "@/server/repositories/third-parties.repository";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const userId = await requireAuthUserId();
    const businessId = await requireCurrentBusinessId(userId);
    const body = await request.json();
    const parsed = thirdPartySchema.safeParse(body);

    if (!parsed.success) {
      return fail("VALIDATION_ERROR", "Invalid third party payload", parsed.error.flatten().fieldErrors, 422);
    }

    const supabase = await createSupabaseServerClient();
    const repository = new ThirdPartiesRepository(supabase);

    return ok(
      await repository.updateById(businessId, id, {
        type: parsed.data.type,
        name: parsed.data.name,
        legalName: parsed.data.legalName,
        email: parsed.data.email,
        phone: parsed.data.phone,
        taxId: parsed.data.taxId,
      }),
    );
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return fail("UNAUTHORIZED", "Authentication required", undefined, 401);
    }
    return internalError(error, "Could not update third party");
  }
}
