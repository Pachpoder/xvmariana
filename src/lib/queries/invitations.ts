import "server-only";
import { requireAdmin } from "@/lib/auth/require-admin";
import type { Database } from "@/types/database";

type InvitationRow = Database["public"]["Tables"]["invitations"]["Row"];
type GuestRow = Database["public"]["Tables"]["invitation_guests"]["Row"];
type RsvpRow = Database["public"]["Tables"]["rsvps"]["Row"];
export type RsvpStatus = "pending" | RsvpRow["response"];
export type InvitationSummary = InvitationRow & {
  guests: GuestRow[];
  rsvp: RsvpRow | null;
  status: RsvpStatus;
  confirmedAttendees: number;
};

export async function getFirstEvent() {
  const { supabase } = await requireAdmin();
  const { data, error } = await supabase.from("events").select("id, name").order("created_at").limit(1).maybeSingle();
  if (error) throw new Error("No fue posible cargar el evento.");
  return data;
}

export async function getEventSettings() {
  const { supabase } = await requireAdmin();
  const { data, error } = await supabase.from("events").select("id, name, slug, invitation_image_path, loading_image_path, event_date, rsvp_deadline, loading_duration_ms, is_published").order("created_at").limit(1).maybeSingle();
  if (error) throw new Error("No fue posible cargar la configuración del evento.");
  return data;
}


export async function getInvitationById(id: string) {
  const { supabase } = await requireAdmin();
  const { data: invitation, error } = await supabase.from("invitations").select("*").eq("id", id).maybeSingle();
  if (error) throw new Error("No fue posible cargar la invitación.");
  if (!invitation) return null;
  const { data: guests, error: guestsError } = await supabase.from("invitation_guests").select("*").eq("invitation_id", id).order("sort_order");
  if (guestsError) throw new Error("No fue posible cargar los invitados.");
  return { ...invitation, guests: guests ?? [] };
}

export async function getInvitationSummaries() {
  const { supabase } = await requireAdmin();
  const { data: invitations, error } = await supabase
    .from("invitations")
    .select("*")
    .is("archived_at", null)
    .eq("is_active", true)
    .order("created_at", { ascending: false });
  if (error) throw new Error("No fue posible cargar las invitaciones.");
  const ids = (invitations ?? []).map((invitation) => invitation.id);
  if (!ids.length) return [] as InvitationSummary[];
  const [{ data: guests, error: guestsError }, { data: rsvps, error: rsvpsError }] = await Promise.all([
    supabase.from("invitation_guests").select("*").in("invitation_id", ids).order("sort_order"),
    supabase.from("rsvps").select("*").in("invitation_id", ids),
  ]);
  if (guestsError || rsvpsError) throw new Error("No fue posible cargar el detalle de las invitaciones.");
  return invitations.map((invitation) => {
    const invitationGuests = (guests ?? []).filter((guest) => guest.invitation_id === invitation.id);
    const rsvp = (rsvps ?? []).find((response) => response.invitation_id === invitation.id) ?? null;
    const status: RsvpStatus = rsvp?.response ?? "pending";
    const confirmedAttendees =
      rsvp?.response === "attending"
        ? rsvp.named_guests_attending + rsvp.extra_guests_attending
        : 0;
    return { ...invitation, guests: invitationGuests, rsvp, status, confirmedAttendees };
  });
}
