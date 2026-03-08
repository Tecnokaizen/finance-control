# 07 · Acceptance Criteria

## 1. Propósito del documento

Este documento define los criterios de aceptación del MVP para la app de control financiero. Su objetivo es establecer, de forma verificable, cuándo una funcionalidad puede considerarse correctamente implementada desde el punto de vista de producto, negocio y experiencia de usuario.

Sirve para:

- validar que una feature está realmente terminada,
- alinear producto, diseño, frontend y backend,
- reducir ambigüedad en la implementación,
- ayudar a Codex a construir con una definición clara de “done”,
- facilitar QA manual o automatizable.

---

## 2. Qué son los acceptance criteria

Los criterios de aceptación responden a esta pregunta:

**“¿Qué tiene que pasar para considerar que esta funcionalidad cumple lo esperado?”**

No describen solo validación de datos, sino también:

- comportamiento funcional,
- estados visibles,
- respuesta del sistema,
- experiencia mínima esperada,
- consistencia con el resto del producto.

---

## 3. Acceptance criteria vs validation

### Validation
Responde a:
**“¿los datos son válidos?”**

Ejemplos:
- el importe debe ser mayor que 0,
- la fecha debe tener formato correcto,
- el archivo debe ser PDF.

### Acceptance criteria
Responde a:
**“¿la funcionalidad se comporta como debe?”**

Ejemplos:
- el usuario puede subir un PDF y ver una preview antes de guardar,
- el usuario puede corregir datos sugeridos por el sistema,
- la importación CSV muestra errores por fila antes de confirmar.

---

## 4. Principios para redactar criterios de aceptación

1. Deben ser observables.
2. Deben ser comprobables.
3. Deben evitar ambigüedad.
4. Deben centrarse en resultado, no en implementación interna.
5. Deben reflejar el comportamiento mínimo del MVP.
6. Deben ser suficientemente concretos para QA y desarrollo.

---

## 5. Estructura recomendada

Cada módulo se define con:

- objetivo funcional,
- condiciones mínimas de aceptación,
- errores y estados mínimos,
- observaciones de UX si aplica.

Cuando convenga, pueden leerse en formato tipo:

- dado...
- cuando...
- entonces...

Pero para este kit se prioriza una estructura más operativa y directa.

---

## 6. Módulo: autenticación

### 6.1 Registro

#### Se considera aceptado si:
- el usuario puede crear una cuenta con email y contraseña válidos;
- si los datos son correctos, el sistema crea la cuenta sin errores;
- el usuario accede a la app o entra en el flujo definido de verificación;
- si el email ya existe, el sistema lo informa con un mensaje claro;
- si faltan campos obligatorios o son inválidos, el formulario muestra errores comprensibles;
- tras el registro correcto, el usuario llega al dashboard o a un estado inicial válido.

### 6.2 Inicio de sesión

#### Se considera aceptado si:
- el usuario puede iniciar sesión con credenciales válidas;
- si las credenciales son incorrectas, recibe un mensaje claro;
- tras iniciar sesión, accede a su entorno y no a datos de otros usuarios;
- las rutas privadas quedan protegidas;
- al cerrar sesión, el usuario pierde acceso a zonas privadas.

---

## 7. Módulo: perfil y negocio

### 7.1 Perfil

#### Se considera aceptado si:
- el usuario puede consultar sus datos básicos de perfil;
- el usuario puede editar su nombre, moneda por defecto y zona horaria si aplica;
- los cambios persistidos se reflejan al volver a cargar la app;
- un usuario no puede editar el perfil de otro.

### 7.2 Negocio actual

#### Se considera aceptado si:
- el usuario puede consultar el negocio activo;
- el usuario puede editar nombre y datos básicos del negocio;
- todos los recursos creados después quedan vinculados al negocio correcto;
- los datos mostrados en la app corresponden solo al negocio permitido por sesión.

---

## 8. Módulo: dashboard

### Objetivo
Ofrecer una visión rápida y fiable del estado financiero del periodo seleccionado.

