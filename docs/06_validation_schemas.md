# 06 · Validation Schemas

## 1. Propósito del documento

Este documento define las reglas de validación del MVP para la app de control financiero. Su objetivo es dejar claras las restricciones de datos que deben aplicarse en frontend, backend y contratos de API para evitar inconsistencias, errores de persistencia y comportamientos ambiguos.

Está pensado para que Codex pueda:

- crear schemas reutilizables,
- compartir validaciones entre cliente y servidor,
- validar formularios,
- validar payloads de API,
- validar importaciones CSV,
- validar resultados editables de parseo PDF,
- mapear errores de validación a mensajes útiles para la UI.

---

## 2. Validation vs Acceptance Criteria

Aunque están relacionadas, **no son lo mismo**.

### Validation
Responde a: **“¿los datos son válidos?”**

Ejemplos:
- el importe debe ser mayor que 0,
- el email debe tener formato válido,
- la fecha debe existir,
- un archivo debe ser PDF,
- una categoría de gasto no puede asignarse a un ingreso.

### Acceptance Criteria
Responde a: **“¿la funcionalidad cumple lo esperado?”**

Ejemplos:
- el usuario puede subir un PDF y ver su preview,
- el sistema muestra errores por fila en una importación,
- al crear un gasto, se actualiza el dashboard,
- el usuario puede corregir los datos sugeridos antes de guardar.

### Relación entre ambas
- **validation** controla integridad de datos;
- **acceptance criteria** controla comportamiento funcional y experiencia esperada.

---

## 3. Principios de validación

1. Validar lo antes posible.
2. Revalidar siempre en backend aunque exista validación en frontend.
3. Usar reglas compartidas cuando sea posible.
4. Mostrar errores claros y accionables.
5. Diferenciar errores bloqueantes de advertencias.
6. Mantener coherencia entre formularios manuales, parseos PDF e importaciones CSV.
7. No confiar en datos importados o parseados sin validación final.

---

## 4. Estrategia recomendada para Codex

### Librería sugerida
**Zod** para:
- formularios,
- server actions,
- route handlers,
- validación de contratos,
- tipado inferido en TypeScript.

### Enfoque recomendado
Crear tres capas de schema:

1. **Base schemas**  
   Campos reutilizables: UUID, dinero, fecha, moneda, email, etc.

2. **Domain schemas**  
   Transactions, invoices, categories, third parties, documents, imports.

3. **Flow schemas**  
   Upload PDF, apply parsed document, CSV mapping, CSV validation, filtros, paginación.

---

## 5. Reglas base reutilizables

### 5.1 UUID

#### Regla
- obligatorio cuando se referencia un registro existente
- debe tener formato UUID válido

#### Ejemplo Zod
```ts
import { z } from 'zod'

export const uuidSchema = z.string().uuid('ID inválido')
```

---

### 5.2 Moneda

#### Regla
- código ISO de 3 letras
- para MVP, idealmente restringido a un conjunto conocido si se desea

#### Ejemplo Zod
```ts
export const currencySchema = z
  .string()
  .trim()
  .length(3, 'La moneda debe tener 3 caracteres')
  .transform((v) => v.toUpperCase())
```
```

---

### 5.3 Fecha simple

#### Regla
- formato `YYYY-MM-DD`
- debe ser una fecha válida

#### Ejemplo Zod
```ts
export const dateStringSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'La fecha debe tener formato YYYY-MM-DD')
```
```

### Nota
La validación semántica de fecha real puede reforzarse en una capa auxiliar.

---

### 5.4 Importe monetario

#### Regla
- número positivo
- máximo 2 decimales en MVP

#### Ejemplo Zod
```ts
export const amountSchema = z
  .number({ invalid_type_error: 'El importe debe ser numérico' })
  .positive('El importe debe ser mayor que 0')
  .refine((value) => Number.isInteger(value * 100), {
    message: 'El importe debe tener como máximo 2 decimales'
  })
```
```

---

### 5.5 Texto corto opcional

```ts
export const optionalTextSchema = z
  .string()
  .trim()
  .max(255, 'Texto demasiado largo')
  .optional()
  .or(z.literal(''))
