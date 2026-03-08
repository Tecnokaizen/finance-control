# 02 · User Flows

## 1. Propósito del documento

Este documento describe los flujos principales de uso de la app de control financiero. Su objetivo es traducir los requisitos funcionales en recorridos concretos de usuario, mostrando qué acciones realiza, qué espera ver, qué decisiones toma el sistema y qué resultados debe obtener.

Está pensado para ayudar a:

- diseñar la experiencia de usuario,
- definir pantallas y estados,
- alinear frontend, backend y modelo de datos,
- facilitar a Codex la implementación de flujos completos sin ambigüedad.

---

## 2. Principios de diseño de flujos

Los flujos deben respetar estas reglas:

1. Pocos pasos para tareas frecuentes.
2. Claridad visual en cada acción.
3. Feedback inmediato tras guardar, importar o procesar datos.
4. Estados vacíos útiles.
5. Validaciones comprensibles.
6. Capacidad de corregir antes de confirmar operaciones sensibles.
7. Consistencia entre listados, formularios, dashboard e importaciones.

---

## 3. Mapa general de flujos principales

Los flujos clave del MVP son:

1. Registro e inicio de sesión.
2. Entrada al dashboard.
3. Alta manual de ingreso.
4. Alta manual de gasto.
5. Consulta y filtrado de movimientos.
6. Creación y seguimiento de facturas.
7. Gestión de categorías.
8. Gestión de clientes y proveedores.
9. Subida y parseo de PDF.
10. Importación de CSV con plantilla.
11. Corrección de errores de importación.
12. Revisión de reportes básicos.

---

## 4. Flujo: registro de usuario

### Objetivo

Permitir que un usuario cree una cuenta y acceda por primera vez a la app.

### Disparador

El usuario entra por primera vez y selecciona crear cuenta.

### Pasos del usuario

1. Abre la pantalla de registro.
2. Introduce nombre, email y contraseña.
3. Acepta condiciones si aplica.
4. Envía el formulario.

### Respuesta del sistema

1. Valida campos obligatorios.
2. Comprueba formato del email.
3. Comprueba requisitos mínimos de contraseña.
4. Crea la cuenta.
5. Inicia sesión o solicita verificación según arquitectura elegida.
6. Redirige al onboarding o al dashboard vacío.

### Estados y validaciones

- Email inválido.
- Contraseña demasiado débil.
- Email ya registrado.
- Error de red o servidor.

### Resultado esperado

El usuario accede correctamente a la app con su espacio aislado.

---

## 5. Flujo: inicio de sesión

### Objetivo

Permitir que un usuario existente acceda a su cuenta.

### Disparador

El usuario abre la app y selecciona iniciar sesión.

### Pasos del usuario

1. Introduce email y contraseña.
2. Envía el formulario.

### Respuesta del sistema

1. Valida credenciales.
2. Crea sesión segura.
3. Redirige al dashboard.

### Estados y validaciones

- Credenciales incorrectas.
- Usuario no verificado si aplica.
- Error temporal.

### Resultado esperado

El usuario entra directamente al entorno principal de trabajo.

---

## 6. Flujo: primera entrada al dashboard

### Objetivo

Ofrecer una visión inmediata del estado financiero del negocio.

### Disparador

El usuario entra tras autenticarse.

### Pasos del usuario

1. Accede al dashboard.
2. Observa KPIs, últimos movimientos y resúmenes.
3. Cambia rango temporal si lo necesita.
4. Navega hacia acciones frecuentes.

### Respuesta del sistema

1. Carga KPIs del periodo por defecto.
2. Carga últimos movimientos.
3. Carga gráficos y bloques resumidos.
4. Si no existen datos, muestra estado vacío con llamadas a acción.

### Elementos esperados

- Total ingresos.
- Total gastos.
- Beneficio neto.
- Facturas pendientes.
- Evolución temporal.
- Accesos rápidos a añadir ingreso, gasto, factura, importar CSV y subir PDF.

### Resultado esperado

El usuario entiende su situación financiera actual en pocos segundos.

---

## 7. Flujo: alta manual de ingreso

### Objetivo

Registrar un ingreso manualmente de forma rápida.

