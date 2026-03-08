Pega esto tal cual en el `README.md`:

````md
# finance-control

App web de control financiero para freelancers, autónomos, agencias y pequeñas empresas.

El objetivo del proyecto es ofrecer un MVP claro, mantenible y escalable para:
- registrar ingresos y gastos,
- gestionar facturas,
- visualizar métricas financieras en un dashboard,
- subir PDFs con vista previa y parseo asistido,
- importar movimientos desde CSV con validación y mapeo.

## Estado actual

**Estado:** MVP Internal Stable

Actualmente el proyecto tiene:
- autenticación funcional,
- rutas privadas operativas,
- dashboard funcional,
- gestión de categorías y terceros,
- transacciones manuales,
- facturas,
- flujo de importación CSV,
- flujo de PDF con preview y apply,
- hardening base,
- documentación técnica del proyecto.

## Estructura del repositorio

```text
finance-control/
├─ AGENTS.md
├─ PROJECT_STATUS.md
├─ RELEASE_NOTES_MVP.md
├─ docs/
├─ supabase/
└─ web/
````

### Carpetas principales

* `web/` → aplicación principal
* `supabase/` → migraciones y recursos relacionados con la base de datos
* `docs/` → kit documental completo del proyecto
* `AGENTS.md` → instrucciones operativas para trabajar con Codex
* `PROJECT_STATUS.md` → estado actual del proyecto
* `RELEASE_NOTES_MVP.md` → resumen de release del MVP

## Stack principal

* Next.js
* TypeScript
* Tailwind CSS
* shadcn/ui
* React Hook Form
* Zod
* Supabase Auth
* Supabase PostgreSQL
* Supabase Storage

## Cómo arrancar el proyecto

### 1. Entrar en la app

```bash
cd web
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Crear variables de entorno

Crea `web/.env.local` a partir de `.env.example` y completa al menos:

```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_DEFAULT_CURRENCY=EUR
NEXT_PUBLIC_DEFAULT_TIMEZONE=Europe/Madrid
```

## Base de datos

Este proyecto usa Supabase.

Para que la app funcione correctamente, deben estar aplicadas las migraciones de `supabase/migrations/`.

Migraciones principales:

* `20260308133000_init_schema.sql`
* `20260308133500_rls_policies.sql`

## Ejecutar en desarrollo

Desde `web/`:

```bash
npm run dev
```

## Build de producción

```bash
npm run build
```

## Testing

```bash
npm test
```

## Documentación clave

Si trabajas sobre este proyecto, empieza por aquí:

* `AGENTS.md`
* `PROJECT_STATUS.md`
* `RELEASE_NOTES_MVP.md`

Y dentro de `docs/`, especialmente:

* `05_api_spec.md`
* `06_validation_schemas.md`
* `07_acceptance_criteria.md`
* `08_frontend_architecture.md`
* `09_backend_architecture.md`
* `10_testing_strategy.md`
* `11_dashboard_metrics.md`
* `12_task_board.md`
* `15_open_questions.md`
* `16_master_prompt.md`

## Forma de trabajo recomendada con Codex

* Usa `AGENTS.md` como guía operativa.
* Usa `docs/` como fuente de verdad del proyecto.
* Trabaja por fases, sin abrir scope innecesario.
* Mantén `main` como referencia estable.

## Próximos pasos

Las siguientes fases recomendadas son:

* mejora de UX y copy,
* ampliación de testing E2E,
* automatización de seeds/cleanup QA,
* nuevas funcionalidades post-MVP.

## Notas

* No subas secretos ni `.env.local`.
* No expongas claves privadas de Supabase.
* Mantén las migraciones versionadas en `supabase/migrations/`.

---

Proyecto mantenido por **Tecnokaizen**.

```