```
```

---

### 5.6 Texto largo opcional

```ts
export const optionalLongTextSchema = z
  .string()
  .trim()
  .max(5000, 'Texto demasiado largo')
  .optional()
  .or(z.literal(''))
```
```

---

## 6. Enums de dominio recomendados

```ts
export const transactionTypeSchema = z.enum(['income', 'expense'])
export const transactionSourceSchema = z.enum(['manual', 'csv_import', 'pdf_parse', 'invoice_sync', 'recurring', 'api'])
export const transactionStatusSchema = z.enum(['draft', 'pending', 'confirmed', 'cancelled'])

export const invoiceTypeSchema = z.enum(['issued', 'received'])
export const invoiceStatusSchema = z.enum(['draft', 'pending', 'paid', 'overdue', 'cancelled'])

export const categoryTypeSchema = z.enum(['income', 'expense'])
export const thirdPartyTypeSchema = z.enum(['client', 'supplier', 'both'])

export const documentTypeSchema = z.enum(['invoice_pdf', 'receipt_pdf', 'statement_pdf', 'generic_pdf'])
export const parseStatusSchema = z.enum(['pending', 'processing', 'parsed', 'partial', 'failed', 'skipped'])

export const parsedReviewStatusSchema = z.enum(['pending_review', 'reviewed', 'rejected', 'applied'])

export const importTypeSchema = z.enum(['transactions_csv', 'invoices_csv', 'categories_csv', 'third_parties_csv'])
export const importStatusSchema = z.enum(['uploaded', 'mapping_pending', 'validating', 'validated', 'partially_imported', 'imported', 'failed', 'cancelled'])
export const importRowStatusSchema = z.enum(['pending', 'valid', 'warning', 'invalid', 'imported', 'skipped'])
```

---

## 7. Profile validation

### Schema recomendado
```ts
export const updateProfileSchema = z.object({
  fullName: z.string().trim().min(2, 'El nombre es demasiado corto').max(120, 'El nombre es demasiado largo').optional(),
  locale: z.string().trim().min(2).max(10).optional(),
  defaultCurrency: currencySchema.optional(),
  timezone: z.string().trim().min(2).max(100).optional()
})
```
```

### Reglas
- `fullName` no vacío si se informa
- `defaultCurrency` en formato válido
- `timezone` debe validarse contra lista conocida si se quiere endurecer

---

## 8. Business validation

```ts
export const updateBusinessSchema = z.object({
  name: z.string().trim().min(2, 'El nombre del negocio es obligatorio').max(150, 'Nombre demasiado largo'),
  legalName: z.string().trim().max(150).optional().or(z.literal('')),
  taxId: z.string().trim().max(50).optional().or(z.literal('')),
  defaultCurrency: currencySchema,
  country: z.string().trim().min(2).max(2).transform((v) => v.toUpperCase()).optional().or(z.literal(''))
})
```
```

---

## 9. Category validation

### Create / update category
```ts
export const categorySchema = z.object({
  name: z.string().trim().min(2, 'El nombre es obligatorio').max(100, 'Nombre demasiado largo'),
  slug: z.string().trim().min(2, 'El slug es obligatorio').max(120, 'Slug demasiado largo')
    .regex(/^[a-z0-9-]+$/, 'El slug solo puede contener minúsculas, números y guiones'),
  type: categoryTypeSchema,
  parentId: uuidSchema.optional().nullable(),
  color: z.string().trim().max(30).optional().nullable(),
  icon: z.string().trim().max(50).optional().nullable(),
  sortOrder: z.number().int().optional().nullable()
})
```
```

### Reglas adicionales
- `slug` único por negocio en backend
- `parentId` debe pertenecer al mismo negocio
- si `parentId` existe, idealmente debe tener el mismo `type`

---

## 10. Third party validation

