'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion, type Transition } from 'motion/react';
import { UsersRound } from 'lucide-react';
import { PublicLandingPage } from '@/components/landing/event-landing';
import { PersonalizedAttendanceForm } from '@/components/invitation/personalized-attendance-form';
import { LandingImage } from '@/components/landing/landing-image';
import { nextInvitationStage, type InvitationStage } from '@/lib/invitation-experience';
import type { PublicInvitationDto } from '@/lib/queries/public-invitation';

export function PublicInvitationExperience({
  invitation,
  slug,
}: {
  invitation: PublicInvitationDto;
  slug: string;
}) {
  const [stage, setStage] = useState<InvitationStage>('loading');
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const duration = Math.max(0, invitation.loadingDurationMs || 3000);
    const timer = window.setTimeout(() => setStage('envelope'), duration);
    return () => window.clearTimeout(timer);
  }, [invitation.invitationImagePath, invitation.loadingDurationMs]);

  useEffect(() => {
    if (stage !== 'opening') return;
    const timer = window.setTimeout(() => setStage('invitation'), reducedMotion ? 0 : 4200);
    return () => window.clearTimeout(timer);
  }, [reducedMotion, stage]);

  const transition: Transition = reducedMotion
    ? { duration: 0 }
    : { duration: 0.9, ease: [0.22, 1, 0.36, 1] };
  const openingTransition: Transition = reducedMotion
    ? { duration: 0 }
    : { duration: 1.8, ease: [0.22, 1, 0.36, 1] };
  const invitationImagePath =
    invitation.invitationImagePath === '/assets/invitacion-placeholder.svg'
      ? '/assets/landing/invitacion.jpeg'
      : invitation.invitationImagePath;
  return (
    <main className={stage === 'invitation' ? 'min-h-svh' : 'min-h-svh overflow-hidden bg-[#f7f5ec] px-4 py-6 text-[#495343] sm:px-8'}>
      <AnimatePresence mode='wait'>
        {stage === 'loading' && (
          <motion.section
            key='loading'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={transition}
            className='relative grid min-h-[calc(100svh-3rem)] place-items-center overflow-hidden text-center'
          >
            <LandingImage
              src='/assets/landing/flor_arriba.png.png'
              alt=''
              className='pointer-events-none absolute -bottom-8 -left-14 w-52 opacity-70 sm:w-72'
            />
            <LandingImage
              src='/assets/landing/flor_bajo.png'
              alt=''
              className='pointer-events-none absolute -right-12 -top-8 w-56 opacity-70 sm:w-80'
            />
            <div
              role='status'
              aria-live='polite'
              className='relative z-10 rounded-[2rem] border border-[#d7d5ba] bg-[#fffdf8]/90 px-9 py-10 shadow-[0_24px_70px_rgba(76,87,68,0.12)] backdrop-blur-sm sm:px-14'
            >
              <motion.div
                animate={reducedMotion ? {} : { rotate: 360 }}
                transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
                className='mx-auto size-10 rounded-full border-[3px] border-[#d96f9d] border-t-transparent'
              />
              <p className='mt-6 font-[family-name:var(--font-lora)] text-xl font-semibold tracking-[0.08em] text-[#c65382]'>
                Cargando tu invitación
              </p>
              <p className='mt-3 font-[family-name:var(--font-lora)] text-sm font-semibold tracking-[0.08em] text-[#8c713c]'>
                Estamos preparando un momento especial para ti…
              </p>
            </div>
          </motion.section>
        )}
        {(stage === 'envelope' || stage === 'opening') && (
          <motion.section
            key='envelope'
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={transition}
            className='grid min-h-[calc(100svh-3rem)] place-items-center'
          >
            <div className='w-full max-w-md [perspective:1600px]'>
              <button
                type='button'
                disabled={stage === 'opening'}
                onClick={() => setStage(nextInvitationStage(stage))}
                aria-label='Abrir invitación'
                aria-describedby='envelope-help'
                className='relative block aspect-[1.25/1] w-full text-left outline-offset-8 focus-visible:outline-2 focus-visible:outline-gold disabled:cursor-default'
              >
                <motion.div
                  className='absolute left-[25%] top-[6%] z-10 aspect-[9/16] w-[50%] overflow-hidden rounded-[0.35rem] bg-[#fffdf8] shadow-[0_16px_30px_rgba(76,87,68,0.2)]'
                  initial={false}
                  animate={{
                    y: stage === 'opening' ? '-52%' : '8%',
                    opacity: stage === 'opening' ? 1 : 0,
                    rotate: stage === 'opening' ? 0 : 1,
                    zIndex: stage === 'opening' ? 40 : 10,
                  }}
                  transition={openingTransition}
                >
                  <LandingImage
                    src={invitationImagePath}
                    alt={`Invitación de ${invitation.eventName}`}
                    className='h-full w-full object-contain'
                  />
                </motion.div>
                <motion.div
                  className='pointer-events-none absolute inset-0 z-20'
                  animate={{ y: stage === 'opening' ? '-1.8%' : '0%' }}
                  transition={openingTransition}
                >
                  <LandingImage
                    src='/assets/landing/sobre.png'
                    alt='Sobre de invitación'
                    className='h-full w-full object-contain drop-shadow-[0_24px_28px_rgba(76,53,43,0.22)]'
                  />
                </motion.div>
                <motion.div
                  className='pointer-events-none absolute inset-0 z-30 origin-[50%_13%]'
                  animate={{
                    rotateX: stage === 'opening' ? -175 : 0,
                    y: stage === 'opening' ? '1.8%' : '0%',
                  }}
                  transition={openingTransition}
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  <LandingImage src='/assets/landing/pestanaSobre.png' alt='' className='h-full w-full object-contain' />
                  <LandingImage
                    src='/assets/landing/sello.png'
                    alt='Sello del sobre'
                    className='absolute left-[41.5%] top-[51.5%] w-[17%]'
                  />
                </motion.div>
              </button>
              <p id='envelope-help' className='mt-7 text-center font-[family-name:var(--font-lora)] text-sm font-semibold tracking-[0.08em] text-[#8c713c]'>
                Toca el sobre para abrir tu invitación
              </p>
            </div>
          </motion.section>
        )}
        {stage === 'invitation' && (
          <PersonalizedLanding
            invitation={invitation}
            slug={slug}
            transition={transition}
          />
        )}
      </AnimatePresence>
    </main>
  );
}

