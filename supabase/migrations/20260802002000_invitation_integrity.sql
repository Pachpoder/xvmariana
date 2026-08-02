alter table public.invitations drop constraint invitations_public_slug_check;
alter table public.invitations add constraint invitations_public_slug_check check (public_slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$');

create function public.validate_invitation_primary_guest() returns trigger language plpgsql set search_path = public as $$
declare target_id uuid;
begin
  if tg_table_name = 'invitations' then target_id := new.id; else target_id := coalesce(new.invitation_id, old.invitation_id); end if;
  if exists (select 1 from public.invitations where id = target_id) and (select count(*) from public.invitation_guests where invitation_id = target_id and is_primary) <> 1 then
    raise exception 'An invitation must have exactly one primary guest';
  end if;
  return null;
end; $$;

create constraint trigger invitations_require_primary_guest after insert on public.invitations deferrable initially deferred for each row execute function public.validate_invitation_primary_guest();
create constraint trigger invitation_guests_require_primary_guest after insert or update or delete on public.invitation_guests deferrable initially deferred for each row execute function public.validate_invitation_primary_guest();
