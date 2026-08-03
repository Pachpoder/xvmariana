import {
  CalendarHeart,
  Camera,
  Church,
  Clock,
  Crown,
  Heart,
  MapPin,
  Music2,
  PartyPopper,
  Sparkles,
} from 'lucide-react';
import { LandingImage } from '@/components/landing/landing-image';
import { LandingRsvpCta } from '@/components/landing/landing-rsvp-cta';
import type { LandingContent } from '@/lib/landing-content';

const icons = {
  crown: Crown,
  dance: Music2,
  camera: Camera,
  party: PartyPopper,
  clock: Clock,
  sparkles: Sparkles,
  music: Music2,
  heart: Heart,
  'map-pin': MapPin,
  church: Church,
};
type IconName = keyof typeof icons;
type Location = LandingContent['locations'][number];
type TimelineItem = LandingContent['timeline'][number];

export function EventLocationsSection({ locations }: { locations: readonly Location[] }) {
  const visibleLocations = locations.filter((location) => location.title);
  if (!visibleLocations.length) return null;
  return (
    <section className='space-y-8'>
      <PublicSectionHeading>Detalles de la celebración</PublicSectionHeading>
      {visibleLocations.map((location) => {
        const Icon = icons[location.icon as IconName] ?? MapPin;
        return (
          <article key={location.title} className='text-center'>
            <Icon aria-hidden='true' className='mx-auto text-gold' />
            <h2 className='mt-3 font-serif text-2xl text-olive'>{location.title}</h2>
            {location.time && <p className='mt-2 font-semibold text-olive'>{location.time}</p>}
            {location.venue && <p className='mt-2 text-sm text-stone-600'>{location.venue}</p>}
            {location.address && <p className='mt-1 text-sm text-stone-500'>{location.address}</p>}
            {location.mapsUrl && (
              <a
                href={location.mapsUrl}
                target='_blank'
                rel='noopener noreferrer'
                aria-label={`Ver ubicación de ${location.title} en Google Maps`}
                className='mt-4 inline-flex min-h-11 items-center gap-2 rounded-full border border-sage px-4 text-sm font-semibold text-olive'
              >
                <MapPin size={16} />
                Ver ubicación
              </a>
            )}
          </article>
        );
      })}
    </section>
  );
}
export function EventTimelineSection({ timeline }: { timeline: readonly TimelineItem[] }) {
  const visibleItems = timeline.filter((item) => item.time || item.title);
  if (!visibleItems.length) return null;
  return (
    <section>
      <PublicSectionHeading>Itinerario de actividades</PublicSectionHeading>
      <ol className='mt-7 space-y-5'>
        {visibleItems.map((item, index) => {
          const Icon = icons[item.icon as IconName] ?? Sparkles;
          return (
            <li
              key={`${item.time}-${item.title}`}
              className='grid grid-cols-[1fr_auto_1fr] items-center gap-3'
            >
              <div className={index % 2 ? 'text-right' : 'order-3'}>
                <p className='font-semibold text-olive'>{item.time}</p>
                <p className='text-sm text-stone-600'>{item.title}</p>
              </div>
              <div
                aria-hidden='true'
                className='grid size-10 place-items-center rounded-full border border-gold bg-cream text-gold'
              >
                <Icon size={18} />
              </div>
              <div className={index % 2 ? 'order-3' : 'text-right'} />
            </li>
          );
        })}
      </ol>
    </section>
  );
}
export function DressCodeSection({ dressCode }: { dressCode: LandingContent['dressCode'] }) {
  if (!dressCode.enabled) return null;
  return (
    <section className='text-center'>
      <PublicSectionHeading>{dressCode.title}</PublicSectionHeading>
      <p className='mt-2 text-xs font-bold tracking-[.25em] text-gold'>{dressCode.label}</p>
      <LandingImage
        src={dressCode.imagePath}
        alt='Código de vestimenta'
        className='mx-auto mt-5 h-48 w-48 object-contain'
      />
      {dressCode.message && (
        <p className='mx-auto mt-4 max-w-sm text-sm leading-7 text-stone-600'>
          {dressCode.message}
        </p>
      )}
    </section>
  );
}
export function AttendanceSection({ attendance }: { attendance: LandingContent['attendance'] }) {
  const deadline = attendance.deadline
    ? new Intl.DateTimeFormat('es-GT', { dateStyle: 'long', timeZone: 'America/Guatemala' }).format(
        new Date(attendance.deadline)
      )
    : null;
  return (
    <section className='rounded-[1.5rem] bg-cream p-6 text-center'>
      <CalendarHeart className='mx-auto text-gold' />
      <PublicSectionHeading>{attendance.title}</PublicSectionHeading>
      {deadline && (
        <p className='mt-3 text-sm text-stone-600'>
          Por favor, confirma tu asistencia antes del {deadline}.
        </p>
      )}
      <div className='mt-5'>
        <LandingRsvpCta label={attendance.buttonLabel} />
      </div>
      {attendance.message && (
        <p className='mt-5 text-sm leading-6 text-stone-600'>{attendance.message}</p>
      )}
      {attendance.closing && (
        <p className='mt-6 font-serif text-lg italic text-olive'>{attendance.closing}</p>
      )}
    </section>
  );
}
export function PublicSectionHeading({ children }: { children: React.ReactNode }) {
  return <h2 className='text-center font-serif text-2xl text-olive'>{children}</h2>;
}
