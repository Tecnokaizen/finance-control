# PROJECT STATUS

Fecha de actualización: 8 de marzo de 2026

## 1. Resumen ejecutivo

- Estado general: MVP funcional en entorno local con Supabase configurado.
- Partes funcionales del MVP: auth, perfil/negocio, categorías, terceros, transacciones, facturas, dashboard, flujo PDF, flujo CSV, reportes básicos.
- Nivel de estabilidad actual: alto para flujos principales ya validados; medio para escenarios edge no cubiertos por E2E formal completo.
- Frontend: estable para rutas privadas y formularios principales, con estados vacíos reforzados en dashboard.
- Backend: servicios y repositorios operativos con ownership por `business_id`; handlers API normalizados en errores.
- Auth: login/register/logout y protección de rutas privadas validados en ejecución real.
- Dashboard: métricas calculadas en backend y consistentes con reglas (`confirmed` + pendientes globales).
- PDF: upload + parse heurístico + revisión humana + apply validados.
- CSV: template + upload + mapping + validación + execute validados.

## 2. Qué está completado

### Auth
- Registro, login, logout.
- Rutas privadas protegidas.
- Redirecciones de sesión funcionales.

### Perfil / Negocio
- Lectura y actualización de perfil.
- Lectura y actualización de negocio actual.
- Bootstrap automático de profile/business para usuario nuevo.

### Categorías
- Listado, creación y edición.
- Validación de `slug` y tipo.

### Terceros
- Listado, creación y edición.
- Validación de email/tipo.

### Transacciones
- Listado, creación y edición.
- Validación de categoría compatible con tipo.
- Ownership validado por negocio.

### Facturas
- Listado, creación y edición.
- Validación de campos y relaciones.
- Validación cruzada `dueDate >= issueDate`.

### Dashboard
- KPIs principales implementados:
  - `totalIncome`, `totalExpense`, `netProfit`
  - `pendingInvoicesCount`, `pendingInvoicesAmount`
  - `latestTransactions`, `expenseByCategory`, `incomeVsExpenseSeries`
- Moneda sin hardcode USD (usa moneda de negocio/registro).
- Empty states explícitos y útiles.

### PDF flow
- Subida de PDF.
- Parseo heurístico.
- Revisión humana y aplicación a transacción/factura.
- Trazabilidad por `documentId`.
- Manejo más seguro de estados de parse (`failed` en error).

### CSV import flow
- Descarga de template.
- Upload CSV.
- Detección headers.
- Mapping.
- Validación por fila.
- Preview.
- Execute import.
- Estado de import endurecido (evita degradación por re-ejecución).

### Reportes
- Resumen mensual básico (`income`, `expense`, `netProfit`) con `status=confirmed`.

### Testing
- Suite Vitest de validaciones y utilidades (`npm test`) en verde.
- Builds (`npm run build`) en verde en las rondas de hardening.
- Smokes Playwright manuales/automatizados en flujos clave.

### Hardening
- Crítico: ownership/API, consultas ambiguas de FK, consistencia de import/PDF.
- Medio: validación invoice cruzada, moneda dashboard, empty states, mensajes backend.
- Cosmético mínimo: etiquetas de estados humanizadas, microajustes de formularios largos.

## 3. Qué está validado

- Build producción: validado varias veces, estado OK.
- Tests unitarios/validación: estado OK (`18` tests).
- Smoke tests de rutas privadas: estado OK.
- Login real con usuario confirmado en Supabase: validado.
- Rutas privadas (`/dashboard`, `/transactions`, `/invoices`, `/categories`, `/third-parties`, `/documents`, `/imports`, `/reports`, `/settings`): validadas.
- Formularios privados (settings, categorías, terceros, transacciones, facturas): validados.
- Dashboard runtime: validado sin errores 500 tras hardening.
- PDF runtime (upload/parse/apply): validado.
- CSV runtime (upload/mapping/execute): validado.
- API runtime básico (`/api/v1/dashboard` y resto de rutas tocadas): estable en smoke.

Nota de honestidad:
- No existe todavía una suite E2E formal persistida en repo para cobertura integral de regresión.
- La validación hecha es real y repetida, pero principalmente por smoke manual/script puntual en este entorno.

## 4. Qué queda pendiente

### Pendiente menor
- Configurar `allowedDevOrigins` en Next para eliminar warning de desarrollo por origen cruzado.
- Ejecutar y dejar reportado `npm run lint` como parte del cierre operativo.

