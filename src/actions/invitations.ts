"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/require-admin";
import { createInvitationSlug, isReservedSlug, normalizeSlug } from "@/lib/slugs";
import { invitationSchema, type InvitationInput } from "@/lib/validation/invitation";
import { z } from "zod";

export type InvitationActionState = { error?: string };

function parseInvitation(formData: FormData) {
  const guestsValue = formData.get("guests");
  let guests: unknown = [];
  try { guests = typeof guestsValue === "string" ? JSON.parse(guestsValue) : []; } catch { guests = []; }
  return invitationSchema.safeParse({
    id: formData.get("id") || undefined,
    eventId: formData.get("eventId"),
    label: formData.get("label"),
    slug: formData.get("slug") || undefined,
    maxExtraGuests: formData.get("maxExtraGuests"),
    internalNotes: formData.get("internalNotes") || undefined,
    guests,
  });
}

async function resolveSlug(input: InvitationInput, invitationId?: string) {
  const { supabase } = await requireAdmin();
  const requestedSlug = input.slug ? normalizeSlug(input.slug) : createInvitationSlug(input.guests[0]?.fullName ?? input.label);
  if (isReservedSlug(requestedSlug)) return { error: "Ese slug está reservado." };
  const { data, error } = await supabase.from("invitations").select("id").eq("public_slug", requestedSlug).maybeSingle();
  if (error) return { error: "No fue posible validar el slug." };
  if (data && data.id !== invitationId) return { error: "Ese slug ya está en uso. Elige otro." };
  return { slug: requestedSlug };
}

function guestsForRpc(input: InvitationInput) {
  return input.guests.map((guest, index) => ({ full_name: guest.fullName, is_primary: guest.isPrimary, sort_order: index }));
}

export async function createInvitation(_: InvitationActionState, formData: FormData): Promise<InvitationActionState> {
  const parsed = parseInvitation(formData);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Revisa los datos de la invitación." };
  const slugResult = await resolveSlug(parsed.data);
  if ("error" in slugResult) return slugResult;
  const { supabase } = await requireAdmin();
  const { error } = await supabase.rpc("create_invitation_with_guests", {
    p_event_id: parsed.data.eventId, p_label: parsed.data.label, p_public_slug: slugResult.slug,
    p_max_extra_guests: parsed.data.maxExtraGuests, p_internal_notes: parsed.data.internalNotes ?? "", p_guests: guestsForRpc(parsed.data),
  });
  if (error) return { error: error.message.includes("duplicate") ? "Ese slug ya está en uso. Elige otro." : "No fue posible crear la invitación." };
  revalidatePath("/admin/invitaciones");
  redirect("/admin/invitaciones?notice=created");
}

export async function updateInvitation(_: InvitationActionState, formData: FormData): Promise<InvitationActionState> {
  const parsed = parseInvitation(formData);
  if (!parsed.success || !parsed.data.id) return { error: parsed.success ? "Falta el identificador de la invitación." : parsed.error.issues[0]?.message ?? "Revisa los datos de la invitación." };
  const slugResult = await resolveSlug(parsed.data, parsed.data.id);
  if ("error" in slugResult) return slugResult;
  const { supabase } = await requireAdmin();
  const { error } = await supabase.rpc("update_invitation_with_guests", {
    p_invitation_id: parsed.data.id, p_label: parsed.data.label, p_public_slug: slugResult.slug,
    p_max_extra_guests: parsed.data.maxExtraGuests, p_internal_notes: parsed.data.internalNotes ?? "", p_guests: guestsForRpc(parsed.data),
  });
  if (error) return { error: error.message.includes("already confirmed") ? "No puedes dejar menos nombres que los ya confirmados." : error.message.includes("duplicate") ? "Ese slug ya está en uso. Elige otro." : "No fue posible actualizar la invitación." };
  revalidatePath("/admin/invitaciones");
  revalidatePath(`/admin/invitaciones/${parsed.data.id}/editar`);
  redirect("/admin/invitaciones?notice=updated");
}

export async function archiveInvitation(formData: FormData) {
  const id = z.string().uuid().safeParse(formData.get("id"));
  if (!id.success) return;
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("invitations").update({ archived_at: new Date().toISOString(), is_active: false }).eq("id", id.data);
  if (error) return;
  revalidatePath("/admin/invitaciones");
  redirect("/admin/invitaciones?notice=archived");
}

export async function restoreInvitation(formData: FormData) {
  const id = z.string().uuid().safeParse(formData.get("id"));
  if (!id.success) return;
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("invitations").update({ archived_at: null, is_active: true }).eq("id", id.data);
  if (error) return;
  revalidatePath("/admin/invitaciones");
  redirect("/admin/invitaciones?notice=restored");
}
