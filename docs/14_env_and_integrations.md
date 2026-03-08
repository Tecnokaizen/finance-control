# 14 · Env and Integrations

## 1. Propósito del documento

Este documento define las variables de entorno, integraciones externas y configuración operativa mínima del MVP para la app de control financiero. Su objetivo es evitar ambigüedad técnica al conectar frontend, backend, base de datos, storage, parseo de documentos, importaciones y despliegue.

Debe servir como referencia para:

- variables de entorno,
- servicios externos,
- credenciales necesarias,
- buckets y storage,
- configuración por entorno,
- buenas prácticas de seguridad,
- dependencias opcionales y futuras.

---

## 2. Objetivos del documento

Este documento debe dejar claro:

- qué integraciones necesita realmente el MVP,
- cuáles son obligatorias y cuáles opcionales,
- qué variables de entorno necesita cada capa,
- cómo separar local, staging y producción,
- qué secretos no deben exponerse,
- qué puntos pueden cambiar si evoluciona el producto.

---

## 3. Principios generales

1. Mantener el número de integraciones al mínimo en el MVP.
2. Separar claramente variables públicas y privadas.
3. No hardcodear secretos en el código.
4. Mantener nombres de variables consistentes.
5. Diferenciar valores por entorno.
6. Preparar el sistema para crecer sin rehacer la base.
7. Documentar qué depende de cada integración.

---

## 4. Integraciones principales del MVP

### Obligatorias
- **Supabase Auth**
- **Supabase Database (PostgreSQL)**
- **Supabase Storage**
- **Next.js app runtime**

### Muy recomendables
- **Vercel** o plataforma equivalente para despliegue
- librería de parseo PDF local o server-side
- librería de parseo CSV

### Opcionales en MVP
- servicio OCR externo
- servicio de logging/monitoring
- servicio de emails transaccionales
- analytics de producto
- colas o procesamiento asíncrono avanzado

---

## 5. Entornos recomendados

### 5.1 Local
Uso para desarrollo diario.

Debe permitir:
- auth de pruebas,
- base de datos de desarrollo,
- storage de pruebas,
- archivos PDF y CSV demo,
- ejecución rápida de cambios.

### 5.2 Staging
Uso para validación previa a producción.

Debe permitir:
- despliegue cercano a producción,
- variables separadas,
- base de datos separada,
- storage separado,
- pruebas E2E y QA realistas.

### 5.3 Production
Uso real con datos finales.

Debe tener:
- secretos definitivos,
- medidas de seguridad activas,
- acceso restringido,
- monitorización mínima.

---

## 6. Convención de variables de entorno

### Regla general
Usar prefijos claros según exposición:

- `NEXT_PUBLIC_` → variables seguras para frontend
- sin `NEXT_PUBLIC_` → secretos solo servidor

### Regla crítica
Nada sensible debe exponerse con `NEXT_PUBLIC_`.

---

## 7. Variables de entorno mínimas del MVP

## 7.1 Frontend público

### `NEXT_PUBLIC_APP_URL`
URL pública de la aplicación.

#### Ejemplos
- local: `http://localhost:3000`
- staging: `https://staging.tuapp.com`
- production: `https://tuapp.com`

### `NEXT_PUBLIC_SUPABASE_URL`
URL del proyecto Supabase.

### `NEXT_PUBLIC_SUPABASE_ANON_KEY`
Clave pública anónima de Supabase para cliente.

### `NEXT_PUBLIC_DEFAULT_CURRENCY`
Moneda por defecto de la app si se quiere centralizar.

#### Valor sugerido
- `EUR`

### `NEXT_PUBLIC_DEFAULT_TIMEZONE`
Zona horaria por defecto inicial.

#### Valor sugerido
- `Europe/Madrid`

---

## 7.2 Backend privado

### `SUPABASE_SERVICE_ROLE_KEY`
Clave privada de servicio para operaciones server-side con privilegios elevados.

### `DATABASE_URL`
Conexión directa a PostgreSQL si se necesita para migraciones o herramientas externas.

### `APP_ENV`
Entorno actual.

#### Valores sugeridos
- `local`
- `staging`
- `production`

### `APP_SECRET`
Secreto interno si la arquitectura necesita firmados, tokens o checks específicos.

### `MAX_UPLOAD_FILE_SIZE_MB`
Tamaño máximo permitido para subida de archivos.

#### Valor inicial sugerido
- `10`

### `ALLOWED_DOCUMENT_MIME_TYPES`
Lista de MIME types aceptados para documentos del MVP.

#### Valor sugerido
- `application/pdf`

### `ALLOWED_IMPORT_MIME_TYPES`
Lista de MIME types aceptados para imports.

#### Valores sugeridos
- `text/csv`
- `application/vnd.ms-excel`

### `PDF_PARSE_MODE`
Modo de parseo activo en el MVP.

#### Valores sugeridos
- `text_only`
- `text_plus_heuristics`

### `ENABLE_OCR`
Flag para activar OCR si en futuro se incorpora.

#### Valores sugeridos
- `false`
- `true`

