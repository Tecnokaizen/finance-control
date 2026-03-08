# 05 · API Spec (Contracts)

## 1. Propósito del documento

Este documento define los contratos de API del MVP para la app de control financiero. Su función es establecer una interfaz clara entre frontend y backend para que Codex pueda implementar server actions, endpoints, servicios y validaciones con una base consistente.

El objetivo es evitar ambigüedades en:

- payloads de entrada,
- respuestas esperadas,
- errores,
- validaciones,
- filtros,
- paginación,
- flujos asistidos por archivos,
- consistencia entre UI y persistencia.

---

## 2. Principios de diseño de contratos

1. Contratos simples y predecibles.
2. Nombres consistentes con el modelo de datos.
3. Respuestas homogéneas entre recursos.
4. Soporte para validaciones claras.
5. Compatibilidad con Server Actions, Route Handlers o REST clásico.
6. Preparado para evolucionar sin romper frontend.
7. Separación entre datos fuente, datos sugeridos y datos confirmados.

---

## 3. Convenciones generales

### Base conceptual
Aunque la implementación pueda hacerse con:
- Next.js Server Actions,
- Route Handlers,
- Supabase client,
- tRPC,
- o API REST,

este documento usará una **convención REST-like neutral** para describir contratos.

### Base path sugerido
```text
/api/v1
```

### Formato de datos
- JSON para operaciones estándar.
- `multipart/form-data` para subida de archivos.

### Formato de fechas
- `YYYY-MM-DD` para fechas puras.
- ISO 8601 para timestamps.

### Moneda
- Código ISO de moneda, por ejemplo: `EUR`, `USD`.

### Importes
- En requests y responses se enviarán como número decimal.
- En backend se almacenarán en `numeric(12,2)`.

---

## 4. Estructura estándar de respuesta

### Respuesta de éxito simple
```json
{
  "success": true,
  "data": {}
}
```

### Respuesta con metadatos
```json
{
  "success": true,
  "data": [],
  "meta": {
    "page": 1,
    "pageSize": 20,
    "total": 125,
    "totalPages": 7
  }
}
```

### Respuesta de error
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Hay campos inválidos en la solicitud.",
    "details": {
      "amount": ["El importe debe ser mayor que 0"]
    }
  }
}
```

---

## 5. Códigos de error recomendados

### Genéricos
- `UNAUTHORIZED`
- `FORBIDDEN`
- `NOT_FOUND`
- `VALIDATION_ERROR`
- `CONFLICT`
- `BAD_REQUEST`
- `UNPROCESSABLE_FILE`
- `INTERNAL_ERROR`

### Dominio financiero
- `INVALID_TRANSACTION_TYPE`
- `INVALID_CATEGORY_FOR_TYPE`
- `INVOICE_ALREADY_EXISTS`
- `CATEGORY_REQUIRED`
- `THIRD_PARTY_NOT_FOUND`
- `BUSINESS_NOT_FOUND`

### Importación y parseo
- `INVALID_CSV_STRUCTURE`
- `CSV_MAPPING_REQUIRED`
- `CSV_VALIDATION_FAILED`
- `PDF_PARSE_FAILED`
- `PDF_PREVIEW_FAILED`
- `FILE_TOO_LARGE`
- `UNSUPPORTED_FILE_TYPE`

---

## 6. Recursos principales

Los recursos del MVP son:

- auth
- profile
- businesses
- dashboard
- categories
- third-parties
- transactions
- invoices
- documents
- parsed-document-data
- imports
- import-rows
- reports

---

## 7. Auth contracts

### 7.1 Register
**POST** `/api/v1/auth/register`

#### Request
```json
{
  "fullName": "Rubén Calvo",
  "email": "ruben@example.com",
  "password": "********"
}
```

#### Success response
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "ruben@example.com"
    },
    "profile": {
      "fullName": "Rubén Calvo",
      "defaultCurrency": "EUR",
      "timezone": "Europe/Madrid"
    }
  }
}
```