#### Se considera aceptado si:
- al entrar al dashboard se muestran KPIs principales sin pasos adicionales;
- el dashboard muestra, como mínimo, ingresos, gastos, beneficio neto y facturas pendientes;
- el usuario puede cambiar el rango temporal y los datos se actualizan;
- los valores del dashboard coinciden con los datos persistidos y los filtros aplicados;
- si no hay datos, se muestra un estado vacío útil y accionable;
- el dashboard incluye accesos rápidos a acciones frecuentes;
- los últimos movimientos mostrados son coherentes con el listado real.

#### No se considera aceptado si:
- los KPI no cuadran con el listado filtrado;
- el dashboard queda vacío sin explicación;
- el cambio de periodo no refresca la información correctamente.

---

## 9. Módulo: categorías

### Objetivo
Permitir clasificar ingresos y gastos de forma consistente.

#### Se considera aceptado si:
- el usuario puede crear una categoría de ingreso o gasto;
- la categoría creada aparece disponible en formularios y filtros;
- el usuario puede editar una categoría existente;
- si se soporta borrado, el sistema gestiona correctamente categorías en uso;
- el sistema no permite usar una categoría incompatible con el tipo de movimiento;
- si existen subcategorías, estas quedan correctamente asociadas.

---

## 10. Módulo: terceros (clientes y proveedores)

### Objetivo
Permitir reutilizar clientes y proveedores en movimientos y facturas.

#### Se considera aceptado si:
- el usuario puede crear un tercero desde su sección o desde un formulario relacionado;
- el tercero queda disponible para futuras selecciones;
- el usuario puede editar sus datos;
- el usuario puede asociarlo a transacciones y facturas;
- los filtros por tercero funcionan correctamente en los listados.

---

## 11. Módulo: transacciones manuales

### 11.1 Alta manual de ingreso

#### Se considera aceptado si:
- el usuario puede crear un ingreso desde un formulario claro;
- tras guardar, el ingreso aparece en el listado correspondiente;
- el ingreso impacta correctamente en dashboard y reportes;
- si faltan campos obligatorios, el sistema lo indica antes de guardar;
- el usuario puede editar el ingreso después de crearlo;
- el usuario puede eliminarlo si el flujo lo permite.

### 11.2 Alta manual de gasto

#### Se considera aceptado si:
- el usuario puede crear un gasto desde un formulario claro;
- tras guardar, el gasto aparece en el listado correspondiente;
- el gasto impacta correctamente en dashboard y reportes;
- si faltan campos obligatorios, el sistema lo indica antes de guardar;
- el usuario puede editar el gasto después de crearlo;
- el usuario puede eliminarlo si el flujo lo permite.

### 11.3 Listado de transacciones

#### Se considera aceptado si:
- el usuario puede consultar una vista de movimientos;
- el listado muestra datos clave suficientes para identificar cada registro;
- el usuario puede filtrar por fecha, tipo, categoría, estado y tercero;
- el usuario puede buscar registros por texto;
- los filtros combinados devuelven resultados coherentes;
- abrir una transacción muestra o permite acceder a su detalle;
- editar o eliminar una transacción actualiza correctamente la información visible.

---

## 12. Módulo: facturas

### 12.1 Alta de factura

#### Se considera aceptado si:
- el usuario puede crear una factura emitida o recibida;
- la factura guarda tipo, estado, fechas, importe y tercero si aplica;
- la factura aparece en el listado tras guardarla;
- si hay documento adjunto, queda vinculado correctamente;
- los errores de campos obligatorios se muestran antes de persistir.

### 12.2 Seguimiento de facturas

#### Se considera aceptado si:
- el usuario puede listar facturas;
- puede filtrar por estado, fechas y tercero;
- puede identificar fácilmente facturas pendientes o vencidas;
- cambiar el estado de una factura se refleja correctamente en el sistema;
- el contador de facturas pendientes del dashboard se actualiza de forma coherente.

---

## 13. Módulo: documentos PDF