### `ENABLE_BACKGROUND_JOBS`
Flag para activar procesamiento asíncrono futuro.

#### Valores sugeridos
- `false`
- `true`

---

## 7.3 Opcionales recomendables

### `SENTRY_DSN`
Para errores y monitoring, si se usa.

### `RESEND_API_KEY` o equivalente
Para emails transaccionales, si se implementan.

### `POSTHOG_KEY` o equivalente
Para analytics de producto, si se desea.

### `OCR_PROVIDER_API_KEY`
Si se usa OCR externo en una fase posterior.

### `OCR_PROVIDER_BASE_URL`
Base URL del proveedor OCR si aplica.

---

## 8. Archivo `.env.example` recomendado

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_DEFAULT_CURRENCY=EUR
NEXT_PUBLIC_DEFAULT_TIMEZONE=Europe/Madrid

SUPABASE_SERVICE_ROLE_KEY=
DATABASE_URL=
APP_ENV=local
APP_SECRET=
MAX_UPLOAD_FILE_SIZE_MB=10
ALLOWED_DOCUMENT_MIME_TYPES=application/pdf
ALLOWED_IMPORT_MIME_TYPES=text/csv,application/vnd.ms-excel
PDF_PARSE_MODE=text_plus_heuristics
ENABLE_OCR=false
ENABLE_BACKGROUND_JOBS=false

SENTRY_DSN=
RESEND_API_KEY=
POSTHOG_KEY=
OCR_PROVIDER_API_KEY=
OCR_PROVIDER_BASE_URL=
```

---

## 9. Supabase integration

### Servicios usados
- Auth
- Postgres
- Storage
- RLS

### Requisitos
- proyecto creado
- tablas desplegadas
- políticas RLS activas
- buckets configurados
- keys separadas por entorno

### Variables mínimas
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

### Reglas importantes
- el cliente público usa `anon key`
- operaciones privilegiadas solo desde servidor con `service role`
- nunca exponer `service role` al cliente

---

## 10. Supabase Storage strategy

### Buckets sugeridos
- `documents`
- `imports`
- `previews` opcional

### Recomendación práctica MVP
Se puede empezar con:
- `documents`
- `imports`

Y guardar previews dentro de `documents` si se prefiere simplificar.

### Paths sugeridos
```text
businesses/{businessId}/documents/{documentId}/original.pdf
businesses/{businessId}/documents/{documentId}/preview.jpg
businesses/{businessId}/imports/{importId}/source.csv
```

### Reglas
- nombres predecibles pero no inseguros
- paths segmentados por `businessId`
- mantener trazabilidad con `documentId` e `importId`

---

## 11. PDF parsing integration

### MVP recomendado
Usar parseo server-side simple, basado en:
- extracción de texto,
- heurísticas,
- normalización.

### Opciones de implementación
- librería local Node compatible con PDFs
- servicio externo solo si hace falta más precisión

### Recomendación de orden
#### MVP fase 1
- extracción de texto local
- heurísticas básicas
- sin OCR obligatorio

#### Fase posterior
- OCR opcional si se detecta necesidad real

### Variables relacionadas
- `PDF_PARSE_MODE`
- `ENABLE_OCR`
- `OCR_PROVIDER_API_KEY`
- `OCR_PROVIDER_BASE_URL`

### Regla crítica
La integración de parseo no debe saltarse el flujo humano de revisión.

---

## 12. CSV integration

### MVP recomendado
Usar parseo server-side con librería simple y robusta.

### Responsabilidades
- leer archivo,
- detectar cabeceras,
- normalizar delimitadores,
- transformar filas,
- validar por fila,
- guardar resultados.

### Variables relacionadas
No suele requerir secretos externos si se resuelve internamente.

### Regla
Evitar dependencia innecesaria de servicios externos para CSV en el MVP.

---

## 13. Email integration opcional

### Casos donde podría usarse
- verificación de cuenta
- reset de contraseña
- notificaciones de importación completada
- alertas futuras

### Recomendación MVP
No hacerlo núcleo del producto si Supabase Auth ya resuelve la parte básica.

### Si se integra
Variables posibles:
- `RESEND_API_KEY`
- `EMAIL_FROM`
- `EMAIL_REPLY_TO`

---

## 14. Error monitoring integration opcional

### Recomendación
Integrar monitoring si el proyecto va a tener uso real temprano.

### Candidato típico
- Sentry

### Variable
- `SENTRY_DSN`

### Eventos útiles a capturar
- fallos de parseo PDF
- fallos de importación CSV
- errores de storage
- errores de autorización
- errores inesperados en dashboard o reportes

---

## 15. Product analytics opcional

### Posibles herramientas
- PostHog
- Plausible
- alternativa simple

### Casos de uso
- saber cuántos usuarios usan importación CSV
- saber cuántos suben PDFs
- detectar abandono en flujos
- medir pantallas más usadas

### Recomendación MVP
Opcional. No debe bloquear el desarrollo del núcleo.

---

## 16. Integraciones futuras probables

Estas no son necesarias en la primera versión, pero conviene contemplarlas:

- OCR externo
- proveedor de email transaccional
- cola de trabajos o workers
- almacenamiento alternativo
- integración bancaria
- importación por email
- webhooks
- analytics avanzada
- feature flags

---

## 17. Configuración por entorno

## Local
### Objetivos
- facilidad de desarrollo
- errores visibles
- datos demo seguros

### Recomendaciones
- buckets de pruebas
- base de datos de desarrollo
- seeds pequeñas
- logs visibles

## Staging
### Objetivos
- simular producción
- validar despliegues
- ejecutar QA

### Recomendaciones
- proyecto Supabase separado
- dominios y variables separadas
- archivos de prueba controlados

## Production
### Objetivos
- estabilidad
- seguridad
- observabilidad mínima

### Recomendaciones
- secretos bien gestionados
- rotación de claves cuando corresponda
- RLS verificada
- acceso restringido al panel

---

## 18. Seguridad de secretos

### Reglas obligatorias
- no subir `.env` al repositorio
- usar `.env.example` sin secretos
- no loguear `service role` ni tokens sensibles
- no exponer claves privadas al cliente
- revisar configuración de despliegue antes de publicar

### Buenas prácticas
- variables separadas por entorno
- rotación de claves si se filtran
- revisar permisos de buckets
- revisar acceso a funciones administrativas

---

## 19. Validación de configuración al arrancar

### Recomendación
Crear un módulo de validación de env para fallar pronto si faltan variables críticas.

### Ejemplo conceptual
- validar que existen Supabase URL y keys
- validar límites de subida
- validar modo de parseo
- validar APP_ENV

### Beneficio
Evita errores silenciosos y acelera debugging.

---

## 20. Módulo sugerido de env config

### Estructura recomendada
```text
src/
  lib/
    env/
      client-env.ts
      server-env.ts
      env-schema.ts
