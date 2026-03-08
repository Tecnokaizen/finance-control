"use server";

import { revalidatePath } from "next/cache";

import type { InvoicesActionState } from "@/features/invoices/types/invoices-action-state";
import { requireAuthUserId } from "@/server/auth/require-auth";
import { requireCurrentBusinessId } from "@/server/auth/require-business";
import { getUserFacingErrorMessage } from "@/server/errors/user-facing-error";
import { createInvoice } from "@/server/services/invoices/create-invoice";
import { updateInvoice } from "@/server/services/invoices/update-invoice";

export async function createInvoiceAction(
  _prevState: InvoicesActionState,
  formData: FormData,
): Promise<InvoicesActionState> {
  try {
    const userId = await requireAuthUserId();
    const businessId = await requireCurrentBusinessId(userId);
    const result = await createInvoice(businessId, userId, formData);

    if (!result.success) {
      return result;
    }

    revalidatePath("/invoices");
    revalidatePath("/dashboard");

    return { success: true, message: result.message };
  } catch (error) {
    return {
      success: false,
      message: getUserFacingErrorMessage(error, "Could not create invoice."),
    };
  }
}

export async function updateInvoiceAction(
  _prevState: InvoicesActionState,
  formData: FormData,
): Promise<InvoicesActionState> {
  try {
    const userId = await requireAuthUserId();
    const businessId = await requireCurrentBusinessId(userId);
    const result = await updateInvoice(businessId, formData);

    if (!result.success) {
      return result;
    }

    revalidatePath("/invoices");
    revalidatePath("/dashboard");

    return { success: true, message: result.message };
  } catch (error) {
    return {
      success: false,
      message: getUserFacingErrorMessage(error, "Could not update invoice."),
    };
  }
}
