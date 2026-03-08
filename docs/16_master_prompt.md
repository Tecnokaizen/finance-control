# 16 · Master Prompt

## 1. Propósito del documento

Este documento contiene el prompt maestro para usar con Codex al construir la app de control financiero. Su objetivo es condensar el contexto estratégico, funcional, técnico y operativo del kit en una instrucción única, clara y accionable, para que Codex implemente el proyecto con el menor margen posible de ambigüedad.

Este prompt está pensado para:

- iniciar el proyecto,
- generar estructura base,
- construir módulos por fases,
- mantener consistencia con el kit,
- evitar suposiciones incompatibles con el alcance del MVP.

---

## 2. Cómo usar este prompt

### Opción A · Prompt maestro completo
Usarlo al inicio del proyecto o al abrir una nueva sesión de trabajo amplia con Codex.

### Opción B · Prompt maestro + tarea concreta
Usarlo como contexto fijo y añadir debajo una instrucción específica, por ejemplo:
- construye el módulo de transacciones,
- implementa el dashboard,
- crea el flujo CSV,
- genera las migraciones iniciales.

### Opción C · Prompt maestro resumido
A partir de este documento puede hacerse una versión corta para sesiones más tácticas.

---

## 3. Instrucciones previas para Codex

Antes de empezar a generar código, Codex debe asumir lo siguiente:

1. Este proyecto es una **app web de control financiero** para autónomos, freelancers, pequeños negocios y microempresas.
2. La prioridad es construir un **MVP funcional, claro, mantenible y escalable**, evitando sobreingeniería.
3. Debe respetarse el kit documental ya definido: brief, requirements, user flows, data model, schema SQL, API spec, validation, acceptance criteria, frontend, backend, testing, dashboard metrics, task board, env/integrations y open questions.
4. Si alguna decisión sigue abierta, debe aplicarse el **default sugerido** del documento `15-open-questions.md`.
5. No debe inventarse funcionalidad fuera del MVP sin justificarlo.
6. Debe priorizar estructura limpia, tipado claro, separación por capas y coherencia entre frontend, backend y base de datos.

---

## 4. Prompt maestro principal

