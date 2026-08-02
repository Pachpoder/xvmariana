# Arquitectura

## Base de aplicación

Un único proyecto Next.js con App Router y TypeScript estricto. Las rutas y layouts son Server Components por defecto. Los Client Components se reservarán para animaciones Motion, formularios RSVP, clipboard y demás comportamiento de navegador.

## Organización

```text
src/
  actions/                 Server Actions (a partir del milestone correspondiente)
  app/                     Rutas App Router
  components/admin/        UI reutilizable del panel
  components/invitation/   UI de experiencia pública
  components/ui/           Primitivas compartidas
  lib/constants/           Constantes de dominio
  lib/queries/             Consultas de datos
  lib/auth/                Guards de autenticación y autorización
  lib/supabase/            Clientes browser, SSR y administrativo aislado
  lib/validation/          Esquemas Zod
  types/                   Tipos de dominio
supabase/migrations/       Migraciones SQL futuras
public/assets/             Assets estáticos
```

## Autenticación y autorización

`proxy.ts` refresca la sesión de Supabase y desvía solicitudes sin identidad válida fuera de `/admin/login`. El layout administrativo ejecuta además `requireAdmin()`: valida el JWT mediante `getClaims()` y consulta el rol `admin` en `profiles`. Esta segunda comprobación protege cada ruta administrativa incluso si el proxy no se ejecuta.

Los clientes se separan por contexto:

- `client.ts`: navegador, solo URL y publishable key públicas.
- `server.ts`: Server Components y Server Actions, con cookies SSR.
- `admin.ts`: service role, aislado con `server-only`; no se importa desde componentes de cliente.

## Base de datos y seguridad

La migración inicial crea los enums, tablas, índices, restricciones, triggers `updated_at` y triggers de reglas RSVP. Todas las tablas tienen RLS activado. No existen políticas para `anon`; únicamente un perfil con rol `admin` autenticado puede operar las tablas. La creación del primer perfil se realiza desde el SQL Editor con privilegios de propietario, no desde la aplicación.

## Experiencia pública

La página pública consulta en servidor mediante un DTO sanitizado. Las notas internas, IDs internos y secretos permanecen fuera del navegador. Las invitaciones públicas usan `noindex, nofollow` y metadatos genéricos.

## Migraciones y seed

`supabase/config.toml` contiene únicamente la configuración local de Supabase. Las migraciones son incrementales y no se eliminan: la inicial crea el dominio y las posteriores añaden funciones, reglas de integridad RSVP y ajustes de índices/foreign keys. La foreign key `invitations.event_id` elimina invitaciones únicamente ante un borrado explícito del evento; el flujo normal archiva invitaciones. El seed crea el evento solo después de que exista un perfil administrador, por lo que nunca inventa `created_by`.