### Disparador

El usuario pulsa “Nuevo ingreso”.

### Pasos del usuario

1. Abre el formulario de nuevo ingreso.
2. Introduce fecha.
3. Introduce importe.
4. Selecciona moneda.
5. Selecciona categoría.
6. Selecciona o crea cliente si aplica.
7. Añade método de cobro.
8. Añade notas opcionales.
9. Guarda.

### Respuesta del sistema

1. Valida campos obligatorios.
2. Guarda el ingreso.
3. Actualiza listados y KPIs relacionados.
4. Muestra confirmación visual.

### Estados y validaciones

- Importe vacío o no válido.
- Fecha vacía.
- Categoría no seleccionada.

### Resultado esperado

El ingreso queda registrado y reflejado en dashboard y listados.

---

## 8. Flujo: alta manual de gasto

### Objetivo

Registrar un gasto manualmente de forma rápida.

### Disparador

El usuario pulsa “Nuevo gasto”.

### Pasos del usuario

1. Abre el formulario de nuevo gasto.
2. Introduce fecha.
3. Introduce importe.
4. Selecciona moneda.
5. Selecciona categoría.
6. Selecciona o crea proveedor si aplica.
7. Añade método de pago.
8. Añade notas opcionales.
9. Guarda.

### Respuesta del sistema

1. Valida campos.
2. Guarda el gasto.
3. Refresca indicadores y listados.
4. Muestra confirmación.

### Resultado esperado

El gasto queda registrado y afecta a la visión financiera del periodo.

---

## 9. Flujo: consulta de movimientos

### Objetivo

Permitir revisar en una sola vista los movimientos registrados.

### Disparador

El usuario abre la sección de movimientos.

### Pasos del usuario

1. Accede al listado.
2. Visualiza movimientos recientes.
3. Filtra por fecha, tipo, categoría, estado o tercero.
4. Usa búsqueda por texto si lo necesita.
5. Abre un registro concreto.
6. Edita o elimina si corresponde.

### Respuesta del sistema

1. Carga listado paginado o progresivo.
2. Aplica filtros acumulables.
3. Devuelve resultados coherentes con el dashboard.
4. Permite acciones sobre cada registro.

### Resultado esperado

El usuario localiza rápidamente cualquier movimiento relevante.

---

## 10. Flujo: creación de factura

### Objetivo

Registrar una factura emitida o recibida.

### Disparador

El usuario pulsa “Nueva factura”.

### Pasos del usuario

1. Selecciona tipo de factura.
2. Introduce número o referencia.
3. Introduce fecha de emisión.
4. Introduce fecha de vencimiento si aplica.
5. Introduce importe.
6. Selecciona moneda.
7. Selecciona cliente o proveedor.
8. Define estado.
9. Añade notas.
10. Adjunta documento si aplica.
11. Guarda.

### Respuesta del sistema

1. Valida campos obligatorios.
2. Guarda factura.
3. Clasifica la factura como emitida o recibida.
4. La muestra en el listado de facturas.

### Resultado esperado

La factura queda disponible para seguimiento y filtrado.

---

## 11. Flujo: seguimiento de facturas pendientes

### Objetivo

Permitir detectar rápidamente facturas pendientes o vencidas.

### Disparador

El usuario entra en la vista de facturas o revisa el dashboard.

### Pasos del usuario

1. Accede al listado de facturas.
2. Filtra por estado pendiente o vencida.
3. Revisa fecha, importe y tercero.
4. Abre una factura.
5. Cambia su estado a pagada o actualiza información.

### Respuesta del sistema

1. Destaca visualmente vencidas y pendientes.
2. Permite actualización rápida del estado.
3. Refresca contador de facturas pendientes.

### Resultado esperado

El usuario controla de forma simple qué sigue pendiente de cobrar o pagar.

---

## 12. Flujo: creación y gestión de categorías

### Objetivo

Permitir personalizar la clasificación de ingresos y gastos.

### Disparador

El usuario necesita crear o editar una categoría.

### Pasos del usuario

1. Accede a la sección de categorías.
2. Selecciona crear categoría.
3. Introduce nombre.
4. Elige tipo: ingreso o gasto.
5. Añade subcategoría si aplica.
6. Guarda.

