import { createSupabaseServerClient } from "@/lib/supabase/server";
import { applyParsedDocumentSchema } from "@/lib/validation/documents";
import { DocumentsRepository } from "@/server/repositories/documents.repository";
import { createInvoice } from "@/server/services/invoices/create-invoice";
import { createTransaction } from "@/server/services/transactions/create-transaction";

export async function applyParsedDocument(
  businessId: string,
  userId: string,
  documentId: string,
  formData: FormData,
) {
  const parsed = applyParsedDocumentSchema.safeParse({
    targetType: formData.get("targetType"),
    transactionType: formData.get("transactionType") || undefined,
    invoiceType: formData.get("invoiceType") || undefined,
    date: formData.get("date"),
    amount: formData.get("amount"),
    currency: formData.get("currency"),
    description: formData.get("description") || "",
    invoiceNumber: formData.get("invoiceNumber") || "",
    categoryId: formData.get("categoryId") || "",
    thirdPartyId: formData.get("thirdPartyId") || "",
  });

  if (!parsed.success) {
    return {
      success: false as const,
      message: "Please review parsed fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  if (parsed.data.targetType === "transaction") {
    if (!parsed.data.transactionType) {
      return {
        success: false as const,
        message: "Transaction type is required.",
      };
    }

    if (!parsed.data.categoryId) {
      return {
        success: false as const,
        message: "Category is required for transactions.",
      };
    }

    const transactionData = new FormData();
    transactionData.set("type", parsed.data.transactionType);
    transactionData.set("status", "pending");
    transactionData.set("transactionDate", parsed.data.date);
    transactionData.set("amount", String(parsed.data.amount));
    transactionData.set("currency", parsed.data.currency);
    transactionData.set("description", parsed.data.description || "Parsed from PDF");
    transactionData.set("categoryId", parsed.data.categoryId);
    transactionData.set("documentId", documentId);
    if (parsed.data.thirdPartyId) {
      transactionData.set("thirdPartyId", parsed.data.thirdPartyId);
    }

    const result = await createTransaction(businessId, userId, transactionData);

    if (!result.success) {
      return result;
    }

    const supabase = await createSupabaseServerClient();
    const repository = new DocumentsRepository(supabase);
    try {
      await repository.setReviewStatus(businessId, documentId, "applied");
    } catch {
      return {
        success: true as const,
        message: "Parsed transaction created, but document review status could not be updated.",
      };
    }

    return {
      success: true as const,
      message: "Parsed document applied as transaction (pending review).",
    };
  }

  const invoiceType = parsed.data.invoiceType ?? "received";

  const invoiceData = new FormData();
  invoiceData.set("type", invoiceType);
  invoiceData.set("status", "pending");
  invoiceData.set("invoiceNumber", parsed.data.invoiceNumber || "");
  invoiceData.set("issueDate", parsed.data.date);
  invoiceData.set("amountTotal", String(parsed.data.amount));
  invoiceData.set("currency", parsed.data.currency);
  if (parsed.data.thirdPartyId) {
    invoiceData.set("thirdPartyId", parsed.data.thirdPartyId);
  }
  if (parsed.data.categoryId) {
    invoiceData.set("categoryId", parsed.data.categoryId);
  }
  invoiceData.set("notes", parsed.data.description || "Parsed from PDF");
  invoiceData.set("documentId", documentId);

  const result = await createInvoice(businessId, userId, invoiceData);

  if (!result.success) {
    return result;
  }

  const supabase = await createSupabaseServerClient();
  const repository = new DocumentsRepository(supabase);
  try {
    await repository.setReviewStatus(businessId, documentId, "applied");
  } catch {
    return {
      success: true as const,
      message: "Parsed invoice created, but document review status could not be updated.",
    };
  }

  return {
    success: true as const,
    message: "Parsed document applied as invoice (pending).",
  };
}
