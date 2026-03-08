# 10 · Testing Strategy

## 1. Propósito del documento

Este documento define la estrategia de testing del MVP para la app de control financiero. Su objetivo es establecer cómo verificar que la aplicación funciona correctamente a nivel de validación, lógica de negocio, seguridad, UI, flujos asistidos por archivos y consistencia general del producto.

Debe servir como referencia para:

- pruebas manuales,
- tests automatizados,
- cobertura prioritaria del MVP,
- verificación de regresiones,
- definición de qué probar primero,
- ayudar a Codex a construir con calidad desde el inicio.

---

## 2. Objetivos de testing

La estrategia debe asegurar que:

- los datos se validan correctamente,
- los flujos críticos funcionan de extremo a extremo,
- el aislamiento por usuario y negocio se mantiene,
- el dashboard y los reportes muestran métricas correctas,
- los flujos de PDF y CSV no contaminan la base de datos,
- los errores se muestran de forma útil,
- las funcionalidades principales no se rompen al iterar.

---

## 3. Principios de testing

1. Probar primero lo más crítico para negocio.
2. Priorizar flujos reales sobre cobertura artificial.
3. Separar pruebas unitarias, integración y end-to-end.
4. No confiar solo en pruebas manuales.
5. Cubrir especialmente los puntos donde hay transformación de datos.
6. Verificar tanto casos felices como fallos previsibles.
7. Mantener tests fáciles de entender y mantener.

---

## 4. Pirámide de testing recomendada

### 4.1 Unit tests
Para:
- schemas de validación,
- helpers,
- mappers,
- normalizadores,
- lógica aislada.

### 4.2 Integration tests
Para:
- servicios,
- repositorios,
- handlers,
- flujos de parseo e importación,
- checks de permisos.

### 4.3 End-to-end tests
Para:
- login,
- dashboard,
- creación de transacciones,
- facturas,
- subida y aplicación de PDF,
- importación CSV,
- navegación principal.

### Recomendación de equilibrio
Para el MVP conviene:
- mucha cobertura en unit e integración,
- E2E focalizados solo en los flujos clave.

---

## 5. Stack de testing recomendado

### Recomendación principal
- **Vitest** para unit e integración ligera
- **Testing Library** para componentes React
- **Playwright** para end-to-end
- **MSW** opcional para mock de requests si se necesita

### Beneficio
- encaja bien con Next.js y TypeScript,
- rápido para iterar con Codex,
- buen equilibrio entre fiabilidad y velocidad.

---

## 6. Niveles de prueba por capa

### Frontend
Probar:
- render básico de pantallas,
- formularios,
- estados loading / empty / error,
- interacción de filtros,
- tablas y acciones,
- feedback visual básico.

### Backend
Probar:
- validación,
- servicios,
- reglas de negocio,
- permisos,
- queries principales,
- parseo PDF,
- validación/importación CSV.

### Full flow
Probar:
- autenticación,
- dashboard inicial,
- alta de gasto/ingreso,
- factura,
- PDF flow,
- CSV flow,
- reportes básicos.

---

## 7. Prioridades de testing del MVP

### Prioridad crítica
- autenticación y aislamiento,
- creación/edición/eliminación de transacciones,
- creación/seguimiento de facturas,
- dashboard metrics,
- parseo PDF con revisión,
- importación CSV con validación,
- seguridad por negocio.

### Prioridad media
- categorías,
- terceros,
- reportes,
- estados vacíos,
- mensajes de error.

### Prioridad menor en fase inicial
- refinamientos visuales,
- accesibilidad avanzada,
- optimizaciones finas de performance,
- escenarios edge poco probables.

---

## 8. Matriz de cobertura mínima por módulo

### Auth
Debe cubrir:
- registro correcto,
- login correcto,
- credenciales inválidas,
- protección de rutas privadas,
- logout.

### Dashboard
Debe cubrir:
- carga sin datos,
- carga con datos,
- KPIs correctos,
- cambio de rango temporal,
- coherencia con transacciones y facturas.

### Transactions
Debe cubrir:
- create,
- update,
- delete,
- list con filtros,
- categoría incompatible,
- registros fuera del negocio.

### Invoices
Debe cubrir:
- create,
- update,
- listado,
- estados pendientes/vencidas,
- cambio de estado,
- documento vinculado.

### Documents / PDF
Debe cubrir:
- subida válida,
- tipo de archivo inválido,
- preview,
- parse correcto,
- parse parcial,
- parse fallido,
- aplicación a registro final,
- edición posterior del registro generado.

### Imports / CSV
Debe cubrir:
- subida válida,
- headers detectados,
- mapping,
- validación por fila,
- errores por fila,
- importación `valid_only`,
- bloqueo en `all_or_nothing`.

### Reports
Debe cubrir:
- resumen mensual,
- resumen anual si aplica,
- coherencia con filtros y transacciones.

---

## 9. Unit tests recomendados

### 9.1 Validation schemas
Probar:
- UUID válido / inválido,
- currency válida,
- amount positivo,
- fechas inválidas,
- dueDate anterior a issueDate,
- transacción confirmada sin categoría,
- CSV mapping incompleto,
- apply parsed document con target inválido.

