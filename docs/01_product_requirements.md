# 01 · Product Requirements

## 1. Propósito del documento

Este documento traduce el project brief en requisitos concretos de producto para que el desarrollo pueda ejecutarse con claridad, priorización y criterios de aceptación comprensibles. Está pensado para servir como referencia operativa para Codex, desarrollo y futuras iteraciones del proyecto.

---

## 2. Objetivo del producto

Construir una aplicación web de control financiero que permita a autónomos, freelancers y pequeñas empresas registrar, organizar y analizar sus ingresos, gastos y facturas desde un panel centralizado, con una experiencia simple, rápida y útil para la toma de decisiones.

---

## 3. Objetivos del MVP

El MVP debe resolver con solvencia estas necesidades mínimas:

1. Registrar ingresos y gastos sin fricción.
2. Consultar métricas financieras clave en un dashboard.
3. Gestionar facturas emitidas y recibidas con estados claros.
4. Filtrar y revisar movimientos por fecha, categoría y tercero.
5. Obtener una visión mensual del negocio.
6. Mantener los datos organizados por usuario y negocio.

---

## 4. Perfil de usuario

### Usuario principal
- Autónomo.
- Freelancer digital.
- Agencia pequeña.
- Negocio de servicios.
- Ecommerce pequeño.

### Necesidades principales del usuario
- Saber cuánto ha ingresado y cuánto ha gastado.
- Saber cuánto beneficio tiene en un periodo.
- Tener control sobre facturas pendientes.
- Detectar categorías de gasto relevantes.
- Revisar evolución financiera mensual.
- Acceder rápido a la información importante.

### Frustraciones habituales
- Exceso de hojas de cálculo.
- Datos dispersos en varias herramientas.
- Dificultad para comparar periodos.
- Falta de visibilidad sobre cobros y pagos.
- Pérdida de tiempo en tareas manuales.

---

## 5. Principios de producto

1. **Claridad antes que complejidad**: la interfaz debe ser evidente.
2. **Rapidez de uso**: registrar un movimiento debe requerir pocos pasos.
3. **Valor inmediato**: el usuario debe entender su situación financiera al entrar.
4. **Escalabilidad razonable**: el diseño de datos debe permitir crecer.
5. **Consistencia**: mismas convenciones en estados, categorías y filtros.
6. **Modularidad**: cada parte debe poder ampliarse sin romper la base.

---

## 6. Alcance funcional del MVP

### 6.1 Autenticación y acceso

El sistema debe permitir:
- registro de usuario,
- inicio de sesión,
- cierre de sesión,
- recuperación básica de acceso,
- acceso aislado a los datos de cada usuario.

#### Requisitos
- Cada usuario solo puede ver sus propios datos.
- La sesión debe ser persistente de forma segura.
- Las rutas privadas deben estar protegidas.

---

### 6.2 Dashboard principal

El dashboard debe ofrecer una visión inmediata del estado financiero del periodo seleccionado.

#### Elementos mínimos
- Total ingresos.
- Total gastos.
- Beneficio neto.
- Número de facturas pendientes.
- Evolución temporal básica.
- Últimos movimientos.
- Distribución por categorías principales.

#### Requisitos
- El usuario debe poder cambiar el rango temporal.
- La información del dashboard debe actualizarse según filtros globales.
- Los KPIs deben calcularse a partir de datos reales persistidos.

#### Criterios de aceptación
- Al entrar al dashboard, el usuario ve los KPIs principales sin pasos adicionales.
- El cambio de periodo actualiza métricas y listados relacionados.
- Si no hay datos, se muestra un estado vacío útil.

---

### 6.3 Gestión de ingresos

El sistema debe permitir registrar, consultar y editar ingresos.

#### Campos mínimos
- Fecha.
- Importe.
- Moneda.
- Categoría.
- Subcategoría opcional.
- Cliente opcional.
- Método de cobro.
- Estado.
- Notas.
- Indicador de recurrencia opcional.

