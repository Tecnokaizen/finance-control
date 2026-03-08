# 03 · Data Model

## 1. Propósito del documento

Este documento define el modelo de datos inicial de la app de control financiero. Su objetivo es establecer una estructura consistente y escalable para almacenar usuarios, movimientos financieros, facturas, categorías, terceros, importaciones y documentos.

Debe servir como referencia para:

- diseño de base de datos,
- implementación backend,
- validaciones de frontend,
- relaciones entre entidades,
- decisiones de arquitectura de producto,
- generación de esquemas por parte de Codex.

---

## 2. Principios del modelo de datos

1. Un usuario solo puede acceder a sus propios datos.
2. El modelo debe ser simple en el MVP, pero preparado para crecer.
3. Ingresos y gastos deben compartir una estructura base común.
4. Las facturas deben poder existir por sí solas o relacionarse con movimientos.
5. Los datos importados o parseados deben poder revisarse antes de consolidarse.
6. El sistema debe registrar trazabilidad básica.
7. El modelo debe permitir corrección manual tras importación o parseo.

---

## 3. Visión general de entidades

### Entidades principales
- users
- businesses
- profiles
- financial_accounts
- categories
- third_parties
- transactions
- invoices
- documents
- imports
- import_rows
- parsed_document_data
- tags (opcional futuro)

### Entidades auxiliares o futuras
- recurring_rules
- audit_logs
- invoice_transaction_links
- exchange_rates
- report_snapshots

---

## 4. Enfoque arquitectónico recomendado

Para el MVP, se recomienda una estructura multi-tenant simple por usuario.

### Recomendación base
- Un `user` autenticado.
- Un `profile` con datos visibles del usuario.
- Un `business` principal por usuario en la primera versión.
- Todos los registros principales cuelgan de `business_id` y/o `user_id`.

### Decisión recomendada para MVP
Aunque el sistema pueda evolucionar a multiempresa, conviene diseñar desde el inicio con una tabla `businesses` para no bloquear crecimiento futuro.

---

## 5. Entidad: users

### Descripción
Entidad de autenticación gestionada por el sistema de auth elegido.

### Fuente
Normalmente provista por Supabase Auth o sistema equivalente.

### Campos esperados
- id
- email
- created_at
- updated_at
- last_sign_in_at

### Notas
- Esta tabla puede ser externa al modelo app si la gestiona el proveedor auth.
- El resto del sistema se relaciona con `users.id`.

---

## 6. Entidad: profiles

### Descripción
Información de perfil del usuario dentro de la aplicación.

### Campos
- id
- user_id
- full_name
- avatar_url opcional
- locale opcional
- default_currency
- timezone
- created_at
- updated_at

### Reglas
- Relación 1:1 con `users`.
- `default_currency` debe tener valor por defecto.
- `timezone` debe inicializarse si es posible.

---

## 7. Entidad: businesses

### Descripción
Representa el negocio o unidad financiera sobre la que se registran datos.

### Campos
- id
- user_id
- name
- legal_name opcional
- tax_id opcional
- default_currency
- country opcional
- created_at
- updated_at

### Reglas
- Un usuario puede tener un negocio en MVP, pero el modelo permite varios en futuro.
- Todos los registros principales deben asociarse a `business_id`.

### Razón de diseño
Esto facilita evolucionar a multiempresa sin refactor agresivo.

---

## 8. Entidad: financial_accounts

### Descripción
Cuenta financiera conceptual para organizar movimientos.

### Uso en MVP
Opcional, pero recomendable si se quiere distinguir caja, banco, Stripe, PayPal u otras fuentes.

### Campos
- id
- business_id
- name
- type
- currency
- is_active
- notes opcional
- created_at
- updated_at

### Valores sugeridos para `type`
- cash
- bank
- card
- stripe
- paypal
- wallet
- other

### Notas
Si se quiere simplificar al máximo, esta entidad puede implementarse desde fase 1.1 en vez de la 1.0.

---

## 9. Entidad: categories

### Descripción
Clasificación reutilizable para ingresos y gastos.

### Campos
- id
- business_id
- name
- slug
- type
- parent_id opcional
- color opcional
- icon opcional
- is_active
- sort_order opcional
- created_at
- updated_at

### Valores de `type`
- income
- expense

### Reglas
- Una categoría pertenece a un solo negocio.
- `parent_id` permite subcategorías.
- No se puede usar una categoría de tipo `expense` en una transacción `income`.
- `slug` debe tender a unicidad por negocio.

