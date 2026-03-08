import type { SupabaseClient } from "@supabase/supabase-js";

import type { CreateTransactionInput, TransactionDto, TransactionWithRelationsDto, UpdateTransactionInput } from "@/types/transaction";

type TransactionRow = {
  id: string;
  business_id: string;
  user_id: string;
  type: "income" | "expense";
  status: "draft" | "pending" | "confirmed" | "cancelled";
  transaction_date: string;
  amount: number;
  currency: string;
  description: string | null;
  category_id: string;
  third_party_id: string | null;
  document_id: string | null;
  import_id: string | null;
  created_at: string;
  updated_at: string;
  categories?: { name: string } | null;
  third_parties?: { name: string } | null;
};

function toDto(row: TransactionRow): TransactionDto {
  return {
    id: row.id,
    businessId: row.business_id,
    userId: row.user_id,
    type: row.type,
    status: row.status,
    transactionDate: row.transaction_date,
    amount: Number(row.amount),
    currency: row.currency,
    description: row.description,
    categoryId: row.category_id,
    thirdPartyId: row.third_party_id,
    documentId: row.document_id,
    importId: row.import_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function toWithRelationsDto(row: TransactionRow): TransactionWithRelationsDto {
  return {
    ...toDto(row),
    categoryName: row.categories?.name ?? null,
    thirdPartyName: row.third_parties?.name ?? null,
  };
}

export class TransactionsRepository {
  constructor(private readonly supabase: SupabaseClient) {}

  async listByBusinessId(businessId: string): Promise<TransactionWithRelationsDto[]> {
    const { data, error } = await this.supabase
      .from("transactions")
      .select(
        "id,business_id,user_id,type,status,transaction_date,amount,currency,description,category_id,third_party_id,document_id,import_id,created_at,updated_at,categories!transactions_category_id_fkey(name),third_parties(name)",
      )
      .eq("business_id", businessId)
      .order("transaction_date", { ascending: false })
      .order("created_at", { ascending: false })
      .returns<TransactionRow[]>();

    if (error) {
      throw new Error(error.message);
    }

    return (data ?? []).map(toWithRelationsDto);
  }

  async create(businessId: string, userId: string, input: CreateTransactionInput): Promise<TransactionDto> {
    const { data, error } = await this.supabase
      .from("transactions")
      .insert({
        business_id: businessId,
        user_id: userId,
        type: input.type,
        status: input.status,
        source: "manual",
        transaction_date: input.transactionDate,
        amount: input.amount,
        currency: input.currency,
        description: input.description || null,
        category_id: input.categoryId,
        third_party_id: input.thirdPartyId || null,
        document_id: input.documentId || null,
        import_id: input.importId || null,
      })
      .select(
        "id,business_id,user_id,type,status,transaction_date,amount,currency,description,category_id,third_party_id,document_id,import_id,created_at,updated_at",
      )
      .single<TransactionRow>();

    if (error) {
      throw new Error(error.message);
    }

    return toDto(data);
  }

  async updateById(businessId: string, id: string, input: UpdateTransactionInput): Promise<TransactionDto> {
    const { data, error } = await this.supabase
      .from("transactions")
      .update({
        type: input.type,
        status: input.status,
        transaction_date: input.transactionDate,
        amount: input.amount,
        currency: input.currency,
        description: input.description || null,
        category_id: input.categoryId,
        third_party_id: input.thirdPartyId || null,
      })
      .eq("id", id)
      .eq("business_id", businessId)
      .select(
        "id,business_id,user_id,type,status,transaction_date,amount,currency,description,category_id,third_party_id,document_id,import_id,created_at,updated_at",
      )
      .single<TransactionRow>();

    if (error) {
      throw new Error(error.message);
    }

    return toDto(data);
  }
}
