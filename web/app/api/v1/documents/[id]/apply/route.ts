import { ok, fail, internalError } from "@/server/api/response";
import { requireAuthUserId } from "@/server/auth/require-auth";
import { requireCurrentBusinessId } from "@/server/auth/require-business";
import { applyParsedDocument } from "@/server/services/documents/apply-parsed-document";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const userId = await requireAuthUserId();
    const businessId = await requireCurrentBusinessId(userId);

    const body = await request.json();
    const formData = new FormData();

    for (const [key, value] of Object.entries(body as Record<string, string | number>)) {
      formData.set(key, String(value));
    }

    const result = await applyParsedDocument(businessId, userId, id, formData);

    if (!result.success) {
      return fail("VALIDATION_ERROR", result.message, result.fieldErrors, 422);
    }

    return ok({ applied: true });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return fail("UNAUTHORIZED", "Authentication required", undefined, 401);
    }

    return internalError(error, "Could not apply parsed document");
  }
}