### 13.1 Subida de PDF

#### Se considera aceptado si:
- el usuario puede subir un archivo PDF válido;
- el sistema rechaza archivos no soportados con mensaje claro;
- el sistema guarda el documento y lo deja disponible para revisión;
- el documento queda asociado al negocio y usuario correctos.

### 13.2 Vista previa de PDF

#### Se considera aceptado si:
- tras subir un PDF, el usuario puede ver una preview antes de confirmar acciones finales;
- si la preview no puede generarse, el sistema informa del problema;
- si el archivo se ha subido correctamente, el usuario puede seguir trabajando con el documento aunque el parseo falle.

### 13.3 Parseo de PDF

#### Se considera aceptado si:
- el usuario puede lanzar el procesamiento del PDF;
- el sistema devuelve un resultado parseado, parcial o fallido de forma explícita;
- cuando se detectan datos, estos se muestran como sugerencias editables;
- el sistema no consolida automáticamente un registro final sin confirmación humana en el MVP;
- si el parseo falla, el usuario puede completar el formulario manualmente usando el documento como referencia.

### 13.4 Aplicación del parseo a registro final

#### Se considera aceptado si:
- el usuario puede revisar y corregir datos sugeridos antes de guardar;
- el formulario derivado del parseo permite completar campos no detectados;
- el usuario puede crear desde el PDF una transacción o una factura;
- el registro final queda vinculado al `documentId` correspondiente;
- el resultado final cumple las mismas reglas que un alta manual.

### 13.5 Edición posterior de factura o documento parseado

#### Se considera aceptado si:
- la factura o documento generado desde PDF sigue siendo editable tras su creación;
- el usuario puede añadir o modificar categoría, subcategoría si procede y campos no parseados inicialmente;
- los cambios posteriores quedan persistidos correctamente;
- la edición no rompe la trazabilidad con el documento origen.

---

## 14. Módulo: importación CSV

### 14.1 Descarga de plantilla

#### Se considera aceptado si:
- el usuario puede descargar una plantilla CSV de ejemplo;
- la plantilla contiene columnas mínimas necesarias;
- la plantilla es coherente con el formato esperado por el sistema.

### 14.2 Subida de CSV

#### Se considera aceptado si:
- el usuario puede subir un archivo CSV válido;
- el sistema detecta cabeceras y crea una importación en estado inicial válido;
- si el archivo no es válido o está corrupto, el sistema lo informa claramente.

### 14.3 Mapeo de columnas

#### Se considera aceptado si:
- el sistema propone un mapeo inicial de columnas cuando sea posible;
- el usuario puede corregir el mapeo antes de validar;
- el sistema no permite continuar sin mapeo mínimo requerido.

### 14.4 Validación previa

#### Se considera aceptado si:
- el usuario puede revisar una preview antes de importar;
- el sistema muestra errores por fila y por campo cuando los haya;
- el sistema distingue entre errores bloqueantes y advertencias si aplica;
- el resumen de validación refleja correctamente filas válidas e inválidas.

### 14.5 Ejecución de importación

#### Se considera aceptado si:
- el usuario puede confirmar la importación tras la validación;
- los registros válidos se crean correctamente según el modo elegido;
- el sistema devuelve un resumen final del proceso;
- los registros creados quedan vinculados al `importId` correspondiente;
- los datos importados aparecen en listados, dashboard y reportes cuando corresponda.

### 14.6 Corrección de errores

#### Se considera aceptado si:
- el usuario puede identificar con claridad qué filas fallaron;
- el sistema explica el motivo del error;
- el usuario puede repetir el flujo tras corregir el CSV;
- una importación fallida o parcial no contamina silenciosamente la base de datos.

---

## 15. Módulo: reportes

### Objetivo
Ofrecer lectura rápida y fiable de la evolución financiera.

