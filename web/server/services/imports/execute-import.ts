import { createTransaction } from "@/server/services/transactions/create-transaction";
import { ImportsRepository } from "@/server/repositories/imports.repository";
import { CategoriesRepository } from "@/server/repositories/categories.repository";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function executeImport(businessId: string, userId: string, importId: string) {
  const supabase = await createSupabaseServerClient();
  const importsRepository = new ImportsRepository(supabase);
  const categoriesRepository = new CategoriesRepository(supabase);

  const importData = await importsRepository.getWithRows(businessId, importId);
  if (!importData) {
    return {
      success: false as const,
      message: "Import not found.",
    };
  }

  const categories = await categoriesRepository.listByBusinessId(businessId);
  const categoryBySlug = new Map(categories.map((category) => [category.slug, category]));
  const alreadyImportedCount = importData.rows.filter((row) => row.validationStatus === "imported").length;

  const rowIdsToMarkImported: string[] = [];
  let importedCount = 0;

  for (const row of importData.rows) {
    if (row.validationStatus !== "valid" && row.validationStatus !== "warning") {
      continue;
    }

    if (!row.normalizedDataJson) {
      continue;
    }

    const category = categoryBySlug.get(row.normalizedDataJson.categorySlug);
    if (!category) {
      continue;
    }

    const data = new FormData();
    data.set("type", row.normalizedDataJson.type);
    data.set("status", "confirmed");
    data.set("transactionDate", row.normalizedDataJson.transactionDate);
    data.set("amount", row.normalizedDataJson.amount);
    data.set("currency", row.normalizedDataJson.currency);
    data.set("description", row.normalizedDataJson.description || "Imported from CSV");
    data.set("categoryId", category.id);
    data.set("importId", importId);

    const result = await createTransaction(businessId, userId, data);

    if (result.success) {
      rowIdsToMarkImported.push(row.id);
      importedCount += 1;
    }
  }

  await importsRepository.markRowsAsImported(importId, rowIdsToMarkImported);

  const importableRowsCount = importData.rows.filter(
    (row) =>
      row.validationStatus === "valid" ||
      row.validationStatus === "warning" ||
      row.validationStatus === "imported",
  ).length;
  const totalImportedCount = alreadyImportedCount + importedCount;
  const status =
    importableRowsCount > 0 && totalImportedCount >= importableRowsCount
      ? "imported"
      : "partially_imported";

  await importsRepository.setSummary(businessId, importId, {
    totalRows: importData.totalRows,
    validRows: importData.validRows,
    invalidRows: importData.invalidRows,
    status,
    summaryJson: {
      ...(importData.summaryJson ?? {}),
      importedCount: totalImportedCount,
      newlyImportedCount: importedCount,
      executedAt: new Date().toISOString(),
    },
  });

  return {
    success: true as const,
    message: `Import executed. ${importedCount} rows imported.`,
  };
}
