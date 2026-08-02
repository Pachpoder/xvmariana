import { RsvpResponseForm } from "@/components/invitation/rsvp-response-form";
import type { PublicInvitationDto } from "@/lib/queries/public-invitation";

export function RsvpForm({ slug, invitation }: { slug: string; invitation: PublicInvitationDto }) {
  return <RsvpResponseForm invitation={{ slug, namedGuestLimit: invitation.guestNames.length, maxExtraGuests: invitation.maxExtraGuests, initialRsvp: invitation.initialRsvp }} />;
}
