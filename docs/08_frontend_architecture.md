# 08 · Frontend Architecture

## 1. Propósito del documento

Este documento define la arquitectura frontend del MVP para la app de control financiero. Su objetivo es dar a Codex una estructura clara para construir la interfaz, organizar el código y mantener consistencia entre páginas, componentes, formularios, tablas, estados de carga, errores y flujos asistidos por archivos.

Debe servir como referencia para:

- estructura de carpetas,
- módulos funcionales,
- rutas y pantallas,
- componentes reutilizables,
- manejo de estado,
- formularios,
- tablas y filtros,
- experiencia de usuario,
- integración con backend y contratos.

---

## 2. Objetivos de arquitectura frontend

La arquitectura debe permitir:

- construir rápido sin desorden,
- reutilizar componentes y formularios,
- mantener coherencia entre módulos,
- separar UI, estado y acceso a datos,
- facilitar evolución futura del producto,
- evitar sobreingeniería en el MVP.

---

## 3. Stack frontend recomendado

### Recomendación principal
- **Next.js** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **shadcn/ui** como base de componentes
- **React Hook Form** para formularios
- **Zod** para validación
- **TanStack Query** opcional para lecturas cliente y caché, si no se trabaja casi todo con Server Actions
- **Supabase Auth** o auth equivalente
- **Chart library simple** para dashboard y reportes, por ejemplo Recharts

### Criterio de elección
Este stack encaja bien con:
- desarrollo rápido,
- formularios ricos,
- tablas y filtros,
- UI moderna,
- integración cómoda con Supabase,
- buena experiencia para Codex al generar estructura modular.

---

## 4. Principios de arquitectura frontend

1. Separar dominios por módulo.
2. Mantener los componentes genéricos fuera del dominio cuando sean reutilizables.
3. Centralizar validaciones reutilizables.
4. Reutilizar formularios entre alta manual, importación y parseo PDF cuando sea posible.
5. Reducir lógica de negocio en componentes visuales.
6. Mantener contratos tipados entre frontend y backend.
7. Diseñar pantallas pensando en escritorio primero, sin romper móvil.

---

## 5. Enfoque de organización recomendado

La organización debe mezclar:

- estructura por **app routes**,
- módulos por **dominio funcional**,
- librerías compartidas para UI, validación, utilidades y tipos.

### Idea base
- `app/` para rutas y layout
- `features/` para dominio
- `components/` para UI reusable
- `lib/` para utilidades, clientes y helpers
- `types/` para DTOs y tipos compartidos

---

## 6. Estructura de carpetas sugerida

```text
src/
  app/
    (public)/
      login/
        page.tsx
      register/
        page.tsx
      layout.tsx
    (dashboard)/
      layout.tsx
      page.tsx
      transactions/
        page.tsx
        [id]/
          page.tsx
      invoices/
        page.tsx
        [id]/
          page.tsx
      categories/
        page.tsx
      third-parties/
        page.tsx
      imports/
        page.tsx
        [id]/
          page.tsx
      documents/
        page.tsx
        [id]/
          page.tsx
      reports/
        page.tsx
      settings/
        page.tsx
    api/
      ...
    globals.css

  components/
    ui/
    layout/
    shared/
    feedback/
    tables/
    filters/
    charts/
    forms/

  features/
    auth/
      components/
      actions/
      schemas/
      types/
    dashboard/
      components/
      hooks/
      services/
      types/
    transactions/
      components/
      forms/
      hooks/
      services/
      schemas/
      types/
    invoices/
      components/
      forms/
      hooks/
      services/
      schemas/
      types/
    categories/
      components/
      hooks/
      services/
      schemas/
      types/
    third-parties/
      components/
      hooks/
      services/
      schemas/
      types/
    documents/
      components/
      hooks/
      services/
      schemas/
      types/
    imports/
      components/
      hooks/
      services/
      schemas/
      types/
    reports/
      components/
      hooks/
      services/
      types/
    settings/
      components/
      hooks/
      services/
      schemas/
      types/

  lib/
    auth/
    supabase/
    api/
    validation/
    format/
    dates/
    errors/
    guards/
    constants/
    utils/

  types/
    api.ts
    dto.ts
    domain.ts
    ui.ts
```

---

## 7. Rutas principales del MVP

### Públicas
- `/login`
- `/register`

### Privadas
- `/`
- `/transactions`
- `/transactions/[id]`
- `/invoices`
- `/invoices/[id]`
- `/categories`
- `/third-parties`
- `/documents`
- `/documents/[id]`
- `/imports`
- `/imports/[id]`
- `/reports`
- `/settings`

