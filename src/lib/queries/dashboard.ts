import 'server-only';

import { requireAdmin } from '@/lib/auth/require-admin';

export type DashboardStats = {
  invitationsTotal: number;
  pendingInvitations: number;
  attendingInvitations: number;
  notAttendingInvitations: number;
  passesIssued: number;
  personalizedConfirmed: number;
  landingResponsesTotal: number;
  landingConfirmed: number;
  landingNotAttending: number;
  totalConfirmed: number;
  lastResponseAt: string | null;
};

export async function getDashboardStats(): Promise<DashboardStats> {
  const { supabase } = await requireAdmin();
  const [
    { data: invitations, error: invitationsError },
    { data: guests, error: guestsError },
    { data: rsvps, error: rsvpsError },
    { data: landingResponses, error: landingResponsesError },
  ] = await Promise.all([
    supabase
      .from('invitations')
      .select('id, max_extra_guests')
      .is('archived_at', null)
      .eq('is_active', true),
    supabase.from('invitation_guests').select('invitation_id'),
    supabase
      .from('rsvps')
      .select(
        'invitation_id, response, named_guests_attending, extra_guests_attending, responded_at'
      ),
    supabase.from('landing_rsvp_submissions').select('response, created_at'),
  ]);

  if (invitationsError || guestsError || rsvpsError || landingResponsesError) {
    throw new Error('No fue posible cargar las estadísticas.');
  }

  const activeInvitations = invitations ?? [];
  const activeIds = new Set(activeInvitations.map((invitation) => invitation.id));
  const activeRsvps = (rsvps ?? []).filter((rsvp) => activeIds.has(rsvp.invitation_id));
  const attendingRsvps = activeRsvps.filter((rsvp) => rsvp.response === 'attending');
  const activeGuestCount = (guests ?? []).filter((guest) =>
    activeIds.has(guest.invitation_id)
  ).length;
  const passesIssued = activeInvitations.reduce(
    (total, invitation) => total + invitation.max_extra_guests,
    activeGuestCount
  );
  const personalizedConfirmed = attendingRsvps.reduce(
    (total, rsvp) =>
      total + rsvp.named_guests_attending + rsvp.extra_guests_attending,
    0
  );
  const publicResponses = landingResponses ?? [];
  const landingConfirmed = publicResponses.filter(
    (response) => response.response === 'attending'
  ).length;
  const responseDates = [
    ...activeRsvps.map((rsvp) => rsvp.responded_at),
    ...publicResponses.map((response) => response.created_at),
  ];
  const lastResponseAt = responseDates.reduce<string | null>(
    (latest, date) => (!latest || date > latest ? date : latest),
    null
  );

  return {
    invitationsTotal: activeInvitations.length,
    pendingInvitations: Math.max(0, activeInvitations.length - activeRsvps.length),
    attendingInvitations: attendingRsvps.length,
    notAttendingInvitations: activeRsvps.filter(
      (rsvp) => rsvp.response === 'not_attending'
    ).length,
    passesIssued,
    personalizedConfirmed,
    landingResponsesTotal: publicResponses.length,
    landingConfirmed,
    landingNotAttending: publicResponses.filter(
      (response) => response.response === 'not_attending'
    ).length,
    totalConfirmed: personalizedConfirmed + landingConfirmed,
    lastResponseAt,
  };
}
