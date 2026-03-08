"use server";

import { revalidatePath } from "next/cache";

import type { DocumentsActionState } from "@/features/documents/types/documents-action-state";
import { requireAuthUserId } from "@/server/auth/require-auth";
import { requireCurrentBusinessId } from "@/server/auth/require-business";
import { getUserFacingErrorMessage } from "@/server/errors/user-facing-error";
import { applyParsedDocument } from "@/server/services/documents/apply-parsed-document";
import { parseDocumentHeuristics } from "@/server/services/documents/parse-document";
import { uploadDocument } from "@/server/services/documents/upload-document";

export async function uploadDocumentAction(
  _prevState: DocumentsActionState,
  formData: FormData,
): Promise<DocumentsActionState> {
  try {
    const userId = await requireAuthUserId();
    const businessId = await requireCurrentBusinessId(userId);
    const result = await uploadDocument(businessId, userId, formData);

    if (!result.success) {
      return result;
    }

    revalidatePath("/documents");

    return { success: true, message: result.message };
  } catch (error) {
    return {
      success: false,
      message: getUserFacingErrorMessage(error, "Could not upload document."),
    };
  }
}

export async function parseDocumentAction(
  _prevState: DocumentsActionState,
  formData: FormData,
): Promise<DocumentsActionState> {
  try {
    const userId = await requireAuthUserId();
    const businessId = await requireCurrentBusinessId(userId);
    const documentId = formData.get("documentId");

    if (!documentId || typeof documentId !== "string") {
      return { success: false, message: "Document id is required." };
    }

    const result = await parseDocumentHeuristics(businessId, documentId);

    if (!result.success) {
      return result;
    }

    revalidatePath("/documents");

    return { success: true, message: result.message };
  } catch (error) {
    return {
      success: false,
      message: getUserFacingErrorMessage(error, "Could not parse document."),
    };
  }
}

export async function applyParsedDocumentAction(
  _prevState: DocumentsActionState,
  formData: FormData,
): Promise<DocumentsActionState> {
  try {
    const userId = await requireAuthUserId();
    const businessId = await requireCurrentBusinessId(userId);
    const documentId = formData.get("documentId");

    if (!documentId || typeof documentId !== "string") {
      return { success: false, message: "Document id is required." };
    }

    const result = await applyParsedDocument(businessId, userId, documentId, formData);

    if (!result.success) {
      return result;
    }

    revalidatePath("/documents");
    revalidatePath("/transactions");
    revalidatePath("/invoices");

    return { success: true, message: result.message };
  } catch (error) {
    return {
      success: false,
      message: getUserFacingErrorMessage(error, "Could not apply parsed document."),
    };
  }
}
