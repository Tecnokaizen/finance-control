create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users (id) on delete cascade,
  full_name text,
  avatar_url text,
  locale text default 'es',
  default_currency text not null default 'EUR',
  timezone text not null default 'Europe/Madrid',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.businesses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  legal_name text,
  tax_id text,
  default_currency text not null default 'EUR',
  country text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_businesses_user_id on public.businesses(user_id);

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses (id) on delete cascade,
  name text not null,
  slug text not null,
  type text not null check (type in ('income', 'expense')),
  parent_id uuid references public.categories (id) on delete set null,
  color text,
  icon text,
  is_active boolean not null default true,
  sort_order integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (business_id, slug)
);
create index if not exists idx_categories_business_id on public.categories(business_id);
create index if not exists idx_categories_type on public.categories(type);

create table if not exists public.third_parties (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses (id) on delete cascade,
  type text not null check (type in ('client', 'supplier', 'both')),
  name text not null,
  legal_name text,
  email text,
  phone text,
  tax_id text,
  address text,
  notes text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_third_parties_business_id on public.third_parties(business_id);
create index if not exists idx_third_parties_type on public.third_parties(type);

create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  file_name text not null,
  original_file_name text not null,
  mime_type text not null,
  file_size bigint not null,
  storage_path text not null,
  file_hash text,
  document_type text not null default 'generic_pdf' check (document_type in ('invoice_pdf','receipt_pdf','statement_pdf','generic_pdf')),
  preview_image_path text,
  upload_status text not null default 'uploaded' check (upload_status in ('uploaded','failed','deleted')),
  parse_status text not null default 'pending' check (parse_status in ('pending','processing','parsed','partial','failed','skipped')),
  uploaded_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_documents_business_id on public.documents(business_id);
create index if not exists idx_documents_parse_status on public.documents(parse_status);
create index if not exists idx_documents_user_id on public.documents(user_id);

create table if not exists public.parsed_document_data (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null unique references public.documents (id) on delete cascade,
  business_id uuid not null references public.businesses (id) on delete cascade,
  parser_version text,
  raw_text text,
  extracted_json jsonb not null default '{}'::jsonb,
  suggested_type text check (suggested_type is null or suggested_type in ('income','expense','issued_invoice','received_invoice')),
  suggested_date date,
  suggested_amount numeric(12,2),
  suggested_currency text,
  suggested_third_party_name text,
  suggested_invoice_number text,
  confidence_score numeric(5,2),
  review_status text not null default 'pending_review' check (review_status in ('pending_review','reviewed','rejected','applied')),
  reviewed_by uuid references auth.users (id) on delete set null,
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_parsed_document_data_business_id on public.parsed_document_data(business_id);
create index if not exists idx_parsed_document_data_document_id on public.parsed_document_data(document_id);

create table if not exists public.imports (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  import_type text not null check (import_type in ('transactions_csv','invoices_csv','categories_csv','third_parties_csv')),
  source_file_name text not null,
  source_file_path text,
  template_version text,
  total_rows integer not null default 0,
  valid_rows integer not null default 0,
  invalid_rows integer not null default 0,
  status text not null default 'uploaded' check (status in ('uploaded','mapping_pending','validating','validated','partially_imported','imported','failed','cancelled')),
  mapping_json jsonb,
  summary_json jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_imports_business_id on public.imports(business_id);
create index if not exists idx_imports_user_id on public.imports(user_id);

create table if not exists public.import_rows (
  id uuid primary key default gen_random_uuid(),
  import_id uuid not null references public.imports (id) on delete cascade,
  row_number integer not null,
  raw_data_json jsonb not null,
  normalized_data_json jsonb,
  validation_status text not null default 'pending' check (validation_status in ('pending','valid','warning','invalid','imported','skipped')),
  error_messages_json jsonb,
  created_record_type text check (created_record_type is null or created_record_type in ('transaction','invoice','category','third_party')),
  created_record_id uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (import_id, row_number)
);
create index if not exists idx_import_rows_import_id on public.import_rows(import_id);

create table if not exists public.invoices (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  type text not null check (type in ('issued','received')),
  status text not null default 'draft' check (status in ('draft','pending','paid','overdue','cancelled')),
  invoice_number text,
  issue_date date not null,
  due_date date,
  paid_date date,
  amount_total numeric(12,2) not null,
  currency text not null default 'EUR',
  third_party_id uuid references public.third_parties (id) on delete set null,
  category_id uuid references public.categories (id) on delete set null,
  notes text,
  document_id uuid references public.documents (id) on delete set null,
  import_id uuid references public.imports (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique nulls not distinct (business_id, type, invoice_number)
);
create index if not exists idx_invoices_business_id on public.invoices(business_id);
create index if not exists idx_invoices_status on public.invoices(status);
create index if not exists idx_invoices_issue_date on public.invoices(issue_date);

create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  type text not null check (type in ('income','expense')),
  source text not null default 'manual' check (source in ('manual','csv_import','pdf_parse','invoice_sync','recurring','api')),
  status text not null default 'draft' check (status in ('draft','pending','confirmed','cancelled')),
  transaction_date date not null,
  amount numeric(12,2) not null check (amount > 0),
  currency text not null default 'EUR',
  description text,
  notes text,
  category_id uuid not null references public.categories (id) on delete restrict,
  subcategory_id uuid references public.categories (id) on delete set null,
  third_party_id uuid references public.third_parties (id) on delete set null,
  payment_method text,
  reference text,
  is_recurring boolean not null default false,
  invoice_id uuid references public.invoices (id) on delete set null,
  document_id uuid references public.documents (id) on delete set null,
  import_id uuid references public.imports (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_transactions_business_id on public.transactions(business_id);
create index if not exists idx_transactions_status on public.transactions(status);
create index if not exists idx_transactions_type on public.transactions(type);
create index if not exists idx_transactions_business_date on public.transactions(business_id, transaction_date);

create or replace function public.get_user_business_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select b.id
  from public.businesses b
  where b.user_id = auth.uid()
  order by b.created_at asc
  limit 1;
$$;

create trigger set_profiles_updated_at before update on public.profiles for each row execute function public.set_updated_at();
create trigger set_businesses_updated_at before update on public.businesses for each row execute function public.set_updated_at();
create trigger set_categories_updated_at before update on public.categories for each row execute function public.set_updated_at();
create trigger set_third_parties_updated_at before update on public.third_parties for each row execute function public.set_updated_at();
create trigger set_documents_updated_at before update on public.documents for each row execute function public.set_updated_at();
create trigger set_parsed_document_data_updated_at before update on public.parsed_document_data for each row execute function public.set_updated_at();
create trigger set_imports_updated_at before update on public.imports for each row execute function public.set_updated_at();
create trigger set_import_rows_updated_at before update on public.import_rows for each row execute function public.set_updated_at();
create trigger set_invoices_updated_at before update on public.invoices for each row execute function public.set_updated_at();
create trigger set_transactions_updated_at before update on public.transactions for each row execute function public.set_updated_at();