### Mejoras post-MVP
- E2E formal estable para regresiones (auth + dashboard + PDF + CSV + API).
- Cobertura de integración para handlers `app/api/v1/*`.
- Mayor robustez del parser CSV (quotes/escenarios complejos).

### Deuda técnica ligera
- Coexistencia de Server Actions y API handlers con lógica similar (aceptable en MVP, requiere disciplina de consistencia).
- Algunos contratos de respuesta API son minimalistas (correctos para MVP, mejorables).

### Mejoras UX/cosméticas
- Revisión global de copy para uniformidad de idioma/tono.
- Ajustes finos de microcopy de errores para casos edge.

### Mejoras operativas
- Script oficial de seed/cleanup QA para evitar acumulación de datos de pruebas.
- Runbook corto de incidencias comunes de Supabase (auth, RLS, migraciones).

## 5. Riesgos o puntos a vigilar

- Consultas con relaciones múltiples en PostgREST:
  - `transactions -> categories` tiene más de una FK (`category_id`, `subcategory_id`).
  - Deben usarse relaciones explícitas en `select(...)` para evitar ambigüedad.
- Ownership/seguridad:
  - Mantener validaciones de negocio en servicios (no saltarlas en handlers).
  - No confiar en IDs de cliente sin verificar pertenencia de negocio.
- Dependencias Supabase/env/RLS:
  - Sin `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY` no hay auth local funcional.
  - Sin migraciones y policies aplicadas, el runtime falla en rutas privadas.
- Flujos sensibles:
  - PDF y CSV escriben datos financieros; evitar cambios sin pruebas de regresión.
  - Re-ejecución de import debe mantenerse idempotente a nivel de estado.

## 6. Cómo arrancar el proyecto

### Pasos mínimos local
1. `cd web`
2. `npm install`
3. Crear `web/.env.local` desde `web/.env.example`
4. Asegurar en Supabase:
   - Auth habilitado para email/password.
   - Usuario de prueba confirmado o confirmación desactivada en entorno de pruebas.
   - Migraciones aplicadas.
5. Ejecutar: `npm run dev`

### Env necesario (mínimo para desbloquear auth/app)
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Env útil recomendado
- `NEXT_PUBLIC_DEFAULT_CURRENCY` (por defecto `EUR`)
- `NEXT_PUBLIC_DEFAULT_TIMEZONE` (por defecto `Europe/Madrid`)

### Comandos de calidad
- Tests: `npm test`
- Build: `npm run build`

### Notas de Supabase
- Migraciones clave:
  - `supabase/migrations/20260308133000_init_schema.sql`
  - `supabase/migrations/20260308133500_rls_policies.sql`
- RLS debe estar activo en tablas principales.

### Si falla auth o faltan tablas
- Verificar env público en `web/.env.local`.
- Verificar usuario confirmado en Supabase Auth.
- Reaplicar migraciones y confirmar existencia de tablas/policies.
- Revisar errores de runtime en consola del servidor Next.

## 7. Estructura y documentos importantes

### Guía de trabajo
- `/AGENTS.md`

### Docs principales del kit
- `/docs/05_api_spec.md`
- `/docs/06_validation_schemas.md`
- `/docs/07_acceptance_criteria.md`
- `/docs/08_frontend_architecture.md`
- `/docs/09_backend_architecture.md`
- `/docs/10_testing_strategy.md`
- `/docs/11_dashboard_metrics.md`
- `/docs/12_task_board.md`
- `/docs/14_env_and_integrations.md`
- `/docs/15_open_questions.md`
- `/docs/16_master_prompt.md`

### Carpetas/archivos clave del repo
- `/web` (app Next.js)
- `/web/app` (rutas públicas/privadas y API handlers)
- `/web/features` (UI y acciones por dominio)
- `/web/server` (servicios, repositorios, auth, errores)
- `/web/lib/validation` (Zod schemas + tests)
- `/supabase/migrations` (schema + RLS)

## 8. Próximos pasos recomendados

Orden sugerido (sin abrir scope):
1. Consolidar regresión: añadir E2E estables para flujos críticos.
2. Completar cobertura de integración de API handlers.
3. Añadir runbook operativo (incidencias comunes Supabase/env/RLS).
4. Ajustes UX menores pendientes (copy/consistencia fina) en lote.

Qué no tocar aún si no hace falta:
- Arquitectura base por dominios (está funcionando).
- Reglas de cálculo del dashboard ya cerradas.
- Flujos PDF/CSV más allá de fixes puntuales sin test de regresión.

## 9. Estado del proyecto

**MVP internal stable**

siguiente fase: **documentación de cierre + planificación post-MVP**
