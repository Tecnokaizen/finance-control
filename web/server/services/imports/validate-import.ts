import type { CategoryDto } from "@/types/category";
import type { ImportMappingInput } from "@/lib/validation/imports";

export type ValidatedImportRow = {
  rowNumber: number;
  rawDataJson: Record<string, string>;
  normalizedDataJson: Record<string, string> | null;
  validationStatus: "valid" | "invalid" | "warning";
  errorMessagesJson: { errors?: string[]; warnings?: string[] } | null;
};

export function validateImportRows(
  headers: string[],
  rows: string[][],
  mapping: ImportMappingInput,
  categories: CategoryDto[],
): ValidatedImportRow[] {
  const categoryBySlug = new Map(categories.map((category) => [category.slug, category]));

  return rows.map((rowValues, index) => {
    const rowNumber = index + 2;
    const rawDataJson: Record<string, string> = {};

    headers.forEach((header, i) => {
      rawDataJson[header] = rowValues[i] ?? "";
    });

    const normalizedDataJson: Record<string, string> = {
      transactionDate: rawDataJson[mapping.transactionDate] ?? "",
      type: rawDataJson[mapping.type] ?? "",
      amount: rawDataJson[mapping.amount] ?? "",
      currency: rawDataJson[mapping.currency] ?? "",
      description: rawDataJson[mapping.description] ?? "",
      categorySlug: rawDataJson[mapping.categorySlug] ?? "",
    };

    const errors: string[] = [];
    const warnings: string[] = [];

    if (!/^\d{4}-\d{2}-\d{2}$/.test(normalizedDataJson.transactionDate)) {
      errors.push("transactionDate must be YYYY-MM-DD");
    }

    if (!["income", "expense"].includes(normalizedDataJson.type)) {
      errors.push("type must be income or expense");
    }

    const amount = Number(normalizedDataJson.amount);
    if (!Number.isFinite(amount) || amount <= 0) {
      errors.push("amount must be greater than 0");
    }

    if (!/^[A-Za-z]{3}$/.test(normalizedDataJson.currency)) {
      errors.push("currency must have 3 letters");
    }

    const category = categoryBySlug.get(normalizedDataJson.categorySlug);
    if (!category) {
      errors.push("categorySlug not found in current business");
    } else if (category.type !== normalizedDataJson.type) {
      errors.push("category type incompatible with transaction type");
    }

    if (!normalizedDataJson.description) {
      warnings.push("description is empty");
    }

    return {
      rowNumber,
      rawDataJson,
      normalizedDataJson,
      validationStatus: errors.length > 0 ? "invalid" : warnings.length > 0 ? "warning" : "valid",
      errorMessagesJson: errors.length > 0 || warnings.length > 0 ? { errors, warnings } : null,
    };
  });
}
