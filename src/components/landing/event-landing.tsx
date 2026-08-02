import { CalendarDays, Crown, Sparkles } from "lucide-react";
import { LandingImage } from "@/components/landing/landing-image";
import { LandingMusicSection } from "@/components/landing/landing-music-section";
import { LandingRsvpCta } from "@/components/landing/landing-rsvp-cta";
import { PublicSectionContainer } from "@/components/landing/public-section-container";
import type { PublicEventDto } from "@/lib/queries/public-event";

const guatemalaDate = new Intl.DateTimeFormat("es-GT", { dateStyle: "full", timeStyle: "short", timeZone: "America/Guatemala" });

export function PublicLandingPage({ event }: { event: PublicEventDto | null }) {
  if (!event) return <UnavailableLanding />;
  return <main className="min-h-svh bg-[#f7f5ec] px-4 py-5 text-[#495343] sm:px-8 sm:py-10"><PublicSectionContainer className="py-0"><LandingHero event={event} /><div className="space-y-8 px-5 pb-9 pt-8 sm:space-y-9 sm:px-10 sm:pb-10"><LandingCrown imagePath={event.landingCrownImagePath} /><LandingCelebrantPhoto event={event} /><LandingDescription event={event} /><LandingDetailsSection event={event} /><LandingMusicSection musicUrl={event.landingMusicUrl} autoplay={event.landingMusicAutoplay} /><LandingRsvpCta label={event.landingRsvpCtaText} /></div></PublicSectionContainer></main>;
}

function LandingHero({ event }: { event: PublicEventDto }) {
  return <header className="relative min-h-48 overflow-hidden bg-[#aab68f] sm:min-h-60"><LandingImage src={event.landingBannerImagePath} alt="Decoración de la celebración" className="absolute inset-0 size-full object-cover opacity-75" /><div className="absolute inset-0 bg-gradient-to-b from-[#44503e]/35 to-[#fffdf8]/30" /><div className="relative z-10 px-7 pb-7 pt-12 text-center text-white"><p className="text-xs font-semibold tracking-[0.32em]">XV AÑOS</p><p className="mt-3 font-serif text-xl italic text-[#fff9ee]">{event.landingHeading || event.name}</p></div></header>;
}

function LandingCrown({ imagePath }: { imagePath: string | null }) {
  return <div className="relative -mt-[4.35rem] flex justify-center"><div className="grid size-[8.7rem] place-items-center overflow-hidden rounded-full border-4 border-[#fffdf8] bg-[#fbf5e7] text-[#b18d42] shadow-[0_10px_30px_rgba(91,100,72,0.18)]">{imagePath ? <LandingImage src={imagePath} alt="Corona decorativa" className="size-full object-cover" /> : <Crown size={58} strokeWidth={1.25} />}</div></div>;
}

function LandingCelebrantPhoto({ event }: { event: PublicEventDto }) {
  return <section className="text-center"><h1 className="font-serif text-[clamp(2.75rem,14vw,4rem)] leading-none tracking-tight text-[#59664d]">{event.landingCelebrantName}</h1><div className="mx-auto mt-5 max-w-sm overflow-hidden rounded-[1.5rem] border border-[#e2dccb] bg-[#f4f0e6] p-2 shadow-[0_12px_30px_rgba(76,87,68,0.1)]"><LandingImage src={event.landingCelebrantImagePath} alt={`Retrato de ${event.landingCelebrantName}`} className="aspect-[4/5] w-full rounded-[1.1rem] object-cover" /></div></section>;
}

function LandingDescription({ event }: { event: PublicEventDto }) {
  return <section className="text-center"><div aria-hidden="true" className="flex items-center justify-center gap-3 text-[#d8bb76]"><span className="h-px w-10 bg-current/70" /><Sparkles size={16} /><span className="h-px w-10 bg-current/70" /></div><p className="mx-auto mt-5 max-w-sm text-sm leading-7 text-[#70796c]">{event.landingDescription || "Con mucha ilusión, celebramos un momento lleno de sueños, alegría y nuevos comienzos."}</p></section>;
}

function LandingDetailsSection({ event }: { event: PublicEventDto }) {
  const deadline = event.rsvpDeadline ? new Intl.DateTimeFormat("es-GT", { dateStyle: "long", timeZone: "America/Guatemala" }).format(new Date(event.rsvpDeadline)) : null;
  return <section aria-label="Detalles de la celebración" className="rounded-[1.5rem] border border-[#e3dfcb] bg-[#fbfaf4] px-5 py-6 text-center"><CalendarDays className="mx-auto text-[#aab68f]" size={22} /><p className="mt-3 text-xs font-semibold tracking-[0.18em] text-[#8a9677]">CELEBRACIÓN</p><time dateTime={event.eventDate} className="mt-2 block font-serif text-xl leading-8 text-[#59664d]">{guatemalaDate.format(new Date(event.eventDate))}</time>{event.landingDetails && <p className="mx-auto mt-5 max-w-sm whitespace-pre-line text-sm leading-6 text-[#70796c]">{event.landingDetails}</p>}{deadline && <p className="mt-5 text-xs leading-5 text-[#7b8476]">Confirmaciones hasta el {deadline}.</p>}</section>;
}

function UnavailableLanding() {
  return <main className="min-h-svh bg-[#f7f5ec] px-4 py-7 text-[#495343] sm:px-8 sm:py-12"><PublicSectionContainer className="px-7 py-14 text-center sm:px-12"><Crown className="mx-auto text-[#b18d42]" size={42} strokeWidth={1.25} /><h1 className="mt-6 font-serif text-3xl text-[#59664d]">Próximamente</h1><p className="mt-4 text-sm leading-6 text-[#70796c]">Los detalles de esta celebración estarán disponibles muy pronto.</p></PublicSectionContainer></main>;
}