#### Validaciones
- email obligatorio y válido
- password obligatoria con mínimo configurable
- fullName opcional u obligatorio según decisión final

---

### 7.2 Login
**POST** `/api/v1/auth/login`

#### Request
```json
{
  "email": "ruben@example.com",
  "password": "********"
}
```

#### Success response
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "ruben@example.com"
    }
  }
}
```

---

### 7.3 Logout
**POST** `/api/v1/auth/logout`

#### Success response
```json
{
  "success": true,
  "data": {
    "loggedOut": true
  }
}
```

---

## 8. Profile contracts

### 8.1 Get current profile
**GET** `/api/v1/profile`

#### Response
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "userId": "uuid",
    "fullName": "Rubén Calvo",
    "avatarUrl": null,
    "locale": "es",
    "defaultCurrency": "EUR",
    "timezone": "Europe/Madrid",
    "createdAt": "2026-03-07T10:00:00.000Z",
    "updatedAt": "2026-03-07T10:00:00.000Z"
  }
}
```

### 8.2 Update profile
**PATCH** `/api/v1/profile`

#### Request
```json
{
  "fullName": "Rubén Calvo",
  "locale": "es",
  "defaultCurrency": "EUR",
  "timezone": "Europe/Madrid"
}
```

---

## 9. Business contracts

### 9.1 Get current business
**GET** `/api/v1/businesses/current`

#### Response
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Mi Negocio",
    "legalName": null,
    "taxId": null,
    "defaultCurrency": "EUR",
    "country": "ES"
  }
}
```

### 9.2 Update current business
**PATCH** `/api/v1/businesses/current`

#### Request
```json
{
  "name": "Tecnokaizen",
  "legalName": "Tecnokaizen LLC",
  "taxId": "",
  "defaultCurrency": "EUR",
  "country": "ES"
}
```

---

## 10. Dashboard contracts

### 10.1 Get dashboard summary
**GET** `/api/v1/dashboard?from=2026-03-01&to=2026-03-31`

#### Response
```json
{
  "success": true,
  "data": {
    "kpis": {
      "totalIncome": 12500.00,
      "totalExpense": 4200.00,
      "netProfit": 8300.00,
      "pendingInvoicesCount": 4,
      "pendingInvoicesAmount": 2900.00
    },
    "latestTransactions": [
      {
        "id": "uuid",
        "type": "income",
        "transactionDate": "2026-03-05",
        "amount": 1200.00,
        "currency": "EUR",
        "category": {
          "id": "uuid",
          "name": "Servicios"
        },
        "thirdParty": {
          "id": "uuid",
          "name": "Cliente A"
        },
        "status": "confirmed"
      }
    ],
    "expenseByCategory": [
      {
        "categoryId": "uuid",
        "categoryName": "Software",
        "total": 300.00
      }
    ],
    "incomeVsExpenseSeries": [
      {
        "date": "2026-03-01",
        "income": 500.00,
        "expense": 120.00
      }
    ]
  }
}
```

#### Notas
- Este endpoint es agregado.
- Debe devolver estructura estable aunque no haya datos.

---

## 11. Category contracts

### 11.1 List categories
**GET** `/api/v1/categories?type=expense&active=true`

#### Response
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "businessId": "uuid",
      "name": "Software",
      "slug": "software",
      "type": "expense",
      "parentId": null,
      "color": null,
      "icon": null,
      "isActive": true,
      "sortOrder": null,
      "createdAt": "2026-03-07T10:00:00.000Z",
      "updatedAt": "2026-03-07T10:00:00.000Z"
    }
  ]
}
```

### 11.2 Create category
**POST** `/api/v1/categories`

#### Request
```json
{
  "name": "Publicidad",
  "slug": "publicidad",
  "type": "expense",
  "parentId": null,
  "color": null,
  "icon": null,
  "sortOrder": 10
}
```

### 11.3 Update category
**PATCH** `/api/v1/categories/{id}`

