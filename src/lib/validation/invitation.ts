import { z } from "zod";
import { isReservedSlug, normalizeSlug } from "../slugs";

const guestSchema = z.object({
  fullName: z.string().trim().min(1, "Cada invitado necesita un nombre.").max(120, "El nombre es demasiado largo."),
  isPrimary: z.boolean(),
});

export const invitationSchema = z.object({
  id: z.string().uuid().optional(),
  eventId: z.string().uuid(),
  label: z.string().trim().min(1, "La etiqueta interna es obligatoria.").max(120),
  slug: z.string().trim().max(160).optional(),
  maxExtraGuests: z.coerce.number().int().min(0, "Los extras no pueden ser negativos."),
  internalNotes: z.string().trim().max(1000).optional(),
  guests: z.array(guestSchema).min(1, "Agrega al menos un nombre.").max(50),
}).superRefine((value, ctx) => {
  if (value.guests.filter((guest) => guest.isPrimary).length !== 1) ctx.addIssue({ code: "custom", path: ["guests"], message: "Elige exactamente un invitado principal." });
  if (value.slug) {
    const normalized = normalizeSlug(value.slug);
    if (!normalized) ctx.addIssue({ code: "custom", path: ["slug"], message: "El slug no es válido." });
    if (isReservedSlug(normalized)) ctx.addIssue({ code: "custom", path: ["slug"], message: "Ese slug está reservado." });
  }
});

export type InvitationInput = z.infer<typeof invitationSchema>;
