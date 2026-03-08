# 15 · Open Questions

## 1. Propósito del documento

Este documento recoge las decisiones aún no cerradas del proyecto. Su objetivo es separar claramente lo que ya está definido de lo que sigue abierto, para que Codex no haga suposiciones silenciosas en temas que afectan al producto, la arquitectura, la UX, el modelo de datos o la operativa.

Debe servir como referencia para:

- decisiones pendientes,
- riesgos de ambigüedad,
- prioridades de resolución,
- impacto técnico y funcional,
- preparación del prompt maestro,
- futuras iteraciones del kit.

---

## 2. Cómo usar este documento

Cada pregunta abierta debe leerse con estas tres ideas:

- si afecta al MVP inmediato,
- si puede bloquear implementación,
- si puede resolverse con una decisión provisional segura.

### Estados sugeridos para cada cuestión
- Open
- Suggested default
- Needs decision
- Deferred
- Closed

### Regla importante
Mientras una cuestión siga abierta, Codex debe seguir el **default sugerido** si existe, y documentar la asunción cuando impacte en implementación.

---

## 3. Criterio de priorización

### Prioridad alta
Cuestiones que pueden romper:
- modelo de datos,
- métricas,
- seguridad,
- UX principal,
- contratos API,
- implementación del núcleo.

### Prioridad media
Cuestiones que afectan:
- refinamientos de producto,
- reportes,
- comodidad de uso,
- cobertura funcional secundaria.

### Prioridad baja
Cuestiones futuras o no bloqueantes del MVP.

---

## 4. Preguntas abiertas de producto

### 4.1 ¿Habrá un solo negocio por usuario en el MVP o varios?

**Estado:** Suggested default  
**Prioridad:** Alta  
**Impacto:** Modelo de datos, auth, navegación, filtros, ownership, dashboard.

**Default sugerido:**
- Un solo negocio activo por usuario en el MVP.
- El modelo sigue preparado para multiempresa futura.

**Por qué importa:**
Afecta a cómo se resuelve `business_id`, a la selección de contexto y a todas las consultas agregadas.

---

### 4.2 ¿La app será solo interna o también se diseñará desde ya como SaaS comercializable?

**Estado:** Open  
**Prioridad:** Media  
**Impacto:** Branding, onboarding, settings, roles futuros, SEO, pricing y arquitectura de crecimiento.

**Default sugerido:**
- Diseñar como producto interno con estructura compatible con futura comercialización.

---

### 4.3 ¿La primera versión se orienta más a freelancers/servicios o también a ecommerce desde el inicio?

**Estado:** Open  
**Prioridad:** Media  
**Impacto:** categorías iniciales, dashboard copy, métricas futuras, plantillas CSV, SEO.

**Default sugerido:**
- Priorizar negocios de servicios, freelancers y microempresas.
- Mantener compatibilidad básica con ecommerce pequeño.

---

### 4.4 ¿Qué nivel de complejidad debe tener el onboarding inicial?

**Estado:** Open  
**Prioridad:** Media  
**Impacto:** UX, primera experiencia, setup de negocio, seeds iniciales.

**Default sugerido:**
- Onboarding mínimo o inexistente en MVP.
- Redirección al dashboard con estado vacío y quick actions.

---

## 5. Preguntas abiertas de modelo de datos

### 5.1 ¿Debe entrar `financial_accounts` en el MVP o quedar fuera?

**Estado:** Suggested default  
**Prioridad:** Alta  
**Impacto:** tablas, formularios, filtros, importaciones, dashboard.

**Default sugerido:**
- Dejar `financial_accounts` fuera del MVP inicial.
- Preparar el modelo para añadirlo después.

**Por qué importa:**
Añade complejidad a transacciones, UX y reporting sin ser imprescindible para el primer valor real.

---

### 5.2 ¿`overdue` se calcula dinámicamente o se guarda en la base de datos?

**Estado:** Suggested default  
**Prioridad:** Alta  
**Impacto:** invoices, dashboard pending metrics, filtros, queries.

**Default sugerido:**
- Guardar `status` y permitir que backend lo recalcule o actualice cuando toque.
- En MVP, tratar `overdue` como estado persistido si el flujo lo necesita.

