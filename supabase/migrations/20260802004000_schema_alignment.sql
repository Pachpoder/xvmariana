-- Alinea el esquema ya existente con las reglas operativas de Supabase.
-- Las invitaciones siguen archivándose en la aplicación; esta cascada cubre únicamente
-- el borrado administrativo explícito de un evento.
alter table public.invitations drop constraint invitations_event_id_fkey;
alter table public.invitations
  add constraint invitations_event_id_fkey
  foreign key (event_id) references public.events(id) on delete cascade;

-- Los índices unique de slug e invitation_id ya existen de forma implícita.
create index if not exists invitations_is_active_idx on public.invitations(is_active);
create index if not exists invitations_archived_at_idx on public.invitations(archived_at);

comment on function public.validate_rsvp_limits() is
  'Verifica en PostgreSQL los límites de invitados nombrados y acompañantes antes de cada RSVP.';
comment on function public.validate_rsvp_submission() is
  'Rechaza RSVP nuevos o modificados para invitaciones inactivas, archivadas o fuera de deadline.';
