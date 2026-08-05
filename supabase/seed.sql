-- Ejecutar después de crear el primer perfil administrador.
-- No inventa created_by: el INSERT solo se ejecuta si existe un perfil admin.
-- La fecha debe confirmarse antes de producción; se usa una fecha de referencia explícita para el seed inicial.
insert into public.events (name, slug, invitation_image_path, loading_image_path, event_date, loading_duration_ms, is_published, created_by)
select 'XV Años de Mariana', 'xv-mariana', '/assets/landing/invitacion.jpeg', '/assets/loading-placeholder.svg', '2027-01-01T00:00:00-06:00'::timestamptz, 3000, false, id
from public.profiles
where role = 'admin'
order by created_at
limit 1
on conflict (slug) do update set invitation_image_path = excluded.invitation_image_path, loading_image_path = excluded.loading_image_path, loading_duration_ms = excluded.loading_duration_ms;
