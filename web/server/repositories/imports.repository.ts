import type { SupabaseClient } from "@supabase/supabase-js";

import type { ImportDto, ImportRowDto, ImportWithRowsDto } from "@/types/import";

type ImportRow = {
  id: string;
  business_id: string;
  user_id: string;
  import_type: "transactions_csv";
  source_file_name: string;
  total_rows: number;
  valid_rows: number;
  invalid_rows: number;
  status: ImportDto["status"];
  mapping_json: Record<string, string> | null;
  summary_json: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
};

type ImportDetailRow = {
  id: string;
  import_id: string;
  row_number: number;
  raw_data_json: Record<string, string>;
  normalized_data_json: Record<string, string> | null;
  validation_status: ImportRowDto["validationStatus"];
  error_messages_json: { errors?: string[]; warnings?: string[] } | null;
};

function toImportDto(row: ImportRow): ImportDto {
  return {
    id: row.id,
    businessId: row.business_id,
    userId: row.user_id,
    importType: row.import_type,
    sourceFileName: row.source_file_name,
    totalRows: row.total_rows,
    validRows: row.valid_rows,
    invalidRows: row.invalid_rows,
    status: row.status,
    mappingJson: row.mapping_json,
    summaryJson: row.summary_json,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function toImportRowDto(row: ImportDetailRow): ImportRowDto {
  return {
    id: row.id,
    importId: row.import_id,
    rowNumber: row.row_number,
    rawDataJson: row.raw_data_json,
    normalizedDataJson: row.normalized_data_json,
    validationStatus: row.validation_status,
    errorMessagesJson: row.error_messages_json,
  };
}

export class ImportsRepository {
  constructor(private readonly supabase: SupabaseClient) {}

  async listByBusinessId(businessId: string): Promise<ImportDto[]> {
    const { data, error } = await this.supabase
      .from("imports")
      .select(
        "id,business_id,user_id,import_type,source_file_name,total_rows,valid_rows,invalid_rows,status,mapping_json,summary_json,created_at,updated_at",
      )
      .eq("business_id", businessId)
      .eq("import_type", "transactions_csv")
      .order("created_at", { ascending: false })
      .returns<ImportRow[]>();

    if (error) {
      throw new Error(error.message);
    }

    return (data ?? []).map(toImportDto);
  }

  async create(businessId: string, userId: string, sourceFileName: string): Promise<ImportDto> {
    const { data, error } = await this.supabase
      .from("imports")
      .insert({
        business_id: businessId,
        user_id: userId,
        import_type: "transactions_csv",
        source_file_name: sourceFileName,
        status: "uploaded",
      })
      .select(
        "id,business_id,user_id,import_type,source_file_name,total_rows,valid_rows,invalid_rows,status,mapping_json,summary_json,created_at,updated_at",
      )
      .single<ImportRow>();

    if (error) {
      throw new Error(error.message);
    }

    return toImportDto(data);
  }

  async updateMappingAndStatus(
    businessId: string,
    importId: string,
    mapping: Record<string, string>,
    status: ImportDto["status"],
  ) {
    const { error } = await this.supabase
      .from("imports")
      .update({ mapping_json: mapping, status })
      .eq("business_id", businessId)
      .eq("id", importId);

    if (error) {
      throw new Error(error.message);
    }
  }

  async setSummary(
    businessId: string,
    importId: string,
    values: { totalRows: number; validRows: number; invalidRows: number; status: ImportDto["status"]; summaryJson: Record<string, unknown> },
  ) {
    const { error } = await this.supabase
      .from("imports")
      .update({
        total_rows: values.totalRows,
        valid_rows: values.validRows,
        invalid_rows: values.invalidRows,
        status: values.status,
        summary_json: values.summaryJson,
      })
      .eq("business_id", businessId)
      .eq("id", importId);

    if (error) {
      throw new Error(error.message);
    }
  }

  async replaceRows(
    importId: string,
    rows: Array<{
      rowNumber: number;
      rawDataJson: Record<string, string>;
      normalizedDataJson: Record<string, string> | null;
      validationStatus: ImportRowDto["validationStatus"];
      errorMessagesJson: { errors?: string[]; warnings?: string[] } | null;
    }>,
  ) {
    const { error: deleteError } = await this.supabase.from("import_rows").delete().eq("import_id", importId);
    if (deleteError) {
      throw new Error(deleteError.message);
    }

    if (rows.length === 0) {
      return;
    }

    const { error } = await this.supabase.from("import_rows").insert(
      rows.map((row) => ({
        import_id: importId,
        row_number: row.rowNumber,
        raw_data_json: row.rawDataJson,
        normalized_data_json: row.normalizedDataJson,
        validation_status: row.validationStatus,
        error_messages_json: row.errorMessagesJson,
      })),
    );

    if (error) {
      throw new Error(error.message);
    }
  }

  async getWithRows(businessId: string, importId: string): Promise<ImportWithRowsDto | null> {
    const { data: importData, error: importError } = await this.supabase
      .from("imports")
      .select(
        "id,business_id,user_id,import_type,source_file_name,total_rows,valid_rows,invalid_rows,status,mapping_json,summary_json,created_at,updated_at",
      )
      .eq("business_id", businessId)
      .eq("id", importId)
      .maybeSingle<ImportRow>();

    if (importError) {
      throw new Error(importError.message);
    }

    if (!importData) {
      return null;
    }

    const { data: rowData, error: rowError } = await this.supabase
      .from("import_rows")
      .select("id,import_id,row_number,raw_data_json,normalized_data_json,validation_status,error_messages_json")
      .eq("import_id", importId)
      .order("row_number", { ascending: true })
      .returns<ImportDetailRow[]>();

    if (rowError) {
      throw new Error(rowError.message);
    }

    return {
      ...toImportDto(importData),
      rows: (rowData ?? []).map(toImportRowDto),
    };
  }

  async listWithRowsByBusinessId(businessId: string): Promise<ImportWithRowsDto[]> {
    const imports = await this.listByBusinessId(businessId);

    const results: ImportWithRowsDto[] = [];
    for (const item of imports) {
      const full = await this.getWithRows(businessId, item.id);
      if (full) {
        results.push(full);
      }
    }

    return results;
  }

  async markRowsAsImported(importId: string, rowIds: string[]) {
    if (rowIds.length === 0) {
      return;
    }

    const { error } = await this.supabase
      .from("import_rows")
      .update({ validation_status: "imported" })
      .in("id", rowIds)
      .eq("import_id", importId);

    if (error) {
      throw new Error(error.message);
    }
  }
}
