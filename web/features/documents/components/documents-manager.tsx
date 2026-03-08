"use client";

import { useActionState } from "react";

import { Card, CardHeader } from "@/components/ui/card";
import {
  applyParsedDocumentAction,
  parseDocumentAction,
  uploadDocumentAction,
} from "@/features/documents/actions/documents.actions";
import {
  INITIAL_DOCUMENTS_ACTION_STATE,
  type DocumentsActionState,
} from "@/features/documents/types/documents-action-state";
import type { CategoryDto } from "@/types/category";
import type { DocumentDto, ParsedDocumentDataDto } from "@/types/document";
import type { ThirdPartyDto } from "@/types/third-party";

type DocumentWithParsed = DocumentDto & { parsed: ParsedDocumentDataDto | null };

function getFieldError(state: DocumentsActionState, key: string) {
  return state.fieldErrors?.[key]?.[0];
}

function formatLabel(value: string) {
  return value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (match) => match.toUpperCase());
}

function ParseDocumentForm({ documentId }: { documentId: string }) {
  const [state, action, isPending] = useActionState(parseDocumentAction, INITIAL_DOCUMENTS_ACTION_STATE);

  return (
    <form action={action} className="flex items-center gap-2">
      <input type="hidden" name="documentId" value={documentId} />
      <button
        type="submit"
        disabled={isPending}
        className="rounded-lg border border-slate-300 bg-white px-3 py-1 text-sm hover:bg-slate-50 disabled:opacity-60"
      >
        {isPending ? "Parsing..." : "Parse"}
      </button>
      {state.message ? <span className={`text-xs ${state.success ? "text-emerald-700" : "text-rose-700"}`}>{state.message}</span> : null}
    </form>
  );
}

