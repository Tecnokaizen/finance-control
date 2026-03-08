# 12 · Task Board

## 1. Propósito del documento

Este documento convierte el kit del proyecto en un tablero de trabajo ejecutable. Su objetivo es traducir la visión, requisitos, arquitectura, validaciones, métricas y testing en bloques de ejecución concretos para que Codex pueda construir la app paso a paso sin improvisar prioridades.

Debe servir como referencia para:

- plan de ejecución,
- orden de implementación,
- división por épicas,
- tareas de frontend,
- tareas de backend,
- tareas de base de datos,
- tareas de testing,
- definición de entregables por fase.

---

## 2. Cómo usar este task board

Este board está pensado para funcionar de dos formas:

### Como plan de ejecución manual
El usuario o equipo puede ir marcando tareas por bloques.

### Como guía operativa para Codex
Codex puede usar cada épica y tarea como unidad de implementación, respetando dependencias y criterios de completitud.

### Regla importante
No se debe intentar construir todo a la vez. El MVP debe avanzar por capas y por bloques funcionales.

---

## 3. Estructura del board

El tablero se organiza en:

- fases,
- épicas,
- tareas,
- dependencias,
- entregables,
- definición mínima de done.

### Estados sugeridos
- Backlog
- Ready
- In Progress
- Blocked
- Review
- Done

---

## 4. Orden general recomendado

### Secuencia de construcción sugerida
1. Base técnica y setup
2. Auth + negocio actual + layout base
3. Catálogos base: categorías y terceros
4. Transacciones manuales
5. Facturas
6. Dashboard y métricas
7. PDF flow
8. CSV import flow
9. Reportes
10. Ajustes, endurecimiento, QA y pulido

---

## 5. Fase 0 · Setup del proyecto

### Objetivo
Dejar la base técnica lista para empezar a construir sin fricción.

### Épica 0.1 · Bootstrap del repositorio

#### Tareas
- Crear proyecto base en Next.js con TypeScript.
- Configurar Tailwind.
- Configurar shadcn/ui.
- Configurar linting y formatting.
- Definir estructura inicial de carpetas.
- Añadir variables de entorno base.
- Preparar cliente Supabase.
- Crear README técnico inicial.

#### Entregable
Proyecto arrancable con estructura base y dependencias listas.

### Épica 0.2 · Base de datos inicial

#### Tareas
- Crear schema SQL inicial en Supabase/Postgres.
- Ejecutar migraciones base.
- Activar RLS.
- Crear políticas mínimas.
- Crear seeds mínimas de categorías demo si aplica.
- Verificar acceso autenticado y aislamiento.

#### Entregable
Base de datos operativa con tablas principales y seguridad mínima activa.

---

## 6. Fase 1 · Auth, sesión y layout base

### Objetivo
Permitir acceso seguro a la app y navegación inicial.

### Épica 1.1 · Autenticación

#### Tareas backend
- Implementar register.
- Implementar login.
- Implementar logout.
- Resolver sesión actual.
- Crear helpers `requireAuth` y `requireBusiness`.

#### Tareas frontend
- Crear pantalla `/login`.
- Crear pantalla `/register`.
- Mostrar errores de auth.
- Redirigir al dashboard tras login.
- Proteger rutas privadas.

#### Testing
- Test de login correcto.
- Test de credenciales inválidas.
- Test de acceso denegado a ruta privada.

#### Entregable
Usuario puede registrarse, entrar y salir correctamente.

### Épica 1.2 · Layout base privado

#### Tareas
- Crear dashboard layout.
- Crear sidebar.
- Crear topbar.
- Crear contenedor de páginas.
- Preparar quick actions base.
- Añadir estados loading/empty/error genéricos.

#### Entregable
App navegable con layout consistente.

---

## 7. Fase 2 · Perfil, negocio actual y ajustes base

### Objetivo
Establecer el contexto operativo del usuario y su negocio.

### Épica 2.1 · Perfil

#### Tareas
- Implementar lectura de perfil.
- Implementar edición de perfil.
- Crear formulario de perfil.
- Persistir moneda y zona horaria por defecto.

### Épica 2.2 · Negocio actual

#### Tareas
- Implementar lectura del negocio actual.
- Implementar edición del negocio.
- Resolver negocio principal del usuario.
- Verificar que los servicios usan el `business_id` correcto.

#### Entregable
Usuario trabaja con un negocio actual correctamente resuelto.

---

## 8. Fase 3 · Catálogos base