```text
Quiero que actúes como ingeniero full-stack senior y arquitecto de producto para construir una app web de control financiero orientada a autónomos, freelancers y pequeñas empresas.

Tu misión es construir un MVP funcional, claro, mantenible y escalable, usando un enfoque pragmático: estructura sólida, pocas dependencias innecesarias, buena experiencia de usuario y separación limpia entre frontend, backend, validación, acceso a datos y lógica de negocio.

Debes trabajar siguiendo estas reglas:

CONTEXTO DEL PRODUCTO
- La app permite registrar, organizar y analizar ingresos, gastos y facturas.
- Debe mostrar un dashboard con KPIs financieros claros.
- Debe soportar gestión manual de transacciones y facturas.
- Debe soportar subida de PDFs con vista previa, parseo de datos sugeridos y revisión humana antes de consolidar el registro.
- Debe soportar importación CSV con plantilla descargable, mapping de columnas, preview, validación por fila y ejecución controlada.
- El usuario debe poder revisar métricas, movimientos, facturas, categorías, terceros y reportes básicos.

ALCANCE DEL MVP
Incluye como núcleo:
- autenticación,
- perfil y negocio actual,
- categorías,
- terceros,
- transacciones manuales,
- facturas,
- dashboard,
- flujo PDF,
- flujo CSV,
- reportes básicos,
- testing crítico,
- seguridad y ownership por usuario/negocio.

No incluyas como núcleo del MVP, salvo que se pida expresamente:
- OCR avanzado,
- integraciones bancarias,
- multiempresa real expuesta en UI,
- multi-moneda real con conversión,
- financial accounts complejos,
- background jobs avanzados,
- app móvil nativa,
- automatizaciones complejas con IA.

DECISIONES DE MVP YA FIJADAS
- Un solo negocio por usuario en el MVP, aunque el modelo debe quedar preparado para multiempresa futura.
- `transactions` es una tabla unificada para ingresos y gastos.
- `invoices` va separada de `transactions`.
- Una factura NO debe generar automáticamente una transacción en el MVP.
- El parseo PDF usa extracción de texto + heurísticas. OCR queda fuera del MVP inicial.
- La importación CSV prioritaria es `transactions_csv`.
- El dashboard usa solo transacciones `confirmed` para ingresos, gastos y beneficio neto.
- Las métricas de facturas pendientes usan estados `pending` + `overdue` y son globales del negocio, no dependientes del filtro temporal principal.
- La app se plantea primero como app privada funcional; la capa pública/marketing puede venir después.

STACK RECOMENDADO
Usa este stack salvo motivo fuerte para cambiarlo:
- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn/ui
- React Hook Form
- Zod
- Supabase Auth
- Supabase PostgreSQL
- Supabase Storage
- Recharts para gráficos simples
- Vitest / Testing Library / Playwright para testing

ARQUITECTURA FRONTEND
- Usa estructura modular por dominio.
- Separa `app`, `features`, `components`, `lib`, `types`.
- Reutiliza formularios entre alta manual, edición y datos derivados de PDF cuando sea posible.
- Usa Server Components para lecturas iniciales cuando aporte valor.
- Usa componentes cliente solo donde haya interacción rica.
- Contempla loading, empty, error y success states desde el inicio.
- Diseña dashboard con sidebar fija en escritorio y drawer en móvil.

ARQUITECTURA BACKEND
- Separa handlers/actions, services, repositories, validation, mappers, parsers y storage.
- No metas lógica compleja directamente en route handlers o componentes.
- Centraliza reglas de negocio en services.
- Repositories encapsulan queries y filtros.
- Usa Supabase como integración central del MVP.
- Mantén ownership y business isolation en todas las operaciones.
- Apóyate en RLS + validación backend.

MODELO DE DATOS
Debes respetar estas entidades principales:
- profiles
- businesses
- categories
- third_parties
- transactions
- invoices
- documents
- parsed_document_data
- imports
- import_rows

Y estas reglas base:
- UUID como ID.
- `business_id` como eje multi-tenant simple.
- `transactions.type` en `income | expense`.
- `transactions.status` en `draft | pending | confirmed | cancelled`.
- `invoices.type` en `issued | received`.
- `invoices.status` en `draft | pending | paid | overdue | cancelled`.
- `document_id` e `import_id` deben mantener trazabilidad.

VALIDACIÓN
- Usa Zod para validación compartida.
- Revalida siempre en backend.
- No aceptes categorías incompatibles con el tipo de transacción.
- No aceptes recursos de otros negocios.
- No aceptes archivos fuera de los MIME/type esperados.
- Separa errores bloqueantes y warnings en PDF/CSV cuando tenga sentido.

FLUJO PDF
Implementa este flujo:
1. subir PDF,
2. guardar documento,
3. mostrar preview,
4. ejecutar parseo,
5. devolver sugerencias editables,
6. permitir confirmación humana,
7. crear factura o transacción,
8. permitir edición posterior del registro generado,
9. mantener vínculo con `document_id`.

Regla crítica:
- nunca consolides automáticamente el parseo como registro final confirmado sin revisión humana en el MVP.

FLUJO CSV
Implementa este flujo:
1. descargar plantilla,
2. subir CSV,
3. detectar cabeceras,
4. guardar mapping,
5. validar filas,
6. mostrar preview,
7. mostrar errores por fila,
8. ejecutar importación,
9. vincular registros a `import_id`.

Reglas críticas:
- no importar definitivamente sin preview y validación,
- priorizar `transactions_csv`,
- soportar como mínimo modo `valid_only`.

DASHBOARD
El dashboard debe incluir como mínimo:
- totalIncome,
- totalExpense,
- netProfit,
- pendingInvoicesCount,
- pendingInvoicesAmount,
- latestTransactions,
- expenseByCategory,
- incomeVsExpenseSeries.

Reglas de cálculo:
- `totalIncome` = suma de transactions `income` con `status = confirmed` dentro del rango.
- `totalExpense` = suma de transactions `expense` con `status = confirmed` dentro del rango.
- `netProfit` = totalIncome - totalExpense.
- `pendingInvoicesCount` y `pendingInvoicesAmount` = facturas `pending` + `overdue`, globales del negocio.
- `expenseByCategory` = agrupación de gastos confirmados dentro del rango.
- `incomeVsExpenseSeries` = serie temporal de ingresos y gastos confirmados.

SEGURIDAD
- Implementa aislamiento por usuario y negocio.
- Nunca confíes solo en el frontend para permisos.
- Aplica RLS en Supabase.
- Verifica ownership en servicios y acciones.
- No expongas claves sensibles al cliente.

ENV E INTEGRACIONES
- Usa variables públicas y privadas separadas.
- Valida env al arrancar.
- Usa Supabase Auth, DB y Storage como núcleo.
- OCR, analytics y monitoring son opcionales en MVP.

CALIDAD Y TESTING
Debes construir con foco en pruebas desde el inicio.
Prioriza tests para:
- auth y ownership,
- create/update/delete de transacciones,
- create/update de facturas,
- dashboard metrics,
- flujo PDF,
- flujo CSV,
- errores y validación crítica.

FORMA DE TRABAJO ESPERADA
Cuando implementes:
- avanza por fases lógicas,
- explica la estructura que vas a crear,
- no saltes a refinamientos antes del núcleo funcional,
- genera código mantenible y modular,
- mantén consistencia entre tipos, schemas, DTOs y tablas,
- documenta decisiones cuando tomes una asunción.

ORDEN DE CONSTRUCCIÓN RECOMENDADO
1. setup base,
2. auth + layout,
3. perfil + negocio,
4. categorías + terceros,
5. transacciones,
6. facturas,
7. dashboard,
8. PDF flow,
9. CSV flow,
10. reportes,
11. testing y hardening.

QUÉ HACER SI FALTA INFORMACIÓN
- Si una decisión está abierta, usa el default sugerido del documento de open questions.
- Si algo no está especificado pero afecta al MVP, elige la opción más simple, estable y compatible con el kit.
- No añadas complejidad futura como si ya fuera requisito actual.

ESTILO DE IMPLEMENTACIÓN
- limpio,
- modular,
- tipado,
- pragmático,
- orientado a shipping del MVP,
- sin sobreingeniería.
```

