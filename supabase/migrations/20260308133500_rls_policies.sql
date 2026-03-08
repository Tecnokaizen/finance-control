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

-- profiles
create policy "profiles_select_own" on public.profiles for select using (user_id = auth.uid());
create policy "profiles_insert_own" on public.profiles for insert with check (user_id = auth.uid());
create policy "profiles_update_own" on public.profiles for update using (user_id = auth.uid()) with check (user_id = auth.uid());

-- businesses
create policy "businesses_select_own" on public.businesses for select using (user_id = auth.uid());
create policy "businesses_insert_own" on public.businesses for insert with check (user_id = auth.uid());
create policy "businesses_update_own" on public.businesses for update using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "businesses_delete_own" on public.businesses for delete using (user_id = auth.uid());

-- helper expression
-- for tables with business_id direct ownership
create policy "categories_all_own_business" on public.categories
for all
using (
  exists (
    select 1 from public.businesses b
    where b.id = categories.business_id
      and b.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1 from public.businesses b
    where b.id = categories.business_id
      and b.user_id = auth.uid()
  )
);

create policy "third_parties_all_own_business" on public.third_parties
for all
using (
  exists (
    select 1 from public.businesses b
    where b.id = third_parties.business_id
      and b.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1 from public.businesses b
    where b.id = third_parties.business_id
      and b.user_id = auth.uid()
  )
);

create policy "documents_all_own_business" on public.documents
for all
using (
  exists (
    select 1 from public.businesses b
    where b.id = documents.business_id
      and b.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1 from public.businesses b
    where b.id = documents.business_id
      and b.user_id = auth.uid()
  )
);

create policy "parsed_document_data_all_own_business" on public.parsed_document_data
for all
using (
  exists (
    select 1 from public.businesses b
    where b.id = parsed_document_data.business_id
      and b.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1 from public.businesses b
    where b.id = parsed_document_data.business_id
      and b.user_id = auth.uid()
  )
);

create policy "imports_all_own_business" on public.imports
for all
using (
  exists (
    select 1 from public.businesses b
    where b.id = imports.business_id
      and b.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1 from public.businesses b
    where b.id = imports.business_id
      and b.user_id = auth.uid()
  )
);

create policy "import_rows_all_own_business" on public.import_rows
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

create policy "invoices_all_own_business" on public.invoices
for all
using (
  exists (
    select 1 from public.businesses b
    where b.id = invoices.business_id
      and b.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1 from public.businesses b
    where b.id = invoices.business_id
      and b.user_id = auth.uid()
  )
);

create policy "transactions_all_own_business" on public.transactions
for all
using (
  exists (
    select 1 from public.businesses b
    where b.id = transactions.business_id
      and b.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1 from public.businesses b
    where b.id = transactions.business_id
      and b.user_id = auth.uid()
  )
);