### Criterio
El dashboard puede vivir en `/` para reducir fricción.

---

## 8. Layouts principales

### 8.1 Public layout
Debe incluir:
- branding simple,
- formularios centrados,
- diseño limpio,
- mensajes globales de error o éxito cuando aplique.

### 8.2 Dashboard layout
Debe incluir:
- sidebar o navegación principal,
- topbar,
- selector de rango temporal global si aplica,
- acceso rápido a acciones frecuentes,
- área principal scrollable,
- manejo claro de loading y empty states.

### 8.3 Mobile behavior
En móvil:
- sidebar colapsable o drawer,
- acciones rápidas accesibles,
- tablas con fallback a cards cuando haga falta.

---

## 9. Módulos funcionales del frontend

### 9.1 Auth
Responsable de:
- login,
- registro,
- estado de sesión,
- protección de rutas,
- redirecciones iniciales.

### 9.2 Dashboard
Responsable de:
- KPIs,
- resumen financiero,
- últimos movimientos,
- gráficos,
- accesos rápidos.

### 9.3 Transactions
Responsable de:
- listado,
- filtros,
- detalle,
- creación,
- edición,
- borrado,
- formularios.

### 9.4 Invoices
Responsable de:
- listado,
- filtros,
- detalle,
- creación,
- edición,
- seguimiento de estados.

### 9.5 Categories
Responsable de:
- listado,
- creación,
- edición,
- archivado o borrado.

### 9.6 Third parties
Responsable de:
- listado,
- alta,
- edición,
- selección reutilizable desde formularios.

### 9.7 Documents
Responsable de:
- subida de PDF,
- preview,
- parseo,
- revisión de sugerencias,
- conversión a transacción o factura,
- edición posterior.

### 9.8 Imports
Responsable de:
- subida CSV,
- descarga de plantilla,
- mapeo,
- preview,
- validación,
- ejecución,
- revisión de errores por fila.

### 9.9 Reports
Responsable de:
- resumen mensual,
- resumen anual si entra en MVP,
- visualizaciones simples.

### 9.10 Settings
Responsable de:
- perfil,
- negocio,
- preferencias básicas.

---

## 10. Componentes UI reutilizables recomendados

### Layout
- `AppSidebar`
- `AppTopbar`
- `PageHeader`
- `PageContainer`
- `QuickActionsBar`

### Feedback
- `EmptyState`
- `ErrorState`
- `LoadingState`
- `SkeletonBlock`
- `InlineFieldError`
- `ToastSuccess`
- `ToastError`
- `ConfirmDialog`

### Datos
- `DataTable`
- `DataCardList`
- `FilterBar`
- `SearchInput`
- `PaginationControls`
- `StatCard`
- `TrendBadge`

### Formularios
- `FormSection`
- `FormActions`
- `CurrencyInput`
- `DateInput`
- `CategorySelect`
- `ThirdPartySelect`
- `PaymentMethodSelect`
- `StatusSelect`
- `FileDropzone`

### Visualización
- `AmountDisplay`
- `StatusBadge`
- `TypeBadge`
- `DocumentPreview`
- `ImportPreviewTable`
- `ValidationSummaryCard`

### Gráficos
- `IncomeExpenseChart`
- `ExpenseByCategoryChart`
- `MonthlySummaryChart`

---

## 11. Componentes por dominio recomendados

### Dashboard
- `DashboardKpiGrid`
- `LatestTransactionsCard`
- `PendingInvoicesCard`
- `ExpenseByCategoryCard`
- `IncomeVsExpenseCard`

### Transactions
- `TransactionTable`
- `TransactionFilters`
- `TransactionForm`
- `TransactionDetailCard`
- `TransactionDeleteDialog`

### Invoices
- `InvoiceTable`
- `InvoiceFilters`
- `InvoiceForm`
- `InvoiceDetailCard`
- `InvoiceStatusActions`

### Categories
- `CategoryTable`
- `CategoryForm`
- `CategoryTypeTabs`

### Third parties
- `ThirdPartyTable`
- `ThirdPartyForm`
- `ThirdPartyPicker`

### Documents
- `DocumentUploadCard`
- `DocumentPreviewPanel`
- `DocumentParseResultCard`
- `ApplyParsedDocumentForm`
- `DocumentLinkedRecords`

### Imports
- `ImportUploadCard`
- `CsvTemplateDownloadCard`
- `CsvMappingForm`
- `ImportPreviewPanel`
- `ImportRowsTable`
- `ImportExecutionSummary`

---

## 12. Formularios clave del MVP