### 9.2 Helpers y utils
Probar:
- formateo de moneda,
- formateo de fecha,
- normalización de strings,
- helpers de badges,
- cálculo de rangos de fecha.

### 9.3 Mappers
Probar:
- map DB row → DTO,
- map parsed document → result DTO,
- map import row → preview DTO,
- manejo de campos nulos y opcionales.

### 9.4 Parsers
Probar:
- extracción de campos esperados desde PDF de muestra,
- cabeceras CSV variadas,
- filas con datos faltantes,
- separación entre errors y warnings.

---

## 10. Integration tests recomendados

### 10.1 Services
Deben cubrir al menos:
- `createTransactionService`
- `updateTransactionService`
- `deleteTransactionService`
- `createInvoiceService`
- `updateInvoiceService`
- `getDashboardSummaryService`
- `parseDocumentService`
- `applyParsedDocumentService`
- `validateImportService`
- `executeImportService`

### 10.2 Qué validar en servicios
- que persisten correctamente,
- que aplican reglas de negocio,
- que rechazan datos inconsistentes,
- que respetan ownership,
- que enlazan `document_id` o `import_id` cuando corresponde.

### 10.3 Repositories
No hace falta sobretestear queries triviales, pero sí probar:
- filtros importantes,
- paginación,
- queries agregadas del dashboard,
- consultas de facturas pendientes,
- listado de import rows con estado.

---

## 11. End-to-end tests recomendados

### 11.1 Flujo: login + dashboard vacío
**Objetivo:** verificar acceso inicial correcto.

#### Debe comprobar:
- login exitoso,
- redirección a dashboard,
- estado vacío útil si no hay datos,
- acceso a quick actions.

### 11.2 Flujo: crear gasto manual
#### Debe comprobar:
- acceso a formulario,
- validaciones visibles,
- guardado correcto,
- aparición en listado,
- actualización del dashboard.

### 11.3 Flujo: crear ingreso manual
#### Debe comprobar:
- guardado correcto,
- reflejo en listados,
- cambio de métricas del dashboard.

### 11.4 Flujo: crear factura y marcar pagada
#### Debe comprobar:
- alta correcta,
- aparición en listado,
- filtro por pendiente,
- cambio a pagada,
- actualización del contador en dashboard.

### 11.5 Flujo: subir PDF y crear factura
#### Debe comprobar:
- subida correcta,
- preview visible,
- parseo o simulación de parseo,
- edición de sugerencias,
- creación de factura,
- edición posterior de la factura generada,
- vínculo con documento origen.

### 11.6 Flujo: importar CSV
#### Debe comprobar:
- descarga de plantilla o acceso a ella,
- subida CSV,
- mapping,
- preview,
- errores por fila,
- importación final,
- aparición de datos importados en listados.

### 11.7 Flujo: seguridad básica
#### Debe comprobar:
- un usuario no puede abrir recursos ajenos manipulando URL o IDs.

---

## 12. Testing específico de dashboard metrics

Este bloque es especialmente importante porque el dashboard es una vista agregada y fácil de romper sin darse cuenta.

### Métricas mínimas a validar
- totalIncome,
- totalExpense,
- netProfit,
- pendingInvoicesCount,
- pendingInvoicesAmount,
- latestTransactions,
- expenseByCategory,
- incomeVsExpenseSeries.

### Casos mínimos

#### Caso 1: sin datos
Debe devolver:
- ingresos = 0,
- gastos = 0,
- beneficio neto = 0,
- series vacías o estructura vacía válida,
- estado vacío correcto en UI.

#### Caso 2: solo ingresos
Debe devolver:
- totalIncome correcto,
- totalExpense = 0,
- netProfit = totalIncome.

#### Caso 3: ingresos y gastos mezclados
Debe devolver:
- sumas exactas por rango,
- beneficio neto correcto,
- series temporales correctas,
- categorías de gasto coherentes.

#### Caso 4: estados no confirmados
Debe comprobar:
- si la lógica definida excluye `draft` o `pending`, no deben contaminar KPIs finales.

#### Caso 5: facturas pendientes
Debe comprobar:
- el contador de pendientes y el importe pendiente son coherentes con las facturas en estado pendiente o vencido según regla definida.

### Recomendación de testing
- integration tests sobre el servicio agregado,
- un E2E mínimo que verifique reflejo tras crear y editar registros.

---

## 13. Testing de seguridad y aislamiento

### Casos obligatorios
- usuario A no puede leer transacciones del usuario B,
- usuario A no puede editar facturas del usuario B,
- usuario A no puede aplicar un `documentId` ajeno,
- usuario A no puede ejecutar una importación ajena,
- recursos relacionados deben pertenecer al mismo negocio.

### Qué probar
- bloqueo por RLS,
- bloqueo por checks backend,
- manejo correcto de respuestas `FORBIDDEN` o `NOT_FOUND`.

---

## 14. Testing del flujo PDF