---

## 5. Versión reducida del prompt maestro

```text
Construye una app web de control financiero para freelancers y pequeñas empresas usando Next.js, TypeScript, Tailwind, shadcn/ui, React Hook Form, Zod y Supabase.

Quiero un MVP funcional, claro y mantenible con:
- auth,
- perfil y negocio actual,
- categorías,
- terceros,
- transacciones manuales,
- facturas,
- dashboard con métricas claras,
- subida de PDF con preview, parseo sugerido y revisión humana,
- importación CSV con plantilla, mapping, preview y validación,
- reportes básicos,
- seguridad por usuario/negocio,
- testing crítico.

Reglas clave:
- un negocio por usuario en MVP,
- `transactions` unificada para income/expense,
- facturas separadas de transacciones,
- no auto-generar transacción desde factura,
- PDF sin OCR en MVP, solo texto + heurísticas,
- CSV centrado primero en transacciones,
- dashboard con solo transactions `confirmed` para KPIs financieros,
- pendientes de facturas = `pending + overdue` globales del negocio,
- sin sobreingeniería.

Trabaja por capas: handlers/actions, services, repositories, validation, mappers, parsers y storage.
Usa Zod, RLS, DTOs claros, formularios reutilizables, estados loading/empty/error y tests para flujos críticos.
Avanza por este orden: auth, layout, categorías, terceros, transacciones, facturas, dashboard, PDF, CSV, reportes, testing.
```

---

## 6. Prompt maestro para arranque técnico del proyecto

```text
Quiero que generes la base técnica del proyecto siguiendo este stack y arquitectura:

- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn/ui
- React Hook Form
- Zod
- Supabase Auth, Postgres y Storage

Necesito que prepares:
1. estructura de carpetas frontend/backend por dominios,
2. configuración base de Supabase,
3. módulo de env config validado con Zod,
4. esquema inicial de tipos compartidos,
5. validaciones base,
6. layout público y privado,
7. auth mínima,
8. placeholders de módulos principales,
9. base para services/repositories/parsers,
10. setup de testing con Vitest y Playwright.

Hazlo de forma modular y alineada con un MVP de control financiero que luego crecerá con dashboard, facturas, PDF y CSV.
```

---

## 7. Prompt maestro para construir por fases

