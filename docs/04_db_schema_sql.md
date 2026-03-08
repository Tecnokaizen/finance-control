# 04 · DB Schema SQL

## 1. Propósito del documento

Este documento define un esquema SQL inicial para PostgreSQL/Supabase basado en el modelo de datos del proyecto. Está pensado como base operativa para que Codex pueda generar migraciones, políticas de seguridad, seeds y acceso a datos con una estructura coherente desde el inicio.

El objetivo no es cerrar una versión final e inamovible, sino proporcionar un **schema MVP sólido, ejecutable y escalable**.

---

## 2. Decisiones previas asumidas

Este schema parte de estas decisiones:

- PostgreSQL como base de datos.
- Supabase Auth o sistema equivalente para autenticación.
- UUID como identificador principal.
- `transactions` como tabla unificada para ingresos y gastos.
- `businesses` como capa multi-tenant simple.
- `documents` + `parsed_document_data` para PDFs.
- `imports` + `import_rows` para importaciones CSV.
- `invoices` separada de `transactions`, con posibilidad de relación opcional.

---

## 3. Extensiones y utilidades recomendadas

```sql
create extension if not exists pgcrypto;
```

### Nota
Se usará `gen_random_uuid()` para generar IDs.

---

## 4. Convenciones generales

### Convenciones de nombres
- tablas en plural y snake_case
- columnas en snake_case
- primary keys como `id`
- foreign keys como `<tabla>_id`
- timestamps estándar: `created_at`, `updated_at`

### Convenciones de timestamps
Se recomienda usar:
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`

### Convención para importes
Para el MVP se recomienda:
- `numeric(12,2)` para importes monetarios

Si más adelante se necesita mayor precisión, se podrá ampliar.

---

## 5. Enumeraciones

### Opción recomendada
Para un MVP en evolución rápida, conviene usar `text` con `check constraints` en vez de tipos `enum` nativos de Postgres, porque facilita cambios sin migraciones más rígidas.

---

## 6. Tabla: profiles

```sql
create table public.profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique,
  full_name text,
  avatar_url text,
  locale text default 'es',
  default_currency text not null default 'EUR',
  timezone text not null default 'Europe/Madrid',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profiles_user_id_fkey
    foreign key (user_id)
    references auth.users (id)
    on delete cascade
);
```

---

## 7. Tabla: businesses

```sql
create table public.businesses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  name text not null,
  legal_name text,
  tax_id text,
  default_currency text not null default 'EUR',
  country text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint businesses_user_id_fkey
    foreign key (user_id)
    references auth.users (id)
    on delete cascade
);

create index idx_businesses_user_id on public.businesses(user_id);
```

---

## 8. Tabla: categories

```sql
create table public.categories (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null,
  name text not null,
  slug text not null,
  type text not null,
  parent_id uuid,
  color text,
  icon text,
  is_active boolean not null default true,
  sort_order integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint categories_business_id_fkey
    foreign key (business_id)
    references public.businesses (id)
    on delete cascade,
  constraint categories_parent_id_fkey
    foreign key (parent_id)
    references public.categories (id)
    on delete set null,
  constraint categories_type_check
    check (type in ('income', 'expense')),
  constraint categories_slug_unique
    unique (business_id, slug)
);

create index idx_categories_business_id on public.categories(business_id);
create index idx_categories_type on public.categories(type);
```

---

## 9. Tabla: third_parties

```sql
create table public.third_parties (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null,
  type text not null,
  name text not null,
  legal_name text,
  email text,
  phone text,
  tax_id text,
  address text,
  notes text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint third_parties_business_id_fkey
    foreign key (business_id)
    references public.businesses (id)
    on delete cascade,
  constraint third_parties_type_check
    check (type in ('client', 'supplier', 'both'))
);

create index idx_third_parties_business_id on public.third_parties(business_id);
create index idx_third_parties_type on public.third_parties(type);
```

---

## 10. Tabla: documents

```sql
create table public.documents (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null,
  user_id uuid not null,
  file_name text not null,
  original_file_name text not null,
  mime_type text not null,
  file_size bigint not null,
  storage_path text not null,
  file_hash text,
  document_type text not null default 'generic_pdf',
  preview_image_path text,
  upload_status text not null default 'uploaded',
  parse_status text not null default 'pending',
  uploaded_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint documents_business_id_fkey
    foreign key (business_id)
    references public.businesses (id)
    on delete cascade,
  constraint documents_user_id_fkey
    foreign key (user_id)
    references auth.users (id)
    on delete cascade,
  constraint documents_document_type_check
    check (document_type in ('invoice_pdf', 'receipt_pdf', 'statement_pdf', 'generic_pdf', 'image', 'other')),
  constraint documents_upload_status_check
    check (upload_status in ('uploaded', 'failed', 'deleted')),
  constraint documents_parse_status_check
    check (parse_status in ('pending', 'processing', 'parsed', 'partial', 'failed', 'skipped'))
);

