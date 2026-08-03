import { z } from "zod";
import { normalizeSlug } from "@/lib/slugs";

export const eventSettingsSchema = z.object({
  id: z.string().uuid(),
  name: z.string().trim().min(1, "El nombre del evento es obligatorio.").max(120),
  slug: z.string().trim().min(1, "El slug es obligatorio.").max(120),
  invitationImagePath: z.string().trim().min(1, "La imagen de invitación es obligatoria.").max(500),
  loadingImagePath: z.string().trim().max(500).optional(),
  eventDate: z.string().min(1, "La fecha del evento es obligatoria.").refine((value) => !Number.isNaN(Date.parse(value)), "La fecha del evento no es válida."),
  rsvpDeadline: z.string().optional(),
  loadingDurationMs: z.coerce.number().int().min(0).max(10000),
  isPublished: z.boolean(),
}).superRefine((value, ctx) => {
  if (!normalizeSlug(value.slug)) ctx.addIssue({ code: "custom", path: ["slug"], message: "El slug no es válido." });
  if (value.rsvpDeadline && Number.isNaN(Date.parse(value.rsvpDeadline))) ctx.addIssue({ code: "custom", path: ["rsvpDeadline"], message: "La fecha límite no es válida." });
  if (value.rsvpDeadline && new Date(value.rsvpDeadline) > new Date(value.eventDate)) ctx.addIssue({ code: "custom", path: ["rsvpDeadline"], message: "La fecha límite no puede ser posterior al evento." });
});

export type EventSettingsInput = z.infer<typeof eventSettingsSchema>;