---

### 5.3 ¿Una factura debe generar automáticamente una transacción?

**Estado:** Open  
**Prioridad:** Alta  
**Impacto:** flujos de facturas, modelo, dashboard, duplicidades.

**Default sugerido:**
- No generar automáticamente transacción en el MVP.
- Mantener facturas y transacciones relacionadas, pero no fusionadas.

**Por qué importa:**
Evita duplicidades y lógica ambigua hasta cerrar bien el comportamiento financiero esperado.

---

### 5.4 ¿Cómo se tratarán categorías históricas archivadas o borradas?

**Estado:** Open  
**Prioridad:** Media  
**Impacto:** dashboard, reportes, listados históricos.

**Default sugerido:**
- Preferir archivado lógico frente a borrado duro.

---

### 5.5 ¿Qué precisión monetaria final se necesita más allá de `numeric(12,2)`?

**Estado:** Suggested default  
**Prioridad:** Media  
**Impacto:** DB, cálculos, importaciones.

**Default sugerido:**
- Mantener `numeric(12,2)` en MVP.

---

## 6. Preguntas abiertas de transacciones y facturas

### 6.1 ¿Latest transactions debe mostrar solo `confirmed` o también `pending`?

**Estado:** Open  
**Prioridad:** Media  
**Impacto:** dashboard UX, consistencia visual.

**Default sugerido:**
- Mostrar `confirmed` y opcionalmente `pending`.
- Excluir siempre `cancelled`.

---

### 6.2 ¿Las métricas de facturas pendientes deben ser globales o respetar el rango temporal?

**Estado:** Closed  
**Prioridad:** Alta  
**Decisión actual:**
- Globales del negocio en MVP.

**Referencia:**
- `11-dashboard-metrics.md`

---

### 6.3 ¿Debe existir un KPI separado de facturación emitida además de ingresos confirmados?

**Estado:** Open  
**Prioridad:** Media  
**Impacto:** dashboard, reportes, comprensión de negocio.

**Default sugerido:**
- No incluirlo en MVP.
- Mantenerlo como evolución futura.

---

### 6.4 ¿Se permitirá una factura sin tercero asociado?

**Estado:** Open  
**Prioridad:** Media  
**Impacto:** UX, calidad de datos, imports.

**Default sugerido:**
- Sí, permitirlo en MVP si el resto de campos mínimos están completos.

---

## 7. Preguntas abiertas del dashboard y reporting

### 7.1 ¿La serie `incomeVsExpenseSeries` será diaria, mensual o adaptativa desde el inicio?

**Estado:** Open  
**Prioridad:** Alta  
**Impacto:** backend agregado, charts, testing.

**Default sugerido:**
- Adaptativa simple:
  - rangos cortos → diaria
  - rangos largos → mensual

---

### 7.2 ¿Se incluye comparativa con periodo anterior en el MVP?

**Estado:** Open  
**Prioridad:** Media  
**Impacto:** dashboard UI, queries, copy.

**Default sugerido:**
- No incluir en MVP inicial.

---

### 7.3 ¿Se rellenan huecos con ceros en todas las series temporales?

**Estado:** Suggested default  
**Prioridad:** Media  
**Impacto:** gráficas, legibilidad, testing.

**Default sugerido:**
- Sí, rellenar huecos para visualización estable.

---

### 7.4 ¿El reporte anual entra realmente en MVP o queda en fase 1.1?

**Estado:** Open  
**Prioridad:** Media  
**Impacto:** scope, task board, testing.

**Default sugerido:**
- Mantener mensual seguro en MVP.
- Año completo como opcional si el ritmo de desarrollo lo permite.

---

## 8. Preguntas abiertas del flujo PDF

### 8.1 ¿El parseo PDF será solo por texto o incluirá OCR desde el inicio?

**Estado:** Suggested default  
**Prioridad:** Alta  
**Impacto:** complejidad técnica, integraciones, costes, testing.

**Default sugerido:**
- Solo extracción de texto + heurísticas en MVP.
- OCR como mejora futura opcional.

---

### 8.2 ¿Qué tipo de PDFs se priorizan primero?

**Estado:** Open  
**Prioridad:** Alta  
**Impacto:** precisión del parser, UX, fixtures.

