# 00 · Project Brief

## 1. Resumen del proyecto

**Nombre provisional del proyecto:** Finance Control App  
**Tipo de producto:** Aplicación web de control financiero para autónomos, pequeñas empresas y proyectos digitales  
**Objetivo principal:** Centralizar ingresos, gastos, facturas, métricas financieras y visión del negocio en una sola aplicación clara, rápida y accionable.

La app debe permitir registrar y consultar movimientos financieros, clasificar ingresos y gastos, analizar rentabilidad, visualizar métricas clave y facilitar la toma de decisiones. La intención es construir una base sólida, escalable y bien documentada para que Codex pueda generar funcionalidades con contexto claro, evitando ambigüedades técnicas y de negocio.

---

## 2. Problema que resuelve

Actualmente, el control financiero de pequeños negocios y freelancers suele estar fragmentado entre hojas de cálculo, correos, PDFs, extractos bancarios, herramientas de facturación y notas sueltas. Esto genera varios problemas:

- Falta de visibilidad real sobre beneficios, gastos y flujo de caja.
- Pérdida de tiempo consolidando datos manualmente.
- Dificultad para saber qué clientes, servicios o canales son más rentables.
- Escasa previsión financiera.
- Riesgo de errores en clasificación y seguimiento documental.

La app busca resolver este caos con una interfaz sencilla y una estructura de datos consistente.

---

## 3. Objetivo de negocio

Construir una aplicación interna o comercializable que permita:

- Tener una visión financiera consolidada del negocio.
- Reducir trabajo manual de seguimiento.
- Detectar rápidamente desviaciones, picos de gasto y oportunidades.
- Controlar facturas emitidas y recibidas.
- Preparar una base para futuras automatizaciones con IA.

A medio plazo, el producto podría evolucionar hacia una solución SaaS para autónomos, agencias, consultores y pequeñas empresas.

---

## 4. Usuario objetivo

### Usuario principal
- Autónomos.
- Freelancers digitales.
- Microempresas.
- Agencias de servicios.
- Negocios online y ecommerce pequeños.

### Perfil tipo
Usuario que necesita saber:
- cuánto ha facturado,
- cuánto ha gastado,
- qué margen tiene,
- qué facturas están pendientes,
- cómo evoluciona su negocio mes a mes.

### Nivel técnico
- Bajo o medio.
- Necesita una interfaz intuitiva.
- No quiere depender de hojas complejas ni herramientas contables excesivamente pesadas.

---

## 5. Resultado esperado

El usuario debe poder entrar en la app y ver en pocos segundos:

- ingresos del mes,
- gastos del mes,
- beneficio neto,
- facturas pendientes,
- evolución temporal,
- categorías con mayor gasto,
- clientes o fuentes de ingreso principales.

La aplicación debe transmitir claridad, control y confianza.

---

## 6. Alcance inicial (MVP)

El MVP debe incluir únicamente lo necesario para que el producto sea útil desde el primer momento.

### Funcionalidades del MVP

#### 6.1 Dashboard principal
- Resumen financiero del periodo actual.
- KPIs principales.
- Gráficas simples de evolución.
- Últimos movimientos.
- Alertas básicas.

#### 6.2 Gestión de ingresos
- Crear, editar y eliminar ingresos.
- Asociar fecha, importe, categoría, cliente, método de cobro y notas.
- Posibilidad de marcar ingresos recurrentes.

#### 6.3 Gestión de gastos
- Crear, editar y eliminar gastos.
- Asociar fecha, importe, categoría, proveedor, método de pago y notas.
- Posibilidad de marcar gastos recurrentes.

#### 6.4 Gestión de facturas
- Registro de facturas emitidas.
- Registro de facturas recibidas.
- Estado: pendiente, pagada, vencida.
- Adjuntar archivo o referencia documental.

#### 6.5 Categorías
- Categorías personalizadas para ingresos y gastos.
- Subcategorías opcionales.

#### 6.6 Filtros y búsqueda
- Filtrar por fechas.
- Filtrar por tipo de movimiento.
- Filtrar por categoría, cliente o proveedor.
- Buscar por texto.

#### 6.7 Reportes básicos
- Vista mensual.
- Vista anual.
- Exportación simple de datos.

#### 6.8 Autenticación
- Acceso seguro por usuario.
- Gestión básica de cuenta.

---

## 7. Fuera de alcance en esta primera fase

Estas funcionalidades no forman parte del MVP, aunque podrían contemplarse en fases posteriores:

- Conciliación bancaria automática.
- Sincronización bancaria directa.
- Generación fiscal avanzada.
- Multiempresa compleja.
- Roles avanzados y permisos granulares.
- Automatizaciones complejas con IA.
- OCR avanzado de facturas.
- Integración contable completa.
- App móvil nativa.

---

## 8. Casos de uso principales

### Caso de uso 1
Como usuario, quiero registrar un gasto rápidamente para mantener actualizado mi control financiero.

### Caso de uso 2
Como usuario, quiero ver mis ingresos y gastos del mes para saber si el negocio va bien.

### Caso de uso 3
Como usuario, quiero consultar qué facturas siguen pendientes para hacer seguimiento.

