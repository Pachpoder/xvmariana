import test from 'node:test';
import assert from 'node:assert/strict';
import { invitationSchema } from '../src/lib/validation/invitation.ts';

const baseInvitation = {
  eventId: '11111111-1111-4111-8111-111111111111',
  label: 'Familia López',
  maxExtraGuests: 2,
  guests: [{ fullName: 'Ana López', isPrimary: true }],
};

test('requiere al menos un nombre', () => {
  assert.equal(invitationSchema.safeParse({ ...baseInvitation, guests: [] }).success, false);
});

test('requiere exactamente un invitado principal', () => {
  assert.equal(
    invitationSchema.safeParse({
      ...baseInvitation,
      guests: [
        { fullName: 'Ana', isPrimary: false },
        { fullName: 'Luis', isPrimary: false },
      ],
    }).success,
    false
  );
});

test('rechaza extras negativos y slugs reservados', () => {
  assert.equal(
    invitationSchema.safeParse({ ...baseInvitation, maxExtraGuests: -1 }).success,
    false
  );
  assert.equal(invitationSchema.safeParse({ ...baseInvitation, slug: 'admin' }).success, false);
});
