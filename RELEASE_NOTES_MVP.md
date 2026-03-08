# RELEASE NOTES MVP

## 1. Título de release

- Nombre: Finance Control MVP - Internal Release
- Versión sugerida: v0.1.0
- Fecha: 2026-03-08

## 2. Resumen de la release

Esta versión representa una entrega interna funcional del MVP de control financiero.

El producto ya permite operar el flujo financiero base para un negocio por usuario:
- autenticación y acceso privado,
- registro manual de transacciones y facturas,
- visualización de KPIs financieros en dashboard,
- flujo de documentos PDF con revisión humana,
- flujo de importación CSV con validación previa.

Nivel de madurez actual: MVP operativo y estable para flujos principales, con límites esperables de producto en fase inicial.

## 3. Funcionalidades incluidas

### Autenticación
- Registro, login y logout con Supabase Auth.
- Protección de rutas privadas.
- Redirecciones de sesión en flujo privado.

### Negocio y perfil
- Perfil editable (datos base, moneda, timezone).
- Negocio actual editable.
- Bootstrap automático de perfil/negocio si no existen.

### Categorías
- Listado, creación y edición.
- Validaciones de nombre/slug/tipo.

### Terceros
- Listado, creación y edición de terceros (clientes/proveedores/ambos).
- Validaciones básicas (tipo, email, etc.).

### Transacciones manuales
- Listado, creación y edición.
- Validación de compatibilidad categoría/tipo.
- Aislamiento por negocio.

### Facturas
- Listado, creación y edición.
- Estados básicos de factura.
- Validación cruzada de fechas (`dueDate` no anterior a `issueDate`).

### Dashboard
- KPIs: ingresos, gastos, neto, pendientes (count + amount).
- Bloques: latest transactions, expense by category, series.
- Cálculo en backend con reglas cerradas de MVP.
- Moneda de visualización alineada al negocio (sin hardcode USD).
- Empty states explícitos.

### PDF flow
- Subida de PDF.
- Parseo heurístico.
- Sugerencias editables.
- Confirmación humana obligatoria antes de crear registro final.
- Aplicación a transacción o factura con trazabilidad.

### CSV import flow
- Descarga de plantilla.
- Subida CSV.
- Detección de headers.
- Mapping.
- Validación por fila (errores y warnings).
- Preview.
- Ejecución de import.

### Reportes
- Resumen mensual básico (ingresos, gastos, neto) sobre transacciones confirmadas.

### Hardening / estabilidad
- Refuerzo de validaciones de ownership y negocio.
- Corrección de consultas ambiguas en relaciones.
- Endurecimiento de consistencia en estado de imports y parseo/apply de documentos.
- Normalización de errores backend en acciones y API handlers.

## 4. Validaciones realizadas

- Build: `npm run build` OK.
- Tests: `npm test` OK (18 tests en verde).
- Smoke tests: ejecutados sobre rutas y flujos críticos.
- Login real: validado con usuario confirmado.
- Navegación privada: validada.
- Formularios privados: validados (settings, categorías, terceros, transacciones, facturas).
- Dashboard: validado en runtime.
- PDF: validado (upload/parse/apply).
- CSV: validado (upload/mapping/validate/execute).

## 5. Cambios importantes de hardening

### Ownership / seguridad
- Endpoints API de transacciones/facturas alineados con servicios que validan pertenencia al negocio y reglas de dominio.
- RLS y aislamiento por `business_id` mantenidos en operaciones críticas.

### Validaciones
- Validación cruzada de invoice para bloquear `dueDate < issueDate`.
- Mensajes de validación más específicos en servicios principales.

### Dashboard metrics
- Corrección de consulta para evitar ambigüedad de FK en `transactions -> categories`.
- Reglas de cálculo consistentes con documentación de métricas MVP.

### Consistencia de imports
- Ajuste de lógica de estado en re-ejecución para evitar degradaciones incorrectas (`imported` -> `partially_imported`).

### Parseo PDF
- Parse con fallback de estado (`failed`) en errores internos.
- Apply con mejor comportamiento en escenarios parciales de actualización de estado de revisión.

### Mensajes de error
- Normalizador común para errores internos en server actions.
- Normalizador aplicado también en handlers `app/api/v1/*` para uniformidad de respuesta.

## 6. Fuera de alcance de esta release

- OCR avanzado / extracción compleja por visión.
- Integraciones bancarias.
- Multiempresa real en UI/operación.
- Multi-moneda real con conversión.
- Background jobs complejos / infraestructura de workers avanzada.
- App móvil nativa.
- Automatizaciones avanzadas de IA fuera del flujo actual.

## 7. Limitaciones conocidas

- Parser CSV es funcional pero básico (no cubre todos los edge cases de CSV complejo).
- Parseo PDF es heurístico y no orientado a OCR avanzado.
- No existe aún una suite E2E formal completa versionada para regresión integral.
- Existe deuda técnica ligera por coexistencia de server actions y API handlers (controlada para MVP).
- Algunos aspectos de copy/UX siguen en nivel base.

## 8. Recomendaciones para siguiente release

Prioridades post-MVP sugeridas:
1. Consolidar calidad: E2E formal para flujos críticos (auth, dashboard, transacciones, facturas, PDF, CSV).
2. Mejorar robustez backend: tests de integración de handlers `app/api/v1/*` y servicios críticos.
3. Mejoras operativas: runbook de incidencias y script de seed/cleanup QA.
4. Quick wins UX: unificación final de copy, refinamiento de estados vacíos/errores y consistencia visual menor.

Qué no acelerar sin necesidad:
- Cambios arquitectónicos amplios.
- Scope fuera de MVP (OCR, banca, multiempresa real, multi-moneda real).

## 9. Estado del proyecto

**MVP internal stable**

siguiente fase: **documentación de cierre + planificación post-MVP**
