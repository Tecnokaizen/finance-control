"use server";

import { revalidatePath } from "next/cache";

import type { TransactionsActionState } from "@/features/transactions/types/transactions-action-state";
import { requireAuthUserId } from "@/server/auth/require-auth";
import { requireCurrentBusinessId } from "@/server/auth/require-business";
import { getUserFacingErrorMessage } from "@/server/errors/user-facing-error";
import { createTransaction } from "@/server/services/transactions/create-transaction";
import { updateTransaction } from "@/server/services/transactions/update-transaction";

export async function createTransactionAction(
  _prevState: TransactionsActionState,
  formData: FormData,
): Promise<TransactionsActionState> {
  try {
    const userId = await requireAuthUserId();
    const businessId = await requireCurrentBusinessId(userId);
    const result = await createTransaction(businessId, userId, formData);

    if (!result.success) {
      return result;
    }

    revalidatePath("/transactions");
    revalidatePath("/dashboard");

    return { success: true, message: result.message };
  } catch (error) {
    return {
      success: false,
      message: getUserFacingErrorMessage(error, "Could not create transaction."),
    };
  }
}

export async function updateTransactionAction(
  _prevState: TransactionsActionState,
  formData: FormData,
): Promise<TransactionsActionState> {
  try {
    const userId = await requireAuthUserId();
    const businessId = await requireCurrentBusinessId(userId);
    const result = await updateTransaction(businessId, formData);

    if (!result.success) {
      return result;
    }

    revalidatePath("/transactions");
    revalidatePath("/dashboard");

    return { success: true, message: result.message };
  } catch (error) {
    return {
      success: false,
      message: getUserFacingErrorMessage(error, "Could not update transaction."),
    };
  }
}