```ts
export const thirdPartySchema = z.object({
  type: thirdPartyTypeSchema,
  name: z.string().trim().min(2, 'El nombre es obligatorio').max(150, 'Nombre demasiado largo'),
  legalName: z.string().trim().max(150).optional().or(z.literal('')),
  email: z.string().trim().email('Email inválido').optional().or(z.literal('')),
  phone: z.string().trim().max(50).optional().or(z.literal('')),
  taxId: z.string().trim().max(50).optional().or(z.literal('')),
  address: z.string().trim().max(255).optional().or(z.literal('')),
  notes: optionalLongTextSchema
})
```
```

### Regla práctica
- email puede ser opcional, pero si existe debe ser válido

---

## 11. Transaction validation

### Base transaction schema
```ts
export const baseTransactionSchema = z.object({
  type: transactionTypeSchema,
  source: transactionSourceSchema.default('manual'),
  status: transactionStatusSchema.default('confirmed'),
  transactionDate: dateStringSchema,
  amount: amountSchema,
  currency: currencySchema.default('EUR'),
  description: z.string().trim().max(255).optional().or(z.literal('')),
  notes: optionalLongTextSchema,
  categoryId: uuidSchema.optional().nullable(),
  subcategoryId: uuidSchema.optional().nullable(),
  thirdPartyId: uuidSchema.optional().nullable(),
  paymentMethod: z.enum(['bank_transfer', 'cash', 'card', 'stripe', 'paypal', 'bizum', 'direct_debit', 'other']).optional().nullable(),
  reference: z.string().trim().max(120).optional().or(z.literal('')),
  isRecurring: z.boolean().default(false),
  invoiceId: uuidSchema.optional().nullable(),
  documentId: uuidSchema.optional().nullable(),
  importId: uuidSchema.optional().nullable()
})
.superRefine((data, ctx) => {
  if (data.status === 'confirmed' && !data.categoryId) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['categoryId'],
      message: 'La categoría es obligatoria cuando la transacción está confirmada'
    })
  }
})
```
```

### Create transaction
```ts
export const createTransactionSchema = baseTransactionSchema
```
```

### Update transaction
```ts
export const updateTransactionSchema = baseTransactionSchema.partial()
```
```

### Reglas adicionales de backend
- la categoría debe pertenecer al mismo negocio
- la categoría debe ser compatible con `type`
- la subcategoría debe pertenecer a la categoría o al menos al mismo árbol lógico
- `thirdPartyId`, `invoiceId`, `documentId`, `importId` deben pertenecer al mismo negocio

---

## 12. Invoice validation

```ts
export const baseInvoiceSchema = z.object({
  type: invoiceTypeSchema,
  status: invoiceStatusSchema.default('draft'),
  invoiceNumber: z.string().trim().max(120).optional().or(z.literal('')),
  issueDate: dateStringSchema,
  dueDate: dateStringSchema.optional().nullable(),
  paidDate: dateStringSchema.optional().nullable(),
  amountTotal: amountSchema,
  currency: currencySchema.default('EUR'),
  thirdPartyId: uuidSchema.optional().nullable(),
  categoryId: uuidSchema.optional().nullable(),
  description: z.string().trim().max(255).optional().or(z.literal('')),
  notes: optionalLongTextSchema,
  documentId: uuidSchema.optional().nullable(),
  importId: uuidSchema.optional().nullable()
})
.superRefine((data, ctx) => {
  if (data.dueDate && data.issueDate && data.dueDate < data.issueDate) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['dueDate'],
      message: 'La fecha de vencimiento no puede ser anterior a la fecha de emisión'
    })
  }

  if (data.paidDate && data.issueDate && data.paidDate < data.issueDate) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['paidDate'],
      message: 'La fecha de pago no puede ser anterior a la fecha de emisión'
    })
  }
})
```
```

### Reglas adicionales de backend
- `invoiceNumber` puede requerir unicidad por negocio y tipo
- `thirdPartyId`, `categoryId`, `documentId`, `importId` deben pertenecer al mismo negocio

---

## 13. Document upload validation

### Upload PDF
```ts
export const uploadDocumentSchema = z.object({
  documentType: documentTypeSchema.default('generic_pdf')
})
```
```

