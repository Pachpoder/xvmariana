'use client';

import { Crown } from 'lucide-react';
import type { ReactNode } from 'react';
import { LandingImage } from '@/components/landing/landing-image';
import { LandingRsvpCta } from '@/components/landing/landing-rsvp-cta';
import { PublicSectionContainer } from '@/components/landing/public-section-container';
import { landingContent } from '@/lib/landing-content';

export function PublicLandingPage({
  personalizedContent,
  rsvpContent,
}: {
  personalizedContent?: ReactNode;
  rsvpContent?: ReactNode;
}) {
  return (
    <main className='min-h-svh bg-[#f7f5ec] px-4 py-5 text-[#495343] sm:px-8 sm:py-10'>
      <PublicSectionContainer className='py-0'>
        <LandingCelebrantPhoto />
        {personalizedContent}
        <LandingEventDetails />
        <LandingItinerary />
        <LandingDressAndAttendance rsvpContent={rsvpContent} />
      </PublicSectionContainer>
    </main>
  );
}

export function PublicLandingUnderDevelopment() {
  return (
    <main className='grid min-h-svh place-items-center bg-[#f7f5ec] px-5 py-10 text-[#495343]'>
      <PublicSectionContainer className='px-7 py-16 text-center sm:px-12'>
        <Crown className='mx-auto text-[#b18d42]' size={46} strokeWidth={1.25} />
        <p className='mt-7 text-xs font-semibold tracking-[0.28em] text-[#9b7b3d]'>MIS XV AÑOS</p>
        <h1 className='mt-4 font-serif text-4xl text-[#59664d]'>En desarrollo</h1>
        <p className='mt-5 text-sm leading-7 text-[#70796c]'>Muy pronto compartiremos todos los detalles de esta celebración.</p>
      </PublicSectionContainer>
    </main>
  );
}

function LandingCelebrantPhoto() {
  const { celebrant } = landingContent;
  return (
    <section className='relative overflow-hidden text-center'>
      <LandingImage
        src={celebrant.imagePath}
        alt={`Invitación de ${celebrant.name}`}
        className='block h-auto w-full'
      />
      <LandingImage
        src='/assets/landing/flor_bajo.png'
        alt=''
        className='pointer-events-none absolute -top-[2%] left-[60%] z-10 w-[48%] -translate-x-[35%] sm:left-79'
      />
      <LandingImage
        src='/assets/landing/flor_arriba.png.png'
        alt=''
        className='pointer-events-none absolute -left-[18%] bottom-[4%] z-10 w-[48%]'
      />
      <LandingImage
        src='/assets/landing/sello.png'
        alt=''
        className='pointer-events-none absolute left-1/2 top-[21%] z-20 w-[28%] -translate-x-1/2'
      />
      <div className='pointer-events-none absolute inset-x-0 top-[40%] z-30 px-5 text-center'>
        <p className='font-[family-name:var(--font-lora)] text-[clamp(0.9rem,4vw,1.35rem)] font-semibold tracking-[0.32em] text-[#9b7b3d]'>
          {celebrant.title}
        </p>
        <h1 className='mt-3 font-[family-name:var(--font-luxurious-script)] text-[clamp(3.4rem,16vw,5.5rem)] leading-none tracking-tight text-[#d96f9d]'>
          {celebrant.name}
        </h1>
        <p className='mt-4 font-[family-name:var(--font-lora)] text-[clamp(0.85rem,3.5vw,1.2rem)] font-semibold tracking-[0.36em] text-[#9b7b3d]'>
          {celebrant.date}
        </p>
      </div>
      <p className='pointer-events-none absolute inset-x-[11%] top-[63%] z-30 text-center font-[family-name:var(--font-lora)] text-[clamp(1rem,4.3vw,1.2rem)] leading-[1.28] text-[#8c713c]'>
        {celebrant.description}
      </p>
    </section>
  );
}

