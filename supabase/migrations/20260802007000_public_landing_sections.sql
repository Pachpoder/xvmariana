create table public.event_landing_settings (
  event_id uuid primary key references public.events(id) on delete cascade,
  locations_section_enabled boolean not null default false,
  timeline_section_enabled boolean not null default false,
  dress_code_section_enabled boolean not null default false,
  attendance_section_enabled boolean not null default true,
  timeline_title text not null default 'Itinerario de actividades' check (char_length(trim(timeline_title)) between 1 and 120 and timeline_title !~ '<[^>]+>'),
  dress_code_title text not null default 'Código de vestimenta' check (char_length(trim(dress_code_title)) between 1 and 120 and dress_code_title !~ '<[^>]+>'),
  dress_code_label text not null default 'ETIQUETA' check (char_length(trim(dress_code_label)) between 1 and 60 and dress_code_label !~ '<[^>]+>'),
  dress_code_image_path text check (dress_code_image_path is null or dress_code_image_path ~ '^/' or dress_code_image_path ~ '^https://'),
  dress_code_message text not null default 'Con mucho cariño, les pedimos evitar el tono rosa pastel, ya que estará reservado especialmente para nuestra quinceañera, Mariana.' check (char_length(trim(dress_code_message)) between 1 and 1000 and dress_code_message !~ '<[^>]+>'),
  attendance_title text not null default 'Confirma tu asistencia' check (char_length(trim(attendance_title)) between 1 and 120 and attendance_title !~ '<[^>]+>'),
  attendance_button_text text not null default 'Confirma tu asistencia' check (char_length(trim(attendance_button_text)) between 1 and 80 and attendance_button_text !~ '<[^>]+>'),
  attendance_body_text text not null default 'Con mucho cariño, esta celebración está pensada para que adolescentes y adultos puedan compartir y disfrutar juntos.' check (char_length(trim(attendance_body_text)) between 1 and 1000 and attendance_body_text !~ '<[^>]+>'),
  attendance_closing_text text not null default 'Tu presencia y alegría harán que esta noche sea inolvidable.' check (char_length(trim(attendance_closing_text)) between 1 and 500 and attendance_closing_text !~ '<[^>]+>'),
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.event_locations (
 id uuid primary key default gen_random_uuid(), event_id uuid not null references public.events(id) on delete cascade,
 location_type text not null check (location_type in ('ceremony','reception')), title text not null check (char_length(trim(title)) between 1 and 120 and title !~ '<[^>]+>'),
 time_text text, venue_name text, address text, maps_url text check (maps_url is null or maps_url ~ '^https://'), icon_key text not null default 'map-pin', sort_order integer not null default 0 check (sort_order >= 0), is_visible boolean not null default false, created_at timestamptz not null default now(), updated_at timestamptz not null default now(), unique(event_id, location_type)
);
create table public.event_timeline_items (
 id uuid primary key default gen_random_uuid(), event_id uuid not null references public.events(id) on delete cascade,
 title text not null check (char_length(trim(title)) between 1 and 120 and title !~ '<[^>]+>'), time_text text not null check (char_length(trim(time_text)) between 1 and 40 and time_text !~ '<[^>]+>'), icon_key text not null check (icon_key in ('crown','dance','camera','party','clock','sparkles','music','heart','map-pin')), sort_order integer not null default 0 check (sort_order >= 0), is_visible boolean not null default true, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create index event_locations_event_id_idx on public.event_locations(event_id);
create index event_timeline_items_event_sort_idx on public.event_timeline_items(event_id, sort_order);
create trigger event_landing_settings_set_updated_at before update on public.event_landing_settings for each row execute function public.set_updated_at();
create trigger event_locations_set_updated_at before update on public.event_locations for each row execute function public.set_updated_at();
create trigger event_timeline_items_set_updated_at before update on public.event_timeline_items for each row execute function public.set_updated_at();
alter table public.event_landing_settings enable row level security; alter table public.event_locations enable row level security; alter table public.event_timeline_items enable row level security;
revoke all on public.event_landing_settings, public.event_locations, public.event_timeline_items from anon;
grant select, insert, update, delete on public.event_landing_settings, public.event_locations, public.event_timeline_items to authenticated;
create policy "landing settings: admins manage" on public.event_landing_settings for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "event locations: admins manage" on public.event_locations for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "event timeline: admins manage" on public.event_timeline_items for all to authenticated using (public.is_admin()) with check (public.is_admin());
insert into public.event_landing_settings(event_id) select id from public.events on conflict do nothing;
insert into public.event_locations(event_id,location_type,title,icon_key,sort_order,is_visible) select id,'ceremony','Misa de Acción de Gracias','church',0,false from public.events where slug='xv-mariana' on conflict do nothing;
insert into public.event_locations(event_id,location_type,title,icon_key,sort_order,is_visible) select id,'reception','Recepción','party',1,false from public.events where slug='xv-mariana' on conflict do nothing;
insert into public.event_timeline_items(event_id,time_text,title,icon_key,sort_order) select id,'6:00 PM','Llegada','crown',0 from public.events where slug='xv-mariana' on conflict do nothing;
insert into public.event_timeline_items(event_id,time_text,title,icon_key,sort_order) select id,'7:30 PM','Vals','dance',1 from public.events where slug='xv-mariana' on conflict do nothing;
insert into public.event_timeline_items(event_id,time_text,title,icon_key,sort_order) select id,'8:00 PM','Sesión de fotos','camera',2 from public.events where slug='xv-mariana' on conflict do nothing;
insert into public.event_timeline_items(event_id,time_text,title,icon_key,sort_order) select id,'10:30 PM','Fiesta','party',3 from public.events where slug='xv-mariana' on conflict do nothing;
insert into public.event_timeline_items(event_id,time_text,title,icon_key,sort_order) select id,'2:00 AM','Despedida','clock',4 from public.events where slug='xv-mariana' on conflict do nothing;
