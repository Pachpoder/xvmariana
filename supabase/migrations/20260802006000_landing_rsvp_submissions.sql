-- Respuestas independientes enviadas desde la landing pública. No se relacionan
-- con invitaciones personales ni modifican sus RSVP existentes.
create table public.landing_rsvp_submissions (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  first_name text not null check (char_length(trim(first_name)) between 1 and 80),
  last_name text not null check (char_length(trim(last_name)) between 1 and 120),
  response public.rsvp_response not null,
  created_at timestamptz not null default now()
);

create index landing_rsvp_submissions_event_created_idx on public.landing_rsvp_submissions(event_id, created_at desc);
create index landing_rsvp_submissions_response_idx on public.landing_rsvp_submissions(response);

alter table public.landing_rsvp_submissions enable row level security;
revoke all on public.landing_rsvp_submissions from anon;
grant select, insert, update, delete on public.landing_rsvp_submissions to authenticated;

create policy "landing RSVP submissions: admins manage"
  on public.landing_rsvp_submissions for all to authenticated
  using (public.is_admin()) with check (public.is_admin());
