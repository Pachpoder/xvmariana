'use server';

import { revalidatePath } from 'next/cache';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import { prepareRsvp, rsvpFormSchema } from '@/lib/validation/rsvp';

export type RsvpActionState = { status: 'idle' | 'success' | 'error'; message?: string };

export async function submitRsvp(_: RsvpActionState, formData: FormData): Promise<RsvpActionState> {
  const parsed = rsvpFormSchema.safeParse({
    slug: formData.get('slug'),
    response: formData.get('response'),
    namedGuestsAttending: formData.get('namedGuestsAttending'),
    extraGuestsAttending: formData.get('extraGuestsAttending'),
    message: formData.get('message') || undefined,
    website: formData.get('website') || '',
  });
  if (!parsed.success)
    return {
      status: 'error',
      message: parsed.error.issues[0]?.message ?? 'Revisa los datos ingresados.',
    };
  if (parsed.data.website) return { status: 'success', message: 'Tu respuesta ha sido guardada.' };
  const supabase = createSupabaseAdminClient();
  const { data: invitation, error } = await supabase
    .from('invitations')
    .select('id, event_id, is_active, archived_at, max_extra_guests')
    .eq('public_slug', parsed.data.slug)
    .maybeSingle();
  if (error || !invitation)
    return { status: 'error', message: 'Esta invitación no está disponible.' };
  const [
    { count: namedGuestLimit, error: guestsError },
    { data: event, error: eventError },
    { data: existingRsvp, error: existingRsvpError },
  ] = await Promise.all([
    supabase
      .from('invitation_guests')
      .select('id', { count: 'exact', head: true })
      .eq('invitation_id', invitation.id),
    supabase.from('events').select('rsvp_deadline').eq('id', invitation.event_id).maybeSingle(),
    supabase.from('rsvps').select('id').eq('invitation_id', invitation.id).maybeSingle(),
  ]);
  if (guestsError || eventError || existingRsvpError || !event)
    return { status: 'error', message: 'No fue posible validar la invitación.' };
  const prepared = prepareRsvp(parsed.data, {
    isActive: invitation.is_active,
    isArchived: invitation.archived_at !== null,
    namedGuestLimit: namedGuestLimit ?? 0,
    maxExtraGuests: invitation.max_extra_guests,
    rsvpDeadline: event.rsvp_deadline,
  });
  if ('error' in prepared) return { status: 'error', message: prepared.error };
  const { error: upsertError } = await supabase
    .from('rsvps')
    .upsert(
      {
        invitation_id: invitation.id,
        response: prepared.response,
        named_guests_attending: prepared.namedGuestsAttending,
        extra_guests_attending: prepared.extraGuestsAttending,
        message: prepared.message,
        responded_at: new Date().toISOString(),
      },
      { onConflict: 'invitation_id' }
    );
  if (upsertError) return { status: 'error', message: 'No fue posible guardar la respuesta.' };
  revalidatePath('/');
  revalidatePath('/admin');
  revalidatePath('/admin/invitaciones');
  const message = existingRsvp
    ? 'Hemos actualizado tu confirmación. ¡Gracias por avisarnos!'
    : prepared.response === 'attending'
      ? '¡Qué alegría! Tu asistencia ha quedado confirmada.'
      : 'Gracias por avisarnos. Tu respuesta quedó registrada.';
  return { status: 'success', message };
}
