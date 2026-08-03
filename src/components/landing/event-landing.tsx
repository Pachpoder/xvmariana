import { Crown } from 'lucide-react';
import { LandingImage } from '@/components/landing/landing-image';
import { LandingMusicSection } from '@/components/landing/landing-music-section';
import { PublicSectionContainer } from '@/components/landing/public-section-container';
import {
  AttendanceSection,
  DressCodeSection,
  EventLocationsSection,
  EventTimelineSection,
} from '@/components/landing/event-sections';
import { landingContent } from '@/lib/landing-content';

export function PublicLandingPage() {
  const content = landingContent;
  return (
    <main className='min-h-svh bg-[#f7f5ec] px-4 py-5 text-[#495343] sm:px-8 sm:py-10'>
      <PublicSectionContainer className='py-0'>
        <LandingCelebrantPhoto />
        <LandingHero />
        <div className='space-y-10 px-5 pb-9 pt-8 sm:px-10 sm:pb-10'>
          <LandingCrown />
          <LandingMusicSection musicUrl={content.music.url} autoplay={content.music.autoplay} />
          <EventLocationsSection locations={content.locations} />
          <EventTimelineSection timeline={content.timeline} />
          <DressCodeSection dressCode={content.dressCode} />
          <AttendanceSection attendance={content.attendance} />
        </div>
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

function LandingHero() {
  const { hero } = landingContent;
  return (
    <header className='relative min-h-48 overflow-hidden bg-[#aab68f] sm:min-h-60'>
      <LandingImage
        src={hero.bannerImagePath}
        alt='Decoración de la celebración'
        className='absolute inset-0 size-full object-cover opacity-75'
      />
      <div className='absolute inset-0 bg-gradient-to-b from-[#44503e]/35 to-[#fffdf8]/30' />
      <div className='relative z-10 px-7 pb-7 pt-12 text-center text-white'>
        <p className='text-xs font-semibold tracking-[0.32em]'>{hero.eyebrow}</p>
        <p className='mt-3 font-serif text-xl italic text-[#fff9ee]'>{hero.heading}</p>
      </div>
    </header>
  );
}
function LandingCrown() {
  return (
    <div className='relative -mt-[4.35rem] flex justify-center'>
      <div className='grid size-[8.7rem] place-items-center overflow-hidden rounded-full border-4 border-[#fffdf8] bg-[#fbf5e7] text-[#b18d42] shadow-[0_10px_30px_rgba(91,100,72,0.18)]'>
        <Crown size={58} strokeWidth={1.25} />
      </div>
    </div>
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