### Respuesta del sistema

1. Valida que el nombre sea válido.
2. Guarda la categoría.
3. La hace disponible en formularios y filtros.

### Resultado esperado

El usuario puede mantener una clasificación adaptada a su negocio.

---

## 13. Flujo: creación y reutilización de cliente o proveedor

### Objetivo

Permitir registrar terceros y reutilizarlos en movimientos y facturas.

### Disparador

El usuario necesita asociar un cliente o proveedor nuevo.

### Pasos del usuario

1. Desde el formulario o sección específica, crea tercero.
2. Introduce nombre y tipo.
3. Añade email, teléfono y notas si quiere.
4. Guarda.

### Respuesta del sistema

1. Registra el tercero.
2. Lo deja disponible para autocompletar o selección futura.

### Resultado esperado

El usuario evita escribir repetidamente los mismos datos.

---

## 14. Flujo: subida y escaneado de PDF con vista previa

### Objetivo

Permitir cargar un PDF financiero, revisarlo visualmente y extraer datos antes de registrarlos.

### Disparador

El usuario pulsa “Subir PDF”.

### Pasos del usuario

1. Selecciona un archivo PDF desde su dispositivo.
2. Espera la carga inicial.
3. Ve una vista previa del PDF o de su primera página.
4. Solicita el procesamiento del documento.
5. Revisa los datos extraídos sugeridos por el sistema.
6. Corrige campos si es necesario.
7. Confirma la creación del registro o factura asociada.
8. La factura o documento subido, debe ser editable para incluir campos de categoría, subcategoría si procede, o datos faltantes no parseados o sugeridos por el sistema

### Respuesta del sistema

1. Valida que el archivo sea PDF y cumpla límites de tamaño definidos.
2. Muestra vista previa del documento.
3. Ejecuta el parseo inicial.
4. Extrae, cuando sea viable, campos como fecha, importe, emisor/proveedor, número de factura o referencia.
5. Presenta un formulario pre-rellenado con datos sugeridos.
6. Permite confirmar, corregir o cancelar.

### Estados y validaciones

- Archivo no válido.
- PDF corrupto o ilegible.
- Parseo parcial.
- Parseo sin coincidencias útiles.
- Error de procesamiento.

### Resultado esperado

El usuario puede transformar un PDF en un registro útil con menos trabajo manual.

### Consideraciones UX

- Siempre debe haber vista previa antes de confirmar.
- Si el parseo falla, el usuario puede usar el PDF como referencia visual y completar el formulario manualmente.
- Debe mostrarse claramente qué datos fueron detectados y con qué nivel de confianza si más adelante se implementa.

---

## 15. Flujo: importación de CSV con plantilla descargable

### Objetivo

Permitir cargar múltiples registros desde CSV de forma guiada y segura.

### Disparador

El usuario pulsa “Importar CSV”.

### Pasos del usuario

1. Entra en la sección de importación.
2. Descarga una plantilla CSV de ejemplo si la necesita.
3. Prepara su archivo siguiendo la plantilla.
4. Sube el CSV.
5. Revisa el mapeo sugerido entre columnas del CSV y campos internos.
6. Ajusta el mapeo si hace falta.
7. Ve una vista previa de filas a importar.
8. Confirma la importación.

### Respuesta del sistema

1. Ofrece una plantilla descargable con columnas recomendadas.
2. Valida estructura del archivo.
3. Detecta cabeceras.
4. Sugiere correspondencias entre columnas y campos internos.
5. Muestra una preview de los datos.
6. Señala errores antes de importar definitivamente.
7. Importa los registros válidos.
8. Muestra resumen de importación.

### Resultado esperado

El usuario puede cargar datos masivos sin necesidad de introducirlos uno a uno.

### Columnas sugeridas mínimas de plantilla

- tipo
- fecha
- importe
- moneda
- categoria
- subcategoria
- tercero
- metodo
- estado
- notas
- referencia

---

## 16. Flujo: corrección de errores de importación CSV

### Objetivo

Permitir al usuario detectar y corregir errores antes de contaminar la base de datos.

### Disparador

