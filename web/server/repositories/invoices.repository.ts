import type { SupabaseClient } from "@supabase/supabase-js";

import type { CreateInvoiceInput, InvoiceDto, InvoiceWithRelationsDto, UpdateInvoiceInput } from "@/types/invoice";

type InvoiceRow = {
  id: string;
  business_id: string;
  user_id: string;
  type: "issued" | "received";
  status: "draft" | "pending" | "paid" | "overdue" | "cancelled";
  invoice_number: string | null;
  issue_date: string;
  due_date: string | null;
  amount_total: number;
  currency: string;
  third_party_id: string | null;
  category_id: string | null;
  document_id: string | null;
  import_id: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  categories?: { name: string } | null;
  third_parties?: { name: string } | null;
};

function toDto(row: InvoiceRow): InvoiceDto {
  return {
    id: row.id,
    businessId: row.business_id,
    userId: row.user_id,
    type: row.type,
    status: row.status,
    invoiceNumber: row.invoice_number,
    issueDate: row.issue_date,
    dueDate: row.due_date,
    amountTotal: Number(row.amount_total),
    currency: row.currency,
    thirdPartyId: row.third_party_id,
    categoryId: row.category_id,
    documentId: row.document_id,
    importId: row.import_id,
    notes: row.notes,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function toWithRelationsDto(row: InvoiceRow): InvoiceWithRelationsDto {
  return {
    ...toDto(row),
    thirdPartyName: row.third_parties?.name ?? null,
    categoryName: row.categories?.name ?? null,
  };
}

export class InvoicesRepository {
  constructor(private readonly supabase: SupabaseClient) {}

  async listByBusinessId(businessId: string): Promise<InvoiceWithRelationsDto[]> {
    const { data, error } = await this.supabase
      .from("invoices")
      .select(
        "id,business_id,user_id,type,status,invoice_number,issue_date,due_date,amount_total,currency,third_party_id,category_id,document_id,import_id,notes,created_at,updated_at,third_parties(name),categories(name)",
      )
      .eq("business_id", businessId)
      .order("issue_date", { ascending: false })
      .order("created_at", { ascending: false })
      .returns<InvoiceRow[]>();

    if (error) {
      throw new Error(error.message);
    }

    return (data ?? []).map(toWithRelationsDto);
  }

  async create(businessId: string, userId: string, input: CreateInvoiceInput): Promise<InvoiceDto> {
    const { data, error } = await this.supabase
      .from("invoices")
      .insert({
        business_id: businessId,
        user_id: userId,
        type: input.type,
        status: input.status,
        invoice_number: input.invoiceNumber || null,
        issue_date: input.issueDate,
        due_date: input.dueDate || null,
        amount_total: input.amountTotal,
        currency: input.currency,
        third_party_id: input.thirdPartyId || null,
        category_id: input.categoryId || null,
        document_id: input.documentId || null,
        import_id: input.importId || null,
        notes: input.notes || null,
      })
      .select(
        "id,business_id,user_id,type,status,invoice_number,issue_date,due_date,amount_total,currency,third_party_id,category_id,document_id,import_id,notes,created_at,updated_at",
      )
      .single<InvoiceRow>();

    if (error) {
      throw new Error(error.message);
    }

    return toDto(data);
  }

  async updateById(businessId: string, id: string, input: UpdateInvoiceInput): Promise<InvoiceDto> {
    const { data, error } = await this.supabase
      .from("invoices")
      .update({
        type: input.type,
        status: input.status,
        invoice_number: input.invoiceNumber || null,
        issue_date: input.issueDate,
        due_date: input.dueDate || null,
        amount_total: input.amountTotal,
        currency: input.currency,
        third_party_id: input.thirdPartyId || null,
        category_id: input.categoryId || null,
        document_id: input.documentId || null,
        import_id: input.importId || null,
        notes: input.notes || null,
      })
      .eq("id", id)
      .eq("business_id", businessId)
      .select(
        "id,business_id,user_id,type,status,invoice_number,issue_date,due_date,amount_total,currency,third_party_id,category_id,document_id,import_id,notes,created_at,updated_at",
      )
      .single<InvoiceRow>();

    if (error) {
      throw new Error(error.message);
    }

    return toDto(data);
  }
}
