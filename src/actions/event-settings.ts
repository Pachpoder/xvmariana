'use server';

import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/auth/require-admin';
import { normalizeSlug } from '@/lib/slugs';
import { eventSettingsSchema } from '@/lib/validation/event-settings';

export type EventSettingsState = { status: 'idle' | 'success' | 'error'; message?: string };

export async function updateEventSettings(
  _: EventSettingsState,
  formData: FormData
): Promise<EventSettingsState> {
  const parsed = eventSettingsSchema.safeParse({
    id: formData.get('id'),
    name: formData.get('name'),
    slug: formData.get('slug'),
    invitationImagePath: formData.get('invitationImagePath'),
    loadingImagePath: formData.get('loadingImagePath') || undefined,
    eventDate: formData.get('eventDate'),
    rsvpDeadline: formData.get('rsvpDeadline') || undefined,
    loadingDurationMs: formData.get('loadingDurationMs'),
    isPublished: formData.get('isPublished') === 'on',
  });
  if (!parsed.success)
    return {
      status: 'error',
      message: parsed.error.issues[0]?.message ?? 'Revisa la configuración.',
    };
  const { supabase } = await requireAdmin();
  const { data: duplicate, error: duplicateError } = await supabase
    .from('events')
    .select('id')
    .eq('slug', normalizeSlug(parsed.data.slug))
    .neq('id', parsed.data.id)
    .maybeSingle();
  if (duplicateError) return { status: 'error', message: 'No fue posible validar el slug.' };
  if (duplicate) return { status: 'error', message: 'Ese slug ya está en uso.' };
  const { error } = await supabase
    .from('events')
    .update({
      name: parsed.data.name,
      slug: normalizeSlug(parsed.data.slug),
      invitation_image_path: parsed.data.invitationImagePath,
      loading_image_path: parsed.data.loadingImagePath || null,
      event_date: new Date(parsed.data.eventDate).toISOString(),
      rsvp_deadline: parsed.data.rsvpDeadline
        ? new Date(parsed.data.rsvpDeadline).toISOString()
        : null,
      loading_duration_ms: parsed.data.loadingDurationMs,
      is_published: parsed.data.isPublished,
    })
    .eq('id', parsed.data.id);
  if (error) return { status: 'error', message: 'No fue posible guardar la configuración.' };
  revalidatePath('/');
  revalidatePath('/admin');
  revalidatePath('/admin/configuracion');
  revalidatePath('/[slug]', 'page');
  return { status: 'success', message: 'Configuración del evento guardada.' };
}