#### Operaciones requeridas
- Crear ingreso.
- Editar ingreso.
- Eliminar ingreso.
- Listar ingresos.
- Filtrar ingresos.
- Buscar ingresos.

#### Reglas de negocio
- El importe debe ser mayor que cero.
- La fecha es obligatoria.
- La categoría es obligatoria.
- El estado debe seguir un conjunto controlado.

#### Criterios de aceptación
- El usuario puede crear un ingreso en un formulario simple.
- El ingreso aparece en el listado y afecta a métricas del dashboard.
- El usuario puede modificar cualquier ingreso existente.

---

### 6.4 Gestión de gastos

El sistema debe permitir registrar, consultar y editar gastos.

#### Campos mínimos
- Fecha.
- Importe.
- Moneda.
- Categoría.
- Subcategoría opcional.
- Proveedor opcional.
- Método de pago.
- Estado.
- Notas.
- Indicador de recurrencia opcional.

#### Operaciones requeridas
- Crear gasto.
- Editar gasto.
- Eliminar gasto.
- Listar gastos.
- Filtrar gastos.
- Buscar gastos.

#### Reglas de negocio
- El importe debe ser mayor que cero.
- La fecha es obligatoria.
- La categoría es obligatoria.
- El estado debe estar normalizado.

#### Criterios de aceptación
- El usuario puede crear un gasto en pocos pasos.
- El gasto se refleja en dashboard y listados.
- El usuario puede revisar gastos por periodo y categoría.

---

### 6.5 Gestión de movimientos financieros

Para simplificar la arquitectura, el producto puede tratar ingresos y gastos como variantes de una entidad base de movimiento financiero.

#### Requisitos
- Debe existir una estructura común para ingresos y gastos.
- El sistema debe permitir distinguir claramente el tipo de movimiento.
- Los listados agregados deben combinar ambos tipos cuando sea necesario.

#### Criterios de aceptación
- El usuario puede consultar una vista global de movimientos.
- Los filtros funcionan tanto en ingresos como en gastos.

---

### 6.6 Gestión de facturas

El sistema debe permitir registrar y consultar facturas relacionadas con actividad financiera.

#### Tipos de factura
- Factura emitida.
- Factura recibida.

#### Campos mínimos
- Número o referencia.
- Tipo.
- Fecha de emisión.
- Fecha de vencimiento opcional.
- Importe total.
- Moneda.
- Cliente o proveedor.
- Estado.
- Notas.
- Archivo adjunto o referencia documental opcional.

#### Estados mínimos
- Pendiente.
- Pagada.
- Vencida.
- Cancelada.

#### Operaciones requeridas
- Crear factura.
- Editar factura.
- Eliminar factura.
- Listar facturas.
- Filtrar por estado, fecha y tercero.

#### Reglas de negocio
- El número de factura puede repetirse solo si se decide explícitamente permitirlo por negocio; por defecto, debe tender a unicidad por usuario.
- El estado vencida puede derivarse de fecha de vencimiento si no está pagada.
- Las facturas emitidas y recibidas deben diferenciarse claramente.

#### Criterios de aceptación
- El usuario puede identificar rápidamente qué facturas siguen pendientes.
- El sistema puede mostrar facturas vencidas de forma destacada.
- El listado de facturas permite filtrado útil.

---

### 6.7 Categorías y subcategorías

El sistema debe permitir estructurar la información por categorías.

#### Requisitos
- Deben existir categorías para ingresos y gastos.
- El usuario puede crear categorías personalizadas.
- Las subcategorías son opcionales.
- Las categorías deben reutilizarse en formularios y filtros.

#### Reglas de negocio
- Una categoría pertenece a un tipo principal: ingreso o gasto.
- No debe permitirse usar una categoría de gasto en un ingreso y viceversa.

#### Criterios de aceptación
- El usuario puede crear y usar categorías propias.
- Las categorías aparecen ordenadas y disponibles en formularios.