**Opciones posibles:**
- facturas de proveedor
- facturas emitidas
- tickets/recibos
- PDFs genéricos financieros

**Default sugerido:**
- Priorizar facturas recibidas de proveedor y PDFs tipo factura.

---

### 8.3 ¿El usuario podrá crear tercero automáticamente desde el flujo de parseo si no existe?

**Estado:** Open  
**Prioridad:** Media  
**Impacto:** UX, apply parsed document, formularios.

**Default sugerido:**
- Sí, permitir crear tercero inline o en modal simple si no existe.

---

### 8.4 ¿Se mostrará al usuario una confianza numérica del parseo?

**Estado:** Open  
**Prioridad:** Baja/Media  
**Impacto:** UX y percepción del parser.

**Default sugerido:**
- Guardarla en backend, no hacerla crítica en UI del MVP.

---

## 9. Preguntas abiertas del flujo CSV

### 9.1 ¿Qué tipo de importación entra primero en MVP?

**Estado:** Suggested default  
**Prioridad:** Alta  
**Impacto:** scope, validaciones, UI, repositorios.

**Default sugerido:**
- Priorizar `transactions_csv`.
- `invoices_csv`, `categories_csv` y `third_parties_csv` quedan preparadas pero no obligatorias en la primera entrega.

---

### 9.2 ¿Se soportará edición inline de filas inválidas dentro de la app?

**Estado:** Open  
**Prioridad:** Media  
**Impacto:** UX, complejidad frontend, task board.

**Default sugerido:**
- No en MVP inicial.
- Corregir CSV fuera de la app y reimportar.

---

### 9.3 ¿Se aceptarán categorías inexistentes creando nuevas automáticamente?

**Estado:** Open  
**Prioridad:** Alta  
**Impacto:** calidad de datos, imports, catálogos.

**Default sugerido:**
- No crear automáticamente en MVP sin confirmación.
- Marcar como error o warning según estrategia decidida.

---

### 9.4 ¿El separador CSV esperado será fijo o flexible?

**Estado:** Open  
**Prioridad:** Media  
**Impacto:** parser, UX en ES/Latam, testing.

**Default sugerido:**
- Detectar automáticamente coma y punto y coma cuando sea viable.

---

## 10. Preguntas abiertas de UX

### 10.1 ¿La navegación principal será sidebar fija o adaptable desde el inicio?

**Estado:** Suggested default  
**Prioridad:** Media  
**Impacto:** frontend architecture, responsive.

**Default sugerido:**
- Sidebar fija en escritorio y drawer en móvil.

---

### 10.2 ¿Las tablas pasan a cards en móvil o se mantendrán scroll horizontales?

**Estado:** Open  
**Prioridad:** Media  
**Impacto:** UX responsive, componentes.

**Default sugerido:**
- Cards en móvil para listados clave.
- Scroll horizontal solo en tablas muy técnicas como import rows si hace falta.

---

### 10.3 ¿Se usarán modales o páginas dedicadas para formularios de alta/edición?

**Estado:** Open  
**Prioridad:** Media  
**Impacto:** flujo, complejidad, reusabilidad.

**Default sugerido:**
- Formularios en página o panel principal para flows complejos.
- Modal solo para entidades pequeñas como categoría o tercero.

---

## 11. Preguntas abiertas de seguridad y operativa

### 11.1 ¿Se necesita audit log en el MVP?

**Estado:** Open  
**Prioridad:** Media  
**Impacto:** backend, DB, debugging, compliance.

**Default sugerido:**
- No como módulo formal del MVP.
- Logging estructurado básico sí.

---

### 11.2 ¿Habrá background jobs reales en MVP para PDF o imports pesados?

**Estado:** Suggested default  
**Prioridad:** Media  
**Impacto:** backend, infra, env.

**Default sugerido:**
- No en MVP inicial.
- Diseñar servicios preparados para evolucionar a async.

---

### 11.3 ¿Qué nivel de monitoring entra desde la primera versión?

**Estado:** Open  
**Prioridad:** Baja/Media  
**Impacto:** env, ops, debugging.

**Default sugerido:**
- Logging estructurado básico.
- Sentry opcional si la app se usa en producción real pronto.