### Objetivo
Preparar las entidades reutilizables que necesita el núcleo financiero.

### Épica 3.1 · Categorías

#### Tareas backend
- Listar categorías.
- Crear categoría.
- Editar categoría.
- Borrar o archivar categoría.
- Validar tipo income/expense.

#### Tareas frontend
- Crear vista `/categories`.
- Crear tabla de categorías.
- Crear formulario de categoría.
- Soportar subcategorías si entra en esta fase.

#### Testing
- Crear categoría válida.
- Bloquear categoría con datos inválidos.
- Verificar aparición en formularios posteriores.

### Épica 3.2 · Terceros

#### Tareas backend
- Listar terceros.
- Crear tercero.
- Editar tercero.
- Borrar o archivar tercero.
- Filtrar por tipo.

#### Tareas frontend
- Crear vista `/third-parties`.
- Tabla de terceros.
- Formulario de tercero.
- Selector reutilizable para transacciones/facturas.

#### Entregable
Categorías y terceros listos para ser reutilizados en el núcleo.

---

## 9. Fase 4 · Transacciones manuales

### Objetivo
Construir el núcleo financiero principal del MVP.

### Épica 4.1 · Crear transacción

#### Tareas backend
- Implementar `createTransactionService`.
- Validar categoría compatible con tipo.
- Validar pertenencia al negocio.
- Persistir `source`, `status`, `document_id`, `import_id` cuando aplique.

#### Tareas frontend
- Crear `TransactionForm` reutilizable.
- Soportar creación de ingreso.
- Soportar creación de gasto.
- Mostrar validaciones de formulario.
- Confirmación visual tras guardar.

### Épica 4.2 · Listado y filtros

#### Tareas backend
- Implementar `listTransactionsService`.
- Soportar paginación.
- Soportar filtros por fecha, tipo, estado, categoría, tercero y búsqueda.

#### Tareas frontend
- Crear vista `/transactions`.
- Crear tabla de transacciones.
- Crear filtros.
- Sincronizar filtros con URL si aplica.
- Añadir acciones por fila.

### Épica 4.3 · Detalle, edición y borrado

#### Tareas
- Implementar lectura por id.
- Implementar edición.
- Implementar borrado.
- Añadir confirm dialog.
- Refrescar listado y dashboard tras cambios.

#### Testing crítico
- create/update/delete
- filtros
- ownership
- actualización de dashboard

#### Entregable
El usuario puede gestionar ingresos y gastos manuales de extremo a extremo.

---

## 10. Fase 5 · Facturas

### Objetivo
Añadir control de facturas emitidas y recibidas.

### Épica 5.1 · Alta de facturas

#### Tareas backend
- Implementar `createInvoiceService`.
- Validar tipo, estado, fechas y amount.
- Gestionar unicidad razonable de `invoiceNumber`.

#### Tareas frontend
- Crear `InvoiceForm`.
- Crear alta de factura emitida y recibida.
- Añadir campo de tercero, fechas, estado y adjunto.

### Épica 5.2 · Listado y filtros de facturas

#### Tareas
- Implementar listado paginado.
- Filtrar por estado, fechas, tercero, tipo y búsqueda.
- Mostrar estados pendientes y vencidas de forma clara.

### Épica 5.3 · Edición y seguimiento

#### Tareas
- Editar factura.
- Cambiar estado.
- Refrescar contador de pendientes.
- Mostrar detalle de factura.

#### Testing crítico
- create/update
- pending/overdue
- impacto en dashboard pending metrics
- ownership

#### Entregable
Facturas funcionales y coherentes con dashboard.

---

## 11. Fase 6 · Dashboard y métricas

### Objetivo
Dar visibilidad inmediata del negocio con métricas fiables.

### Épica 6.1 · Servicio agregado de dashboard

#### Tareas backend
- Implementar `getDashboardSummaryService`.
- Calcular `totalIncome`.
- Calcular `totalExpense`.
- Calcular `netProfit`.
- Calcular `pendingInvoicesCount`.
- Calcular `pendingInvoicesAmount`.
- Obtener `latestTransactions`.
- Obtener `expenseByCategory`.
- Obtener `incomeVsExpenseSeries`.
- Aplicar exactamente las reglas de `11-dashboard-metrics.md`.

### Épica 6.2 · UI del dashboard

#### Tareas frontend
- Crear grid de KPIs.
- Crear bloque de últimos movimientos.
- Crear gráfico de gastos por categoría.
- Crear gráfico de income vs expense.
- Añadir empty states útiles.
- Añadir quick actions.