---

### 6.8 Clientes y proveedores

El sistema debe permitir asociar movimientos y facturas a terceros.

#### Requisitos
- Registrar nombre del cliente o proveedor.
- Guardar información básica opcional.
- Reutilizar terceros en registros futuros.

#### Campos mínimos sugeridos
- Nombre.
- Tipo: cliente o proveedor.
- Email opcional.
- Teléfono opcional.
- Notas opcionales.

#### Criterios de aceptación
- El usuario puede seleccionar terceros existentes al registrar datos.
- El sistema puede filtrar movimientos por tercero.

---

### 6.9 Filtros, búsqueda y listados

La app debe ofrecer exploración simple y eficaz de la información.

#### Filtros mínimos
- Por rango de fechas.
- Por tipo.
- Por categoría.
- Por estado.
- Por cliente o proveedor.

#### Búsqueda mínima
- Texto libre sobre referencia, notas, cliente o proveedor.

#### Requisitos
- Los filtros deben ser acumulables.
- Debe poder restablecerse el filtro fácilmente.
- Los listados deben soportar paginación o carga progresiva si el volumen crece.

#### Criterios de aceptación
- El usuario puede localizar un registro concreto sin navegar excesivamente.
- El filtrado modifica el listado sin confusión visual.

---

### 6.10 Reportes básicos

El MVP debe incluir reportes sencillos orientados a consulta rápida.

#### Reportes mínimos
- Resumen mensual.
- Resumen anual.
- Totales por categoría.
- Evolución de ingresos y gastos.

#### Requisitos
- Los reportes deben derivarse de la misma fuente de datos que los movimientos.
- Deben poder visualizarse dentro de la app.
- Debe existir una exportación simple en una fase temprana del producto o siguiente iteración corta.

#### Criterios de aceptación
- El usuario puede revisar un resumen financiero por periodo.
- Los totales del reporte cuadran con los listados filtrados.

---

## 7. Requisitos de experiencia de usuario

### 7.1 Usabilidad
- Interfaz limpia.
- Navegación clara.
- Textos comprensibles.
- Formularios cortos.
- Estados vacíos informativos.
- Feedback visual tras guardar cambios.

### 7.2 Responsive
- La app debe funcionar correctamente en escritorio.
- Debe ser usable en móvil aunque el uso principal sea escritorio.

### 7.3 Velocidad percibida
- Las acciones frecuentes deben sentirse rápidas.
- Deben usarse loaders o skeletons cuando corresponda.

---

## 8. Requisitos técnicos de producto

### 8.1 Arquitectura general
- Frontend desacoplado y modular.
- Backend con persistencia robusta.
- API o capa de acceso a datos bien estructurada.
- Modelo preparado para crecimiento futuro.

### 8.2 Persistencia
- Toda información debe guardarse de forma persistente.
- Debe existir trazabilidad básica de creación y actualización.

### 8.3 Seguridad
- Aislamiento por usuario.
- Validación de entradas.
- Protección de rutas privadas.
- Gestión segura de sesión.

### 8.4 Mantenibilidad
- Código con estructura por módulos.
- Convenciones coherentes de nombres.
- Reutilización de componentes.
- Separación de lógica de presentación y negocio.

---

## 9. Reglas de negocio iniciales

1. Todo movimiento pertenece a un usuario.
2. Todo movimiento tiene fecha, importe, tipo y categoría.
3. Los importes deben ser positivos; el tipo define si impacta como ingreso o gasto.
4. Las categorías deben estar tipadas.
5. Las facturas deben tener estado controlado.
6. Los KPIs se calculan a partir de registros persistidos, no de valores manuales.
7. Un usuario no puede acceder a datos de otro usuario.
8. Los filtros del dashboard deben ser consistentes con los listados.

---

## 10. Priorización funcional

### Prioridad alta
- Autenticación.
- Dashboard con KPIs.
- CRUD de ingresos.
- CRUD de gastos.
- CRUD de facturas.
- Categorías.
- Filtros y búsqueda.

