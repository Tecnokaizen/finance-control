# 09 · Backend Architecture

## 1. Propósito del documento

Este documento define la arquitectura backend del MVP para la app de control financiero. Su objetivo es proporcionar a Codex una estructura clara para implementar autenticación, acceso a datos, lógica de negocio, validaciones, parseo de PDFs, importaciones CSV, seguridad y trazabilidad sin improvisar responsabilidades.

Debe servir como referencia para:

- organización del backend,
- separación por capas,
- servicios y acciones,
- acceso a datos,
- reglas de negocio,
- parseo de documentos,
- flujo de importaciones,
- seguridad y aislamiento,
- manejo de errores,
- evolución futura.

---

## 2. Objetivos de la arquitectura backend

La arquitectura debe permitir:

- construir el MVP con rapidez sin perder orden,
- mantener separadas validación, persistencia y lógica de negocio,
- reutilizar reglas entre acciones manuales y flujos asistidos,
- aplicar seguridad por usuario y negocio desde el inicio,
- facilitar testing,
- permitir crecimiento posterior sin rehacer la base.

---

## 3. Stack backend recomendado

### Recomendación principal
- **Next.js App Router**
- **Server Actions** para mutaciones simples de interfaz
- **Route Handlers** para endpoints explícitos, subidas de archivos o flujos multipaso
- **Supabase** para auth, base de datos y storage
- **PostgreSQL** como base persistente
- **Zod** para validación de inputs
- **Storage bucket** para PDFs y archivos CSV

### Uso recomendado de cada pieza
- **Supabase Auth**: autenticación y sesión
- **Supabase DB**: datos del dominio
- **Supabase Storage**: PDFs, previews y CSV subidos
- **Server Actions**: crear/editar registros desde formularios
- **Route Handlers**: upload, parse, importación, previews, descargas

---

## 4. Principios de arquitectura backend

1. Separar validación, lógica de negocio y persistencia.
2. No meter reglas complejas directamente en handlers o componentes.
3. Centralizar acceso a datos por dominio.
4. Tratar PDFs y CSV como flujos asistidos con estados intermedios.
5. Mantener trazabilidad de origen (`document_id`, `import_id`).
6. Aplicar aislamiento por usuario/negocio en todas las operaciones.
7. Evitar sobreingeniería innecesaria en el MVP.

---

## 5. Capas recomendadas

La arquitectura debe organizarse en capas simples:

### 5.1 Capa de entrada
Responsable de:
- recibir requests,
- leer sesión,
- validar input,
- devolver respuesta.

### 5.2 Capa de aplicación / servicios
Responsable de:
- coordinar casos de uso,
- aplicar reglas de negocio,
- orquestar repositorios,
- construir resultados.

### 5.3 Capa de acceso a datos
Responsable de:
- leer y escribir en DB,
- encapsular queries,
- evitar SQL mezclado en handlers.

### 5.4 Capa de infraestructura
Responsable de:
- Supabase client,
- storage,
- parseadores,
- utilidades de archivos,
- logging.

---

## 6. Patrón recomendado para el MVP

### Patrón práctico
No hace falta montar una arquitectura hexagonal completa. Para el MVP basta con un patrón tipo:

- `actions` / `route handlers`
- `services`
- `repositories`
- `schemas`
- `mappers`
- `types`

### Beneficio
- suficientemente limpio,
- fácil para Codex,
- fácil de escalar,
- poco ceremonial.

---

## 7. Estructura de carpetas sugerida

