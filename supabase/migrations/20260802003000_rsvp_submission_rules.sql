create function public.validate_rsvp_submission() returns trigger language plpgsql set search_path = public as $$
declare invitation_active boolean; invitation_archived timestamptz; deadline timestamptz;
begin
  select i.is_active, i.archived_at, e.rsvp_deadline into invitation_active, invitation_archived, deadline
  from public.invitations i join public.events e on e.id = i.event_id where i.id = new.invitation_id;
  if invitation_active is null or not invitation_active or invitation_archived is not null then raise exception 'Invitation is not accepting RSVP'; end if;
  if deadline is not null and now() > deadline then raise exception 'RSVP deadline has passed'; end if;
  return new;
end; $$;

create trigger rsvps_validate_submission before insert or update on public.rsvps for each row execute function public.validate_rsvp_submission();
