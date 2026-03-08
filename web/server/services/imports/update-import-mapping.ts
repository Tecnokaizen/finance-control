import { createSupabaseServerClient } from "@/lib/supabase/server";
import { importMappingSchema } from "@/lib/validation/imports";
import { CategoriesRepository } from "@/server/repositories/categories.repository";
import { ImportsRepository } from "@/server/repositories/imports.repository";
import { validateImportRows } from "@/server/services/imports/validate-import";

export async function updateImportMapping(businessId: string, importId: string, formData: FormData) {
  const parsed = importMappingSchema.safeParse({
    transactionDate: formData.get("transactionDate"),
    type: formData.get("type"),
    amount: formData.get("amount"),
    currency: formData.get("currency"),
    description: formData.get("description"),
    categorySlug: formData.get("categorySlug"),
  });

  if (!parsed.success) {
    return {
      success: false as const,
      message: "Invalid mapping fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const supabase = await createSupabaseServerClient();
  const importsRepository = new ImportsRepository(supabase);
  const categoriesRepository = new CategoriesRepository(supabase);

  const current = await importsRepository.getWithRows(businessId, importId);
  if (!current) {
    return {
      success: false as const,
      message: "Import not found.",
    };
  }

  const headers = Object.keys(current.rows[0]?.rawDataJson ?? {});
  const rows = current.rows.map((row) => headers.map((header) => row.rawDataJson[header] ?? ""));
  const categories = await categoriesRepository.listByBusinessId(businessId);
  const validatedRows = validateImportRows(headers, rows, parsed.data, categories);

  await importsRepository.updateMappingAndStatus(businessId, importId, parsed.data, "validating");
  await importsRepository.replaceRows(importId, validatedRows);

  const validRows = validatedRows.filter((row) => row.validationStatus === "valid" || row.validationStatus === "warning").length;
  const invalidRows = validatedRows.filter((row) => row.validationStatus === "invalid").length;

  await importsRepository.setSummary(businessId, importId, {
    totalRows: validatedRows.length,
    validRows,
    invalidRows,
    status: "validated",
    summaryJson: {
      headers,
      mapping: parsed.data,
      remappedAt: new Date().toISOString(),
    },
  });

  return {
    success: true as const,
    message: "Mapping updated and rows revalidated.",
  };
}