create index idx_documents_business_id on public.documents(business_id);
create index idx_documents_parse_status on public.documents(parse_status);
create index idx_documents_user_id on public.documents(user_id);
```

---

## 11. Tabla: parsed_document_data

```sql
create table public.parsed_document_data (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null,
  business_id uuid not null,
  parser_version text,
  raw_text text,
  extracted_json jsonb not null default '{}'::jsonb,
  suggested_type text,
  suggested_date date,
  suggested_amount numeric(12,2),
  suggested_currency text,
  suggested_third_party_name text,
  suggested_invoice_number text,
  confidence_score numeric(5,2),
  review_status text not null default 'pending_review',
  reviewed_by uuid,
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint parsed_document_data_document_id_fkey
    foreign key (document_id)
    references public.documents (id)
    on delete cascade,
  constraint parsed_document_data_business_id_fkey
    foreign key (business_id)
    references public.businesses (id)
    on delete cascade,
  constraint parsed_document_data_reviewed_by_fkey
    foreign key (reviewed_by)
    references auth.users (id)
    on delete set null,
  constraint parsed_document_data_review_status_check
    check (review_status in ('pending_review', 'reviewed', 'rejected', 'applied')),
  constraint parsed_document_data_suggested_type_check
    check (suggested_type is null or suggested_type in ('income', 'expense', 'issued_invoice', 'received_invoice')),
  constraint parsed_document_data_confidence_score_check
    check (confidence_score is null or (confidence_score >= 0 and confidence_score <= 100))
);

create index idx_parsed_document_data_document_id on public.parsed_document_data(document_id);
create index idx_parsed_document_data_business_id on public.parsed_document_data(business_id);
create index idx_parsed_document_data_review_status on public.parsed_document_data(review_status);
```

---

## 12. Tabla: imports

```sql
create table public.imports (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null,
  user_id uuid not null,
  import_type text not null,
  source_file_name text not null,
  source_file_path text,
  template_version text,
  total_rows integer not null default 0,
  valid_rows integer not null default 0,
  invalid_rows integer not null default 0,
  status text not null default 'uploaded',
  mapping_json jsonb,
  summary_json jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint imports_business_id_fkey
    foreign key (business_id)
    references public.businesses (id)
    on delete cascade,
  constraint imports_user_id_fkey
    foreign key (user_id)
    references auth.users (id)
    on delete cascade,
  constraint imports_import_type_check
    check (import_type in ('transactions_csv', 'invoices_csv', 'categories_csv', 'third_parties_csv')),
  constraint imports_status_check
    check (status in ('uploaded', 'mapping_pending', 'validating', 'validated', 'partially_imported', 'imported', 'failed', 'cancelled'))
);

create index idx_imports_business_id on public.imports(business_id);
create index idx_imports_user_id on public.imports(user_id);
create index idx_imports_status on public.imports(status);
```

---

## 13. Tabla: import_rows

```sql
create table public.import_rows (
  id uuid primary key default gen_random_uuid(),
  import_id uuid not null,
  row_number integer not null,
  raw_data_json jsonb not null,
  normalized_data_json jsonb,
  validation_status text not null default 'pending',
  error_messages_json jsonb,
  created_record_type text,
  created_record_id uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint import_rows_import_id_fkey
    foreign key (import_id)
    references public.imports (id)
    on delete cascade,
  constraint import_rows_validation_status_check
    check (validation_status in ('pending', 'valid', 'warning', 'invalid', 'imported', 'skipped')),
  constraint import_rows_created_record_type_check
    check (created_record_type is null or created_record_type in ('transaction', 'invoice', 'category', 'third_party')),
  constraint import_rows_import_row_unique
    unique (import_id, row_number)
);

