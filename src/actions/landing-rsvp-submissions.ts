'use server';

import { revalidatePath } from 'next/cache';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import { landingContent } from '@/lib/landing-content';
import { landingRsvpSubmissionSchema } from '@/lib/validation/landing-rsvp-submission';

export type LandingRsvpSubmissionState = { status: 'idle' | 'success' | 'error'; message?: string };

export async function submitLandingRsvp(
  _: LandingRsvpSubmissionState,
  formData: FormData
): Promise<LandingRsvpSubmissionState> {
  const parsed = landingRsvpSubmissionSchema.safeParse({
    firstName: formData.get('firstName'),
    lastName: formData.get('lastName'),
    response: formData.get('response'),
    website: formData.get('website') || '',
  });
  if (!parsed.success)
    return {
      status: 'error',
      message: parsed.error.issues[0]?.message ?? 'Revisa los datos ingresados.',
    };
  if (parsed.data.website)
    return { status: 'success', message: 'Tu respuesta fue registrada correctamente.' };

  const supabase = createSupabaseAdminClient();
  const { data: event, error: eventError } = await supabase
    .from('events')
    .select('id')
    .eq('slug', landingContent.eventSlug)
    .eq('is_published', true)
    .maybeSingle();
  if (eventError || !event)
    return { status: 'error', message: 'La confirmación no está disponible en este momento.' };
  const { error } = await supabase.from('landing_rsvp_submissions').insert({
    event_id: event.id,
    first_name: parsed.data.firstName,
    last_name: parsed.data.lastName,
    response: parsed.data.response,
  });
  if (error)
    return { status: 'error', message: 'No fue posible guardar tu respuesta. Inténtalo de nuevo.' };
  revalidatePath('/');
  revalidatePath('/admin');
  revalidatePath('/admin/respuestas-landing');
  return {
    status: 'success',
    message:
      parsed.data.response === 'attending'
        ? '¡Qué alegría! Tu asistencia ha quedado confirmada.'
        : 'Gracias por avisarnos. Tu respuesta quedó registrada.',
  };
}