### Épica 6.3 · Filtro temporal global

#### Tareas
- Crear selector de rango temporal.
- Refrescar dashboard al cambiar rango.
- Mantener coherencia con listados y reglas del documento de métricas.

#### Testing crítico
- dashboard vacío
- solo ingresos
- solo gastos
- mezcla real
- pendientes globales
- exclusión de draft/pending en KPIs financieros

#### Entregable
Dashboard fiable, consistente y usable.

---

## 12. Fase 7 · PDF flow

### Objetivo
Permitir subir un PDF, revisarlo, extraer sugerencias y convertirlo en registro utilizable.

### Épica 7.1 · Upload y documento base

#### Tareas backend
- Crear endpoint/acción de subida de PDF.
- Subir archivo a storage.
- Crear fila en `documents`.
- Validar tipo y tamaño.

#### Tareas frontend
- Crear vista `/documents` o entry point de subida.
- Crear `DocumentUploadCard`.
- Mostrar errores de archivo no soportado.

### Épica 7.2 · Preview del PDF

#### Tareas
- Generar o resolver preview.
- Mostrar preview en frontend.
- Mantener documento utilizable aunque falle el parseo.

### Épica 7.3 · Parseo y resultado sugerido

#### Tareas backend
- Extraer texto.
- Normalizar datos sugeridos.
- Guardar `parsed_document_data`.
- Devolver resultado serializable.

#### Tareas frontend
- Mostrar resultado parseado.
- Diferenciar parse completo, parcial o fallido.
- Mostrar formulario editable.

### Épica 7.4 · Apply parsed document

#### Tareas backend
- Aplicar parse a `transaction` o `invoice`.
- Mantener vínculo con `document_id`.
- No consolidar automáticamente sin confirmación humana.

#### Tareas frontend
- Permitir elegir crear factura o transacción.
- Permitir corregir campos sugeridos.
- Permitir completar categoría, subcategoría si procede y datos faltantes.
- Permitir edición posterior del registro generado.

#### Testing crítico
- upload válido / inválido
- preview
- parse correcto / parcial / fallido
- apply a invoice
- apply a transaction
- edición posterior del registro generado

#### Entregable
Flujo PDF completo, seguro y editable.

---

## 13. Fase 8 · CSV import flow

### Objetivo
Permitir importar datos masivos con mapping, preview, validación y trazabilidad.

### Épica 8.1 · Subida y detección inicial

#### Tareas backend
- Subir CSV a storage.
- Crear `imports`.
- Detectar cabeceras.
- Devolver headers detectados.

#### Tareas frontend
- Crear vista `/imports`.
- Crear upload card.
- Mostrar estado inicial del archivo.

### Épica 8.2 · Plantilla descargable

#### Tareas
- Crear plantilla CSV de ejemplo.
- Exponer descarga.
- Añadir explicación mínima de columnas.

### Épica 8.3 · Mapping

#### Tareas backend
- Guardar mapping.
- Validar mapping mínimo requerido.

#### Tareas frontend
- Crear `CsvMappingForm`.
- Sugerir columnas automáticamente.
- Bloquear avance si falta mapping clave.

### Épica 8.4 · Validación y preview

#### Tareas backend
- Parsear filas.
- Normalizar datos.
- Validar filas.
- Guardar `import_rows`.
- Devolver errores y warnings por fila.

#### Tareas frontend
- Crear preview table.
- Mostrar errores por fila.
- Mostrar resumen de válidas/inválidas.

### Épica 8.5 · Ejecución de importación

#### Tareas backend
- Ejecutar importación en modo `valid_only`.
- Soportar `all_or_nothing` si entra en MVP real.
- Vincular registros finales con `import_id`.

#### Tareas frontend
- Mostrar resumen final.
- Permitir revisar filas importadas / omitidas.

#### Testing crítico
- CSV válido
- mapping
- preview
- filas inválidas
- valid_only
- trazabilidad por import_id

#### Entregable
Importación CSV guiada y segura.

---

## 14. Fase 9 · Reportes

### Objetivo
Permitir lectura resumida de evolución financiera.

### Épica 9.1 · Monthly summary

#### Tareas
- Implementar servicio de resumen mensual.
- Crear UI de resumen mensual.
- Mostrar ingresos, gastos, beneficio neto y top categorías.

### Épica 9.2 · Yearly summary

#### Tareas
- Implementar resumen anual si entra en MVP.
- Mostrar evolución agregada.

