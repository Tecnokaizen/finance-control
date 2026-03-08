import { createSupabaseServerClient } from "@/lib/supabase/server";
import { importMappingSchema } from "@/lib/validation/imports";
import { CategoriesRepository } from "@/server/repositories/categories.repository";
import { ImportsRepository } from "@/server/repositories/imports.repository";
import { inferMapping, parseCsvText } from "@/server/services/imports/csv-utils";
import { validateImportRows } from "@/server/services/imports/validate-import";

export async function uploadTransactionsCsv(businessId: string, userId: string, formData: FormData) {
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return {
      success: false as const,
      message: "CSV file is required.",
    };
  }

  if (!file.name.toLowerCase().endsWith(".csv")) {
    return {
      success: false as const,
      message: "Only CSV files are supported.",
    };
  }

  const text = await file.text();
  const { headers, rows } = parseCsvText(text);

  if (headers.length === 0) {
    return {
      success: false as const,
      message: "CSV is empty.",
    };
  }

  const inferredMapping = inferMapping(headers);
  const parsedMapping = importMappingSchema.safeParse(inferredMapping);

  if (!parsedMapping.success) {
    return {
      success: false as const,
      message: "Could not infer CSV mapping. Please map headers manually.",
      fieldErrors: parsedMapping.error.flatten().fieldErrors,
    };
  }

  const supabase = await createSupabaseServerClient();
  const importsRepository = new ImportsRepository(supabase);
  const categoriesRepository = new CategoriesRepository(supabase);

  const createdImport = await importsRepository.create(businessId, userId, file.name);
  await importsRepository.updateMappingAndStatus(businessId, createdImport.id, parsedMapping.data, "validating");

  const categories = await categoriesRepository.listByBusinessId(businessId);
  const validatedRows = validateImportRows(headers, rows, parsedMapping.data, categories);

  await importsRepository.replaceRows(createdImport.id, validatedRows);

  const validRows = validatedRows.filter((row) => row.validationStatus === "valid" || row.validationStatus === "warning").length;
  const invalidRows = validatedRows.filter((row) => row.validationStatus === "invalid").length;

  await importsRepository.setSummary(businessId, createdImport.id, {
    totalRows: validatedRows.length,
    validRows,
    invalidRows,
    status: "validated",
    summaryJson: {
      headers,
      mapping: parsedMapping.data,
      validatedAt: new Date().toISOString(),
    },
  });

  return {
    success: true as const,
    message: "CSV uploaded, headers detected, mapping saved, and rows validated.",
  };
}