### 11.4 Delete category
**DELETE** `/api/v1/categories/{id}`

#### Regla
- si la categoría está en uso, puede bloquearse el borrado o convertirse en archivado lógico

---

## 12. Third-party contracts

### 12.1 List third parties
**GET** `/api/v1/third-parties?type=supplier&search=stripe`

#### Response
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "businessId": "uuid",
      "type": "supplier",
      "name": "Stripe",
      "email": null,
      "phone": null,
      "taxId": null,
      "notes": null,
      "isActive": true
    }
  ]
}
```

### 12.2 Create third party
**POST** `/api/v1/third-parties`

#### Request
```json
{
  "type": "client",
  "name": "Cliente A",
  "legalName": null,
  "email": "cliente@example.com",
  "phone": null,
  "taxId": null,
  "address": null,
  "notes": null
}
```

### 12.3 Update third party
**PATCH** `/api/v1/third-parties/{id}`

### 12.4 Delete third party
**DELETE** `/api/v1/third-parties/{id}`

---

## 13. Transaction contracts

### 13.1 Transaction resource shape

```json
{
  "id": "uuid",
  "businessId": "uuid",
  "userId": "uuid",
  "type": "income",
  "source": "manual",
  "status": "confirmed",
  "transactionDate": "2026-03-07",
  "amount": 1500.00,
  "currency": "EUR",
  "description": "Diseño web",
  "notes": "Pago por proyecto",
  "categoryId": "uuid",
  "subcategoryId": null,
  "thirdPartyId": "uuid",
  "paymentMethod": "bank_transfer",
  "reference": "FAC-2026-001",
  "isRecurring": false,
  "invoiceId": null,
  "documentId": null,
  "importId": null,
  "createdAt": "2026-03-07T10:00:00.000Z",
  "updatedAt": "2026-03-07T10:00:00.000Z"
}
```

### 13.2 List transactions
**GET** `/api/v1/transactions?page=1&pageSize=20&type=expense&status=confirmed&from=2026-03-01&to=2026-03-31&categoryId=uuid&thirdPartyId=uuid&search=hosting`

#### Response
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "type": "expense",
      "source": "manual",
      "status": "confirmed",
      "transactionDate": "2026-03-04",
      "amount": 59.00,
      "currency": "EUR",
      "description": "Mantenimiento hosting",
      "category": {
        "id": "uuid",
        "name": "Software"
      },
      "thirdParty": {
        "id": "uuid",
        "name": "Raiola"
      },
      "paymentMethod": "card",
      "reference": null,
      "documentId": null,
      "invoiceId": null,
      "importId": null,
      "createdAt": "2026-03-07T10:00:00.000Z"
    }
  ],
  "meta": {
    "page": 1,
    "pageSize": 20,
    "total": 1,
    "totalPages": 1
  }
}
```

### 13.3 Get transaction by id
**GET** `/api/v1/transactions/{id}`

### 13.4 Create transaction
**POST** `/api/v1/transactions`

#### Request
```json
{
  "type": "income",
  "source": "manual",
  "status": "confirmed",
  "transactionDate": "2026-03-07",
  "amount": 1500.00,
  "currency": "EUR",
  "description": "Desarrollo WordPress",
  "notes": "Proyecto cliente X",
  "categoryId": "uuid",
  "subcategoryId": null,
  "thirdPartyId": "uuid",
  "paymentMethod": "bank_transfer",
  "reference": "PROY-001",
  "isRecurring": false,
  "invoiceId": null,
  "documentId": null,
  "importId": null
}
```

#### Validaciones clave
- `type` obligatorio: `income | expense`
- `transactionDate` obligatoria
- `amount > 0`
- `categoryId` obligatoria si `status = confirmed`
- la categoría debe corresponder al mismo `type`

### 13.5 Update transaction
**PATCH** `/api/v1/transactions/{id}`

### 13.6 Delete transaction
**DELETE** `/api/v1/transactions/{id}`