---

## 12. Preguntas abiertas de SEO y contenido

### 12.1 ¿La app tendrá marketing site público desde el inicio o solo app privada?

**Estado:** Open  
**Prioridad:** Media  
**Impacto:** content SEO, routing, layout público, prompt maestro.

**Default sugerido:**
- App privada primero.
- Content SEO y landings preparadas como capa aparte.

---

### 12.2 ¿El contenido SEO va orientado a captación orgánica del propio producto o a documentación interna del kit?

**Estado:** Open  
**Prioridad:** Media  
**Impacto:** `13-content-seo.md`.

**Default sugerido:**
- Enfocarlo a captación del producto y a contenidos de funcionalidades / casos de uso.

---

## 13. Preguntas abiertas del proceso de desarrollo con Codex

### 13.1 ¿Codex debe construir primero un MVP funcional bruto o una base más pulida desde el inicio?

**Estado:** Open  
**Prioridad:** Media  
**Impacto:** task board, master prompt, ritmo de ejecución.

**Default sugerido:**
- MVP funcional sólido primero.
- Pulido y refinamiento en segunda pasada.

---

### 13.2 ¿Se trabajará en un solo repo monolítico o con separación clara entre app y assets/scripts?

**Estado:** Open  
**Prioridad:** Baja/Media  
**Impacto:** frontend/backend architecture, repo setup.

**Default sugerido:**
- Un solo repo bien organizado para el MVP.

---

## 14. Preguntas abiertas ya parcialmente respondidas en el kit

Estas no están completamente “abiertas”, pero conviene mantenerlas visibles:

### 14.1 Multi-moneda real
**Estado:** Deferred  
**Default sugerido:** moneda base por negocio en MVP.

### 14.2 OCR avanzado
**Estado:** Deferred  
**Default sugerido:** no en MVP.

### 14.3 Multiempresa real
**Estado:** Deferred  
**Default sugerido:** modelo preparado, UX no expuesta en MVP.

### 14.4 Integraciones bancarias
**Estado:** Deferred  
**Default sugerido:** fuera del MVP.

### 14.5 App móvil nativa
**Estado:** Deferred  
**Default sugerido:** no en MVP.

---

## 15. Cuestiones que conviene cerrar antes del prompt maestro

Estas son las más importantes para cerrar o asumir explícitamente antes de generar el `16-master-prompt.md`:

1. un negocio por usuario en MVP;
2. no auto-generar transacción desde factura;
3. no OCR en MVP;
4. prioridad de `transactions_csv` sobre otros imports;
5. granularidad inicial de la serie del dashboard;
6. si `latestTransactions` incluye `pending` o no;
7. si la app es solo privada o también incluye capa pública inicial;
8. si el reporte anual entra o no en MVP.

---

## 16. Recomendación práctica para seguir avanzando

Para no bloquear el proyecto, se recomienda asumir como decisiones de trabajo estas provisionales:

- un negocio por usuario en MVP;
- sin `financial_accounts` en MVP;
- sin OCR en MVP;
- PDF con texto + heurísticas;
- CSV centrado en transacciones;
- reporte mensual seguro, anual opcional;
- dashboard con métricas cerradas según `11-dashboard-metrics.md`;
- app privada primero;
- factura y transacción separadas.

---

## 17. Instrucciones para Codex

Cuando Codex encuentre una cuestión abierta debe:

- seguir el default sugerido si existe;
- no inventar decisiones incompatibles con otros documentos del kit;
- documentar cualquier asunción relevante en el código o en notas de implementación;
- priorizar decisiones que mantengan el MVP simple y estable;
- evitar introducir complejidad futura como si ya formara parte del alcance actual.

---

## 18. Próximo documento recomendado

Después de este archivo, lo más útil es crear:

- `16-master-prompt.md`

Y después, si quieres cerrar la parte de captación o marketing:

- `13-content-seo.md`

---

## 19. Estado del documento

**Versión:** 1.0  
**Estado:** Borrador operativo  
**Basado en:** `03-data-model.md`, `11-dashboard-metrics.md`, `12-task-board.md` y el resto del kit  
**Siguiente paso recomendado:** `16-master-prompt.md`