### Casos mínimos
- PDF válido sube correctamente,
- archivo no PDF se rechaza,
- preview disponible,
- parseo devuelve sugerencias,
- parseo parcial devuelve datos parciales y no rompe la UI,
- parseo fallido permite continuar manualmente,
- apply a invoice funciona,
- apply a transaction funciona,
- el registro final queda vinculado al documento,
- el registro generado sigue siendo editable.

### Casos edge recomendados
- PDF vacío,
- PDF corrupto,
- PDF muy pequeño,
- PDF con campos ambiguos,
- importes con formato extraño,
- fechas múltiples.

---

## 15. Testing del flujo CSV

### Casos mínimos
- CSV válido con plantilla estándar,
- cabeceras detectadas correctamente,
- mapping correcto,
- fila válida importada,
- fila inválida marcada con error,
- `valid_only` importa solo válidas,
- `all_or_nothing` bloquea si hay inválidas,
- filas importadas quedan vinculadas a `import_id`.

### Casos edge recomendados
- delimitador inesperado,
- cabeceras duplicadas,
- columnas faltantes,
- fechas mal formateadas,
- importes con coma y punto,
- líneas vacías,
- encoding extraño.

---

## 16. Testing de UI y componentes

### Componentes clave a probar
- `TransactionForm`
- `InvoiceForm`
- `DocumentPreviewPanel`
- `ApplyParsedDocumentForm`
- `CsvMappingForm`
- `ImportPreviewPanel`
- `DataTable`
- `FilterBar`
- `EmptyState`
- `ConfirmDialog`

### Qué probar
- render correcto,
- interacción básica,
- mensajes de error,
- submit con datos válidos,
- bloqueo con datos inválidos,
- estados loading y disabled.

---

## 17. Testing de regresión recomendado

Cada vez que se toque:

### Transactions
revisar:
- create/update/delete,
- dashboard,
- reportes,
- filtros.

### Invoices
revisar:
- listado,
- estados,
- dashboard pending metrics.

### PDF flow
revisar:
- subida,
- preview,
- parseo,
- apply,
- edición posterior.

### CSV flow
revisar:
- upload,
- mapping,
- preview,
- validate,
- execute.

---

## 18. Datos de prueba recomendados

Conviene preparar fixtures pequeñas y legibles.

### Conjuntos mínimos
- usuario demo con negocio,
- categorías income/expense,
- terceros cliente/proveedor,
- 3-5 transacciones variadas,
- 2-3 facturas con estados distintos,
- 1 PDF sencillo,
- 1 PDF con parseo parcial,
- 1 CSV correcto,
- 1 CSV con errores.

### Regla
Los fixtures deben ser comprensibles y reutilizables entre unit, integración y E2E cuando sea posible.

---

## 19. Entornos de testing

### Recomendación
Definir al menos:
- local dev,
- test/staging,
- producción.

### En test/staging conviene verificar
- auth real o semimockeada,
- storage real de pruebas,
- PDFs y CSV de muestra,
- políticas de acceso,
- flujos de subida reales.

---

## 20. Criterio de salida mínimo por feature

Una funcionalidad del MVP debería considerarse lista cuando tenga, como mínimo:

1. validación básica cubierta,
2. caso feliz probado,
3. uno o varios casos de error relevantes probados,
4. integración con dashboard/listados verificada si aplica,
5. control de permisos revisado si toca datos privados.

---

## 21. Organización sugerida de tests

```text
src/
  tests/
    unit/
      validation/
      utils/
      mappers/
      parsers/
    integration/
      services/
      repositories/
      api/
    e2e/
      auth/
      dashboard/
      transactions/
      invoices/
      documents/
      imports/
```

### Alternativa práctica
También puede convivir test cerca del código:
- `*.test.ts`
- `*.spec.ts`

Pero para E2E suele venir mejor carpeta separada.

---

## 22. Recomendaciones específicas para Codex

Cuando Codex implemente testing debe:

- priorizar primero tests sobre servicios y flujos críticos;
- no perseguir cobertura total superficial;
- probar explícitamente dashboard metrics;
- cubrir errores por ownership y negocio;
- usar fixtures pequeñas y mantenibles;
- preparar E2E mínimos pero sólidos;
- separar bien tests de validación, integración y flujo completo.

---

## 23. Documentos pendientes del kit a preparar

Además de este testing strategy, conviene crear después estos documentos para completar el kit:

- `11-dashboard-metrics.md`
- `12-task-board.md`
- `13-content-seo.md`
- `14-env-and-integrations.md`
- `15-open-questions.md`
- `16-master-prompt.md`

---

## 24. Próximo documento recomendado

El siguiente más lógico puede ser cualquiera de estos, según cómo quieras trabajar con Codex:

- `11-dashboard-metrics.md` si quieres blindar cálculo y semántica de KPIs
- `12-task-board.md` si quieres convertir todo esto en plan de ejecución
- `16-master-prompt.md` si quieres ya el prompt maestro para construir la app

---

## 25. Estado del documento

**Versión:** 1.0  
**Estado:** Borrador operativo  
**Basado en:** `05-api-spec.md`, `07-acceptance-criteria.md`, `08-frontend-architecture.md` y `09-backend-architecture.md`  
**Siguiente paso recomendado:** `11-dashboard-metrics.md`