### Fase 1 · Núcleo manual
```text
Implementa el núcleo manual del MVP:
- auth,
- perfil,
- negocio actual,
- categorías,
- terceros,
- transacciones,
- facturas,
- dashboard básico.

Respeta ownership por negocio, validación con Zod, separación por capas y coherencia con métricas del dashboard.
No entres todavía en OCR, integraciones bancarias ni automatizaciones complejas.
```

### Fase 2 · Flujos asistidos
```text
Implementa los flujos asistidos del MVP:
- subida de PDF,
- preview,
- parseo sugerido,
- revisión humana,
- apply a factura o transacción,
- importación CSV de transacciones,
- plantilla descargable,
- mapping,
- validación por fila,
- ejecución controlada.

Mantén trazabilidad con `document_id` e `import_id` y no consolides datos automáticamente sin revisión del usuario.
```

### Fase 3 · Hardening
```text
Implementa endurecimiento y calidad del MVP:
- acceptance criteria,
- tests críticos,
- estados loading/empty/error,
- validaciones cruzadas de negocio,
- seguridad por ownership,
- revisión de dashboard metrics,
- revisión de PDF y CSV flows,
- limpieza de código y consistencia de DTOs.
```

---

## 8. Prompt para pedir cambios concretos a Codex

### Ejemplos útiles

#### Implementar un módulo
```text
Usa el master prompt como contexto y construye ahora el módulo de transacciones completo: schema, DTOs, servicio, repositorio, UI, formulario, tabla, filtros y tests mínimos.
```

#### Corregir una funcionalidad
```text
Usa el master prompt como contexto y revisa por qué el dashboard no refleja correctamente los gastos confirmados tras editar una transacción. Quiero corrección alineada con las reglas de métricas del proyecto.
```

#### Añadir una mejora controlada
```text
Usa el master prompt como contexto y añade comparación con periodo anterior al dashboard, pero sin romper las métricas ya definidas ni introducir sobreingeniería.
```

---

## 9. Guardrails para Codex

Codex debe evitar:

- mezclar demasiada lógica en componentes UI,
- meter toda la lógica en route handlers,
- recalcular dashboard en frontend con reglas distintas,
- consolidar parseos PDF automáticamente,
- importar CSV sin trazabilidad por fila,
- introducir módulos no prioritarios del roadmap como si fueran núcleo del MVP,
- asumir multiempresa real o multi-moneda completa sin que se pida explícitamente,
- usar secretos en cliente,
- ignorar RLS y ownership.

---

## 10. Defaults de trabajo que el prompt maestro debe asumir

Si no se especifica lo contrario, Codex debe asumir:

- 1 negocio por usuario en MVP
- app privada primero
- PDF sin OCR
- CSV centrado en transacciones
- reporte mensual seguro, anual opcional
- latest transactions con `confirmed` como base y posibilidad de incluir `pending` solo si se decide explícitamente
- sidebar en escritorio + drawer en móvil
- formularios reutilizables entre alta manual y datos derivados de PDF
- testing priorizado en servicios y flujos críticos

---

## 11. Recomendación de uso real

### Cuando abras una sesión nueva con Codex
Pega:
1. versión reducida o completa del master prompt,
2. la tarea concreta del día,
3. el documento relevante del kit si hace falta reforzar contexto,
4. una instrucción final tipo:
   - no asumas decisiones fuera del MVP,
   - avanza paso a paso,
   - explica estructura antes de generar mucho código.

---

## 12. Relación con otros documentos del kit

Este prompt maestro condensa y depende de:

- `00-project-brief.md`
- `01-product-requirements.md`
- `02-user-flows.md`
- `03-data-model.md`
- `04-db-schema-sql.md`
- `05-api-spec.md`
- `06-validation-schemas.md`
- `07-acceptance-criteria.md`
- `08-frontend-architecture.md`
- `09-backend-architecture.md`
- `10-testing-strategy.md`
- `11-dashboard-metrics.md`
- `12-task-board.md`
- `14-env-and-integrations.md`
- `15-open-questions.md`

---

## 13. Documento pendiente restante

Después de este archivo, ya solo quedaría preparar:

- `13-content-seo.md`

---

## 14. Estado del documento

**Versión:** 1.0  
**Estado:** Borrador operativo listo para usar con Codex  
**Basado en:** todo el kit generado hasta este punto  
**Siguiente paso recomendado:** `13-content-seo.md`