#### Response
```json
{
  "success": true,
  "data": {
    "deleted": true,
    "id": "uuid"
  }
}
```

---

## 14. Invoice contracts

### 14.1 Invoice resource shape
```json
{
  "id": "uuid",
  "businessId": "uuid",
  "userId": "uuid",
  "type": "issued",
  "status": "pending",
  "invoiceNumber": "FAC-2026-001",
  "issueDate": "2026-03-01",
  "dueDate": "2026-03-15",
  "paidDate": null,
  "amountTotal": 1500.00,
  "currency": "EUR",
  "thirdPartyId": "uuid",
  "categoryId": null,
  "description": "Diseño web",
  "notes": null,
  "documentId": null,
  "importId": null,
  "createdAt": "2026-03-07T10:00:00.000Z",
  "updatedAt": "2026-03-07T10:00:00.000Z"
}
```

### 14.2 List invoices
**GET** `/api/v1/invoices?page=1&pageSize=20&type=issued&status=pending&from=2026-03-01&to=2026-03-31&thirdPartyId=uuid&search=FAC-2026`

### 14.3 Get invoice by id
**GET** `/api/v1/invoices/{id}`

### 14.4 Create invoice
**POST** `/api/v1/invoices`

#### Request
```json
{
  "type": "received",
  "status": "pending",
  "invoiceNumber": "REC-2026-004",
  "issueDate": "2026-03-06",
  "dueDate": "2026-03-20",
  "paidDate": null,
  "amountTotal": 89.99,
  "currency": "EUR",
  "thirdPartyId": "uuid",
  "categoryId": "uuid",
  "description": "Suscripción software",
  "notes": null,
  "documentId": null,
  "importId": null
}
```

#### Validaciones clave
- `type` obligatorio: `issued | received`
- `status` obligatorio
- `issueDate` obligatoria
- `amountTotal > 0`
- `invoiceNumber` puede requerir unicidad por negocio y tipo

### 14.5 Update invoice
**PATCH** `/api/v1/invoices/{id}`

### 14.6 Delete invoice
**DELETE** `/api/v1/invoices/{id}`

---

## 15. Document contracts

### 15.1 Upload PDF document
**POST** `/api/v1/documents/upload`

#### Content-Type
```text
multipart/form-data
```

#### Form fields
- `file`: archivo PDF
- `documentType`: `invoice_pdf | receipt_pdf | statement_pdf | generic_pdf`

#### Success response
```json
{
  "success": true,
  "data": {
    "document": {
      "id": "uuid",
      "fileName": "invoice-001.pdf",
      "originalFileName": "invoice-001.pdf",
      "mimeType": "application/pdf",
      "fileSize": 284331,
      "storagePath": "documents/uuid/invoice-001.pdf",
      "documentType": "invoice_pdf",
      "uploadStatus": "uploaded",
      "parseStatus": "pending",
      "previewImagePath": null,
      "uploadedAt": "2026-03-07T10:00:00.000Z"
    }
  }
}
```

#### Validaciones
- solo PDF en MVP
- límite de tamaño configurable

### 15.2 Get document by id
**GET** `/api/v1/documents/{id}`

### 15.3 Get document preview metadata
**GET** `/api/v1/documents/{id}/preview`

#### Response
```json
{
  "success": true,
  "data": {
    "documentId": "uuid",
    "previewAvailable": true,
    "previewImageUrl": "https://...",
    "mimeType": "application/pdf",
    "pages": 1
  }
}
```

### 15.4 Trigger document parse
**POST** `/api/v1/documents/{id}/parse`

#### Request
```json
{
  "mode": "standard"
}
```

#### Response
```json
{
  "success": true,
  "data": {
    "documentId": "uuid",
    "parseStatus": "processing"
  }
}
```

### 15.5 Get parsed document result
**GET** `/api/v1/documents/{id}/parsed-result`

