import test from "node:test";
import assert from "node:assert/strict";
import { landingRsvpSubmissionSchema } from "../src/lib/validation/landing-rsvp-submission.ts";

const validSubmission = { firstName: "Ana", lastName: "López", response: "attending", website: "" };

test("acepta una respuesta independiente de la landing", () => {
  assert.equal(landingRsvpSubmissionSchema.safeParse(validSubmission).success, true);
});

test("requiere nombre, apellido y una respuesta válida", () => {
  assert.equal(landingRsvpSubmissionSchema.safeParse({ ...validSubmission, firstName: "" }).success, false);
  assert.equal(landingRsvpSubmissionSchema.safeParse({ ...validSubmission, lastName: "" }).success, false);
  assert.equal(landingRsvpSubmissionSchema.safeParse({ ...validSubmission, response: "pending" }).success, false);
});

test("rechaza el honeypot de la landing", () => {
  assert.equal(landingRsvpSubmissionSchema.safeParse({ ...validSubmission, website: "bot" }).success, false);
});