### Formularios base
- login form
- register form
- profile form
- business form
- category form
- third party form
- transaction form
- invoice form
- CSV mapping form
- apply parsed document form

### Decisión importante
Los formularios de `transaction` e `invoice` deben diseñarse para poder reutilizarse en tres contextos:

1. alta manual,
2. edición,
3. datos sugeridos desde PDF.

### Beneficio
Esto reduce duplicación y mantiene reglas consistentes.

---

## 13. Estrategia de formularios

### Recomendación
- React Hook Form + Zod resolver
- componentes controlados solo cuando sea necesario
- inputs simples no controlados cuando sea posible

### Estructura recomendada
Cada dominio puede tener:

```text
forms/
  transaction-form.tsx
  transaction-form-fields.tsx
  use-transaction-form.ts
```

### Regla
Separar:
- campos visuales,
- lógica del form,
- schema,
- submit handler.

---

## 14. Estrategia de datos y fetching

## Recomendación práctica para MVP
Usar una mezcla de:
- **Server Components** para pantallas de lectura inicial,
- **Server Actions** o services para mutaciones,
- **client components** solo donde haya interacción rica.

### Lecturas ideales para Server Components
- dashboard inicial,
- listados básicos,
- reportes,
- settings.

### Casos claramente cliente
- formularios,
- filtros interactivos,
- tablas con acciones inline,
- preview y pasos de CSV,
- parseo y revisión de PDF.

### Si se usa TanStack Query
Reservarlo para:
- re-fetch selectivo,
- invalidación tras mutaciones,
- vistas con interacción continua.

### Regla
Evitar montar una capa compleja de estado global si no es necesaria.

---

## 15. Estado frontend recomendado

### Estado local
Para:
- modales,
- selects,
- toggles,
- estados de paso en formularios,
- preview temporal.

### Estado de formulario
React Hook Form.

### Estado de datos remotos
- Server Components o TanStack Query.

### Estado global ligero
Solo si realmente se necesita para:
- sesión,
- negocio actual,
- filtros globales de periodo,
- configuración de UI.

### Recomendación
Mantener global state mínimo.

---

## 16. Patrón de tablas y listados

### Requisitos de UX
Las tablas deben soportar:
- loading,
- empty state,
- error state,
- paginación,
- filtros,
- búsqueda,
- acciones por fila.

### En escritorio
Usar tabla real cuando sea útil.

### En móvil
Convertible a cards si la tabla pierde legibilidad.

### Listados clave
- transactions list
- invoices list
- categories list
- third parties list
- import rows list
- documents list

---

## 17. Patrón de filtros

### Recomendación
Separar filtros en componente propio por dominio.

### Ejemplo
`TransactionFilters` debe incluir:
- rango de fechas,
- tipo,
- estado,
- categoría,
- tercero,
- búsqueda.

### Regla UX
- reset fácil,
- filtros visibles,
- sincronización con URL cuando sea útil.

### Recomendación técnica
Persistir filtros principales en search params cuando aporte valor.

---

## 18. Estados de carga, vacío y error

### Cada pantalla debe contemplar
- `loading`
- `empty`
- `error`
- `success`

### Reglas
- nunca dejar bloques en blanco sin explicación,
- usar skeletons en dashboard y tablas,
- usar mensajes accionables en errores,
- mostrar CTA útil en estados vacíos.

---

## 19. Arquitectura específica para PDF flow

### Flujo UI recomendado
1. subir archivo,
2. mostrar preview,
3. lanzar parseo,
4. mostrar resultado,
5. editar campos sugeridos,
6. confirmar creación como transacción o factura,
7. permitir edición posterior del registro generado.

### Componentes implicados
- `DocumentUploadCard`
- `DocumentPreviewPanel`
- `DocumentParseResultCard`
- `ApplyParsedDocumentForm`

### Regla crítica
Aunque el parser sugiera datos, el frontend debe tratar el resultado como **editable**, no definitivo.

### Campo importante heredado del flujo de usuario
La factura o documento generado desde PDF debe poder editarse después para añadir:
- categoría,
- subcategoría si procede,
- datos faltantes,
- correcciones manuales.

---

## 20. Arquitectura específica para CSV flow

### Flujo UI recomendado
1. descargar plantilla,
2. subir CSV,
3. detectar cabeceras,
4. mapear columnas,
5. validar filas,
6. mostrar preview,
7. mostrar errores y warnings,
8. ejecutar importación,
9. mostrar resumen final.

### Componentes implicados
- `CsvTemplateDownloadCard`
- `ImportUploadCard`
- `CsvMappingForm`
- `ImportPreviewPanel`
- `ImportRowsTable`
- `ImportExecutionSummary`