function PersonalizedLanding({
  invitation,
  slug,
  transition,
}: {
  invitation: PublicInvitationDto;
  slug: string;
  transition: Transition;
}) {
  return (
    <motion.section
      key='invitation'
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={transition}
      className='w-full'
    >
      <PublicLandingPage
        personalizedContent={<PersonalizedInvitationDetails invitation={invitation} slug={slug} />}
        hideAttendance
      />
    </motion.section>
  );
}

function PersonalizedInvitationDetails({ invitation, slug }: { invitation: PublicInvitationDto; slug: string }) {
  const maximumGuests = invitation.guestNames.length + invitation.maxExtraGuests;
  return (
    <section className='border-y border-[#e2d4c0] bg-[#fffdf8] px-6 py-9 text-center text-[#8c713c] sm:px-10'>
      <h1 className='font-[family-name:var(--font-lora)] text-lg font-semibold tracking-[0.08em] text-[#8c713c] sm:text-xl'>
        Esta invitación es para
      </h1>
      <div className='mt-5 space-y-1 font-[family-name:var(--font-luxurious-script)] text-3xl leading-tight text-[#c65382]'>
        {invitation.guestNames.map((name) => (
          <p key={name}>{name}</p>
        ))}
      </div>
      <p className='mx-auto mt-6 flex max-w-xs items-center justify-center gap-2 font-[family-name:var(--font-lora)] text-sm font-semibold leading-6 text-[#8c713c]'>
        <UsersRound size={18} className='shrink-0 text-[#d96f9d]' />
        Pase para {maximumGuests} persona{maximumGuests === 1 ? '' : 's'}
      </p>
      <PersonalizedAttendanceForm
        slug={slug}
        namedGuestLimit={invitation.guestNames.length}
        maxExtraGuests={invitation.maxExtraGuests}
        initialRsvp={invitation.initialRsvp}
      />
    </section>
  );
}