#### Testing
- coherencia con transacciones y filtros
- estado vacío sin datos

#### Entregable
Reportes básicos operativos.

---

## 15. Fase 10 · Hardening, UX y QA

### Objetivo
Pulir el MVP y reducir regresiones antes de considerarlo listo.

### Épica 10.1 · Estados de UI

#### Tareas
- Revisar loading states.
- Revisar empty states.
- Revisar error states.
- Revisar feedback de éxito.

### Épica 10.2 · Seguridad

#### Tareas
- Revisar ownership en todos los servicios.
- Verificar RLS.
- Probar acceso cruzado por ID.
- Revisar storage paths y acceso.

### Épica 10.3 · Testing y regresión

#### Tareas
- Ejecutar suite unitaria crítica.
- Ejecutar integration tests críticos.
- Ejecutar E2E mínimos.
- Corregir regresiones de dashboard, PDF y CSV.

### Épica 10.4 · Revisión funcional final

#### Tareas
- Revisar acceptance criteria por módulo.
- Revisar validación de formularios.
- Revisar consistencia con API contracts.
- Revisar coherencia con dashboard metrics.

#### Entregable
MVP funcional, revisado y endurecido.

---

## 16. Dependencias clave entre épicas

### Dependencias duras
- Auth antes de rutas privadas.
- Negocio actual antes de operaciones del dominio.
- Categorías y terceros antes de flujos financieros cómodos.
- Transactions e invoices antes del dashboard final.
- Documents antes de PDF flow.
- Imports antes de CSV flow.
- Dashboard metrics definidas antes del dashboard final.
- Validation y API contracts deben guiar implementación desde el inicio.

---

## 17. Definition of done mínima por tarea

Una tarea se considera realmente terminada cuando:

1. cumple el objetivo funcional definido,
2. respeta contratos y validaciones,
3. respeta ownership y negocio,
4. tiene feedback visual o respuesta clara,
5. no rompe dashboard/listados/reportes si impacta en datos,
6. tiene al menos verificación manual o test adecuado según criticidad.

---

## 18. Definition of done mínima por épica

Una épica se considera terminada cuando:

- sus tareas críticas están completadas,
- existe flujo usable de extremo a extremo,
- cumple acceptance criteria relevantes,
- los errores principales están controlados,
- no quedan bloqueos funcionales para la siguiente fase.

---

## 19. Board resumido tipo backlog

## Backlog principal

### Foundation
- [ ] Bootstrap proyecto
- [ ] Schema DB + RLS
- [ ] Auth helpers
- [ ] Layout base

### Core domain
- [ ] Perfil
- [ ] Negocio actual
- [ ] Categorías
- [ ] Terceros
- [ ] Transacciones
- [ ] Facturas

### Intelligence / assisted flows
- [ ] Dashboard
- [ ] PDF flow
- [ ] CSV import flow
- [ ] Reportes

### Hardening
- [ ] Testing crítico
- [ ] Seguridad
- [ ] Empty/loading/error states
- [ ] QA final

---

## 20. Recomendación de ejecución para Codex

Cuando Codex use este task board debe:

- avanzar por fases en el orden recomendado;
- no saltar a PDF o CSV sin tener sólido el core financiero;
- usar cada épica como unidad de entrega;
- revisar dependencias antes de implementar;
- completar primero lo necesario para un flujo usable antes de añadir refinamientos;
- comprobar siempre impacto en dashboard metrics cuando toque datos financieros.

---

## 21. Relación con otros documentos del kit

Este task board debe ejecutarse apoyándose en:

- `05-api-spec.md`
- `06-validation-schemas.md`
- `07-acceptance-criteria.md`
- `08-frontend-architecture.md`
- `09-backend-architecture.md`
- `10-testing-strategy.md`
- `11-dashboard-metrics.md`

---

## 22. Próximos documentos pendientes del kit

Para completar el kit todavía conviene crear:

- `13-content-seo.md`
- `14-env-and-integrations.md`
- `15-open-questions.md`
- `16-master-prompt.md`

---

## 23. Estado del documento

**Versión:** 1.0  
**Estado:** Borrador operativo  
**Basado en:** `08-frontend-architecture.md`, `09-backend-architecture.md`, `10-testing-strategy.md` y `11-dashboard-metrics.md`  
**Siguiente paso recomendado:** `13-content-seo.md` o `14-env-and-integrations.md`

## 24. Estado del proyecto

**MVP internal stable**

siguiente fase: **documentación de cierre + planificación post-MVP**

