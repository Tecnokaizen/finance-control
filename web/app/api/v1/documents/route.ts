import { createSupabaseServerClient } from "@/lib/supabase/server";
import { ok, fail, internalError } from "@/server/api/response";
import { requireAuthUserId } from "@/server/auth/require-auth";
import { requireCurrentBusinessId } from "@/server/auth/require-business";
import { DocumentsRepository } from "@/server/repositories/documents.repository";

export async function GET() {
  try {
    const userId = await requireAuthUserId();
    const businessId = await requireCurrentBusinessId(userId);

    const supabase = await createSupabaseServerClient();
    const repository = new DocumentsRepository(supabase);

    return ok(await repository.listByBusinessId(businessId));
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return fail("UNAUTHORIZED", "Authentication required", undefined, 401);
    }

    return internalError(error, "Could not list documents");
  }
}