#### Se considera aceptado si:
- el usuario puede consultar un resumen mensual;
- el usuario puede consultar un resumen anual si está dentro del alcance del MVP;
- los totales coinciden con transacciones y filtros equivalentes;
- las categorías principales mostradas son coherentes con los datos persistidos;
- si no hay datos en el periodo, el sistema lo comunica de forma clara.

---

## 16. Estados vacíos

### Se considera aceptado si:
- dashboard sin datos muestra una explicación y siguiente paso útil;
- listados vacíos no aparecen como pantallas rotas o incompletas;
- ausencia de categorías o terceros se resuelve con CTA clara;
- parseo PDF sin resultados sigue permitiendo avanzar manualmente;
- validación CSV sin filas válidas informa del problema y no deja al usuario bloqueado sin contexto.

---

## 17. Errores y feedback del sistema

### Se considera aceptado si:
- los errores de validación se muestran cerca del campo o de forma claramente asociada;
- los errores de servidor se informan sin lenguaje ambiguo;
- el usuario sabe qué ha fallado y qué puede hacer después;
- tras una acción exitosa, existe feedback visual suficiente;
- el sistema no deja al usuario en estados inciertos tras guardar, importar o procesar.

---

## 18. Seguridad y aislamiento de datos

### Se considera aceptado si:
- un usuario no puede consultar ni modificar datos de otro;
- todas las operaciones respetan el negocio activo o permitido;
- los IDs enviados manualmente no permiten acceder a recursos ajenos;
- las rutas privadas están protegidas;
- la sesión controla correctamente el acceso a recursos.

---

## 19. Rendimiento y experiencia mínima

### Se considera aceptado si:
- las vistas principales cargan de forma razonablemente rápida;
- las acciones frecuentes muestran feedback durante la espera si hace falta;
- la app es usable en escritorio y suficientemente funcional en móvil;
- la interfaz no obliga a pasos innecesarios en tareas comunes.

---

## 20. Criterios globales de aceptación del MVP

El MVP se considera aceptado si se cumplen conjuntamente estas condiciones:

1. el usuario puede autenticarse y trabajar en un entorno aislado;
2. puede crear, editar, listar y eliminar transacciones manuales;
3. puede crear, editar y seguir facturas;
4. puede gestionar categorías y terceros;
5. puede subir un PDF, ver preview, revisar parseo y convertirlo en registro utilizable;
6. puede importar CSV con plantilla, mapping, preview y validación previa;
7. dashboard y reportes reflejan correctamente los datos persistidos;
8. los errores son comprensibles y la app mantiene estados consistentes;
9. los flujos principales funcionan sin depender de trabajo manual fuera del sistema, salvo la corrección del propio CSV cuando proceda.

---

## 21. Formato sugerido para historias o QA

Codex o QA pueden reutilizar estos criterios y transformarlos en casos tipo:

- **Given** el usuario autenticado
- **When** crea un gasto válido
- **Then** el gasto aparece en el listado y actualiza el dashboard

O bien en checklist operativo:

- crear gasto válido
- comprobar persistencia
- comprobar impacto en dashboard
- comprobar edición posterior
- comprobar eliminación

---

## 22. Instrucciones para Codex

Cuando Codex use este documento debe:

- tomar estos criterios como definición mínima de completitud funcional;
- no dar por terminada una feature solo porque persista datos;
- verificar estados visibles, feedback y coherencia con dashboard/listados;
- aplicar el mismo estándar a flujos manuales, parseos PDF e importaciones CSV;
- dejar preparada la base para tests manuales o automatizados a partir de estos criterios.

---

## 23. Próximo documento recomendado

Después de este archivo, el siguiente que más sentido tiene es uno de estos:

- `08-frontend-architecture.md`
- `08-backend-architecture.md`
- `08-testing-strategy.md`

---

## 24. Estado del documento

**Versión:** 1.0  
**Estado:** Borrador operativo  
**Basado en:** `01-product-requirements.md`, `02-user-flows.md`, `05-api-spec.md` y `06-validation-schemas.md`  
**Siguiente paso recomendado:** `08-frontend-architecture.md` o `08-backend-architecture.md`