create index idx_import_rows_import_id on public.import_rows(import_id);
create index idx_import_rows_validation_status on public.import_rows(validation_status);
```

---

## 14. Tabla: invoices

```sql
create table public.invoices (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null,
  user_id uuid not null,
  type text not null,
  status text not null default 'draft',
  invoice_number text,
  issue_date date not null,
  due_date date,
  paid_date date,
  amount_total numeric(12,2) not null,
  currency text not null default 'EUR',
  third_party_id uuid,
  category_id uuid,
  description text,
  notes text,
  document_id uuid,
  import_id uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint invoices_business_id_fkey
    foreign key (business_id)
    references public.businesses (id)
    on delete cascade,
  constraint invoices_user_id_fkey
    foreign key (user_id)
    references auth.users (id)
    on delete cascade,
  constraint invoices_third_party_id_fkey
    foreign key (third_party_id)
    references public.third_parties (id)
    on delete set null,
  constraint invoices_category_id_fkey
    foreign key (category_id)
    references public.categories (id)
    on delete set null,
  constraint invoices_document_id_fkey
    foreign key (document_id)
    references public.documents (id)
    on delete set null,
  constraint invoices_import_id_fkey
    foreign key (import_id)
    references public.imports (id)
    on delete set null,
  constraint invoices_type_check
    check (type in ('issued', 'received')),
  constraint invoices_status_check
    check (status in ('draft', 'pending', 'paid', 'overdue', 'cancelled')),
  constraint invoices_amount_total_check
    check (amount_total > 0),
  constraint invoices_business_invoice_number_unique
    unique nulls not distinct (business_id, type, invoice_number)
);

create index idx_invoices_business_id on public.invoices(business_id);
create index idx_invoices_user_id on public.invoices(user_id);
create index idx_invoices_status on public.invoices(status);
create index idx_invoices_issue_date on public.invoices(issue_date);
create index idx_invoices_due_date on public.invoices(due_date);
create index idx_invoices_third_party_id on public.invoices(third_party_id);
```

### Nota importante
La cláusula `unique nulls not distinct` funciona en versiones modernas de PostgreSQL. Si se quiere máxima compatibilidad, puede sustituirse por una estrategia con índice parcial.

---

## 15. Tabla: transactions

```sql
create table public.transactions (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null,
  user_id uuid not null,
  type text not null,
  source text not null default 'manual',
  status text not null default 'confirmed',
  transaction_date date not null,
  amount numeric(12,2) not null,
  currency text not null default 'EUR',
  description text,
  notes text,
  category_id uuid,
  subcategory_id uuid,
  third_party_id uuid,
  payment_method text,
  reference text,
  is_recurring boolean not null default false,
  invoice_id uuid,
  document_id uuid,
  import_id uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint transactions_business_id_fkey
    foreign key (business_id)
    references public.businesses (id)
    on delete cascade,
  constraint transactions_user_id_fkey
    foreign key (user_id)
    references auth.users (id)
    on delete cascade,
  constraint transactions_category_id_fkey
    foreign key (category_id)
    references public.categories (id)
    on delete set null,
  constraint transactions_subcategory_id_fkey
    foreign key (subcategory_id)
    references public.categories (id)
    on delete set null,
  constraint transactions_third_party_id_fkey
    foreign key (third_party_id)
    references public.third_parties (id)
    on delete set null,
  constraint transactions_invoice_id_fkey
    foreign key (invoice_id)
    references public.invoices (id)
    on delete set null,
  constraint transactions_document_id_fkey
    foreign key (document_id)
    references public.documents (id)
    on delete set null,
  constraint transactions_import_id_fkey
    foreign key (import_id)
    references public.imports (id)
    on delete set null,
  constraint transactions_type_check
    check (type in ('income', 'expense')),
  constraint transactions_source_check
    check (source in ('manual', 'csv_import', 'pdf_parse', 'invoice_sync', 'recurring', 'api')),
  constraint transactions_status_check
    check (status in ('draft', 'pending', 'confirmed', 'cancelled')),
  constraint transactions_payment_method_check
    check (payment_method is null or payment_method in ('bank_transfer', 'cash', 'card', 'stripe', 'paypal', 'bizum', 'direct_debit', 'other')),
  constraint transactions_amount_check
    check (amount > 0),
  constraint transactions_category_required_when_confirmed
    check (
      status in ('draft', 'pending')
      or category_id is not null
    )
);

create index idx_transactions_business_id on public.transactions(business_id);
create index idx_transactions_user_id on public.transactions(user_id);
create index idx_transactions_transaction_date on public.transactions(transaction_date);
create index idx_transactions_type on public.transactions(type);
create index idx_transactions_category_id on public.transactions(category_id);
create index idx_transactions_third_party_id on public.transactions(third_party_id);
create index idx_transactions_invoice_id on public.transactions(invoice_id);
create index idx_transactions_import_id on public.transactions(import_id);
create index idx_transactions_business_date on public.transactions(business_id, transaction_date);
```

---

## 16. Trigger para `updated_at`

```sql
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
```

### Aplicación del trigger

```sql
create trigger trg_profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create trigger trg_businesses_updated_at
before update on public.businesses
for each row execute function public.set_updated_at();

