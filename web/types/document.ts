export type DocumentType = "invoice_pdf" | "receipt_pdf" | "statement_pdf" | "generic_pdf";
export type ParseStatus = "pending" | "processing" | "parsed" | "partial" | "failed" | "skipped";

export type DocumentDto = {
  id: string;
  businessId: string;
  userId: string;
  fileName: string;
  originalFileName: string;
  mimeType: string;
  fileSize: number;
  storagePath: string;
  documentType: DocumentType;
  parseStatus: ParseStatus;
  createdAt: string;
};

export type ParsedDocumentDataDto = {
  id: string;
  documentId: string;
  businessId: string;
  suggestedType: "income" | "expense" | "issued_invoice" | "received_invoice" | null;
  suggestedDate: string | null;
  suggestedAmount: number | null;
  suggestedCurrency: string | null;
  suggestedThirdPartyName: string | null;
  suggestedInvoiceNumber: string | null;
  confidenceScore: number | null;
  reviewStatus: "pending_review" | "reviewed" | "rejected" | "applied";
};