### Validación del archivo
Estas comprobaciones normalmente no viven enteras en Zod, sino en lógica de servidor:

- archivo obligatorio
- MIME type permitido: `application/pdf`
- tamaño máximo configurable, por ejemplo 10 MB o 20 MB
- nombre de archivo no vacío

### Reglas
- solo PDF en MVP
- si el archivo supera el tamaño máximo, devolver `FILE_TOO_LARGE`
- si no es PDF, devolver `UNSUPPORTED_FILE_TYPE`

---

## 14. Parsed document result validation

### Datos sugeridos desde parser
```ts
export const parsedDocumentSuggestionSchema = z.object({
  suggestedType: z.enum(['income', 'expense', 'issued_invoice', 'received_invoice']).optional().nullable(),
  suggestedDate: dateStringSchema.optional().nullable(),
  suggestedAmount: amountSchema.optional().nullable(),
  suggestedCurrency: currencySchema.optional().nullable(),
  suggestedThirdPartyName: z.string().trim().max(150).optional().nullable(),
  suggestedInvoiceNumber: z.string().trim().max(120).optional().nullable(),
  confidenceScore: z.number().min(0).max(100).optional().nullable(),
  extractedJson: z.record(z.any())
})
```
```

### Regla
- el resultado parseado no debe darse por válido como registro final sin edición/revisión humana en el MVP

---

## 15. Apply parsed document validation

### Caso 1: aplicar a transaction
```ts
export const applyParsedDocumentToTransactionSchema = z.object({
  targetType: z.literal('transaction'),
  payload: baseTransactionSchema
})
```
```

### Caso 2: aplicar a invoice
```ts
export const applyParsedDocumentToInvoiceSchema = z.object({
  targetType: z.literal('invoice'),
  payload: baseInvoiceSchema
})
```
```

### Unión discriminada
```ts
export const applyParsedDocumentSchema = z.discriminatedUnion('targetType', [
  applyParsedDocumentToTransactionSchema,
  applyParsedDocumentToInvoiceSchema
])
```
```

### Regla funcional importante
La UI debe permitir completar manualmente:
- categoría,
- subcategoría si procede,
- datos faltantes,
- correcciones de importe, fecha o tercero,
antes de confirmar.

---

## 16. CSV mapping validation

```ts
export const csvMappingSchema = z.object({
  mapping: z.record(z.string().min(1, 'El campo interno no puede estar vacío'))
})
```
```

### Reglas mínimas para `transactions_csv`
El mapeo debe cubrir al menos:
- `type`
- `transactionDate`
- `amount`

Y normalmente también:
- `currency`
- `categoryName` o `categoryId`

### Regla recomendada
Si no existe mapeo mínimo, devolver `CSV_MAPPING_REQUIRED`

---

## 17. CSV import row validation

### Normalized row para transactions
```ts
export const normalizedTransactionImportRowSchema = z.object({
  type: transactionTypeSchema,
  transactionDate: dateStringSchema,
  amount: amountSchema,
  currency: currencySchema.optional().default('EUR'),
  categoryName: z.string().trim().min(1).max(100).optional(),
  subcategoryName: z.string().trim().max(100).optional().or(z.literal('')),
  thirdPartyName: z.string().trim().max(150).optional().or(z.literal('')),
  paymentMethod: z.enum(['bank_transfer', 'cash', 'card', 'stripe', 'paypal', 'bizum', 'direct_debit', 'other']).optional(),
  status: transactionStatusSchema.optional().default('confirmed'),
  notes: optionalLongTextSchema,
  reference: z.string().trim().max(120).optional().or(z.literal(''))
})
```
```

### Reglas
- `type`, `transactionDate`, `amount` son bloqueantes
- `categoryName` puede ser obligatoria si no se va a resolver luego con reglas adicionales
- los errores deben devolverse por fila y por campo

---

## 18. Import execution validation

