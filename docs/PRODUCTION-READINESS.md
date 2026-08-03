# Revisión de producción — Milestone 6

## Validaciones automatizadas

| Comprobación | Resultado |
| --- | --- |
| ESLint | Aprobado |
| TypeScript estricto | Aprobado |
| Pruebas unitarias | 15 aprobadas |
| Build de producción | Aprobado |
| Playwright sin credenciales E2E | 10 escenarios omitidos de forma intencional |
| Revisión visual Playwright | 6/6 aprobada: 320, 375, 390, 430, 768 y 1440 px |

La revisión visual comprueba la pantalla de login, ausencia de overflow horizontal y foco visible por teclado en cada viewport. La experiencia pública y los flujos mutables requieren datos aislados de Supabase, por lo que deben ejecutarse en el entorno E2E antes de publicar.

## E2E

`e2e/invitations.spec.ts` cubre login, acceso no autorizado, creación, edición, archivo, apertura del enlace, RSVP positivo/negativo, actualización por upsert, límite de extras, enlace inválido e invitación inactiva. Para ejecutarla de verdad se requieren `E2E_TESTS=true`, `E2E_ADMIN_EMAIL`, `E2E_ADMIN_PASSWORD` y `E2E_TEST_SLUG` contra un proyecto Supabase de prueba, con evento publicado. No debe apuntarse a producción porque crea, modifica, responde y archiva una invitación.

## Accesibilidad y estabilidad

- El foco visible global usa el color dorado de la interfaz con offset.
- Los formularios usan labels, mensajes de error/estado accesibles y botones deshabilitados mientras guardan.
- El sobre público es un `button` operable por teclado y las animaciones respetan `prefers-reduced-motion`.
- La invitación pública tiene estados de carga, enlace no disponible y fallback de imagen.
- El RSVP usa upsert por invitación; el doble envío no puede crear duplicados.
- Las rutas administrativas se validan tanto en proxy como en el layout server-side por identidad y rol.
- La landing mantiene un ancho limitado, padding lateral móvil y un diálogo RSVP nativo que permite Escape y conserva el foco dentro del modal.

## Seguridad

- `.env.local` está ignorado por Git.
- La búsqueda de código no encontró logs de consola ni service role keys fuera de `src/lib/supabase/admin.ts`, protegido por `server-only`.
- No se encontraron secretos hardcodeados en el repositorio.
- `npm audit --omit=dev` reporta 3 vulnerabilidades altas transitivas en PostCSS/sharp a través de Next.js 16.2.12. La única corrección propuesta por npm baja Next.js a 9.3.3, un cambio mayor inválido; no se aplicó. Antes de producción, monitoriza una actualización compatible de Next.js que resuelva estos avisos.
