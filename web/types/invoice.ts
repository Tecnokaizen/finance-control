export type InvoiceType = "issued" | "received";
export type InvoiceStatus = "draft" | "pending" | "paid" | "overdue" | "cancelled";

export type InvoiceDto = {
  id: string;
  businessId: string;
  userId: string;
  type: InvoiceType;
  status: InvoiceStatus;
  invoiceNumber: string | null;
  issueDate: string;
  dueDate: string | null;
  amountTotal: number;
  currency: string;
  thirdPartyId: string | null;
  categoryId: string | null;
  documentId: string | null;
  importId: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
};

export type InvoiceWithRelationsDto = InvoiceDto & {
  thirdPartyName: string | null;
  categoryName: string | null;
};

export type CreateInvoiceInput = {
  type: InvoiceType;
  status: InvoiceStatus;
  invoiceNumber?: string;
  issueDate: string;
  dueDate?: string;
  amountTotal: number;
  currency: string;
  thirdPartyId?: string;
  categoryId?: string;
  documentId?: string;
  importId?: string;
  notes?: string;
};

export type UpdateInvoiceInput = CreateInvoiceInput;
