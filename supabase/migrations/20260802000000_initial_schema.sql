create extension if not exists "pgcrypto";

create type public.app_role as enum ('admin');
create type public.rsvp_response as enum ('attending', 'not_attending');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.events (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(trim(name)) > 0),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  invitation_image_path text not null check (char_length(trim(invitation_image_path)) > 0),
  loading_image_path text,
  event_date timestamptz not null,
  rsvp_deadline timestamptz,
  loading_duration_ms integer not null default 3000 check (loading_duration_ms between 0 and 10000),
  is_published boolean not null default false,
  created_by uuid not null references public.profiles(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (rsvp_deadline is null or rsvp_deadline <= event_date)
);

create table public.invitations (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete restrict,
  label text not null check (char_length(trim(label)) > 0),
  public_slug text not null unique check (public_slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*-[a-z0-9]{6}$'),
  max_extra_guests integer not null default 0 check (max_extra_guests >= 0),
  internal_notes text,
  is_active boolean not null default true,
  archived_at timestamptz,
  created_by uuid not null references public.profiles(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (public_slug not in ('admin', 'api', 'login', 'favicon', 'robots')),
  check ((archived_at is null) or (archived_at >= created_at))
);

create table public.invitation_guests (
  id uuid primary key default gen_random_uuid(),
  invitation_id uuid not null references public.invitations(id) on delete cascade,
  full_name text not null check (char_length(trim(full_name)) > 0),
  is_primary boolean not null default false,
  sort_order integer not null default 0 check (sort_order >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (invitation_id, sort_order)
);

create unique index invitation_guests_one_primary_per_invitation on public.invitation_guests (invitation_id) where is_primary;

create table public.rsvps (
  id uuid primary key default gen_random_uuid(),
  invitation_id uuid not null unique references public.invitations(id) on delete cascade,
  response public.rsvp_response not null,
  named_guests_attending integer not null default 0 check (named_guests_attending >= 0),
  extra_guests_attending integer not null default 0 check (extra_guests_attending >= 0),
  message text check (message is null or char_length(message) <= 500),
  responded_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (response = 'attending' or (named_guests_attending = 0 and extra_guests_attending = 0))
);

create index events_created_by_idx on public.events(created_by);
create index invitations_event_id_idx on public.invitations(event_id);
create index invitations_active_unarchived_idx on public.invitations(event_id) where is_active and archived_at is null;
create index invitation_guests_invitation_id_idx on public.invitation_guests(invitation_id);
create index rsvps_response_idx on public.rsvps(response);

create function public.set_updated_at() returns trigger language plpgsql set search_path = public as $$ begin new.updated_at = now(); return new; end; $$;
create function public.is_admin() returns boolean language sql stable security definer set search_path = public as $$ select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'); $$;
create function public.validate_rsvp_limits() returns trigger language plpgsql set search_path = public as $$ declare max_extras integer; named_guests integer; begin select i.max_extra_guests, count(g.id) into max_extras, named_guests from public.invitations i left join public.invitation_guests g on g.invitation_id = i.id where i.id = new.invitation_id group by i.max_extra_guests; if max_extras is null then raise exception 'Invitation does not exist'; end if; if new.extra_guests_attending > max_extras then raise exception 'Extra guests exceed invitation limit'; end if; if new.named_guests_attending > named_guests then raise exception 'Named guests exceed invitation limit'; end if; return new; end; $$;
create function public.validate_invitation_has_guests() returns trigger language plpgsql set search_path = public as $$ declare target_id uuid; begin if tg_table_name = 'invitations' then target_id := new.id; else target_id := coalesce(new.invitation_id, old.invitation_id); end if; if exists (select 1 from public.invitations where id = target_id) and not exists (select 1 from public.invitation_guests where invitation_id = target_id) then raise exception 'An invitation must contain at least one guest'; end if; return null; end; $$;

create trigger profiles_set_updated_at before update on public.profiles for each row execute function public.set_updated_at();
create trigger events_set_updated_at before update on public.events for each row execute function public.set_updated_at();
create trigger invitations_set_updated_at before update on public.invitations for each row execute function public.set_updated_at();
create trigger invitation_guests_set_updated_at before update on public.invitation_guests for each row execute function public.set_updated_at();
create trigger rsvps_set_updated_at before update on public.rsvps for each row execute function public.set_updated_at();
create trigger rsvps_validate_limits before insert or update on public.rsvps for each row execute function public.validate_rsvp_limits();
create constraint trigger invitations_require_guest after insert on public.invitations deferrable initially deferred for each row execute function public.validate_invitation_has_guests();
create constraint trigger invitation_guests_require_guest after delete on public.invitation_guests deferrable initially deferred for each row execute function public.validate_invitation_has_guests();

alter table public.profiles enable row level security;
alter table public.events enable row level security;
alter table public.invitations enable row level security;
alter table public.invitation_guests enable row level security;
alter table public.rsvps enable row level security;

create policy "profiles: admins manage" on public.profiles for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "events: admins manage" on public.events for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "invitations: admins manage" on public.invitations for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "invitation guests: admins manage" on public.invitation_guests for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "rsvps: admins manage" on public.rsvps for all to authenticated using (public.is_admin()) with check (public.is_admin());

revoke all on public.profiles, public.events, public.invitations, public.invitation_guests, public.rsvps from anon;
grant select, insert, update, delete on public.profiles, public.events, public.invitations, public.invitation_guests, public.rsvps to authenticated;
