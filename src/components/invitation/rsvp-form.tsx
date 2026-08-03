'use client';

import { RsvpResponseForm } from '@/components/invitation/rsvp-response-form';
import type { PublicInvitationDto } from '@/lib/queries/public-invitation';

export function RsvpForm({
  slug,
  invitation,
  compact = false,
}: {
  slug: string;
  invitation: PublicInvitationDto;
  compact?: boolean;
}) {
  return (
    <RsvpResponseForm
      invitation={{
        slug,
        namedGuestLimit: invitation.guestNames.length,
        maxExtraGuests: invitation.maxExtraGuests,
        initialRsvp: invitation.initialRsvp,
      }}
      compact={compact}
    />
  );
}