#### Response
```json
{
  "success": true,
  "data": {
    "documentId": "uuid",
    "parseStatus": "parsed",
    "parsedData": {
      "id": "uuid",
      "suggestedType": "received_invoice",
      "suggestedDate": "2026-03-06",
      "suggestedAmount": 89.99,
      "suggestedCurrency": "EUR",
      "suggestedThirdPartyName": "Proveedor X",
      "suggestedInvoiceNumber": "A-2026-77",
      "confidenceScore": 82.5,
      "reviewStatus": "pending_review",
      "extractedJson": {
        "raw": {}
      }
    }
  }
}
```

### 15.6 Apply parsed document to final record
**POST** `/api/v1/documents/{id}/apply`

#### Request
```json
{
  "targetType": "invoice",
  "payload": {
    "type": "received",
    "status": "pending",
    "invoiceNumber": "A-2026-77",
    "issueDate": "2026-03-06",
    "dueDate": null,
    "amountTotal": 89.99,
    "currency": "EUR",
    "thirdPartyId": "uuid",
    "categoryId": "uuid",
    "description": "Factura proveedor",
    "notes": null,
    "documentId": "uuid"
  }
}
```

#### Reglas
- debe existir revisión previa del usuario en frontend
- `targetType` puede ser `transaction` o `invoice`
- el payload final debe ser editable y validado como si fuera un alta manual

---

## 16. CSV import contracts

### 16.1 Download CSV template
**GET** `/api/v1/imports/template?type=transactions_csv`

#### Response
- archivo CSV descargable
- o JSON con URL firmada según implementación

### 16.2 Upload CSV
**POST** `/api/v1/imports/upload`

#### Content-Type
```text
multipart/form-data
```

#### Form fields
- `file`: archivo CSV
- `importType`: `transactions_csv | invoices_csv | categories_csv | third_parties_csv`

#### Response
```json
{
  "success": true,
  "data": {
    "import": {
      "id": "uuid",
      "importType": "transactions_csv",
      "sourceFileName": "movimientos-marzo.csv",
      "status": "mapping_pending",
      "totalRows": 0,
      "validRows": 0,
      "invalidRows": 0
    },
    "detectedHeaders": ["tipo", "fecha", "importe", "categoria"]
  }
}
```

### 16.3 Save CSV mapping
**POST** `/api/v1/imports/{id}/mapping`

#### Request
```json
{
  "mapping": {
    "tipo": "type",
    "fecha": "transactionDate",
    "importe": "amount",
    "moneda": "currency",
    "categoria": "categoryName",
    "subcategoria": "subcategoryName",
    "tercero": "thirdPartyName",
    "metodo": "paymentMethod",
    "estado": "status",
    "notas": "notes",
    "referencia": "reference"
  }
}
```

#### Response
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "status": "validating",
    "mappingSaved": true
  }
}
```

### 16.4 Validate CSV import
**POST** `/api/v1/imports/{id}/validate`

#### Response
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "status": "validated",
    "totalRows": 120,
    "validRows": 112,
    "invalidRows": 8,
    "previewRows": [
      {
        "rowNumber": 1,
        "validationStatus": "valid",
        "normalizedData": {
          "type": "expense",
          "transactionDate": "2026-03-01",
          "amount": 59.00,
          "currency": "EUR",
          "categoryName": "Software"
        },
        "errors": []
      }
    ]
  }
}
```

### 16.5 Get import rows
**GET** `/api/v1/imports/{id}/rows?page=1&pageSize=50&status=invalid`

### 16.6 Execute import
**POST** `/api/v1/imports/{id}/execute`

#### Request
```json
{
  "mode": "valid_only"
}
```

