import "server-only";

import { requireAdmin } from "@/lib/auth/require-admin";

export async function getLandingRsvpSubmissions() {
  const { supabase } = await requireAdmin();
  const { data, error } = await supabase
    .from("landing_rsvp_submissions")
    .select("id, first_name, last_name, response, created_at")
    .order("created_at", { ascending: false });
  if (error) throw new Error("No fue posible cargar las respuestas de la landing.");
  return data ?? [];
}
