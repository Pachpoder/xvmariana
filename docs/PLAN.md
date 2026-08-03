# Plan de implementación

## Estado actual

| Milestone | Estado | Alcance |
| --- | --- | --- |
| 1 | Completado | Proyecto Next.js, dependencias, estructura, documentación, rutas y UI placeholder. |
| 2 | Completado | Supabase, migraciones, RLS, autenticación, seed y primer administrador. |
| 3 | Completado | CRUD de invitaciones, nombres, slugs, filtros y archivado. |
| 4 | Completado | Experiencia pública, loading, sobre, animación y responsive. |
| 5 | Completado | RSVP, actualización de respuestas, estadísticas y límites. |
| 6 | Completado | Pruebas amplias, accesibilidad, revisión móvil, Vercel y documentación de despliegue. |

## Registro del Milestone 1

- Inicializado Next.js 16 con App Router, TypeScript, ESLint, Tailwind CSS, directorio `src` y alias `@/*`.
- Añadidas las dependencias planificadas sin configurar credenciales ni clientes Supabase.
- Creadas las rutas administrativas y públicas como placeholders sin datos falsos ni mutaciones.
- Añadidos assets SVG de placeholder, scripts de calidad y documentación inicial.
- Validaciones ejecutadas: lint, typecheck, test y build.

## Próximo trabajo permitido

Todos los milestones planificados están completados. Las siguientes tareas deben definirse explícitamente como mantenimiento, corrección o una nueva fase.

## Mantenimiento — configuración administrativa y landing fija

- Simplificada la pantalla `/admin/configuracion`: conserva solamente los datos operativos del evento y las invitaciones personales.
- La landing de `/` ya no consulta ni modifica contenido editorial desde Supabase o el administrador. Sus textos, imágenes, lugares, agenda y secciones se editan directamente en `src/lib/landing-content.ts`.
- Las respuestas enviadas desde el formulario de la landing continúan guardándose en `landing_rsvp_submissions` y se consultan desde el panel administrativo.
- Añadido un generador y descarga PNG del QR fijo de la landing en `/admin/configuracion`. Usa la URL explícita `NEXT_PUBLIC_APP_URL`, para evitar QR ligados a previews, y `qrcode` como dependencia de producción para generarlo localmente sin un servicio externo.

## Landing pública principal

- La landing pública en `/` evoluciona como una fase posterior a los milestones, sin sustituir la ruta de invitación personalizada `/[slug]`.
- Presenta una experiencia vertical, responsive y centrada con banner, corona, nombre, imagen, descripción, detalles, música y CTA de confirmación preparado para la próxima integración.
- La landing quedó como composición fija de componentes de React. Su contenido se define en código y no depende de la configuración editorial almacenada en el evento.
- Las rutas `/[slug]`, administrativas, métricas, CRUD y lógica RSVP existente no se modificaron. La landing respeta foco visible, navegación por teclado, fallback de imágenes y bloqueo de autoplay del navegador.
- El CTA de la landing usa un formulario independiente de las invitaciones personales. Guarda nombre, apellido y respuesta en `landing_rsvp_submissions`, una tabla con RLS y políticas administrativas propias; las confirmaciones por `/[slug]` y sus RSVP no cambian.
- Pulida la landing y el modal RSVP: márgenes móviles consistentes, tipografía fluida para el nombre, controles de al menos 44 px, diálogo nativo con foco retenido y Escape, y una regla global de movimiento reducido. La prueba E2E de landing cubre 320, 375, 390, 430, 768, 1024 y 1440 px, además de apertura y cierre por teclado del RSVP; acepta un puerto y comando de servidor alternativos para no reutilizar un proceso de desarrollo ajeno.
- Revisión final: eliminadas referencias de UI obsoletas detectadas por ESLint; lint, TypeScript, 21 pruebas unitarias y build siguen aprobados. La landing conserva contenedor centrado, foco visible global, diálogo nativo RSVP y reducción de movimiento.

## Mantenimiento de migraciones Supabase

- Inicializada la configuración local `supabase/config.toml` mediante Supabase CLI, sin enlace remoto.
- Conservadas las migraciones existentes y añadida una migración incremental para cascada de eventos, índices operativos y comentarios de reglas no evidentes.
- Ajustado el seed a `xv-mariana` y `/assets/invitacion-placeholder.svg`; no inserta evento hasta que exista un perfil administrador.
- La ejecución remota queda bloqueada hasta recibir `SUPABASE_PROJECT_REF`, `SUPABASE_ACCESS_TOKEN` y `SUPABASE_DB_PASSWORD` del usuario y confirmar el proyecto destino.
- Ejecutado `npx supabase db reset` en Supabase local: las cinco migraciones y el seed se aplicaron desde cero. Verificados RLS, políticas administrativas, claves foráneas, checks, índices, triggers y bloqueo de SELECT para `anon`.

## Registro del Milestone 6

