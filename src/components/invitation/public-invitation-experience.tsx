'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Heart, UsersRound } from 'lucide-react';
import { PublicLandingPage } from '@/components/landing/event-landing';
import { nextInvitationStage, type InvitationStage } from '@/lib/invitation-experience';
import type { PublicInvitationDto } from '@/lib/queries/public-invitation';
import { RsvpForm } from './rsvp-form';

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

  const transition = reducedMotion
    ? { duration: 0 }
    : { duration: 0.7, ease: 'easeInOut' as const };
  return (
    <main className={stage === 'invitation' ? 'min-h-svh' : 'min-h-svh overflow-hidden bg-[#481c28] px-4 py-6 text-[#39241e] sm:px-8'}>
      <AnimatePresence mode='wait'>
        {stage === 'loading' && (
          <motion.section
            key='loading'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={transition}
            className='grid min-h-[calc(100svh-3rem)] place-items-center text-center text-white'
          >
            <div>
              <motion.div
                animate={reducedMotion ? {} : { rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                className='mx-auto grid size-16 place-items-center rounded-full border-2 border-gold border-t-transparent'
              >
                <Heart size={25} />
              </motion.div>
              <p className='mt-6 font-serif text-3xl'>Una invitación especial</p>
              <p className='mt-2 text-sm text-white/70'>Preparando un momento para ti…</p>
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
            <div className='w-full max-w-sm [perspective:1200px]'>
              <button
                type='button'
                disabled={stage === 'opening'}
                onClick={() => setStage(nextInvitationStage(stage))}
                aria-label='Abrir invitación'
                aria-describedby='envelope-help'
                className='relative block aspect-[1.45/1] w-full rounded-md bg-[#e6caa3] text-left shadow-[0_30px_70px_rgba(0,0,0,0.35)] outline-offset-8 focus-visible:outline-2 focus-visible:outline-gold disabled:cursor-default'
              >
                <motion.div
                  className='absolute inset-x-0 top-0 z-20 h-[55%] origin-top bg-[#f6dfb9] [clip-path:polygon(0_0,100%_0,50%_100%)]'
                  animate={{ rotateX: stage === 'opening' ? -175 : 0 }}
                  transition={transition}
                  style={{ transformStyle: 'preserve-3d' }}
                />
                <div className='absolute inset-0 bg-[#d9b887] [clip-path:polygon(0_0,50%_52%,100%_0,100%_100%,0_100%)]' />
                <motion.div
                  className='absolute left-[8%] right-[8%] top-[10%] z-10 h-[85%] rounded-sm bg-cream p-4 shadow-lg'
                  initial={false}
                  animate={{
                    y: stage === 'opening' ? -150 : 15,
                    opacity: stage === 'opening' ? 1 : 0.8,
                    rotate: stage === 'opening' ? 0 : 1,
                  }}
                  transition={transition}
                  onAnimationComplete={() => {
                    if (stage === 'opening') setStage('invitation');
                  }}
                >
                  <div className='h-full border border-gold/40' />
                </motion.div>
                <motion.div
                  className='absolute left-1/2 top-1/2 z-30 grid size-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-wine text-gold shadow-md'
                  animate={{
                    scale: stage === 'opening' ? 0 : 1,
                    opacity: stage === 'opening' ? 0 : 1,
                  }}
                  transition={reducedMotion ? { duration: 0 } : { duration: 0.35 }}
                >
                  <Heart size={24} fill='currentColor' />
                </motion.div>
              </button>
              <p id='envelope-help' className='mt-8 text-center text-sm text-white/80'>
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
  transition: { duration: number; ease?: 'easeInOut' };
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
        personalizedContent={<PersonalizedInvitationDetails invitation={invitation} />}
        rsvpContent={<RsvpForm slug={slug} invitation={invitation} compact />}
      />
    </motion.section>
  );
}

function PersonalizedInvitationDetails({ invitation }: { invitation: PublicInvitationDto }) {
  return <section className='border-y border-[#e2d4c0] bg-[#fffdf8] px-6 py-9 text-center text-[#8c713c] sm:px-10'><h1 className='font-[family-name:var(--font-luxurious-script)] text-4xl leading-none text-[#c65382]'>Esta invitación es para</h1><div className='mt-5 space-y-1 font-[family-name:var(--font-luxurious-script)] text-3xl leading-tight text-[#c65382]'>{invitation.guestNames.map((name) => <p key={name}>{name}</p>)}</div><p className='mx-auto mt-6 flex max-w-xs items-center justify-center gap-2 font-[family-name:var(--font-lora)] text-sm leading-6 text-[#8c713c]'><UsersRound size={18} className='shrink-0 text-[#d96f9d]' />{invitation.maxExtraGuests === 0 ? 'Invitación personal' : `${invitation.maxExtraGuests} acompañante${invitation.maxExtraGuests === 1 ? '' : 's'} adicional${invitation.maxExtraGuests === 1 ? '' : 'es'} permitido${invitation.maxExtraGuests === 1 ? '' : 's'}`}</p></section>;
}
