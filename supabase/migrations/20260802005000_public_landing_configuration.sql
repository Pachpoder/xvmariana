-- Configuración editorial de la landing pública principal. Los valores por defecto
-- permiten desplegar esta mejora sin invalidar el evento que ya existe.
alter table public.events
  add column public_landing_enabled boolean not null default true,
  add column landing_heading text,
  add column landing_celebrant_name text not null default 'Mariana',
  add column landing_banner_image_path text,
  add column landing_crown_image_path text,
  add column landing_celebrant_image_path text,
  add column landing_description text,
  add column landing_details text,
  add column landing_music_url text,
  add column landing_music_autoplay boolean not null default false,
  add column landing_rsvp_cta_text text not null default 'Confirma tu asistencia';

alter table public.events
  add constraint events_landing_celebrant_name_check
    check (char_length(trim(landing_celebrant_name)) between 1 and 120),
  add constraint events_landing_rsvp_cta_text_check
    check (char_length(trim(landing_rsvp_cta_text)) between 1 and 80),
  add constraint events_landing_heading_length_check
    check (landing_heading is null or char_length(landing_heading) <= 160),
  add constraint events_landing_description_length_check
    check (landing_description is null or char_length(landing_description) <= 1200),
  add constraint events_landing_details_length_check
    check (landing_details is null or char_length(landing_details) <= 2000),
  add constraint events_landing_paths_length_check
    check (
      (landing_banner_image_path is null or char_length(landing_banner_image_path) <= 500)
      and (landing_crown_image_path is null or char_length(landing_crown_image_path) <= 500)
      and (landing_celebrant_image_path is null or char_length(landing_celebrant_image_path) <= 500)
      and (landing_music_url is null or char_length(landing_music_url) <= 500)
    );

comment on column public.events.public_landing_enabled is
  'Controla la disponibilidad de la landing pública principal sin afectar enlaces de invitación personalizados.';