function LandingEventDetails() {
  const { eventDetails } = landingContent;
  return (
    <section className='relative z-30 overflow-hidden text-center'>
      <LandingImage
        src='/assets/landing/background/background2.png'
        alt='Detalles de la celebración'
        className='relative z-10 block h-auto w-full'
      />
      <div className='pointer-events-none absolute inset-x-[9%] top-[9%] z-20'>
        <p className='font-[family-name:var(--font-lora)] text-[clamp(0.95rem,4.2vw,1.45rem)] font-semibold leading-[1.36] tracking-[0.16em] text-[#8c713c]'>
          {eventDetails.invitation.map((line) => (
            <span key={line} className='block'>
              {line}
            </span>
          ))}
        </p>
      </div>
      <div className='pointer-events-none absolute inset-x-[10%] top-[23%] z-20 grid grid-cols-[1fr_auto_1fr] items-center gap-2 text-[#c65382]'>
        <p className='font-[family-name:var(--font-luxurious-script)] text-[clamp(1.65rem,7vw,2.5rem)] leading-[1.05]'>
          {eventDetails.parents.first}
        </p>
        <span className='font-[family-name:var(--font-lora)] text-[clamp(1.35rem,5vw,2rem)] text-[#8c713c]'>&amp;</span>
        <p className='font-[family-name:var(--font-luxurious-script)] text-[clamp(1.65rem,7vw,2.5rem)] leading-[1.05]'>
          {eventDetails.parents.second}
        </p>
      </div>
      <LandingImage
        src='/assets/landing/fecha21agosto.png'
        alt='Viernes 21 de agosto de 2026'
        className='pointer-events-none absolute left-1/2 top-[35%] z-20 w-[72%] -translate-x-1/2'
      />
      <EventLocationCard
        iconPath='/assets/landing/iconoRecepcion.png'
        iconAlt='Iglesia'
        location={eventDetails.ceremony}
        className='top-[53%]'
      />
      <EventLocationCard
        iconPath='/assets/landing/iconoUbicacion.png'
        iconAlt='Ubicación de la recepción'
        location={eventDetails.reception}
        className='top-[76%]'
      />
    </section>
  );
}

function LandingItinerary() {
  const { itinerary } = landingContent;
  return (
    <section className='relative z-10 -mt-[39px] overflow-hidden bg-[#526445] sm:-mt-[47px]'>
      <LandingImage
        src='/assets/landing/background/background3.png'
        alt='Bosque que acompaña el itinerario de actividades'
        className='block h-auto w-full'
      />
      <div className='absolute inset-x-[9%] top-[7%] bottom-[9%] z-10 rounded-[1.6rem] bg-[#fffdfa]/95 px-5 pt-[8%] text-center shadow-[0_12px_30px_rgba(38,49,31,0.16)]'>
        <h2 className='font-[family-name:var(--font-luxurious-script)] text-4xl leading-none text-[#d96f9d] sm:text-5xl'>
          {itinerary.heading}
        </h2>
        <p className='mt-2 font-[family-name:var(--font-lora)] text-base font-semibold tracking-[0.2em] text-[#8c713c] sm:text-lg'>
          {itinerary.connector}
        </p>
        <p className='mt-1 font-[family-name:var(--font-luxurious-script)] text-4xl leading-none text-[#d96f9d] sm:text-5xl'>
          {itinerary.subheading}
        </p>
        <p className='mt-[9%] font-[family-name:var(--font-lora)] text-[10px] font-semibold tracking-[0.16em] text-[#8c713c] sm:text-xs'>
          {itinerary.notice}
        </p>
        <LandingImage
          src='/assets/landing/linea.png'
          alt=''
          className='pointer-events-none absolute left-1/2 top-[31%] z-10 h-[54%] w-auto -translate-x-1/2'
        />
        <ol className='absolute inset-x-[8%] top-[31%] z-20 grid h-[54%] grid-rows-7'>
          {itinerary.items.map((item, index) => {
            const onRight = index % 2 === 0;
            return <li key={`${item.title}-${item.time}`} className='grid grid-cols-[1fr_18%_1fr] items-center'><div className={onRight ? 'col-start-3 text-left' : 'col-start-1 text-right'}><p className='font-[family-name:var(--font-lora)] text-sm italic leading-none text-[#8c713c] sm:text-base'>{item.title}</p><p className='mt-1 font-[family-name:var(--font-lora)] text-xs italic text-[#8c713c] sm:text-sm'>{item.time}</p></div></li>;
          })}
        </ol>
      </div>
      <LandingImage
        src='/assets/landing/rosa.png'
        alt='Rosas decorativas'
        className='pointer-events-none absolute -bottom-[13%] left-1/2 z-20 w-[50%] -translate-x-1/2'
      />
    </section>
  );
}

