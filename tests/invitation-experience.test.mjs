import test from "node:test";
import assert from "node:assert/strict";
import { nextInvitationStage } from "../src/lib/invitation-experience.ts";

test("avanza la experiencia pública en el orden esperado", () => {
  assert.equal(nextInvitationStage("loading"), "envelope");
  assert.equal(nextInvitationStage("envelope"), "opening");
  assert.equal(nextInvitationStage("opening"), "invitation");
});

test("mantiene la experiencia en la tarjeta final", () => {
  assert.equal(nextInvitationStage("invitation"), "invitation");
});
