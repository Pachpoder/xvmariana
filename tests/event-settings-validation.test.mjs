import test from "node:test";
import assert from "node:assert/strict";
import { eventSettingsSchema } from "../src/lib/validation/event-settings.ts";

const validSettings = {
  id: "11111111-1111-4111-8111-111111111111",
  name: "XV Años de Mariana",
  slug: "xv-mariana",
  invitationImagePath: "/assets/invitacion-placeholder.svg",
  eventDate: "2027-01-10T18:00",
  loadingDurationMs: 3000,
  isPublished: true,
  publicLandingEnabled: true,
  landingCelebrantName: "Mariana",
  landingMusicAutoplay: false,
  landingRsvpCtaText: "Confirma tu asistencia",
};

test("acepta la configuración mínima de landing pública", () => {
  assert.equal(eventSettingsSchema.safeParse(validSettings).success, true);
});

test("requiere nombre visible y texto CTA para la landing", () => {
  assert.equal(eventSettingsSchema.safeParse({ ...validSettings, landingCelebrantName: "" }).success, false);
  assert.equal(eventSettingsSchema.safeParse({ ...validSettings, landingRsvpCtaText: "" }).success, false);
});

test("limita el contenido editorial de la landing", () => {
  assert.equal(eventSettingsSchema.safeParse({ ...validSettings, landingDescription: "x".repeat(1201) }).success, false);
  assert.equal(eventSettingsSchema.safeParse({ ...validSettings, landingMusicUrl: "x".repeat(501) }).success, false);
});
