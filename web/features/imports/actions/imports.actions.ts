"use server";

import { revalidatePath } from "next/cache";

import type { ImportsActionState } from "@/features/imports/types/imports-action-state";
import { requireAuthUserId } from "@/server/auth/require-auth";
import { requireCurrentBusinessId } from "@/server/auth/require-business";
import { getUserFacingErrorMessage } from "@/server/errors/user-facing-error";
import { executeImport } from "@/server/services/imports/execute-import";
import { updateImportMapping } from "@/server/services/imports/update-import-mapping";
import { uploadTransactionsCsv } from "@/server/services/imports/upload-transactions-csv";

export async function uploadTransactionsCsvAction(
  _prevState: ImportsActionState,
  formData: FormData,
): Promise<ImportsActionState> {
  try {
    const userId = await requireAuthUserId();
    const businessId = await requireCurrentBusinessId(userId);
    const result = await uploadTransactionsCsv(businessId, userId, formData);

    if (!result.success) {
      return result;
    }

    revalidatePath("/imports");

    return { success: true, message: result.message };
  } catch (error) {
    return {
      success: false,
      message: getUserFacingErrorMessage(error, "Could not upload CSV import."),
    };
  }
}

export async function updateImportMappingAction(
  _prevState: ImportsActionState,
  formData: FormData,
): Promise<ImportsActionState> {
  try {
    const userId = await requireAuthUserId();
    const businessId = await requireCurrentBusinessId(userId);
    const importId = formData.get("importId");

    if (!importId || typeof importId !== "string") {
      return { success: false, message: "Import id is required." };
    }

    const result = await updateImportMapping(businessId, importId, formData);

    if (!result.success) {
      return result;
    }

    revalidatePath("/imports");

    return { success: true, message: result.message };
  } catch (error) {
    return {
      success: false,
      message: getUserFacingErrorMessage(error, "Could not update mapping."),
    };
  }
}

export async function executeImportAction(
  _prevState: ImportsActionState,
  formData: FormData,
): Promise<ImportsActionState> {
  try {
    const userId = await requireAuthUserId();
    const businessId = await requireCurrentBusinessId(userId);
    const importId = formData.get("importId");

    if (!importId || typeof importId !== "string") {
      return { success: false, message: "Import id is required." };
    }

    const result = await executeImport(businessId, userId, importId);

    if (!result.success) {
      return result;
    }

    revalidatePath("/imports");
    revalidatePath("/transactions");
    revalidatePath("/dashboard");

    return { success: true, message: result.message };
  } catch (error) {
    return {
      success: false,
      message: getUserFacingErrorMessage(error, "Could not execute import."),
    };
  }
}