```text
src/
  app/
    api/
      v1/
        auth/
        profile/
        businesses/
        dashboard/
        categories/
        third-parties/
        transactions/
        invoices/
        documents/
        imports/
        reports/

  server/
    auth/
      get-session-user.ts
      require-auth.ts
      require-business.ts

    db/
      client.ts
      admin-client.ts

    services/
      dashboard/
        get-dashboard-summary.ts
      categories/
        create-category.ts
        update-category.ts
        delete-category.ts
        list-categories.ts
      third-parties/
        create-third-party.ts
        update-third-party.ts
        list-third-parties.ts
      transactions/
        create-transaction.ts
        update-transaction.ts
        delete-transaction.ts
        get-transaction.ts
        list-transactions.ts
      invoices/
        create-invoice.ts
        update-invoice.ts
        delete-invoice.ts
        get-invoice.ts
        list-invoices.ts
      documents/
        upload-document.ts
        generate-document-preview.ts
        parse-document.ts
        get-parsed-document-result.ts
        apply-parsed-document.ts
      imports/
        upload-import-file.ts
        detect-import-headers.ts
        save-import-mapping.ts
        validate-import.ts
        execute-import.ts
        list-import-rows.ts
      reports/
        get-monthly-summary.ts
        get-yearly-summary.ts

    repositories/
      businesses.repository.ts
      profiles.repository.ts
      categories.repository.ts
      third-parties.repository.ts
      transactions.repository.ts
      invoices.repository.ts
      documents.repository.ts
      parsed-document-data.repository.ts
      imports.repository.ts
      import-rows.repository.ts

    parsers/
      pdf/
        extract-text-from-pdf.ts
        parse-invoice-like-pdf.ts
        normalize-parsed-document.ts
      csv/
        parse-csv-file.ts
        normalize-csv-headers.ts
        validate-import-row.ts

    storage/
      upload-file.ts
      get-public-or-signed-url.ts
      delete-file.ts

    mappers/
      transaction.mapper.ts
      invoice.mapper.ts
      document.mapper.ts
      import.mapper.ts

    errors/
      app-error.ts
      error-codes.ts
      to-api-error-response.ts

    validation/
      ...schemas compartidos...

    types/
      service-result.ts
      repository.types.ts
      domain.types.ts
```

---

## 8. Responsabilidades por capa

### Handlers / actions
Deben:
- leer el input,
- validar con Zod,
- resolver usuario y negocio,
- llamar al servicio,
- devolver respuesta.

No deben:
- construir queries complejas directamente,
- mezclar lógica de negocio,
- parsear archivos en línea con demasiada lógica.

### Services
Deben:
- aplicar reglas del caso de uso,
- coordinar varios repositorios,
- validar relaciones entre entidades,
- decidir estados intermedios,
- construir resultados del dominio.

### Repositories
Deben:
- encapsular queries,
- aceptar filtros claros,
- devolver datos consistentes,
- no decidir reglas de negocio complejas.

---

## 9. Gestión de autenticación y autorización

### Recomendación
Toda operación protegida debe resolver:
1. usuario autenticado,
2. negocio actual permitido,
3. recurso perteneciente a ese negocio.

### Helpers recomendados
- `requireAuth()`
- `getSessionUser()`
- `requireBusiness()`
- `assertResourceBelongsToBusiness()`

### Regla
Nunca confiar solo en IDs enviados por el cliente.

---

## 10. Gestión del negocio actual

### Recomendación MVP
Usar un único negocio principal por usuario en primera fase.

### Cómo resolverlo
- al iniciar sesión, obtener el negocio principal;
- pasarlo a servicios;
- no dejar que el frontend lo elija arbitrariamente si aún no existe multiempresa real.

### Helper sugerido
`getCurrentBusinessForUser(userId)`

---

## 11. Patrón de respuesta de servicios

### Recomendación
Los servicios pueden devolver un objeto consistente.

```ts
export type ServiceResult<T> = {
  success: true
  data: T
} | {
  success: false
  error: {
    code: string
    message: string
    details?: Record<string, string[]>
  }
}
```

### Beneficio
- simplifica handlers,
- estandariza errores,
- ayuda a Codex a mantener consistencia.

---

## 12. Arquitectura por dominio

### 12.1 Transactions

#### Responsabilidades
- crear transacciones manuales,
- editar,
- eliminar,
- listar con filtros,
- obtener detalle,
- validar categoría compatible,
- enlazar con tercero, factura, documento o importación.

#### Servicio recomendado
- `createTransactionService(input, context)`
- `updateTransactionService(id, input, context)`
- `deleteTransactionService(id, context)`
- `listTransactionsService(filters, context)`

#### Reglas de negocio clave
- `amount > 0`
- categoría obligatoria al confirmar
- categoría del mismo negocio
- categoría compatible con `type`
- referencias enlazadas deben pertenecer al mismo negocio

---

### 12.2 Invoices

#### Responsabilidades
- crear y editar facturas,
- listar y filtrar,
- gestionar estados,
- vincular documento origen,
- preparar futura relación con transacciones.

#### Reglas clave
- tipo y estado válidos,
- fechas coherentes,
- amount positivo,
- unicidad de `invoiceNumber` cuando aplique,
- `thirdPartyId` y `documentId` del mismo negocio.

---

### 12.3 Categories

#### Responsabilidades
- crear,
- editar,
- listar,
- archivar o borrar.

#### Regla importante
No permitir inconsistencias de tipo entre categoría y transacción.

---

### 12.4 Third parties

#### Responsabilidades
- alta y edición de clientes/proveedores,
- reutilización en transacciones y facturas,
- filtros y búsqueda.