### Regla crítica
La UI debe dejar claro en qué paso está el usuario y qué falta para terminar.

---

## 21. Navegación y discoverability

### Sidebar sugerida
- Dashboard
- Movimientos
- Facturas
- Categorías
- Clientes / proveedores
- Documentos
- Importaciones
- Reportes
- Ajustes

### Quick actions recomendadas
- Nuevo ingreso
- Nuevo gasto
- Nueva factura
- Subir PDF
- Importar CSV

### Regla
Las acciones frecuentes deben estar visibles sin obligar a navegar demasiado.

---

## 22. Sistema de diseño mínimo

### Tokens recomendados
- spacing consistente,
- radios consistentes,
- escala tipográfica simple,
- estados de color para success / warning / error / info,
- badges homogéneos para estados y tipos.

### Principios visuales
- interfaz limpia,
- densidad media,
- prioridad a legibilidad,
- jerarquía clara,
- uso moderado de color para semántica financiera.

### Semántica visual sugerida
- income: positivo / success
- expense: warning o neutral fuerte
- overdue / errors: danger
- pending: warning

---

## 23. Accesibilidad mínima

El frontend debe contemplar:
- labels correctas,
- foco visible,
- navegación por teclado razonable,
- contraste suficiente,
- feedback de errores accesible,
- botones y controles con área clicable adecuada.

---

## 24. Formateo y utilidades visuales

### Helpers necesarios
- formateador de moneda,
- formateador de fecha,
- normalización de strings,
- helpers de badges de estado,
- helpers de colores por tipo o estado.

### Regla
Centralizar formatos en `lib/format` o `lib/utils`.

---

## 25. Tipos compartidos y DTOs

### Recomendación
El frontend no debe depender directamente del shape crudo de DB.

Debe trabajar con:
- DTOs de API,
- tipos de formulario,
- tipos de vista.

### Ejemplo
- `TransactionDTO`
- `TransactionTableItem`
- `CreateTransactionInput`
- `InvoiceDTO`
- `DashboardSummaryDTO`
- `ParsedDocumentResultDTO`
- `ImportRowViewModel`

---

## 26. Estrategia de composición recomendada

### Patrón sugerido por pantalla
Cada pantalla puede seguir esta composición:

1. `page.tsx`  
   carga datos iniciales y compone secciones

2. componentes de dominio  
   renderizan UI del módulo

3. hooks / services  
   encapsulan fetching o acciones de mutación

4. schemas / types  
   validan y tipan

### Regla
No meter lógica compleja de negocio directamente en `page.tsx`.

---

## 27. Ejemplo de reparto por dominio

### Transactions
```text
features/transactions/
  components/
    transaction-table.tsx
    transaction-filters.tsx
    transaction-detail-card.tsx
    transaction-delete-dialog.tsx
  forms/
    transaction-form.tsx
    transaction-form-fields.tsx
    use-transaction-form.ts
  hooks/
    use-transaction-filters.ts
  services/
    get-transactions.ts
    get-transaction-by-id.ts
    create-transaction.ts
    update-transaction.ts
    delete-transaction.ts
  schemas/
    transaction-form.schema.ts
  types/
    transaction.types.ts
```

---

## 28. Recomendaciones específicas para Codex

Cuando Codex implemente el frontend debe:

- mantener una separación clara entre `components`, `features` y `lib`;
- reutilizar formularios y componentes de selección;
- no duplicar lógica entre alta manual y datos derivados de PDF;
- usar search params para filtros donde tenga sentido;
- contemplar empty states y loading states desde la primera versión;
- tipar inputs y outputs de cada acción;
- evitar una arquitectura demasiado compleja para el MVP.

---

## 29. Secuencia recomendada de construcción frontend

Orden útil para construir:

1. auth y layout base,
2. dashboard inicial,
3. categorías y terceros,
4. transacciones manuales,
5. facturas,
6. PDF flow,
7. CSV import flow,
8. reportes,
9. ajustes.

### Razón
Este orden permite desbloquear primero el núcleo funcional y dejar después los flujos asistidos más complejos.

---

## 30. Próximo documento recomendado

Después de este archivo, el siguiente más útil sería:

- `09-backend-architecture.md`
- `09-testing-strategy.md`
- `09-ui-components-inventory.md`

---

## 31. Estado del documento

**Versión:** 1.0  
**Estado:** Borrador operativo  
**Basado en:** `02-user-flows.md`, `05-api-spec.md`, `06-validation-schemas.md` y `07-acceptance-criteria.md`  
**Siguiente paso recomendado:** `09-backend-architecture.md`

