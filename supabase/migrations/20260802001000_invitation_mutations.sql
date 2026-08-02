create function public.create_invitation_with_guests(
  p_event_id uuid, p_label text, p_public_slug text, p_max_extra_guests integer, p_internal_notes text, p_guests jsonb
) returns uuid language plpgsql set search_path = public as $$
declare invitation_id uuid;
begin
  if auth.uid() is null or not public.is_admin() then raise exception 'Admin access required' using errcode = '42501'; end if;
  insert into public.invitations (event_id, label, public_slug, max_extra_guests, internal_notes, created_by)
  values (p_event_id, p_label, p_public_slug, p_max_extra_guests, nullif(p_internal_notes, ''), auth.uid()) returning id into invitation_id;
  insert into public.invitation_guests (invitation_id, full_name, is_primary, sort_order)
  select invitation_id, item.full_name, item.is_primary, item.sort_order
  from jsonb_to_recordset(p_guests) as item(full_name text, is_primary boolean, sort_order integer);
  return invitation_id;
end; $$;

create function public.update_invitation_with_guests(
  p_invitation_id uuid, p_label text, p_public_slug text, p_max_extra_guests integer, p_internal_notes text, p_guests jsonb
) returns void language plpgsql set search_path = public as $$
declare confirmed_named_guests integer;
begin
  if auth.uid() is null or not public.is_admin() then raise exception 'Admin access required' using errcode = '42501'; end if;
  select named_guests_attending into confirmed_named_guests from public.rsvps where invitation_id = p_invitation_id;
  if coalesce(confirmed_named_guests, 0) > jsonb_array_length(p_guests) then raise exception 'Cannot remove named guests already confirmed in RSVP'; end if;
  update public.invitations set label = p_label, public_slug = p_public_slug, max_extra_guests = p_max_extra_guests, internal_notes = nullif(p_internal_notes, '') where id = p_invitation_id;
  if not found then raise exception 'Invitation not found'; end if;
  delete from public.invitation_guests where invitation_id = p_invitation_id;
  insert into public.invitation_guests (invitation_id, full_name, is_primary, sort_order)
  select p_invitation_id, item.full_name, item.is_primary, item.sort_order
  from jsonb_to_recordset(p_guests) as item(full_name text, is_primary boolean, sort_order integer);
end; $$;

grant execute on function public.create_invitation_with_guests(uuid, text, text, integer, text, jsonb) to authenticated;
grant execute on function public.update_invitation_with_guests(uuid, text, text, integer, text, jsonb) to authenticated;
revoke all on function public.create_invitation_with_guests(uuid, text, text, integer, text, jsonb) from anon;
revoke all on function public.update_invitation_with_guests(uuid, text, text, integer, text, jsonb) from anon;
