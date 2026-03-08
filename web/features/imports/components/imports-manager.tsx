"use client";

import { useActionState } from "react";

import { Card, CardHeader } from "@/components/ui/card";
import {
  executeImportAction,
  updateImportMappingAction,
  uploadTransactionsCsvAction,
} from "@/features/imports/actions/imports.actions";
import {
  INITIAL_IMPORTS_ACTION_STATE,
  type ImportsActionState,
} from "@/features/imports/types/imports-action-state";
import type { ImportWithRowsDto } from "@/types/import";

function formatStatus(value: string) {
  return value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (match) => match.toUpperCase());
}

function ImportMappingForm({ importItem }: { importItem: ImportWithRowsDto }) {
  const [state, action, isPending] = useActionState(updateImportMappingAction, INITIAL_IMPORTS_ACTION_STATE);
  const mapping = importItem.mappingJson ?? {};
  const headers = Object.keys(importItem.rows[0]?.rawDataJson ?? {});

  return (
    <form action={action} className="space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-3">
      <input type="hidden" name="importId" value={importItem.id} />
      <p className="text-xs font-medium text-slate-700">Mapping</p>

      <div className="grid gap-2 sm:grid-cols-3">
        {[
          ["transactionDate", "Transaction Date"],
          ["type", "Type"],
          ["amount", "Amount"],
          ["currency", "Currency"],
          ["description", "Description"],
          ["categorySlug", "Category Slug"],
        ].map(([key, label]) => (
          <label key={key} className="space-y-1 text-xs text-slate-600">
            <span>{label}</span>
            <select
              name={key}
              defaultValue={(mapping as Record<string, string>)[key] ?? ""}
              className="w-full rounded-lg border border-slate-300 bg-white px-2 py-1 text-sm"
              required
            >
              <option value="">Select header</option>
              {headers.map((header) => (
                <option key={header} value={header}>
                  {header}
                </option>
              ))}
            </select>
          </label>
        ))}
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="rounded-lg border border-slate-300 bg-white px-3 py-1 text-sm hover:bg-slate-100 disabled:opacity-60"
      >
        {isPending ? "Saving..." : "Save mapping + revalidate"}
      </button>

      {state.message ? <p className={`text-xs ${state.success ? "text-emerald-700" : "text-rose-700"}`}>{state.message}</p> : null}
    </form>
  );
}

function ExecuteImportForm({ importId }: { importId: string }) {
  const [state, action, isPending] = useActionState(executeImportAction, INITIAL_IMPORTS_ACTION_STATE);

  return (
    <form action={action} className="flex items-center gap-2">
      <input type="hidden" name="importId" value={importId} />
      <button
        type="submit"
        disabled={isPending}
        className="rounded-lg bg-slate-900 px-3 py-1 text-sm font-semibold text-white disabled:opacity-60"
      >
        {isPending ? "Importing..." : "Execute import"}
      </button>
      {state.message ? <span className={`text-xs ${state.success ? "text-emerald-700" : "text-rose-700"}`}>{state.message}</span> : null}
    </form>
  );
}

function getRowIssue(state: ImportsActionState, key: string) {
  return state.fieldErrors?.[key]?.[0];
}

export function ImportsManager({ imports }: { imports: ImportWithRowsDto[] }) {
  const [uploadState, uploadAction, uploadPending] = useActionState(uploadTransactionsCsvAction, INITIAL_IMPORTS_ACTION_STATE);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader title="1-3. Template + Upload + Header Detection" />
        <div className="mb-3">
          <a
            href="/api/v1/imports/template"
            className="inline-block rounded-lg border border-slate-300 bg-white px-3 py-1 text-sm hover:bg-slate-100"
          >
            Download transactions CSV template
          </a>
        </div>

        <form action={uploadAction} className="grid gap-3 sm:grid-cols-2">
          <input name="file" type="file" accept=".csv,text/csv" className="rounded-xl border border-slate-300 px-3 py-2 text-sm" required />
          <button type="submit" disabled={uploadPending} className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">
            {uploadPending ? "Uploading..." : "Upload + validate"}
          </button>
        </form>

        {uploadState.message ? (
          <p className={`mt-3 text-sm ${uploadState.success ? "text-emerald-700" : "text-rose-700"}`}>{uploadState.message}</p>
        ) : null}
        {getRowIssue(uploadState, "transactionDate") ? (
          <p className="mt-1 text-xs text-rose-600">{getRowIssue(uploadState, "transactionDate")}</p>
        ) : null}
      </Card>

      <Card>
        <CardHeader title="4-9. Mapping, Preview, Validation, Execute" />
        <div className="space-y-4">
          {imports.length === 0 ? <p className="text-sm text-slate-500">No imports yet.</p> : null}
          {imports.map((item) => (
            <div key={item.id} className="space-y-3 rounded-xl border border-slate-200 bg-white p-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-slate-900">{item.sourceFileName}</p>
                  <p className="text-xs text-slate-500">
                    Status: {formatStatus(item.status)} · Total: {item.totalRows} · Valid: {item.validRows} · Invalid:{" "}
                    {item.invalidRows}
                  </p>
                </div>
                <ExecuteImportForm importId={item.id} />
              </div>

              <ImportMappingForm importItem={item} />

              <div className="space-y-2">
                <p className="text-xs font-medium text-slate-700">Row preview</p>
                {item.rows.slice(0, 12).map((row) => (
                  <div key={row.id} className="rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs">
                    <p className="font-medium text-slate-700">
                      Row {row.rowNumber} · {formatStatus(row.validationStatus)}
                    </p>
                    {row.errorMessagesJson?.errors?.length ? (
                      <p className="text-rose-700">Errors: {row.errorMessagesJson.errors.join(" | ")}</p>
                    ) : null}
                    {row.errorMessagesJson?.warnings?.length ? (
                      <p className="text-amber-700">Warnings: {row.errorMessagesJson.warnings.join(" | ")}</p>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
