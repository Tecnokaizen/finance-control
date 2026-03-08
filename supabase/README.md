# Supabase Migrations

This folder contains baseline SQL for the MVP schema and RLS policies, aligned with `docs/04_db_schema_sql.md`.

## Files

- `migrations/20260308133000_init_schema.sql`
- `migrations/20260308133500_rls_policies.sql`

## Notes

- Ownership boundary: `business_id` + authenticated `auth.uid()`.
- RLS policies are mandatory for all business-bound tables.
- Apply these in a fresh database or adapt policy names if rerunning in an existing DB.
