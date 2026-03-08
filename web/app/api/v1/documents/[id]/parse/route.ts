import { ok, fail, internalError } from "@/server/api/response";
import { requireAuthUserId } from "@/server/auth/require-auth";
import { requireCurrentBusinessId } from "@/server/auth/require-business";
import { parseDocumentHeuristics } from "@/server/services/documents/parse-document";

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const userId = await requireAuthUserId();
    const businessId = await requireCurrentBusinessId(userId);

    const result = await parseDocumentHeuristics(businessId, id);

    if (!result.success) {
      return fail("BAD_REQUEST", result.message, undefined, 400);
    }

    return ok({ parsed: true });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return fail("UNAUTHORIZED", "Authentication required", undefined, 401);
    }

    return internalError(error, "Could not parse document");
  }
}