### Relación
- 1 categoría puede tener muchas transacciones.
- 1 categoría puede tener muchas subcategorías.

---

## 10. Entidad: third_parties

### Descripción
Terceros asociados a movimientos y facturas.

### Campos
- id
- business_id
- type
- name
- legal_name opcional
- email opcional
- phone opcional
- tax_id opcional
- address opcional
- notes opcional
- is_active
- created_at
- updated_at

### Valores de `type`
- client
- supplier
- both

### Reglas
- Deben poder reutilizarse en formularios.
- Un tercero puede estar vinculado a múltiples transacciones y facturas.

---

## 11. Entidad central: transactions

### Descripción
Tabla base para todos los movimientos financieros, tanto ingresos como gastos.

### Decisión de modelado
Se recomienda una sola tabla `transactions` con un campo `type` para diferenciar ingreso y gasto.

### Razones
- Simplifica reporting.
- Simplifica listados agregados.
- Reduce duplicación estructural.
- Facilita importaciones CSV y parseo de PDFs.

### Campos
- id
- business_id
- user_id
- type
- source
- status
- transaction_date
- amount
- currency
- description opcional
- notes opcional
- category_id
- subcategory_id opcional
- third_party_id opcional
- financial_account_id opcional
- payment_method opcional
- reference opcional
- is_recurring
- invoice_id opcional
- document_id opcional
- import_id opcional
- created_at
- updated_at

### Valores de `type`
- income
- expense

### Valores sugeridos de `source`
- manual
- csv_import
- pdf_parse
- invoice_sync
- recurring
- api

### Valores sugeridos de `status`
- draft
- pending
- confirmed
- cancelled

### Valores sugeridos de `payment_method`
- bank_transfer
- cash
- card
- stripe
- paypal
- bizum
- direct_debit
- other

### Reglas
- `amount` siempre positivo.
- El signo contable se interpreta por `type`.
- `transaction_date` es obligatoria.
- `category_id` es obligatoria en registros consolidados.
- Un registro creado desde PDF o CSV puede entrar como `draft` hasta revisión.
- `invoice_id` permite relacionar el movimiento con una factura.
- `document_id` permite enlazar archivo origen.

### Relación
- Muchas transacciones pertenecen a un negocio.
- Muchas transacciones pueden referenciar un tercero.
- Muchas transacciones pueden venir de una importación.
- Muchas transacciones pueden derivarse de un documento parseado.

---

## 12. Entidad: invoices

### Descripción
Registro de facturas emitidas o recibidas.

### Campos
- id
- business_id
- user_id
- type
- status
- invoice_number
- issue_date
- due_date opcional
- paid_date opcional
- amount_total
- currency
- third_party_id opcional
- category_id opcional
- description opcional
- notes opcional
- document_id opcional
- import_id opcional
- created_at
- updated_at

### Valores de `type`
- issued
- received

### Valores de `status`
- draft
- pending
- paid
- overdue
- cancelled

### Reglas
- `amount_total` debe ser positivo.
- `issue_date` obligatoria.
- `invoice_number` recomendable como único por negocio y tipo cuando sea posible.
- `overdue` puede calcularse o persistirse según la implementación.
- Una factura puede existir sin transacción asociada inicialmente.

### Relación con transacciones
Hay dos enfoques válidos:

#### Opción A: enlace directo desde `transactions.invoice_id`
Más simple para MVP.

#### Opción B: tabla intermedia `invoice_transaction_links`
Mejor para escenarios donde una factura se paga en varios movimientos.

### Recomendación
Para MVP, empezar con **Opción A**. Si más adelante se necesita pago fraccionado, evolucionar a tabla intermedia.

---

## 13. Entidad: documents

### Descripción
Archivo fuente subido por el usuario, especialmente PDFs.

### Campos
- id
- business_id
- user_id
- file_name
- original_file_name
- mime_type
- file_size
- storage_path
- file_hash opcional
- document_type
- preview_image_path opcional
- upload_status
- parse_status
- uploaded_at
- created_at
- updated_at

### Valores sugeridos de `document_type`
- invoice_pdf
- receipt_pdf
- statement_pdf
- generic_pdf
- image
- other

### Valores sugeridos de `upload_status`
- uploaded
- failed
- deleted

