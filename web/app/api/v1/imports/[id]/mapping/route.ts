import { ok, fail, internalError } from "@/server/api/response";
import { requireAuthUserId } from "@/server/auth/require-auth";
import { requireCurrentBusinessId } from "@/server/auth/require-business";
import { updateImportMapping } from "@/server/services/imports/update-import-mapping";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const userId = await requireAuthUserId();
    const businessId = await requireCurrentBusinessId(userId);

    const body = await request.json();
    const formData = new FormData();
    Object.entries(body as Record<string, string>).forEach(([key, value]) => {
      formData.set(key, value);
    });

    const result = await updateImportMapping(businessId, id, formData);

    if (!result.success) {
      return fail("VALIDATION_ERROR", result.message, result.fieldErrors, 422);
    }

    return ok({ updated: true });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return fail("UNAUTHORIZED", "Authentication required", undefined, 401);
    }

    return internalError(error, "Could not update mapping");
  }
}
