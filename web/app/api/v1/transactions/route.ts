import { createSupabaseServerClient } from "@/lib/supabase/server";
import { ok, fail, internalError } from "@/server/api/response";
import { requireAuthUserId } from "@/server/auth/require-auth";
import { requireCurrentBusinessId } from "@/server/auth/require-business";
import { TransactionsRepository } from "@/server/repositories/transactions.repository";
import { createTransaction } from "@/server/services/transactions/create-transaction";

export async function GET() {
  try {
    const userId = await requireAuthUserId();
    const businessId = await requireCurrentBusinessId(userId);

    const supabase = await createSupabaseServerClient();
    const repository = new TransactionsRepository(supabase);

    return ok(await repository.listByBusinessId(businessId));
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return fail("UNAUTHORIZED", "Authentication required", undefined, 401);
    }
    return internalError(error, "Could not list transactions");
  }
}

export async function POST(request: Request) {
  try {
    const userId = await requireAuthUserId();
    const businessId = await requireCurrentBusinessId(userId);
    const body = (await request.json()) as Record<string, unknown>;
    const formData = new FormData();

    for (const [key, value] of Object.entries(body)) {
      if (value === null || value === undefined) {
        continue;
      }

      formData.set(key, String(value));
    }

    const result = await createTransaction(businessId, userId, formData);

    if (!result.success) {
      return fail("VALIDATION_ERROR", result.message, result.fieldErrors, 422);
    }

    return ok({ created: true, message: result.message });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return fail("UNAUTHORIZED", "Authentication required", undefined, 401);
    }
    return internalError(error, "Could not create transaction");
  }
}