- Añadidos Playwright y escenarios E2E protegidos por variables `E2E_*`, para no modificar un proyecto Supabase no aislado.
- Añadidas comprobaciones de layout y foco visible por teclado para 320, 375, 390, 430, 768 y 1440 px; las seis pasaron.
- Añadido foco visible global y exclusiones Git para artefactos Playwright.
- Actualizado README con instalación, Supabase, migraciones, administrador, pruebas, Vercel, dominio y checklist de envío.
- Documentada la revisión de accesibilidad, seguridad, estabilidad y auditoría de dependencias en `docs/PRODUCTION-READINESS.md`.
- Lint, typecheck, 15 pruebas unitarias y build aprobados. Los 10 E2E que mutan datos quedan intencionalmente omitidos sin credenciales de prueba aisladas.

## Registro del Milestone 5

- Implementado RSVP público editable con asistencia/declinación, conteos, mensaje, honeypot y confirmación accesible.
- Validación Zod compartida en cliente y servidor; los límites se vuelven a calcular con datos de la base antes del upsert.
- La migración añade validación SQL para invitaciones inactivas/archivadas y deadlines, complementando los límites ya existentes.
- Se usa `upsert` por `invitation_id`, por lo que una modificación actualiza la respuesta existente sin crear duplicados; las declinaciones guardan ambos conteos en cero.
- Dashboard conectado con métricas de invitaciones, estados RSVP, personas, extras, total estimado y última respuesta en America/Guatemala.
- Añadidas pruebas de límites, declinación, identidad de upsert, inactividad y deadline.

## Registro del Milestone 4

- Creada la consulta pública server-only que usa la service role para sortear RLS sin exponer acceso anónimo directo y transforma el resultado en un DTO limitado.
- La ruta pública muestra una pantalla segura cuando el slug no existe, la invitación está inactiva o archivada, o el evento no está publicado.
- Implementada la secuencia loading, sobre, apertura y tarjeta con Motion for React; la imagen se precarga en navegador durante el loading sin bloquear el servidor.
- El sobre es un botón accesible y las animaciones respetan `prefers-reduced-motion`.
- La tarjeta muestra solo nombres, imagen general y extras permitidos; las notas internas no se consultan ni envían al navegador.
- Añadidos metadatos `noindex, nofollow`, Open Graph genérico, fallback visual de imagen y CTA RSVP sin mutación.
- Añadidas pruebas de transición de estados de la experiencia.

## Registro del Milestone 3

- Implementado listado adaptable: tabla en escritorio, tarjetas en móvil, búsqueda por nombre, filtro de RSVP y paginación.
- Añadidos formularios de creación y edición con nombres dinámicos, un principal obligatorio, extras, notas internas y slug opcional.
- Los slugs automáticos usan un sufijo aleatorio de seis caracteres; los personalizados se normalizan y se validan contra reservas y duplicados.
- Las mutaciones se realizan con Server Actions y funciones SQL atómicas para respetar el mínimo de un invitado y preservar RSVP existentes.
- Una migración de integridad adicional permite slugs personalizados y garantiza en base de datos exactamente un invitado principal por invitación.
- Archivado y restauración no eliminan RSVP; el archivado requiere confirmación del navegador.
- Incorporados enlaces copiables a partir de `NEXT_PUBLIC_APP_URL`, con notificaciones Sonner y revalidación de rutas.
- Añadido `tsx` como dependencia de desarrollo para ejecutar las pruebas TypeScript de slug y validación sin añadir código al bundle de producción.

## Registro del Milestone 2

- Añadidos clientes Supabase de navegador, SSR y administración server-only; las variables se leen solo al ejecutarse, por lo que el proyecto puede compilar sin credenciales.
- Creada la migración inicial con RLS, políticas exclusivamente administrativas, restricciones de dominio, índices y triggers.
- Protegido `/admin` con proxy y guard de servidor basado en `getClaims()` y `profiles.role`.
- Implementado inicio de sesión por email y contraseña sin registro público.
- Añadido seed idempotente del evento con assets placeholder y guía de puesta en marcha.

## Puesta en marcha de Supabase

1. Crea un proyecto en [Supabase](https://supabase.com/dashboard), espera a que esté listo y abre **Connect** o **Settings → API**. Copia la URL del proyecto y la **Publishable key**; no copies valores de otro proyecto.
2. En el SQL Editor, ejecuta primero el contenido de `supabase/migrations/20260802000000_initial_schema.sql`. Esto crea las tablas, restricciones, RLS y políticas. Si usas la CLI de Supabase, enlaza el proyecto y aplica la migración con `supabase db push`.
3. En **Authentication → Users**, crea el usuario administrativo con correo y contraseña. No habilites una página de registro en esta aplicación.
4. Copia el UUID del usuario creado y, desde el SQL Editor, ejecuta lo siguiente reemplazando los marcadores con datos reales:

   ```sql
   insert into public.profiles (id, full_name, role)
   values ('UUID_DEL_USUARIO', 'Nombre del administrador', 'admin');
   ```

5. Ejecuta `supabase/seed.sql` en el SQL Editor. Crea el evento `XV Años de Mariana` con los SVG placeholder locales. La fecha de referencia del seed debe actualizarse con la fecha definitiva antes de publicar.
6. Copia `.env.example` a `.env.local` y completa `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` y `SUPABASE_SERVICE_ROLE_KEY` con valores del mismo proyecto. La última clave solo se utiliza en servidor y jamás debe recibir prefijo `NEXT_PUBLIC_`.
7. Inicia `npm run dev`, abre `/admin/login` e ingresa con el usuario al que acabas de asignar el perfil `admin`.