```ts
export const executeImportSchema = z.object({
  mode: z.enum(['valid_only', 'all_or_nothing']).default('valid_only')
})
```
```

### Reglas
- no ejecutar si el import no ha pasado por mapping y validación
- si `all_or_nothing`, cualquier fila inválida debe bloquear la importación
- si `valid_only`, las válidas se importan y las inválidas se omiten

---

## 19. Filters validation

### Transaction filters
```ts
export const transactionFiltersSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  type: transactionTypeSchema.optional(),
  status: transactionStatusSchema.optional(),
  from: dateStringSchema.optional(),
  to: dateStringSchema.optional(),
  categoryId: uuidSchema.optional(),
  thirdPartyId: uuidSchema.optional(),
  search: z.string().trim().max(120).optional()
}).superRefine((data, ctx) => {
  if (data.from && data.to && data.to < data.from) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['to'],
      message: 'La fecha final no puede ser anterior a la fecha inicial'
    })
  }
})
```
```

### Invoice filters
Mismo enfoque, adaptando `type` y `status` a invoices.

---

## 20. Error shape recomendado para validación

```ts
export type ValidationErrorResponse = {
  success: false
  error: {
    code: 'VALIDATION_ERROR'
    message: string
    details?: Record<string, string[]>
  }
}
```
```

### Ejemplo
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Hay errores en el formulario.",
    "details": {
      "amount": ["El importe debe ser mayor que 0"],
      "transactionDate": ["La fecha debe tener formato YYYY-MM-DD"]
    }
  }
}
```

---

## 21. Advertencias vs errores bloqueantes

### Errores bloqueantes
Impiden guardar o importar.

Ejemplos:
- importe inválido,
- fecha inválida,
- tipo inexistente,
- archivo no soportado,
- categoría incompatible.

### Advertencias
No impiden necesariamente continuar.

Ejemplos:
- tercero no reconocido pero se puede crear después,
- categoría vacía si se decide dejar el registro en draft,
- confianza baja del parseo PDF.

### Regla útil para Codex
En CSV y PDF, conviene diferenciar:
- `errors`
- `warnings`

para una UX más controlada.

---

## 22. Validaciones cruzadas importantes

Estas no siempre se resuelven solo con Zod y a menudo requieren backend:

1. La categoría debe pertenecer al mismo negocio.
2. La categoría debe ser compatible con el tipo de transacción.
3. El tercero debe pertenecer al mismo negocio.
4. El `documentId` debe pertenecer al mismo negocio.
5. El `importId` debe pertenecer al mismo negocio.
6. Una factura no debe duplicarse si la regla de unicidad lo impide.
7. Un usuario no debe poder enviar IDs de recursos ajenos.

---

## 23. Organización de archivos sugerida

```text
/src/lib/validation/
  common.ts
  auth.ts
  profile.ts
  businesses.ts
  categories.ts
  third-parties.ts
  transactions.ts
  invoices.ts
  documents.ts
  imports.ts
  filters.ts
  errors.ts
```

### Recomendación
Separar:
- schemas de entrada,
- helpers de validación cruzada,
- transformadores,
- mensajes de error.

---

## 24. Instrucciones para Codex

Cuando Codex implemente validaciones debe:

- reutilizar schemas entre formularios y backend;
- no confiar en validación solo de frontend;
- centralizar mensajes de error importantes;
- aplicar `superRefine` cuando haya reglas cruzadas de campos;
- distinguir entre validación de estructura y validación de negocio;
- contemplar warnings en parseos PDF e importaciones CSV;
- hacer que los formularios derivados de PDFs sigan las mismas reglas que los formularios manuales.

---

## 25. Próximo documento recomendado

Después de este archivo, el siguiente más útil sería:

- `07-acceptance-criteria.md` si quieres separar formalmente los criterios de aceptación por módulo
- `07-frontend-architecture.md` si quieres pasar a estructura real de app
- `07-backend-architecture.md` si quieres definir services, repositories, actions y parsers

---

## 26. Estado del documento

**Versión:** 1.0  
**Estado:** Borrador operativo  
**Basado en:** `01-product-requirements.md`, `04-db-schema-sql.md` y `05-api-spec.md`  
**Siguiente paso recomendado:** `07-acceptance-criteria.md` o `07-frontend-architecture.md`