create trigger trg_categories_updated_at
before update on public.categories
for each row execute function public.set_updated_at();

create trigger trg_third_parties_updated_at
before update on public.third_parties
for each row execute function public.set_updated_at();

create trigger trg_documents_updated_at
before update on public.documents
for each row execute function public.set_updated_at();

create trigger trg_parsed_document_data_updated_at
before update on public.parsed_document_data
for each row execute function public.set_updated_at();

create trigger trg_imports_updated_at
before update on public.imports
for each row execute function public.set_updated_at();

create trigger trg_import_rows_updated_at
before update on public.import_rows
for each row execute function public.set_updated_at();

create trigger trg_invoices_updated_at
before update on public.invoices
for each row execute function public.set_updated_at();

create trigger trg_transactions_updated_at
before update on public.transactions
for each row execute function public.set_updated_at();
```

---

## 17. Función auxiliar para obtener negocio principal

En un MVP simple puede ser útil que cada usuario tenga un negocio principal.

```sql
create or replace function public.get_user_business_id()
returns uuid
language sql
stable
as $$
  select id
  from public.businesses
  where user_id = auth.uid()
  order by created_at asc
  limit 1;
$$;
```

---

## 18. RLS recomendada

### Activar RLS

```sql
alter table public.profiles enable row level security;
alter table public.businesses enable row level security;
alter table public.categories enable row level security;
alter table public.third_parties enable row level security;
alter table public.documents enable row level security;
alter table public.parsed_document_data enable row level security;
alter table public.imports enable row level security;
alter table public.import_rows enable row level security;
alter table public.invoices enable row level security;
alter table public.transactions enable row level security;
```

---

## 19. Políticas RLS mínimas para MVP

### Profiles

```sql
create policy "profiles_select_own"
on public.profiles
for select
using (user_id = auth.uid());

create policy "profiles_insert_own"
on public.profiles
for insert
with check (user_id = auth.uid());

create policy "profiles_update_own"
on public.profiles
for update
using (user_id = auth.uid())
with check (user_id = auth.uid());
```

### Businesses

```sql
create policy "businesses_select_own"
on public.businesses
for select
using (user_id = auth.uid());

create policy "businesses_insert_own"
on public.businesses
for insert
with check (user_id = auth.uid());

create policy "businesses_update_own"
on public.businesses
for update
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "businesses_delete_own"
on public.businesses
for delete
using (user_id = auth.uid());
```

### Tablas dependientes de business_id

La política base recomendada es permitir acceso solo si el `business_id` pertenece a un negocio del usuario autenticado.

#### Categories

```sql
create policy "categories_all_own_business"
on public.categories
for all
using (
  exists (
    select 1
    from public.businesses b
    where b.id = categories.business_id
      and b.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.businesses b
    where b.id = categories.business_id
      and b.user_id = auth.uid()
  )
);
```

#### Third parties

```sql
create policy "third_parties_all_own_business"
on public.third_parties
for all
using (
  exists (
    select 1
    from public.businesses b
    where b.id = third_parties.business_id
      and b.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.businesses b
    where b.id = third_parties.business_id
      and b.user_id = auth.uid()
  )
);
```

#### Documents

```sql
create policy "documents_all_own_business"
on public.documents
for all
using (
  exists (
    select 1
    from public.businesses b
    where b.id = documents.business_id
      and b.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.businesses b
    where b.id = documents.business_id
      and b.user_id = auth.uid()
  )
  and user_id = auth.uid()
);
```

#### Parsed document data

```sql
create policy "parsed_document_data_all_own_business"
on public.parsed_document_data
for all
using (
  exists (
    select 1
    from public.businesses b
    where b.id = parsed_document_data.business_id
      and b.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.businesses b
    where b.id = parsed_document_data.business_id
      and b.user_id = auth.uid()
  )
);
```

#### Imports

```sql
create policy "imports_all_own_business"
on public.imports
for all
using (
  exists (
    select 1
    from public.businesses b
    where b.id = imports.business_id
      and b.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.businesses b
    where b.id = imports.business_id
      and b.user_id = auth.uid()
  )
  and user_id = auth.uid()
);
```

#### Import rows

```sql
create policy "import_rows_all_own_business"
on public.import_rows
for all
using (
  exists (
    select 1
    from public.imports i
    join public.businesses b on b.id = i.business_id
    where i.id = import_rows.import_id
      and b.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.imports i
    join public.businesses b on b.id = i.business_id
    where i.id = import_rows.import_id
      and b.user_id = auth.uid()
  )
);
```

#### Invoices

```sql
create policy "invoices_all_own_business"
on public.invoices
for all
using (
  exists (
    select 1
    from public.businesses b
    where b.id = invoices.business_id
      and b.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.businesses b
    where b.id = invoices.business_id
      and b.user_id = auth.uid()
  )
  and user_id = auth.uid()
);
```

#### Transactions

```sql
create policy "transactions_all_own_business"
on public.transactions
for all
using (
  exists (
    select 1
    from public.businesses b
    where b.id = transactions.business_id
      and b.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.businesses b
    where b.id = transactions.business_id
      and b.user_id = auth.uid()
  )
  and user_id = auth.uid()
);
```

---

## 20. Seed mínimo recomendado

```sql
insert into public.profiles (user_id, full_name, default_currency, timezone)
values (
  auth.uid(),
  'Usuario Demo',
  'EUR',
  'Europe/Madrid'
);
```

```sql
insert into public.businesses (user_id, name, default_currency, country)
values (
  auth.uid(),
  'Mi Negocio',
  'EUR',
  'ES'
);
```

### Categorías iniciales sugeridas

```sql
insert into public.categories (business_id, name, slug, type)
values
  (public.get_user_business_id(), 'Ventas', 'ventas', 'income'),
  (public.get_user_business_id(), 'Servicios', 'servicios', 'income'),
  (public.get_user_business_id(), 'Software', 'software', 'expense'),
  (public.get_user_business_id(), 'Publicidad', 'publicidad', 'expense'),
  (public.get_user_business_id(), 'Proveedores', 'proveedores', 'expense');
