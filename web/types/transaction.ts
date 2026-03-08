export type TransactionType = "income" | "expense";
export type TransactionStatus = "draft" | "pending" | "confirmed" | "cancelled";

export type TransactionDto = {
  id: string;
  businessId: string;
  userId: string;
  type: TransactionType;
  status: TransactionStatus;
  transactionDate: string;
  amount: number;
  currency: string;
  description: string | null;
  categoryId: string;
  thirdPartyId: string | null;
  documentId: string | null;
  importId: string | null;
  createdAt: string;
  updatedAt: string;
};

export type TransactionWithRelationsDto = TransactionDto & {
  categoryName: string | null;
  thirdPartyName: string | null;
};

export type CreateTransactionInput = {
  type: TransactionType;
  status: TransactionStatus;
  transactionDate: string;
  amount: number;
  currency: string;
  description?: string;
  categoryId: string;
  thirdPartyId?: string;
  documentId?: string;
  importId?: string;
};

export type UpdateTransactionInput = CreateTransactionInput;
