# Guía de contribución — XV Mariana

## Stack obligatorio

- Next.js con App Router, TypeScript estricto, React incluido en Next.js y Node.js 24 LTS.
- npm con `package-lock.json`, Tailwind CSS, Motion for React (`motion/react`), Supabase (`@supabase/supabase-js` y `@supabase/ssr`), React Hook Form, Zod, Lucide React, Sonner, clsx y tailwind-merge.
- Server Components por defecto; Client Components solo para estado o APIs del navegador. Mutaciones mediante Server Actions.
- No usar Express ni añadir un ORM en esta primera versión.

## Reglas de arquitectura

- Leer `docs/PLAN.md` antes de comenzar cualquier tarea e implementar solamente un milestone por tarea.
- Mantener la organización en `src/actions`, `src/components`, `src/lib`, `src/types` y `supabase/migrations`.
- Las consultas deben vivir en `src/lib/queries`; las validaciones Zod en `src/lib/validation`.
- No agregar dependencias de producción sin justificarlo en la documentación o la tarea correspondiente.
- Actualizar `docs/PLAN.md` al finalizar el trabajo.

## Reglas de seguridad

- Nunca exponer secretos ni inventar credenciales. Las claves `SUPABASE_SERVICE_ROLE_KEY` solo pueden utilizarse en código server-only.
- Nunca usar service role en una variable `NEXT_PUBLIC`.
- Al integrar Supabase: habilitar RLS, no permitir acceso anónimo directo y verificar autenticación y rol en cada Server Action administrativa.
- La página pública solo debe recibir DTOs sanitizados: nunca incluir notas internas, ni nombres privados en Open Graph.

## Comandos de validación

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

## Definición de terminado

Un milestone está terminado cuando su alcance se implementó sin adelantar trabajo de milestones posteriores, la documentación se actualizó y los cuatro comandos de validación pasan.
