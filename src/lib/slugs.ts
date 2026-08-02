import { randomBytes } from "node:crypto";
import { RESERVED_SLUGS } from "./constants/slugs";

const suffixAlphabet = "abcdefghjkmnpqrstuvwxyz23456789";

export function normalizeSlug(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

export function isReservedSlug(slug: string) {
  return RESERVED_SLUGS.has(slug);
}

export function randomSlugSuffix(length = 6) {
  return Array.from(randomBytes(length), (byte) => suffixAlphabet[byte % suffixAlphabet.length]).join("");
}

export function createInvitationSlug(source: string, suffix = randomSlugSuffix()) {
  const base = normalizeSlug(source) || "invitacion";
  return `${base}-${suffix}`;
}
