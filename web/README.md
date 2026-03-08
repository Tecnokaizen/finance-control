# Finance Control Web

MVP financiero con Next.js + Supabase para freelancers y small businesses.

## Módulos implementados

- Auth (login/register/logout, private routes)
- Profile + current business
- Categories
- Third parties
- Transactions
- Invoices
- Dashboard con métricas reales (confirmed transactions + pending/overdue invoices)
- PDF documents flow (upload, parse suggestions, human review, apply)
- CSV imports flow (template, upload, mapping, validation preview, execute)
- Basic reports (monthly summary)

## Rutas privadas

- `/dashboard`
- `/transactions`
- `/invoices`
- `/categories`
- `/third-parties`
- `/documents`
- `/imports`
- `/reports`
- `/settings`

## API base

- `/api/v1/profile`
- `/api/v1/businesses/current`
- `/api/v1/dashboard`
- `/api/v1/categories`
- `/api/v1/third-parties`
- `/api/v1/transactions`
- `/api/v1/invoices`
- `/api/v1/documents`
- `/api/v1/imports`

## Ejecutar

```bash
npm install
npm run dev
```

## Calidad

```bash
npm run lint
npm run test
npm run build
```

## Variables de entorno

Usa `.env.example` como base (mínimo requerido para auth/app):

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
