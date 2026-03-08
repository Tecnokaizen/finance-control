# AGENTS.md

## Project mission

Build a web-based financial control app for freelancers, solo operators, agencies, and small businesses.

The goal is to ship a clear, maintainable, and scalable MVP that helps users:
- register income and expenses,
- manage invoices,
- view financial KPIs in a dashboard,
- upload PDF documents and review parsed suggestions,
- import transactions from CSV with mapping and validation,
- understand business performance quickly.

This project should prioritize clarity, stability, clean architecture, and practical delivery over overengineering.

---

## Core MVP scope

The MVP includes:
- authentication,
- profile and current business,
- categories,
- third parties,
- manual transactions,
- invoices,
- dashboard,
- PDF upload + preview + parsing suggestions + human review,
- CSV import with template, mapping, preview, and validation,
- basic reports,
- ownership/security,
- critical testing.

The MVP does **not** include as core scope unless explicitly requested:
- OCR-heavy document extraction,
- banking integrations,
- real multi-company UI,
- real multi-currency conversion,
- advanced financial accounts,
- background jobs infrastructure,
- native mobile app,
- advanced AI automations.

---

## Fixed decisions for this project

Assume these defaults unless explicitly changed:

- One business per user in the MVP.
- `transactions` is a unified entity for both income and expense.
- `invoices` is separate from `transactions`.
- Creating an invoice does **not** automatically create a transaction in the MVP.
- PDF flow uses text extraction + heuristics only.
- OCR is out of scope for the initial MVP.
- CSV priority is `transactions_csv` first.
- Dashboard financial KPIs use only `transactions.status = confirmed`.
- Pending invoice KPIs use invoice statuses `pending` + `overdue` and are global to the business.
- The product should behave first as a private app; marketing/public pages can come later.

---

## Required stack

Prefer this stack unless there is a strong reason not to:
- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn/ui
- React Hook Form
- Zod
- Supabase Auth
- Supabase PostgreSQL
- Supabase Storage
- Recharts
- Vitest / Testing Library / Playwright

---

## Architecture rules

### Frontend
- Organize by domain.
- Keep `app`, `features`, `components`, `lib`, and `types` separated.
- Reuse forms across manual creation, edit flows, and parsed PDF application when possible.
- Support loading, empty, error, and success states from the beginning.
- Keep UI components simple and reusable.

### Backend
- Separate handlers/actions, services, repositories, validation, mappers, parsers, and storage utilities.
- Do not place complex business logic directly in route handlers.
- Centralize business rules in services.
- Repositories should encapsulate queries and filters.
- Enforce ownership and business isolation in every data operation.

### Validation
- Use Zod.
- Revalidate on the server.
- Reject categories incompatible with transaction type.
- Reject references to resources from another business.
- Distinguish blocking errors from warnings where useful in PDF/CSV flows.

---

## Data model assumptions

Main entities:
- profiles
- businesses
- categories
- third_parties
- transactions
- invoices
- documents
- parsed_document_data
- imports
- import_rows

Key rules:
- UUID IDs
- `business_id` as tenant boundary
- `document_id` and `import_id` preserve traceability
- use clean DTOs and not raw DB shapes in the UI

---

## Dashboard rules

The dashboard must include at least:
- totalIncome
- totalExpense
- netProfit
- pendingInvoicesCount
- pendingInvoicesAmount
- latestTransactions
- expenseByCategory
- incomeVsExpenseSeries

Calculation rules:
- `totalIncome` = sum of confirmed income transactions in selected range
- `totalExpense` = sum of confirmed expense transactions in selected range
- `netProfit` = totalIncome - totalExpense
- pending invoice metrics = invoices with `pending` + `overdue`, global to business
- expense by category = confirmed expense transactions in selected range
- series = confirmed income/expense grouped by time bucket

Do not recalculate these inconsistently in the frontend.

---

## PDF flow rules

The PDF flow must be:
1. upload file
2. store document
3. show preview
4. parse document
5. return editable suggestions
6. require human confirmation
7. create invoice or transaction
8. preserve document link
9. allow later editing of the generated record

Never auto-finalize parsed document data as a confirmed financial record without human review.

---

## CSV flow rules

The CSV flow must be:
1. download template
2. upload CSV
3. detect headers
4. save mapping
5. validate rows
6. show preview
7. show row-level errors
8. execute import
9. preserve `import_id` traceability

Do not import final records without preview and validation.

---

## Security rules

- Enforce ownership by authenticated user and business.
- Use Supabase RLS.
- Never trust client-side IDs without backend checks.
- Do not expose service role or sensitive secrets to the client.
- Use separate public and private env variables.

---

## Quality bar

When implementing any feature:
- keep code modular,
- keep types and DTOs consistent,
- align with validation and API contracts,
- include meaningful loading/error states,
- avoid unnecessary complexity,
- preserve dashboard/report consistency,
- add tests for critical flows.

Critical areas to test:
- auth and ownership,
- create/update/delete transactions,
- create/update invoices,
- dashboard metrics,
- PDF flow,
- CSV flow.

---

## Recommended implementation order

1. setup base
2. auth + private layout
3. profile + current business
4. categories + third parties
5. transactions
6. invoices
7. dashboard
8. PDF flow
9. CSV flow
10. reports
11. testing and hardening

Do not jump to advanced features before the financial core is stable.

---

## Working style expectations

When working on this repo:
- explain the structure you are about to create,
- prefer pragmatic solutions,
- document important assumptions,
- follow the project docs under `/docs` as the source of truth,
- use the simplest stable option when a question is still open,
- avoid adding scope not required by the MVP.

If a decision is still open, use the suggested default from `docs/15-open-questions.md`.

---

## Source of truth

Treat the docs folder as project truth, especially:
- `docs/05-api-spec.md`
- `docs/06-validation-schemas.md`
- `docs/07-acceptance-criteria.md`
- `docs/08-frontend-architecture.md`
- `docs/09-backend-architecture.md`
- `docs/10-testing-strategy.md`
- `docs/11-dashboard-metrics.md`
- `docs/12-task-board.md`
- `docs/14-env-and-integrations.md`
- `docs/15-open-questions.md`
- `docs/16-master-prompt.md`

If there is any conflict, prefer the most recent explicit project decision and preserve MVP simplicity.