### Valores sugeridos de `parse_status`
- pending
- processing
- parsed
- partial
- failed
- skipped

### Reglas
- Un documento puede existir aunque no se haya parseado correctamente.
- Debe mantenerse para vista previa y revisión manual.
- `storage_path` debe ser obligatorio.

---

## 14. Entidad: parsed_document_data

### Descripción
Resultado estructurado del parseo de un documento antes de consolidarlo.

### Función
Permite separar:
- archivo original,
- extracción automática,
- confirmación final del usuario.

### Campos
- id
- document_id
- business_id
- parser_version opcional
- raw_text opcional
- extracted_json
- suggested_type opcional
- suggested_date opcional
- suggested_amount opcional
- suggested_currency opcional
- suggested_third_party_name opcional
- suggested_invoice_number opcional
- confidence_score opcional
- review_status
- reviewed_by opcional
- reviewed_at opcional
- created_at
- updated_at

### Valores sugeridos de `review_status`
- pending_review
- reviewed
- rejected
- applied

### Reglas
- `extracted_json` guarda salida estructurada del parser.
- Los campos sugeridos son una normalización mínima para frontend.
- La consolidación final en `transactions` o `invoices` no debe ser automática sin revisión del usuario en el MVP.

---

## 15. Entidad: imports

### Descripción
Cabecera de cada proceso de importación CSV.

### Campos
- id
- business_id
- user_id
- import_type
- source_file_name
- source_file_path opcional
- template_version opcional
- total_rows
- valid_rows
- invalid_rows
- status
- mapping_json
- summary_json opcional
- created_at
- updated_at

### Valores sugeridos de `import_type`
- transactions_csv
- invoices_csv
- categories_csv
- third_parties_csv

### Valores sugeridos de `status`
- uploaded
- mapping_pending
- validating
- validated
- partially_imported
- imported
- failed
- cancelled

### Reglas
- Cada importación debe conservar su configuración de mapeo.
- Debe existir resumen final del proceso.

---

## 16. Entidad: import_rows

### Descripción
Detalle por fila de una importación CSV.

### Campos
- id
- import_id
- row_number
- raw_data_json
- normalized_data_json opcional
- validation_status
- error_messages_json opcional
- created_record_type opcional
- created_record_id opcional
- created_at
- updated_at

### Valores sugeridos de `validation_status`
- pending
- valid
- warning
- invalid
- imported
- skipped

### Reglas
- Debe permitir mostrar errores por fila y campo.
- `created_record_id` enlaza con el registro creado cuando la fila se importa.

---

## 17. Relación entre parseo, documentos e inserción final

### Flujo lógico recomendado
1. El usuario sube un PDF.
2. Se crea un `documents`.
3. Se ejecuta parser.
4. Se crea `parsed_document_data`.
5. El usuario revisa y corrige.
6. El sistema crea `invoice` y/o `transaction`.
7. Se guarda la relación con `document_id`.

### Ventaja
Evita que un parseo incorrecto ensucie directamente la base de datos principal.

---

## 18. Relación entre CSV e inserción final

### Flujo lógico recomendado
1. El usuario sube un CSV.
2. Se crea `imports`.
3. Se detectan columnas y se guarda `mapping_json`.
4. Se crean `import_rows`.
5. Se validan filas.
6. El usuario revisa preview y errores.
7. El sistema importa filas válidas a entidades finales.
8. Se guarda trazabilidad por `import_id`.

---

## 19. Campos comunes recomendados

Las tablas principales deberían incluir:
- id
- created_at
- updated_at

Y cuando aplique:
- business_id
- user_id
- is_active
- notes

### Tipo de ID recomendado
- UUID recomendado.

### Razón
- Mejor para multi-tenant.
- Mejor para APIs y sincronización futura.
- Evita exponer secuencias predecibles.

---

## 20. Enumeraciones recomendadas

### transaction_type
- income
- expense

### transaction_source
- manual
- csv_import
- pdf_parse
- invoice_sync
- recurring
- api

### transaction_status
- draft
- pending
- confirmed
- cancelled

### invoice_type
- issued
- received

### invoice_status
- draft
- pending
- paid
- overdue
- cancelled

### category_type
- income
- expense

### third_party_type
- client
- supplier
- both

### document_parse_status
- pending
- processing
- parsed
- partial
- failed
- skipped

### parsed_review_status
- pending_review
- reviewed
- rejected
- applied