#### Response
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "status": "partially_imported",
    "totalRows": 120,
    "validRows": 112,
    "invalidRows": 8,
    "importedRows": 112,
    "skippedRows": 8
  }
}
```

#### Modos sugeridos
- `valid_only`
- `all_or_nothing`

---

## 17. Reports contracts

### 17.1 Monthly summary
**GET** `/api/v1/reports/monthly-summary?year=2026&month=3`

#### Response
```json
{
  "success": true,
  "data": {
    "year": 2026,
    "month": 3,
    "totalIncome": 12500.00,
    "totalExpense": 4200.00,
    "netProfit": 8300.00,
    "topExpenseCategories": [
      {
        "categoryId": "uuid",
        "categoryName": "Software",
        "total": 600.00
      }
    ],
    "topIncomeCategories": [
      {
        "categoryId": "uuid",
        "categoryName": "Servicios",
        "total": 9200.00
      }
    ]
  }
}
```

### 17.2 Yearly summary
**GET** `/api/v1/reports/yearly-summary?year=2026`

---

## 18. Paginación, filtros y búsqueda

### Convención recomendada

#### Paginación
- `page`
- `pageSize`

#### Fechas
- `from`
- `to`

#### Filtro general
- `status`
- `type`
- `categoryId`
- `thirdPartyId`
- `search`

### Respuesta meta estándar
```json
{
  "meta": {
    "page": 1,
    "pageSize": 20,
    "total": 200,
    "totalPages": 10
  }
}
```

---

## 19. Validaciones transversales

### Transactions
- `amount > 0`
- `type` válido
- `status` válido
- `transactionDate` obligatoria
- categoría compatible con tipo

### Invoices
- `amountTotal > 0`
- `type` válido
- `status` válido
- `issueDate` obligatoria

### Documents
- archivo requerido
- mime type permitido
- tamaño permitido

### Imports
- mapping obligatorio antes de validar o ejecutar
- filas inválidas deben reportarse de forma clara

---

## 20. Idempotencia y consistencia

### Recomendaciones
- evitar dobles inserciones accidentales en importaciones y aplicación de parseos
- considerar `idempotencyKey` en operaciones sensibles si el flujo lo necesita
- no aplicar automáticamente parsed data sin confirmación explícita del usuario

---

## 21. Contratos internos recomendados para frontend

Además de contratos HTTP, Codex debería definir tipos compartidos.

### Ejemplos de tipos
- `TransactionDTO`
- `CreateTransactionInput`
- `UpdateTransactionInput`
- `InvoiceDTO`
- `CreateInvoiceInput`
- `UploadedDocumentDTO`
- `ParsedDocumentResultDTO`
- `ImportDTO`
- `ImportRowDTO`
- `DashboardSummaryDTO`
- `ApiErrorDTO`

---

## 22. Recomendación de naming en TypeScript

### Regla
- `DTO` para respuestas serializadas
- `Input` para payloads de entrada
- `Filters` para query params complejas
- `Result` para agregados y procesos

### Ejemplos
- `TransactionFilters`
- `ImportValidationResult`
- `ApplyParsedDocumentInput`

---

## 23. Instrucciones para Codex

Cuando Codex implemente este documento debe:

- mantener un contrato homogéneo en todas las respuestas;
- validar entrada antes de persistir;
- reutilizar esquemas de validación entre frontend y backend cuando sea posible;
- separar contratos de creación manual de contratos derivados de importación o parseo;
- contemplar estados intermedios en PDF y CSV;
- devolver errores utilizables por la UI, con `code`, `message` y `details`;
- evitar que el frontend dependa de estructuras inconsistentes entre endpoints.

---

## 24. Próximo documento recomendado

Después de este archivo, el siguiente más útil sería uno de estos:

- `06-validation-schemas.md` para definir Zod schemas y reglas exactas
- `06-frontend-architecture.md` para estructura de app, carpetas, módulos, hooks, tablas y formularios
- `06-rls-and-security.md` para bajar a detalle seguridad de Supabase

---

## 25. Estado del documento

**Versión:** 1.0  
**Estado:** Borrador operativo  
**Basado en:** `03-data-model.md` y `04-db-schema-sql.md`  
**Siguiente paso recomendado:** `06-validation-schemas.md`