### Prioridad media
- Clientes y proveedores reutilizables.
- Reportes básicos.
- Adjuntos en facturas.
- Recurrencia simple.

### Prioridad baja
- Exportación avanzada.
- Automatizaciones.
- OCR.
- IA para clasificación.
- Integraciones bancarias.

---

## 11. Dependencias funcionales

- El dashboard depende de movimientos correctamente registrados.
- Las métricas dependen de categorías y tipos consistentes.
- La gestión de facturas depende de terceros y estados bien definidos.
- Los reportes dependen de filtros y estructura temporal correctos.

---

## 12. Riesgos de producto

- Exceso de alcance en el MVP.
- Mala definición del modelo de datos.
- Estados ambiguos en facturas y movimientos.
- Dashboard con demasiada información y poca claridad.
- Formularios demasiado largos.

### Mitigación
- Reducir el MVP a flujos de mayor valor.
- Definir bien entidades y relaciones antes de construir.
- Normalizar estados desde el inicio.
- Validar UX simple antes de añadir extras.

---

## 13. Criterios globales de aceptación del MVP

El MVP estará listo cuando cumpla estas condiciones:

1. Un usuario puede registrarse e iniciar sesión.
2. Un usuario puede crear, editar, eliminar y consultar ingresos.
3. Un usuario puede crear, editar, eliminar y consultar gastos.
4. Un usuario puede registrar y revisar facturas.
5. El dashboard muestra KPIs coherentes con los datos registrados.
6. Los filtros permiten analizar la información por periodo y categoría.
7. La app funciona correctamente en escritorio y de forma usable en móvil.
8. Los datos quedan persistidos y aislados por usuario.

---

## 14. Preguntas abiertas para cerrar en próximos documentos

Estas decisiones conviene resolverlas antes de construir demasiado:

- ¿Habrá una sola cuenta financiera por usuario o varias?
- ¿Se trabajará desde el inicio con multi-moneda real?
- ¿Las facturas se relacionarán automáticamente con movimientos?
- ¿La recurrencia generará registros automáticos o solo una marca visual?
- ¿Se permitirá importar datos desde CSV en el MVP o en fase 2?
- ¿Qué exportación mínima se requiere primero: CSV, Excel o PDF?

---

## 15. Instrucciones para Codex

Cuando Codex use este documento debe asumir que:

- La prioridad es un MVP funcional y usable.
- Debe proponer primero estructuras simples pero limpias.
- Debe evitar dependencias innecesarias.
- Debe diseñar componentes reutilizables para formularios, tablas, filtros y tarjetas KPI.
- Debe mantener coherencia entre modelo de datos, reglas de negocio y UI.
- Toda funcionalidad debe poder mapearse a un criterio de aceptación.
- Debe contemplar la subida y escaneado de PDFs financieros, mostrando vista previa del archivo antes de confirmar el procesamiento.
- Debe contemplar el parseo de datos desde PDFs para extraer, como mínimo cuando sea viable, campos como fecha, importe, emisor/proveedor, número de factura o referencia y categoría sugerida.
- Debe diseñar este flujo de PDFs de forma modular, permitiendo una primera versión simple y una evolución posterior hacia OCR o extracción más avanzada.
- Debe contemplar también la importación de datos mediante archivos CSV.
- En la importación CSV debe existir una plantilla descargable de ejemplo para que el usuario pueda preparar correctamente sus datos.
- El sistema debe sugerir o mapear columnas del CSV a los campos internos de la app antes de completar la importación.
- Debe priorizar validaciones claras en importaciones, mostrando errores por fila, campos faltantes y vista previa antes de confirmar la carga.

---

## 16. Estado del documento

**Versión:** 1.0  
**Estado:** Borrador operativo  
**Basado en:** `00-project-brief.md`  
**Siguiente paso recomendado:** `02-user-flows.md`

