# XV Mariana

Aplicación de invitaciones digitales RSVP para los XV años de Mariana. Está construida como un único proyecto Next.js con App Router, TypeScript estricto, Supabase y Tailwind CSS.

## Requisitos

- Node.js 24 LTS
- npm
- Un proyecto Supabase PostgreSQL

## Instalación y desarrollo local

```bash
git clone <URL_DEL_REPOSITORIO>
cd xvmariana
cp .env.example .env.local
npm install
npm run dev
```

Abre `http://localhost:3000`. El panel administrativo está en `/admin/login` y cada invitación se abre en `/{public_slug}`.

## Variables de entorno

Completa `.env.local` con valores de un único proyecto Supabase:

```dotenv
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
NEXT_PUBLIC_APP_URL=http://localhost:3000
SUPABASE_SERVICE_ROLE_KEY=
```

`SUPABASE_SERVICE_ROLE_KEY` solo se usa en código marcado `server-only`; nunca debe llevar prefijo `NEXT_PUBLIC_`, incluirse en el navegador, imprimirse en logs ni subirse al repositorio.

## Supabase, migraciones y administrador

1. Crea el proyecto en Supabase y copia URL, Publishable key y Service role key desde la configuración del proyecto.
2. Aplica, en orden, todos los archivos de `supabase/migrations/`. Con Supabase CLI: `supabase db push` tras enlazar el proyecto. También puedes ejecutarlos desde SQL Editor.
3. Crea el usuario administrativo en **Authentication → Users**. La aplicación no ofrece registro público.
4. En SQL Editor crea su perfil, sustituyendo los marcadores:

   ```sql
   insert into public.profiles (id, full_name, role)
   values ('UUID_DEL_USUARIO', 'Nombre del administrador', 'admin');
   ```

5. Ejecuta `supabase/seed.sql` y actualiza la fecha de referencia y `is_published` del evento antes del lanzamiento. Una invitación pública solo se muestra si el evento está publicado.
6. Configura las variables en `.env.local` y entra por `/admin/login`.

### Supabase local y ejecución de migraciones

La configuración local vive en `supabase/config.toml`. Comprueba la CLI e inicia los servicios locales:

```bash
npx supabase --version
npx supabase start
```

Para reproducir el esquema desde cero en la base local aislada, incluidas todas las migraciones y el seed:

```bash
npx supabase db reset
```

Puedes revisar cambios de esquema locales con `npx supabase db diff`. Antes de aplicar en un proyecto remoto, confirma el destino y proporciona explícitamente `SUPABASE_PROJECT_REF`, `SUPABASE_ACCESS_TOKEN` y `SUPABASE_DB_PASSWORD`; entonces enlaza ese proyecto y ejecuta `npx supabase db push`. Nunca uses `--include-all` ni ejecutes `db push` contra producción sin esa confirmación.

## Pruebas y validación

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

La suite E2E usa Playwright. Para evitar tocar producción, solo se activa explícitamente contra un proyecto de prueba aislado, con un evento publicado y un slug que no exista todavía:

```dotenv
E2E_TESTS=true
E2E_ADMIN_EMAIL=
E2E_ADMIN_PASSWORD=
E2E_TEST_SLUG=
```

Instala Chromium una vez y ejecuta la suite:

```bash
npx playwright install chromium
npm run test:e2e
```

Los E2E cubren login y acceso no autorizado, crear/editar/archivar, enlace público, RSVP positivo/negativo y actualización, límite de extras, enlace inválido, invitación inactiva y los anchos 320, 375, 390, 430, 768 y 1440 px. Si las variables no están presentes, Playwright omite los escenarios con una razón explícita.

## Despliegue en Vercel

1. Sube el repositorio a GitHub, GitLab o Bitbucket.
2. En Vercel selecciona **New Project**, importa el repositorio y conserva el preset Next.js.
3. Añade las cuatro variables de producción en **Settings → Environment Variables**. Si no habrá dominio propio, usa la URL de producción estable del proyecto, por ejemplo `https://xvmariana.vercel.app`, como `NEXT_PUBLIC_APP_URL`.
4. Despliega primero una preview y valida login, invitación pública y RSVP con datos de prueba. Fusiona a la rama de producción solo después de validar.
5. Cada cambio de variables requiere un nuevo deployment.

Vercel crea previews para ramas no productivas y un deployment de producción al actualizar la rama configurada. Consulta la [documentación oficial de despliegues Git](https://vercel.com/docs/git) y de [variables de entorno](https://vercel.com/docs/environment-variables).

## Dominio `xvmariana.com`

1. En el proyecto Vercel abre **Settings → Domains** y agrega `xvmariana.com`; agrega `www.xvmariana.com` si deseas redirigirlo al dominio principal.
2. Sigue exactamente los registros DNS que muestra Vercel para tu registrador: un dominio apex usa registro A y un subdominio usa CNAME. Si el dominio pertenece a otra cuenta Vercel, completa primero la verificación TXT.
3. Espera a que Vercel confirme DNS y SSL, configura la redirección canónica elegida y cambia `NEXT_PUBLIC_APP_URL` a `https://xvmariana.com`.
4. Despliega otra vez y prueba un enlace copiado desde el panel, tanto dentro como fuera de WhatsApp.

Consulta la [guía oficial de dominios personalizados](https://vercel.com/docs/domains/working-with-domains/add-a-domain) para los valores DNS vigentes mostrados por Vercel.

## Checklist antes de enviar invitaciones

- [ ] Todas las migraciones están aplicadas y RLS sigue activo.
- [ ] El evento tiene fecha definitiva, `is_published = true` e imágenes finales accesibles.
- [ ] `NEXT_PUBLIC_APP_URL` apunta a la URL de producción definitiva (`https://tu-proyecto.vercel.app` si no hay dominio propio), nunca a localhost ni a una preview.
- [ ] Se generó, descargó y probó el QR de la landing desde `/admin/configuracion`; no se cambiará la URL anterior después de imprimirlo o compartirlo.
- [ ] No hay secretos en Git, logs, variables públicas ni capturas.
- [ ] Se probó login, creación, edición, archivado y restauración con una cuenta admin.
- [ ] Se probó RSVP positivo, negativo, edición y límites mediante un enlace de prueba.
- [ ] Se revisó un enlace en Safari/iOS, Android/Chrome y el navegador integrado de WhatsApp.
- [ ] `npm run lint`, `npm run typecheck`, `npm run test`, `npm run test:e2e` y `npm run build` están aprobados.
