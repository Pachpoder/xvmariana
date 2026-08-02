import "server-only";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export type PublicInvitationDto = {
  eventName: string;
  invitationImagePath: string;
  loadingImagePath: string | null;
  loadingDurationMs: number;
  guestNames: string[];
  maxExtraGuests: number;
  initialRsvp: { response: "attending" | "not_attending"; namedGuestsAttending: number; extraGuestsAttending: number; message: string | null } | null;
};

export async function getPublicInvitationBySlug(slug: string): Promise<PublicInvitationDto | null> {
  const supabase = createSupabaseAdminClient();
  const { data: invitation, error } = await supabase
    .from("invitations")
    .select("id, event_id, max_extra_guests, is_active, archived_at")
    .eq("public_slug", slug)
    .maybeSingle();

  if (error || !invitation || !invitation.is_active || invitation.archived_at) return null;
  const [{ data: event, error: eventError }, { data: guests, error: guestsError }, { data: rsvp, error: rsvpError }] = await Promise.all([
    supabase.from("events").select("name, invitation_image_path, loading_image_path, loading_duration_ms, is_published").eq("id", invitation.event_id).maybeSingle(),
    supabase.from("invitation_guests").select("full_name").eq("invitation_id", invitation.id).order("sort_order"),
    supabase.from("rsvps").select("response, named_guests_attending, extra_guests_attending, message").eq("invitation_id", invitation.id).maybeSingle(),
  ]);
  if (eventError || guestsError || rsvpError || !event || !event.is_published) return null;
  return {
    eventName: event.name,
    invitationImagePath: event.invitation_image_path,
    loadingImagePath: event.loading_image_path,
    loadingDurationMs: event.loading_duration_ms,
    guestNames: (guests ?? []).map((guest) => guest.full_name),
    maxExtraGuests: invitation.max_extra_guests,
    initialRsvp: rsvp ? { response: rsvp.response, namedGuestsAttending: rsvp.named_guests_attending, extraGuestsAttending: rsvp.extra_guests_attending, message: rsvp.message } : null,
  };
}
