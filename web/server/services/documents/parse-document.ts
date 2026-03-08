import { createSupabaseServerClient } from "@/lib/supabase/server";
import { DocumentsRepository } from "@/server/repositories/documents.repository";

function inferType(fileName: string) {
  const lower = fileName.toLowerCase();

  if (lower.includes("sale") || lower.includes("invoice-out") || lower.includes("issued")) {
    return "issued_invoice" as const;
  }

  if (lower.includes("expense") || lower.includes("purchase") || lower.includes("receipt")) {
    return "expense" as const;
  }

  if (lower.includes("invoice") || lower.includes("bill")) {
    return "received_invoice" as const;
  }

  return "expense" as const;
}

function inferAmount(fileName: string) {
  const match = fileName.match(/(\d+[\.,]\d{2})/);
  if (!match) {
    return null;
  }

  return Number(match[1].replace(",", "."));
}

export async function parseDocumentHeuristics(businessId: string, documentId: string) {
  const supabase = await createSupabaseServerClient();
  const repository = new DocumentsRepository(supabase);

  const document = await repository.findById(businessId, documentId);
  if (!document) {
    return {
      success: false as const,
      message: "Document not found for current business.",
    };
  }

  await repository.setParseStatus(businessId, documentId, "processing");

  try {
    const suggestedType = inferType(document.originalFileName);
    const suggestedAmount = inferAmount(document.originalFileName);
    const suggestedDate = new Date().toISOString().slice(0, 10);

    await repository.upsertParsed(businessId, documentId, {
      suggestedType,
      suggestedDate,
      suggestedAmount,
      suggestedCurrency: "EUR",
      suggestedThirdPartyName: null,
      suggestedInvoiceNumber: document.originalFileName.replace(/\.pdf$/i, "").slice(0, 80),
      confidenceScore: suggestedAmount ? 71 : 54,
      reviewStatus: "pending_review",
    });

    await repository.setParseStatus(businessId, documentId, "parsed");

    return {
      success: true as const,
      message: "Document parsed. Review suggestions before applying.",
    };
  } catch (error) {
    await repository.setParseStatus(businessId, documentId, "failed");
    throw error;
  }
}