### Caso de uso 4
Como usuario, quiero filtrar movimientos por categoría para detectar dónde gasto más.

### Caso de uso 5
Como usuario, quiero ver una evolución mensual para comparar periodos.

---

## 9. Datos clave que maneja la app

### Entidades principales
- Usuario
- Cuenta / negocio
- Movimiento financiero
- Ingreso
- Gasto
- Categoría
- Cliente
- Proveedor
- Factura
- Documento adjunto

### Campos mínimos por movimiento
- ID
- Tipo
- Fecha
- Importe
- Moneda
- Categoría
- Subcategoría
- Cliente o proveedor
- Estado
- Método de pago o cobro
- Notas
- Fecha de creación
- Fecha de actualización

---

## 10. Requisitos funcionales

1. El sistema debe permitir autenticación segura.
2. El sistema debe permitir crear, editar, eliminar y listar ingresos.
3. El sistema debe permitir crear, editar, eliminar y listar gastos.
4. El sistema debe permitir gestionar facturas emitidas y recibidas.
5. El sistema debe permitir categorizar movimientos.
6. El sistema debe permitir filtrar y buscar registros.
7. El sistema debe mostrar métricas resumidas en un dashboard.
8. El sistema debe permitir exportar información básica.
9. El sistema debe guardar histórico de datos de forma persistente.
10. El sistema debe ofrecer una experiencia rápida y clara en escritorio y móvil.

---

## 11. Requisitos no funcionales

### Rendimiento
- La app debe cargar rápido.
- Las vistas principales deben responder con fluidez.

### Usabilidad
- Interfaz limpia y comprensible.
- Flujo simple para registrar datos.

### Seguridad
- Autenticación segura.
- Protección de datos sensibles.
- Accesos aislados por usuario.

### Escalabilidad
- Arquitectura preparada para añadir módulos futuros.

### Mantenibilidad
- Código organizado por módulos.
- Componentes reutilizables.
- Convenciones claras para que Codex genere código consistente.

---

## 12. Suposiciones de producto

Estas suposiciones sirven como punto de partida y podrán ajustarse después:

- La primera versión será una app web responsive.
- Habrá un panel principal tipo dashboard.
- Se priorizará rapidez de desarrollo sobre complejidad funcional.
- El usuario introducirá datos manualmente en la primera fase.
- Se preparará la base para integraciones futuras.

---

## 13. Riesgos principales

- Querer abarcar demasiadas funciones desde el inicio.
- Diseñar una estructura de datos poco flexible.
- Mezclar necesidades contables avanzadas con un MVP simple.
- Generar una UX demasiado compleja.
- No definir bien estados, categorías y relaciones desde el principio.

---

## 14. Criterios de éxito del MVP

El MVP se considerará válido si permite:

- Registrar ingresos y gastos sin fricción.
- Consultar KPIs clave en un dashboard.
- Filtrar y revisar movimientos con facilidad.
- Controlar facturas básicas.
- Obtener una visión mensual clara del negocio.

### Métricas de éxito orientativas
- Tiempo de registro de un movimiento inferior a 30 segundos.
- Dashboard comprensible en menos de 10 segundos.
- Reducción del uso de hojas de cálculo para control diario.
- Capacidad de detectar rápidamente beneficio y gasto por categoría.

---

## 15. Visión de evolución futura

Fases posteriores posibles:

- OCR de facturas.
- Integración bancaria.
- IA para clasificación automática.
- IA para previsión de flujo de caja.
- Alertas inteligentes.
- Multiempresa.
- Gestión de impuestos.
- Panel de rentabilidad por cliente, canal o servicio.
- Importación desde CSV, PDF o email.

---

## 16. Stack deseado (a validar en documento técnico)

Como orientación inicial, la app podría construirse con:

- Frontend: React / Next.js
- Backend: Supabase o backend moderno equivalente
- Base de datos: PostgreSQL
- Auth: Supabase Auth o sistema equivalente
- UI: Tailwind + componentes reutilizables
- Despliegue: Vercel u opción similar

Este punto se concretará en documentos posteriores del kit.

---

## 17. Instrucciones para Codex

Al trabajar sobre este proyecto, Codex debe asumir que:

- El producto empieza como un MVP funcional.
- La prioridad es claridad, mantenibilidad y velocidad.
- Debe evitar sobreingeniería.
- Debe proponer estructuras escalables, pero implementaciones simples.
- Debe separar bien frontend, lógica de negocio y persistencia.
- Debe documentar decisiones técnicas cuando afecten a la escalabilidad futura.

---

## 18. Resumen ejecutivo final

Se va a construir una app web de control financiero enfocada en pequeños negocios y freelancers. El MVP debe permitir registrar ingresos, gastos y facturas, visualizar métricas clave en un dashboard y consultar la evolución financiera del negocio con filtros claros. El enfoque inicial será simple, útil y escalable, con base preparada para automatizaciones futuras e integración de IA.

---

## 19. Estado del documento

**Versión:** 1.0  
**Estado:** Borrador operativo  
**Siguiente paso recomendado:** Definir `01-product-requirements.md` y `02-user-flows.md` a partir de este brief.