---

### 12.5 Dashboard y reports

#### Responsabilidades
- consultas agregadas,
- KPIs,
- series temporales,
- totales por categoría,
- últimas transacciones,
- resumen de facturas pendientes.

#### Recomendación
Estas lecturas deben ir en servicios de sólo lectura bien separados de mutaciones.

---

## 13. Arquitectura del flujo PDF

### Objetivo
Permitir subir PDF, almacenarlo, generar preview, extraer datos sugeridos, revisar y consolidar un registro final sin escribir datos erróneos directamente en tablas principales.

### Flujo backend recomendado
1. subir archivo al storage,
2. crear `documents`,
3. generar preview si aplica,
4. ejecutar extracción de texto,
5. normalizar sugerencias,
6. guardar `parsed_document_data`,
7. devolver resultado al frontend,
8. esperar confirmación humana,
9. crear `transaction` o `invoice`,
10. mantener vínculo con `document_id`.

### Servicios recomendados
- `uploadDocumentService`
- `generateDocumentPreviewService`
- `parseDocumentService`
- `getParsedDocumentResultService`
- `applyParsedDocumentService`

### Regla crítica
El parseo no debe insertar automáticamente una transacción o factura confirmada en el MVP.

---

## 14. Subcapa de parseo PDF

### Componentes recomendados
- extractor de texto,
- parser específico de facturas o recibos,
- normalizador de salida,
- calculador simple de confianza,
- mapper a DTO de UI.

### Estructura sugerida
```text
server/parsers/pdf/
  extract-text-from-pdf.ts
  parse-invoice-like-pdf.ts
  normalize-parsed-document.ts
  score-parsed-result.ts
```

### Estrategia MVP
Primera versión:
- extracción simple de texto,
- heurísticas básicas,
- sugerencias editables,
- sin depender de OCR complejo salvo futura evolución.

### Campos a intentar extraer
- fecha,
- importe,
- moneda,
- emisor/proveedor,
- número de factura o referencia,
- tipo sugerido.

---

## 15. Arquitectura del flujo CSV

### Objetivo
Permitir subir CSV, detectar cabeceras, guardar mapping, validar filas, mostrar preview y ejecutar importación con trazabilidad.

### Flujo backend recomendado
1. subir archivo CSV,
2. crear `imports`,
3. leer cabeceras,
4. devolver cabeceras detectadas,
5. guardar mapping,
6. parsear filas,
7. normalizar filas,
8. validar filas,
9. guardar `import_rows`,
10. devolver preview y errores,
11. ejecutar importación final,
12. crear registros finales enlazados a `import_id`.

### Servicios recomendados
- `uploadImportFileService`
- `detectImportHeadersService`
- `saveImportMappingService`
- `validateImportService`
- `executeImportService`
- `listImportRowsService`

### Regla crítica
No importar definitivamente sin pasar por validación y preview.

---

## 16. Subcapa de parseo CSV

### Componentes recomendados
```text
server/parsers/csv/
  parse-csv-file.ts
  normalize-csv-headers.ts
  normalize-csv-row.ts
  validate-import-row.ts
  map-row-to-transaction-input.ts
```

### Responsabilidades
- leer archivo,
- detectar cabeceras,
- limpiar strings,
- transformar tipos,
- validar por fila,
- separar errores y warnings.

### Regla útil
Los errores por fila deben ser serializables y comprensibles para la UI.

---

## 17. Repositories recomendados

### Ejemplo de repositorios por dominio
- `transactionsRepository`
- `invoicesRepository`
- `categoriesRepository`
- `thirdPartiesRepository`
- `documentsRepository`
- `parsedDocumentDataRepository`
- `importsRepository`
- `importRowsRepository`

### Qué deben hacer
- recibir argumentos claros,
- ocultar queries repetitivas,
- devolver entidades o DTOs internas,
- facilitar filtros y paginación.

### Qué no deben hacer
- lanzar decisiones de UX,
- decidir lógica de confirmación o validación de negocio compleja.

---

## 18. Mappers y normalizadores

### Recomendación
Usar mappers para evitar que frontend dependa del shape crudo de DB.

### Ejemplos
- `mapTransactionRowToDTO`
- `mapInvoiceRowToDTO`
- `mapParsedDocumentToResultDTO`
- `mapImportRowToPreviewDTO`

### Beneficio
- desacopla DB de API,
- facilita cambios internos,
- mantiene contratos estables.

---

## 19. Errores y manejo de excepciones

### Recomendación
Definir una jerarquía ligera de errores.