### import_status
- uploaded
- mapping_pending
- validating
- validated
- partially_imported
- imported
- failed
- cancelled

### import_row_status
- pending
- valid
- warning
- invalid
- imported
- skipped

---

## 21. Restricciones y validaciones clave

### Globales
- Todo registro principal debe pertenecer a un `business_id`.
- Un usuario no puede consultar registros de otro negocio ajeno.

### Transactions
- `amount > 0`
- `transaction_date` obligatoria.
- `type` obligatorio.
- `category_id` obligatorio al confirmar.

### Invoices
- `amount_total > 0`
- `issue_date` obligatoria.
- `type` obligatorio.
- `status` obligatorio.

### Categories
- `name` obligatorio.
- `type` obligatorio.

### Third parties
- `name` obligatorio.
- `type` obligatorio.

### Documents
- `storage_path` obligatorio.
- `mime_type` obligatorio.

### Imports
- `mapping_json` obligatorio antes de importar definitivamente.

---

## 22. Índices recomendados

### En transactions
- index por `business_id`
- index por `transaction_date`
- index por `type`
- index por `category_id`
- index por `third_party_id`
- index por `invoice_id`
- índice compuesto por `business_id, transaction_date`

### En invoices
- index por `business_id`
- index por `status`
- index por `issue_date`
- index por `due_date`
- index por `third_party_id`
- posible unique index por `business_id, type, invoice_number`

### En categories
- index por `business_id`
- index por `type`
- posible unique index por `business_id, slug`

### En documents
- index por `business_id`
- index por `parse_status`

### En imports / import_rows
- index por `import_id`
- index por `validation_status`

---

## 23. Relaciones resumidas

- `users` 1:1 `profiles`
- `users` 1:N `businesses`
- `businesses` 1:N `categories`
- `businesses` 1:N `third_parties`
- `businesses` 1:N `transactions`
- `businesses` 1:N `invoices`
- `businesses` 1:N `documents`
- `businesses` 1:N `imports`
- `categories` 1:N `transactions`
- `third_parties` 1:N `transactions`
- `third_parties` 1:N `invoices`
- `documents` 1:1 o 1:N `parsed_document_data` según versiones de parser
- `documents` 1:N `transactions` opcional
- `documents` 1:N `invoices` opcional
- `imports` 1:N `import_rows`

---

## 24. Decisiones recomendadas para MVP

### Sí incluir desde el inicio
- users
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

### Puede esperar a fase posterior
- financial_accounts
- recurring_rules
- audit_logs
- invoice_transaction_links
- exchange_rates

---

## 25. Decisiones abiertas

Estas decisiones conviene cerrarlas pronto:

1. Si `financial_accounts` entra en MVP o no.
2. Si `overdue` se guarda o se calcula al vuelo.
3. Si una factura debe poder generar automáticamente una transacción.
4. Si el parser PDF va a trabajar con texto extraído, OCR o ambos.
5. Si los importes se guardarán en decimal fijo estándar y con cuántos decimales.
6. Si habrá soporte real de múltiples monedas en MVP o solo campo informativo.

---

## 26. Recomendaciones de implementación para Codex

Cuando Codex use este documento debe:

- crear esquemas limpios y normalizados;
- priorizar relaciones simples en MVP;
- usar UUIDs;
- modelar `transactions` como entidad unificada para ingresos y gastos;
- separar claramente datos fuente, datos parseados y datos finales confirmados;
- contemplar trazabilidad mediante `document_id` e `import_id`;
- preparar el modelo para validación por RLS o aislamiento por usuario/negocio;
- evitar sobreingeniería con tablas demasiado especializadas al inicio.

---

## 27. Esquema conceptual resumido

### Núcleo funcional
- Usuario → Negocio → Transacciones / Facturas / Categorías / Terceros / Documentos / Importaciones

### Flujos asistidos
- Documento → Parseo → Revisión → Registro final
- Importación → Filas → Validación → Registros finales

### Beneficio del diseño
Este modelo permite combinar:
- entradas manuales,
- importación CSV,
- parseo de PDF,
- reporting,
- trazabilidad,
- crecimiento futuro.

---

## 28. Estado del documento

**Versión:** 1.0  
**Estado:** Borrador operativo  
**Basado en:** `00-project-brief.md`, `01-product-requirements.md` y `02-user-flows.md`  
**Siguiente paso recomendado:** `04-db-schema-sql.md` o `04-api-spec.md`

