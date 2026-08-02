import { z } from "zod";

export const rsvpFormSchema = z.object({
  slug: z.string().trim().min(1),
  response: z.enum(["attending", "not_attending"]),
  namedGuestsAttending: z.coerce.number().int().min(0),
  extraGuestsAttending: z.coerce.number().int().min(0),
  message: z.string().trim().max(500, "El mensaje no puede superar 500 caracteres.").optional(),
  website: z.string().max(0, "Solicitud no válida."),
});

export type RsvpInput = z.infer<typeof rsvpFormSchema>;
export type RsvpContext = { isActive: boolean; isArchived: boolean; namedGuestLimit: number; maxExtraGuests: number; rsvpDeadline: string | null };
export type PreparedRsvp = { response: "attending" | "not_attending"; namedGuestsAttending: number; extraGuestsAttending: number; message: string | null };

export function prepareRsvp(input: RsvpInput, context: RsvpContext, now = new Date()): PreparedRsvp | { error: string } {
  if (!context.isActive || context.isArchived) return { error: "Esta invitación ya no acepta confirmaciones." };
  if (context.rsvpDeadline && now > new Date(context.rsvpDeadline)) return { error: "El plazo para confirmar asistencia ha finalizado." };
  if (input.response === "not_attending") return { response: input.response, namedGuestsAttending: 0, extraGuestsAttending: 0, message: input.message || null };
  if (input.namedGuestsAttending > context.namedGuestLimit) return { error: "La cantidad de invitados nombrados supera el límite de la invitación." };
  if (input.extraGuestsAttending > context.maxExtraGuests) return { error: "La cantidad de acompañantes supera el límite permitido." };
  return { response: input.response, namedGuestsAttending: input.namedGuestsAttending, extraGuestsAttending: input.extraGuestsAttending, message: input.message || null };
}