### Ejemplo
```ts
export class AppError extends Error {
  constructor(
    public code: string,
    public message: string,
    public details?: Record<string, string[]>,
    public status: number = 400
  ) {
    super(message)
  }
}
```

### Códigos útiles
- `UNAUTHORIZED`
- `FORBIDDEN`
- `NOT_FOUND`
- `VALIDATION_ERROR`
- `CONFLICT`
- `PDF_PARSE_FAILED`
- `INVALID_CSV_STRUCTURE`
- `CSV_VALIDATION_FAILED`
- `INTERNAL_ERROR`

### Regla
Todos los handlers deben convertir errores a una respuesta API consistente.

---

## 20. Seguridad y RLS

### Recomendación principal
La seguridad debe apoyarse en dos capas:

1. **RLS en base de datos**
2. **checks de negocio en servicios/backend**

### Regla crítica
No confiar solo en la UI ni solo en filtros del frontend.

### Qué validar siempre
- usuario autenticado,
- negocio permitido,
- recurso pertenece al negocio,
- IDs relacionados pertenecen al mismo contexto.

---

## 21. Storage strategy

### Buckets sugeridos
- `documents`
- `imports`
- `previews` opcional

### Reglas
- nombres o paths con UUID,
- evitar colisiones,
- guardar metadata básica,
- asociar cada archivo a `documents` o `imports`.

### Path sugerido
```text
businesses/{businessId}/documents/{documentId}/original.pdf
businesses/{businessId}/documents/{documentId}/preview.jpg
businesses/{businessId}/imports/{importId}/source.csv
```

---

## 22. Logging y observabilidad mínima

### Para MVP
Basta con logging estructurado sencillo en servidor para:
- errores de parseo,
- errores de importación,
- fallos de storage,
- conflictos de negocio,
- operaciones críticas.

### Recomendación
No registrar datos sensibles innecesarios.

### Eventos útiles
- documento subido,
- parseo iniciado,
- parseo completado,
- parseo fallido,
- importación validada,
- importación ejecutada,
- conflicto de unicidad.

---

## 23. Jobs y procesamiento asíncrono

### MVP realista
Si el parseo o preview son ligeros, puede resolverse síncronamente.

### Si el proceso crece
Conviene prepararlo para pasar a:
- colas,
- edge/background functions,
- workers.

### Regla
Diseñar servicios como si pudieran ejecutarse después de forma asíncrona, aunque al principio se llamen en línea.

---

## 24. Testing de backend

### Niveles recomendados
- tests de schemas/validación,
- tests de servicios,
- tests de repositorios clave si aplica,
- tests de flujos PDF y CSV sobre muestras pequeñas,
- tests de autorización.

### Prioridades altas
- `createTransactionService`
- `createInvoiceService`
- `applyParsedDocumentService`
- `validateImportService`
- `executeImportService`
- checks de acceso por negocio

---

## 25. Secuencia recomendada de implementación backend

Orden útil para construir:

1. auth helpers y resolución de negocio,
2. repositories base,
3. categories y third parties,
4. transactions,
5. invoices,
6. dashboard y reports,
7. documents upload + preview,
8. parseo PDF,
9. imports CSV,
10. endurecimiento de errores y tests.

---

## 26. Recomendaciones específicas para Codex

Cuando Codex implemente el backend debe:

- no mezclar queries complejas con handlers;
- crear servicios por caso de uso, no solo por tabla;
- reutilizar validaciones entre API y server actions;
- mantener consistencia de errores y respuestas;
- tratar PDF y CSV como flujos de varias fases;
- respetar siempre `business_id` y ownership;
- dejar el sistema preparado para crecer sin reescribir el núcleo.

---

## 27. Anti-patrones a evitar

Codex debe evitar:

- meter toda la lógica en `route.ts`;
- duplicar validación en muchos sitios sin centralización;
- insertar parseos PDF directamente como registros finales confirmados;
- importar CSV sin trazabilidad por fila;
- dejar queries sueltas repetidas por el código;
- asumir que el frontend controla correctamente permisos.

---

## 28. Próximo documento recomendado

Después de este archivo, el siguiente más útil sería:

- `10-testing-strategy.md`
- `10-ui-components-inventory.md`
- `10-implementation-roadmap.md`

---

## 29. Estado del documento

**Versión:** 1.0  
**Estado:** Borrador operativo  
**Basado en:** `04-db-schema-sql.md`, `05-api-spec.md`, `06-validation-schemas.md`, `07-acceptance-criteria.md` y `08-frontend-architecture.md`  
**Siguiente paso recomendado:** `10-testing-strategy.md`

