export type ImportStatus =
  | "uploaded"
  | "mapping_pending"
  | "validating"
  | "validated"
  | "partially_imported"
  | "imported"
  | "failed"
  | "cancelled";

export type ImportRowStatus = "pending" | "valid" | "warning" | "invalid" | "imported" | "skipped";

export type ImportDto = {
  id: string;
  businessId: string;
  userId: string;
  importType: "transactions_csv";
  sourceFileName: string;
  totalRows: number;
  validRows: number;
  invalidRows: number;
  status: ImportStatus;
  mappingJson: Record<string, string> | null;
  summaryJson: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
};

export type ImportRowDto = {
  id: string;
  importId: string;
  rowNumber: number;
  rawDataJson: Record<string, string>;
  normalizedDataJson: Record<string, string> | null;
  validationStatus: ImportRowStatus;
  errorMessagesJson: { errors?: string[]; warnings?: string[] } | null;
};

export type ImportWithRowsDto = ImportDto & { rows: ImportRowDto[] };
