import test from "node:test";
import assert from "node:assert/strict";
import { prepareRsvp } from "../src/lib/validation/rsvp.ts";

const context = { isActive: true, isArchived: false, namedGuestLimit: 2, maxExtraGuests: 1, rsvpDeadline: null };
const attending = { slug: "familia-k7m4p2", response: "attending", namedGuestsAttending: 2, extraGuestsAttending: 1, message: "Nos vemos", website: "" };

test("no permite más extras de los autorizados", () => {
  assert.deepEqual(prepareRsvp({ ...attending, extraGuestsAttending: 2 }, context), { error: "La cantidad de acompañantes supera el límite permitido." });
});
test("no permite más invitados nombrados que los existentes", () => {
  assert.deepEqual(prepareRsvp({ ...attending, namedGuestsAttending: 3 }, context), { error: "La cantidad de invitados nombrados supera el límite de la invitación." });
});
test("declinar siempre prepara conteos en cero", () => {
  assert.deepEqual(prepareRsvp({ ...attending, response: "not_attending", namedGuestsAttending: 2, extraGuestsAttending: 1 }, context), { response: "not_attending", namedGuestsAttending: 0, extraGuestsAttending: 0, message: "Nos vemos" });
});
test("una actualización conserva la misma identidad de invitación para upsert", () => {
  const invitationId = "11111111-1111-4111-8111-111111111111";
  const first = { invitation_id: invitationId, named_guests_attending: 1 };
  const updated = { ...first, named_guests_attending: 2 };
  assert.equal(first.invitation_id, updated.invitation_id);
  assert.equal(updated.named_guests_attending, 2);
});
test("invitación inactiva no acepta respuestas", () => {
  assert.deepEqual(prepareRsvp(attending, { ...context, isActive: false }), { error: "Esta invitación ya no acepta confirmaciones." });
});
test("rechaza RSVP después del deadline", () => {
  assert.deepEqual(prepareRsvp(attending, { ...context, rsvpDeadline: "2026-01-01T00:00:00.000Z" }, new Date("2026-01-02T00:00:00.000Z")), { error: "El plazo para confirmar asistencia ha finalizado." });
});