```

---

## 21. Consultas ejemplo útiles para Codex

### Dashboard resumen por rango

```sql
select
  coalesce(sum(case when type = 'income' and status = 'confirmed' then amount end), 0) as total_income,
  coalesce(sum(case when type = 'expense' and status = 'confirmed' then amount end), 0) as total_expense,
  coalesce(sum(case when type = 'income' and status = 'confirmed' then amount end), 0)
  - coalesce(sum(case when type = 'expense' and status = 'confirmed' then amount end), 0) as net_profit
from public.transactions
where business_id = public.get_user_business_id()
  and transaction_date between date '2026-01-01' and date '2026-01-31';
```

### Facturas pendientes o vencidas

```sql
select *
from public.invoices
where business_id = public.get_user_business_id()
  and status in ('pending', 'overdue')
order by due_date asc nulls last;
```

### Gastos por categoría

```sql
select
  c.name as category,
  sum(t.amount) as total
from public.transactions t
join public.categories c on c.id = t.category_id
where t.business_id = public.get_user_business_id()
  and t.type = 'expense'
  and t.status = 'confirmed'
group by c.name
order by total desc;
```

---

## 22. Riesgos y ajustes futuros previstos

### Posibles cambios posteriores
- añadir `financial_accounts`
- añadir tabla intermedia para pagos fraccionados de facturas
- añadir `recurring_rules`
- separar `addresses` o datos fiscales si crece la complejidad
- introducir multi-moneda real con tipos de cambio
- añadir `audit_logs`

### Riesgos actuales del MVP
- `subcategory_id` apunta también a `categories`, sin constraint fuerte de jerarquía
- `invoice_number` puede requerir una estrategia más flexible si hay importaciones históricas desordenadas
- algunas validaciones cruzadas entre `type` de transacción y `type` de categoría conviene resolverlas con lógica adicional o triggers

---

## 23. Recomendaciones para Codex

Cuando Codex use este schema debe:

- convertirlo en migraciones ordenadas por bloques;
- no asumir que todo debe resolverse con triggers si puede hacerse bien en aplicación;
- mantener RLS activa desde el inicio;
- crear helpers de acceso a datos reutilizables;
- separar claramente inserciones manuales, parseos de PDF e importaciones CSV;
- contemplar formularios reutilizables para `transactions` e `invoices`.

---

## 24. Próximo documento recomendado

A partir de este punto, el siguiente archivo ideal sería uno de estos dos:

- `05-rls-and-security.md` si quieres reforzar la parte Supabase segura
- `05-api-spec.md` si quieres pasar ya a endpoints, acciones y contratos frontend/backend

---

## 25. Estado del documento

**Versión:** 1.0  
**Estado:** Borrador operativo y ejecutable como base de migraciones  
**Basado en:** `03-data-model.md`  
**Siguiente paso recomendado:** `05-api-spec.md` o `05-rls-and-security.md`

