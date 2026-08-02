import "server-only";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export type PublicEventDto = {
  name: string;
  eventDate: string;
  rsvpDeadline: string | null;
  landingHeading: string | null;
  landingCelebrantName: string;
  landingBannerImagePath: string | null;
  landingCrownImagePath: string | null;
  landingCelebrantImagePath: string | null;
  landingDescription: string | null;
  landingDetails: string | null;
  landingMusicUrl: string | null;
  landingMusicAutoplay: boolean;
  landingRsvpCtaText: string;
};

export async function getPublishedPublicEvent(): Promise<PublicEventDto | null> {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("events")
    .select("name, event_date, rsvp_deadline, landing_heading, landing_celebrant_name, landing_banner_image_path, landing_crown_image_path, landing_celebrant_image_path, landing_description, landing_details, landing_music_url, landing_music_autoplay, landing_rsvp_cta_text")
    .eq("is_published", true)
    .eq("public_landing_enabled", true)
    .order("event_date")
    .limit(1)
    .maybeSingle();

  if (error) {
    // Mantiene disponible la landing mínima mientras se aplica la migración incremental
    // en un entorno ya desplegado. El nuevo esquema usa los valores por defecto de abajo.
    const { data: legacyEvent, error: legacyError } = await supabase
      .from("events")
      .select("name, event_date, rsvp_deadline")
      .eq("is_published", true)
      .order("event_date")
      .limit(1)
      .maybeSingle();
    if (legacyError || !legacyEvent) return null;
    return {
      name: legacyEvent.name, eventDate: legacyEvent.event_date, rsvpDeadline: legacyEvent.rsvp_deadline,
      landingHeading: null, landingCelebrantName: "Mariana", landingBannerImagePath: null,
      landingCrownImagePath: null, landingCelebrantImagePath: null, landingDescription: null,
      landingDetails: null, landingMusicUrl: null, landingMusicAutoplay: false,
      landingRsvpCtaText: "Confirma tu asistencia",
    };
  }
  if (!data) return null;
  return {
    name: data.name, eventDate: data.event_date, rsvpDeadline: data.rsvp_deadline,
    landingHeading: data.landing_heading, landingCelebrantName: data.landing_celebrant_name,
    landingBannerImagePath: data.landing_banner_image_path, landingCrownImagePath: data.landing_crown_image_path,
    landingCelebrantImagePath: data.landing_celebrant_image_path, landingDescription: data.landing_description,
    landingDetails: data.landing_details, landingMusicUrl: data.landing_music_url,
    landingMusicAutoplay: data.landing_music_autoplay, landingRsvpCtaText: data.landing_rsvp_cta_text,
  };
}