```

### Recomendación
- `client-env.ts` expone solo variables públicas
- `server-env.ts` valida secretos y configuración interna
- `env-schema.ts` usa Zod para validar configuración

---

## 21. Ejemplo de schema de env con Zod

```ts
import { z } from 'zod'

export const serverEnvSchema = z.object({
  APP_ENV: z.enum(['local', 'staging', 'production']),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  DATABASE_URL: z.string().min(1),
  APP_SECRET: z.string().min(1),
  MAX_UPLOAD_FILE_SIZE_MB: z.coerce.number().positive(),
  PDF_PARSE_MODE: z.enum(['text_only', 'text_plus_heuristics']),
  ENABLE_OCR: z.enum(['true', 'false']),
  ENABLE_BACKGROUND_JOBS: z.enum(['true', 'false'])
})

export const clientEnvSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  NEXT_PUBLIC_DEFAULT_CURRENCY: z.string().length(3),
  NEXT_PUBLIC_DEFAULT_TIMEZONE: z.string().min(1)
})
```

---

## 22. Checklist mínimo de integración del MVP

### Supabase
- [ ] proyecto creado
- [ ] auth funcionando
- [ ] schema desplegado
- [ ] RLS activa
- [ ] buckets creados
- [ ] keys configuradas por entorno

### Next.js / despliegue
- [ ] variables públicas configuradas
- [ ] variables privadas configuradas
- [ ] redirects/callbacks revisados
- [ ] dominio público correcto

### PDF
- [ ] subida permitida
- [ ] parseo base resuelto
- [ ] flujo de preview definido

### CSV
- [ ] subida permitida
- [ ] parseo disponible
- [ ] mapping funcional
- [ ] preview y validación listas

---

## 23. Riesgos operativos a vigilar

### Riesgos comunes
- usar la key equivocada en cliente/servidor
- mezclar buckets o entornos
- no separar staging y production
- no validar env al arrancar
- acoplar el parseo PDF a un proveedor demasiado pronto
- exponer secretos en logs o errores

### Mitigación
- naming consistente
- schema de env validado
- proyectos separados por entorno
- documentación clara de secretos

---

## 24. Recomendaciones específicas para Codex

Cuando Codex implemente la configuración e integraciones debe:

- mantener separadas variables públicas y privadas;
- validar configuración al arrancar;
- no asumir que OCR, email o analytics existen si no están activados;
- tratar Supabase como integración central del MVP;
- evitar dependencias externas innecesarias en CSV;
- dejar el parseo PDF preparado para evolucionar sin romper contratos.

---

## 25. Relación con otros documentos del kit

Este documento debe leerse junto con:

- `04-db-schema-sql.md`
- `05-api-spec.md`
- `08-frontend-architecture.md`
- `09-backend-architecture.md`
- `10-testing-strategy.md`

---

## 26. Documentos pendientes del kit

Después de este archivo conviene preparar:

- `13-content-seo.md`
- `15-open-questions.md`
- `16-master-prompt.md`

---

## 27. Estado del documento

**Versión:** 1.0  
**Estado:** Borrador operativo  
**Basado en:** `08-frontend-architecture.md` y `09-backend-architecture.md`  
**Siguiente paso recomendado:** `15-open-questions.md` o `16-master-prompt.md`

