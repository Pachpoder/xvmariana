import { z } from "zod";

export const landingRsvpSubmissionSchema = z.object({
  firstName: z.string().trim().min(1, "Ingresa tu nombre.").max(80),
  lastName: z.string().trim().min(1, "Ingresa tu apellido.").max(120),
  response: z.enum(["attending", "not_attending"]),
  website: z.string().max(0, "Solicitud no válida."),
});

export type LandingRsvpSubmissionInput = z.infer<typeof landingRsvpSubmissionSchema>;