Durante la previsualización o validación del CSV aparecen errores.

### Pasos del usuario

1. Revisa el resumen de errores.
2. Identifica filas con problemas.
3. Corrige el archivo fuera de la app o mediante edición inline si se implementa.
4. Repite la carga.

### Respuesta del sistema

1. Muestra errores por fila y campo.
2. Explica el motivo del error.
3. Diferencia errores bloqueantes de advertencias.
4. Permite continuar solo con registros válidos si se decide soportarlo.

### Tipos de error esperados

- Fecha inválida.
- Importe no numérico.
- Tipo no reconocido.
- Categoría ausente.
- Columna obligatoria faltante.
- Cabeceras incompatibles.

### Resultado esperado

La importación se vuelve comprensible, controlada y segura.

---

## 17. Flujo: revisión de reportes básicos

### Objetivo

Permitir al usuario revisar resúmenes financieros por periodo.

### Disparador

El usuario accede a la sección de reportes.

### Pasos del usuario

1. Selecciona un periodo.
2. Revisa totales y gráficos básicos.
3. Compara ingresos y gastos.
4. Detecta categorías principales.

### Respuesta del sistema

1. Calcula datos del periodo seleccionado.
2. Presenta totales y visualizaciones simples.
3. Mantiene coherencia con dashboard y listados filtrados.

### Resultado esperado

El usuario obtiene una lectura rápida de la evolución financiera.

---

## 18. Estados vacíos clave

La app debe contemplar estados vacíos útiles en:

- dashboard sin datos,
- listado de movimientos vacío,
- listado de facturas vacío,
- categorías no creadas,
- sin clientes o proveedores,
- parseo PDF sin datos suficientes,
- CSV sin filas válidas.

Cada estado vacío debe incluir:

- explicación breve,
- siguiente acción recomendada,
- botón o enlace útil.

---

## 19. Errores y mensajes del sistema

Los flujos deben contemplar mensajes claros para:

- error de autenticación,
- error de validación,
- error de guardado,
- error de importación,
- error de parseo de PDF,
- fallo temporal del servidor,
- archivo no soportado.

Los mensajes deben explicar:

- qué ha pasado,
- qué puede revisar el usuario,
- cuál es el siguiente paso.

---

## 20. Navegación sugerida entre pantallas

### Navegación principal

- Dashboard
- Movimientos
- Facturas
- Categorías
- Clientes / proveedores
- Importaciones
- Reportes
- Ajustes

### Acciones rápidas recomendadas

- Nuevo ingreso
- Nuevo gasto
- Nueva factura
- Subir PDF
- Importar CSV

---

## 21. Dependencias entre flujos

- El dashboard depende de movimientos existentes.
- Las facturas dependen de terceros y estados bien definidos.
- La importación CSV depende de una estructura mínima de columnas.
- El parseo de PDF depende de un flujo de revisión antes de confirmar.
- Los reportes dependen de filtros y datos consistentes.

---

## 22. Criterios de calidad para implementación

Al implementar estos flujos, Codex debe cumplir que:

1. Cada flujo tenga entrada, validación, confirmación y salida claras.
2. No existan pasos innecesarios en tareas frecuentes.
3. Todo flujo sensible tenga revisión antes de confirmar cuando afecte a múltiples datos o parseos automáticos.
4. Los formularios estén preparados para reutilizarse entre creación manual, parseo PDF e importación.
5. Los listados y dashboards sean coherentes entre sí.

---

## 23. Instrucciones para Codex

Cuando Codex trabaje estos flujos debe:

- traducir cada flujo a pantallas, componentes, estados y acciones;
- reutilizar formularios y validaciones siempre que sea posible;
- separar bien los flujos manuales de los asistidos por archivo;
- contemplar previsualización y confirmación en importaciones y parseos;
- evitar UX compleja en la primera versión;
- dejar la arquitectura preparada para mejorar extracción de PDFs e importaciones en iteraciones futuras.

---

## 24. Estado del documento

**Versión:** 1.0\
**Estado:** Borrador operativo\
**Basado en:** `00-project-brief.md` y `01-product-requirements.md`\
**Siguiente paso recomendado:** `03-data-model.md`

