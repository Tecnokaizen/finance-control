import type { SupabaseClient } from "@supabase/supabase-js";

import type { DocumentDto, ParsedDocumentDataDto } from "@/types/document";

type DocumentRow = {
  id: string;
  business_id: string;
  user_id: string;
  file_name: string;
  original_file_name: string;
  mime_type: string;
  file_size: number;
  storage_path: string;
  document_type: "invoice_pdf" | "receipt_pdf" | "statement_pdf" | "generic_pdf";
  parse_status: "pending" | "processing" | "parsed" | "partial" | "failed" | "skipped";
  created_at: string;
};

type ParsedRow = {
  id: string;
  document_id: string;
  business_id: string;
  suggested_type: "income" | "expense" | "issued_invoice" | "received_invoice" | null;
  suggested_date: string | null;
  suggested_amount: number | null;
  suggested_currency: string | null;
  suggested_third_party_name: string | null;
  suggested_invoice_number: string | null;
  confidence_score: number | null;
  review_status: "pending_review" | "reviewed" | "rejected" | "applied";
};

function toDocumentDto(row: DocumentRow): DocumentDto {
  return {
    id: row.id,
    businessId: row.business_id,
    userId: row.user_id,
    fileName: row.file_name,
    originalFileName: row.original_file_name,
    mimeType: row.mime_type,
    fileSize: row.file_size,
    storagePath: row.storage_path,
    documentType: row.document_type,
    parseStatus: row.parse_status,
    createdAt: row.created_at,
  };
}

function toParsedDto(row: ParsedRow): ParsedDocumentDataDto {
  return {
    id: row.id,
    documentId: row.document_id,
    businessId: row.business_id,
    suggestedType: row.suggested_type,
    suggestedDate: row.suggested_date,
    suggestedAmount: row.suggested_amount === null ? null : Number(row.suggested_amount),
    suggestedCurrency: row.suggested_currency,
    suggestedThirdPartyName: row.suggested_third_party_name,
    suggestedInvoiceNumber: row.suggested_invoice_number,
    confidenceScore: row.confidence_score === null ? null : Number(row.confidence_score),
    reviewStatus: row.review_status,
  };
}

export class DocumentsRepository {
  constructor(private readonly supabase: SupabaseClient) {}

  async listByBusinessId(businessId: string): Promise<(DocumentDto & { parsed: ParsedDocumentDataDto | null })[]> {
    const { data, error } = await this.supabase
      .from("documents")
      .select("id,business_id,user_id,file_name,original_file_name,mime_type,file_size,storage_path,document_type,parse_status,created_at")
      .eq("business_id", businessId)
      .order("created_at", { ascending: false })
      .returns<DocumentRow[]>();

    if (error) {
      throw new Error(error.message);
    }

    const documents = (data ?? []).map(toDocumentDto);
    const parsedMap = new Map<string, ParsedDocumentDataDto>();

    if (documents.length > 0) {
      const { data: parsedData, error: parsedError } = await this.supabase
        .from("parsed_document_data")
        .select(
          "id,document_id,business_id,suggested_type,suggested_date,suggested_amount,suggested_currency,suggested_third_party_name,suggested_invoice_number,confidence_score,review_status",
        )
        .eq("business_id", businessId)
        .in(
          "document_id",
          documents.map((document) => document.id),
        )
        .returns<ParsedRow[]>();

      if (parsedError) {
        throw new Error(parsedError.message);
      }

      for (const row of parsedData ?? []) {
        parsedMap.set(row.document_id, toParsedDto(row));
      }
    }

    return documents.map((document) => ({
      ...document,
      parsed: parsedMap.get(document.id) ?? null,
    }));
  }

  async create(
    businessId: string,
    userId: string,
    input: {
      fileName: string;
      originalFileName: string;
      mimeType: string;
      fileSize: number;
      storagePath: string;
      documentType: DocumentDto["documentType"];
    },
  ): Promise<DocumentDto> {
    const { data, error } = await this.supabase
      .from("documents")
      .insert({
        business_id: businessId,
        user_id: userId,
        file_name: input.fileName,
        original_file_name: input.originalFileName,
        mime_type: input.mimeType,
        file_size: input.fileSize,
        storage_path: input.storagePath,
        document_type: input.documentType,
        upload_status: "uploaded",
        parse_status: "pending",
      })
      .select("id,business_id,user_id,file_name,original_file_name,mime_type,file_size,storage_path,document_type,parse_status,created_at")
      .single<DocumentRow>();

    if (error) {
      throw new Error(error.message);
    }

    return toDocumentDto(data);
  }

  async findById(businessId: string, id: string): Promise<DocumentDto | null> {
    const { data, error } = await this.supabase
      .from("documents")
      .select("id,business_id,user_id,file_name,original_file_name,mime_type,file_size,storage_path,document_type,parse_status,created_at")
      .eq("business_id", businessId)
      .eq("id", id)
      .maybeSingle<DocumentRow>();

    if (error) {
      throw new Error(error.message);
    }

    return data ? toDocumentDto(data) : null;
  }

  async upsertParsed(
    businessId: string,
    documentId: string,
    input: {
      suggestedType: ParsedDocumentDataDto["suggestedType"];
      suggestedDate: string | null;
      suggestedAmount: number | null;
      suggestedCurrency: string | null;
      suggestedThirdPartyName: string | null;
      suggestedInvoiceNumber: string | null;
      confidenceScore: number | null;
      reviewStatus: ParsedDocumentDataDto["reviewStatus"];
    },
  ): Promise<ParsedDocumentDataDto> {
    const { data, error } = await this.supabase
      .from("parsed_document_data")
      .upsert(
        {
          business_id: businessId,
          document_id: documentId,
          suggested_type: input.suggestedType,
          suggested_date: input.suggestedDate,
          suggested_amount: input.suggestedAmount,
          suggested_currency: input.suggestedCurrency,
          suggested_third_party_name: input.suggestedThirdPartyName,
          suggested_invoice_number: input.suggestedInvoiceNumber,
          confidence_score: input.confidenceScore,
          review_status: input.reviewStatus,
        },
        { onConflict: "document_id" },
      )
      .select(
        "id,document_id,business_id,suggested_type,suggested_date,suggested_amount,suggested_currency,suggested_third_party_name,suggested_invoice_number,confidence_score,review_status",
      )
      .single<ParsedRow>();

    if (error) {
      throw new Error(error.message);
    }

    return toParsedDto(data);
  }

  async setParseStatus(businessId: string, documentId: string, status: DocumentDto["parseStatus"]) {
    const { error } = await this.supabase
      .from("documents")
      .update({ parse_status: status })
      .eq("business_id", businessId)
      .eq("id", documentId);

    if (error) {
      throw new Error(error.message);
    }
  }

  async setReviewStatus(businessId: string, documentId: string, status: ParsedDocumentDataDto["reviewStatus"]) {
    const { error } = await this.supabase
      .from("parsed_document_data")
      .update({ review_status: status })
      .eq("business_id", businessId)
      .eq("document_id", documentId);

    if (error) {
      throw new Error(error.message);
    }
  }
}