function LandingDressAndAttendance({ rsvpContent }: { rsvpContent?: ReactNode }) {
  const { dressAndAttendance } = landingContent;
  return (
    <section className='relative overflow-hidden bg-[#fffaf0] text-center'>
      <LandingImage
        src='/assets/landing/background/background1.png'
        alt='Código de vestimenta y confirmación de asistencia'
        className='block h-auto w-full'
      />
      <div className='pointer-events-none absolute inset-x-[10%] top-[12%] z-10'>
        <p className='font-[family-name:var(--font-lora)] text-sm font-semibold tracking-[0.16em] text-[#8c713c] sm:text-lg'>
          {dressAndAttendance.title}
        </p>
        <h2 className='mt-5 font-[family-name:var(--font-luxurious-script)] text-4xl leading-none text-[#c65382] sm:text-5xl'>
          {dressAndAttendance.dressCode}
        </h2>
        <p className='mt-[17%] font-[family-name:var(--font-lora)] text-sm font-semibold leading-[1.45] tracking-[0.12em] text-[#8c713c] sm:text-lg'>
          {dressAndAttendance.message}
        </p>
      </div>
      <div className='absolute inset-x-[10%] top-[47%] z-10'>
        <h2 className='font-[family-name:var(--font-luxurious-script)] text-4xl leading-none text-[#c65382] sm:text-5xl'>
          {dressAndAttendance.attendanceTitle}
        </h2>
        <p className='mt-5 font-[family-name:var(--font-lora)] text-base font-semibold leading-[1.45] text-[#8c713c] sm:text-lg'>
          {dressAndAttendance.attendanceMessage}
        </p>
        <div className='mx-auto mt-7 max-w-[19rem]'>
          {rsvpContent ?? <LandingRsvpCta label={dressAndAttendance.buttonLabel} />}
        </div>
      </div>
    </section>
  );
}

function EventLocationCard({
  iconPath,
  iconAlt,
  location,
  className,
}: {
  iconPath: string;
  iconAlt: string;
  location: { label: string; venue: string; time: string; mapsUrl: string };
  className: string;
}) {
  return (
    <section className={`absolute inset-x-[8%] z-20 text-center ${className}`}>
      <LandingImage src={iconPath} alt={iconAlt} className='pointer-events-none mx-auto w-[11%]' />
      <h2 className='mt-1.5 font-[family-name:var(--font-lora)] text-sm font-semibold tracking-[0.16em] text-[#8c713c] sm:text-base'>
        {location.label}
      </h2>
      <p className='mt-1.5 font-[family-name:var(--font-lora)] text-[10px] font-semibold tracking-[0.1em] text-[#8c713c] sm:text-sm'>
        {location.venue}
      </p>
      <p className='mt-1 font-[family-name:var(--font-luxurious-script)] text-xl leading-none text-[#d96f9d] sm:text-2xl'>
        {location.time}
      </p>
      <a
        href={location.mapsUrl}
        target='_blank'
        rel='noreferrer'
        className='pointer-events-auto mt-2 inline-flex items-center rounded-lg bg-[#947134] px-3 py-1.5 font-[family-name:var(--font-lora)] text-[10px] font-semibold tracking-[0.12em] text-[#fffaf0] shadow-sm transition-colors hover:bg-[#795a29] sm:px-4 sm:text-xs'
      >
        VER UBICACIÓN
      </a>
    </section>
  );
}
