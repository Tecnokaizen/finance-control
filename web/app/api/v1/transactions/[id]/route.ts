import { ok, fail, internalError } from "@/server/api/response";
import { requireAuthUserId } from "@/server/auth/require-auth";
import { requireCurrentBusinessId } from "@/server/auth/require-business";
import { updateTransaction } from "@/server/services/transactions/update-transaction";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const userId = await requireAuthUserId();
    const businessId = await requireCurrentBusinessId(userId);
    const body = (await request.json()) as Record<string, unknown>;
    const formData = new FormData();
    formData.set("id", id);

    for (const [key, value] of Object.entries(body)) {
      if (value === null || value === undefined) {
        continue;
      }

      formData.set(key, String(value));
    }

    const result = await updateTransaction(businessId, formData);

    if (!result.success) {
      return fail("VALIDATION_ERROR", result.message, result.fieldErrors, 422);
    }

    return ok({ updated: true, message: result.message });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return fail("UNAUTHORIZED", "Authentication required", undefined, 401);
    }
    return internalError(error, "Could not update transaction");
  }
}