function ApplyParsedForm({
  document,
  categories,
  thirdParties,
}: {
  document: DocumentWithParsed;
  categories: CategoryDto[];
  thirdParties: ThirdPartyDto[];
}) {
  const [state, action, isPending] = useActionState(applyParsedDocumentAction, INITIAL_DOCUMENTS_ACTION_STATE);

  if (!document.parsed) {
    return null;
  }

  const parsedType = document.parsed.suggestedType;
  const inferredTransactionType = parsedType === "income" ? "income" : "expense";
  const inferredInvoiceType = parsedType === "issued_invoice" ? "issued" : "received";

  return (
    <form action={action} className="mt-3 space-y-2 rounded-xl border border-amber-200 bg-amber-50 p-3">
      <input type="hidden" name="documentId" value={document.id} />
      <p className="text-xs font-medium text-amber-800">
        Parsed suggestions ({document.parsed.confidenceScore ?? 0}% confidence). Review before applying.
      </p>

      <div className="grid gap-2 sm:grid-cols-4">
        <select name="targetType" defaultValue="transaction" className="rounded-lg border border-slate-300 bg-white px-2 py-1 text-sm">
          <option value="transaction">Transaction</option>
          <option value="invoice">Invoice</option>
        </select>
        <select
          name="transactionType"
          defaultValue={inferredTransactionType}
          className="rounded-lg border border-slate-300 bg-white px-2 py-1 text-sm"
        >
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <select name="invoiceType" defaultValue={inferredInvoiceType} className="rounded-lg border border-slate-300 bg-white px-2 py-1 text-sm">
          <option value="issued">Issued</option>
          <option value="received">Received</option>
        </select>
        <input
          name="date"
          type="date"
          defaultValue={document.parsed.suggestedDate ?? new Date().toISOString().slice(0, 10)}
          className="rounded-lg border border-slate-300 bg-white px-2 py-1 text-sm"
        />
      </div>

      <div className="grid gap-2 sm:grid-cols-4">
        <input
          name="amount"
          type="number"
          step="0.01"
          defaultValue={document.parsed.suggestedAmount ?? undefined}
          placeholder="Amount"
          className="rounded-lg border border-slate-300 bg-white px-2 py-1 text-sm"
          required
        />
        <input
          name="currency"
          defaultValue={document.parsed.suggestedCurrency ?? "EUR"}
          className="rounded-lg border border-slate-300 bg-white px-2 py-1 text-sm"
        />
        <input
          name="invoiceNumber"
          defaultValue={document.parsed.suggestedInvoiceNumber ?? ""}
          placeholder="Invoice #"
          className="rounded-lg border border-slate-300 bg-white px-2 py-1 text-sm"
        />
        <input name="description" placeholder="Description" className="rounded-lg border border-slate-300 bg-white px-2 py-1 text-sm" />
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        <select name="categoryId" defaultValue="" className="rounded-lg border border-slate-300 bg-white px-2 py-1 text-sm">
          <option value="">No category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        <select name="thirdPartyId" defaultValue="" className="rounded-lg border border-slate-300 bg-white px-2 py-1 text-sm">
          <option value="">No third party</option>
          {thirdParties.map((thirdParty) => (
            <option key={thirdParty.id} value={thirdParty.id}>
              {thirdParty.name}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="rounded-lg bg-slate-900 px-3 py-1 text-sm font-semibold text-white disabled:opacity-60"
      >
        {isPending ? "Applying..." : "Apply (human confirmed)"}
      </button>

      {state.message ? <p className={`text-xs ${state.success ? "text-emerald-700" : "text-rose-700"}`}>{state.message}</p> : null}
      {getFieldError(state, "amount") ? <p className="text-xs text-rose-600">{getFieldError(state, "amount")}</p> : null}
    </form>
  );
}

export function DocumentsManager({
  documents,
  categories,
  thirdParties,
}: {
  documents: DocumentWithParsed[];
  categories: CategoryDto[];
  thirdParties: ThirdPartyDto[];
}) {
  const [uploadState, uploadAction, uploadPending] = useActionState(uploadDocumentAction, INITIAL_DOCUMENTS_ACTION_STATE);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader title="1. Upload PDF" />
        <form action={uploadAction} className="grid gap-3 sm:grid-cols-3">
          <input name="file" type="file" accept="application/pdf" className="rounded-xl border border-slate-300 px-3 py-2 text-sm" required />
          <select name="documentType" defaultValue="invoice_pdf" className="rounded-xl border border-slate-300 px-3 py-2 text-sm">
            <option value="invoice_pdf">Invoice PDF</option>
            <option value="receipt_pdf">Receipt PDF</option>
            <option value="statement_pdf">Statement PDF</option>
            <option value="generic_pdf">Generic PDF</option>
          </select>
          <button type="submit" disabled={uploadPending} className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">
            {uploadPending ? "Uploading..." : "Upload"}
          </button>
        </form>
        {uploadState.message ? (
          <p className={`mt-3 text-sm ${uploadState.success ? "text-emerald-700" : "text-rose-700"}`}>{uploadState.message}</p>
        ) : null}
      </Card>

      <Card>
        <CardHeader title="2-9. Preview, Parse, Review, Apply" />
        <div className="space-y-3">
          {documents.length === 0 ? <p className="text-sm text-slate-500">No documents uploaded yet.</p> : null}

          {documents.map((document) => (
            <div key={document.id} className="rounded-xl border border-slate-200 bg-white p-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-slate-900">{document.originalFileName}</p>
                  <p className="text-xs text-slate-500">
                    {formatLabel(document.documentType)} · {document.mimeType} · {document.fileSize} bytes · Parse status:{" "}
                    {formatLabel(document.parseStatus)}
                    {document.parsed ? ` · Review: ${formatLabel(document.parsed.reviewStatus)}` : ""}
                  </p>
                </div>
                <ParseDocumentForm documentId={document.id} />
              </div>

              <ApplyParsedForm document={document} categories={categories} thirdParties={thirdParties} />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
