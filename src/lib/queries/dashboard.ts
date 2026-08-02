import "server-only";
import { requireAdmin } from "@/lib/auth/require-admin";

export type DashboardStats = { invitationsTotal: number; pending: number; attending: number; notAttending: number; namedGuestsInvited: number; namedGuestsConfirmed: number; extraGuestsConfirmed: number; estimatedAttendees: number; lastResponseAt: string | null };

export async function getDashboardStats(): Promise<DashboardStats> {
  const { supabase } = await requireAdmin();
  const [{ data: invitations, error: invitationsError }, { data: guests, error: guestsError }, { data: rsvps, error: rsvpsError }] = await Promise.all([
    supabase.from("invitations").select("id").is("archived_at", null),
    supabase.from("invitation_guests").select("invitation_id"),
    supabase.from("rsvps").select("invitation_id, response, named_guests_attending, extra_guests_attending, responded_at"),
  ]);
  if (invitationsError || guestsError || rsvpsError) throw new Error("No fue posible cargar las estadísticas.");
  const activeIds = new Set((invitations ?? []).map((invitation) => invitation.id));
  const activeRsvps = (rsvps ?? []).filter((rsvp) => activeIds.has(rsvp.invitation_id));
  const attending = activeRsvps.filter((rsvp) => rsvp.response === "attending");
  const latest = activeRsvps.reduce<string | null>((current, rsvp) => !current || rsvp.responded_at > current ? rsvp.responded_at : current, null);
  return { invitationsTotal: activeIds.size, pending: activeIds.size - activeRsvps.length, attending: attending.length, notAttending: activeRsvps.filter((rsvp) => rsvp.response === "not_attending").length, namedGuestsInvited: (guests ?? []).filter((guest) => activeIds.has(guest.invitation_id)).length, namedGuestsConfirmed: attending.reduce((sum, rsvp) => sum + rsvp.named_guests_attending, 0), extraGuestsConfirmed: attending.reduce((sum, rsvp) => sum + rsvp.extra_guests_attending, 0), estimatedAttendees: attending.reduce((sum, rsvp) => sum + rsvp.named_guests_attending + rsvp.extra_guests_attending, 0), lastResponseAt: latest };
}
