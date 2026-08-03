'use client';

import { startTransition, useActionState, useEffect, useRef } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle2 } from 'lucide-react';
import type { z } from 'zod';
import { submitRsvp, type RsvpActionState } from '@/actions/rsvp';
import { rsvpFormSchema, type RsvpInput } from '@/lib/validation/rsvp';

export type RsvpResponseInvitation = {
  slug: string;
  namedGuestLimit: number;
  maxExtraGuests: number;
  initialRsvp: {
    response: 'attending' | 'not_attending';
    namedGuestsAttending: number;
    extraGuestsAttending: number;
    message: string | null;
  } | null;
};

type RsvpFormValues = z.input<typeof rsvpFormSchema>;
const initialState: RsvpActionState = { status: 'idle' };

export function RsvpResponseForm({
  invitation,
  defaultResponse = 'attending',
  compact = false,
}: {
  invitation: RsvpResponseInvitation;
  defaultResponse?: 'attending' | 'not_attending';
  compact?: boolean;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, pending] = useActionState(submitRsvp, initialState);
  const existingResponse = invitation.initialRsvp;
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RsvpFormValues, unknown, RsvpInput>({
    resolver: zodResolver(rsvpFormSchema),
    defaultValues: {
      slug: invitation.slug,
      response: existingResponse?.response ?? defaultResponse,
      namedGuestsAttending: existingResponse?.namedGuestsAttending ?? invitation.namedGuestLimit,
      extraGuestsAttending: existingResponse?.extraGuestsAttending ?? 0,
      message: existingResponse?.message ?? '',
      website: '',
    },
  });
  const response = useWatch({ control, name: 'response' });
  const needsCounts = invitation.namedGuestLimit > 1 || invitation.maxExtraGuests > 0;
  useEffect(() => {
    if (state.status === 'success') formRef.current?.focus();
  }, [state.status]);
  function submit() {
    if (formRef.current) startTransition(() => formAction(new FormData(formRef.current!)));
  }

  return (
    <section
      className={
        compact
          ? 'text-left'
          : 'mt-8 rounded-2xl border border-dashed border-gold/70 bg-white/60 p-5 text-left'
      }
    >
      <h2
        className={
          compact
            ? 'font-serif text-2xl text-[#59664d]'
            : 'text-center text-sm font-semibold text-wine'
        }
      >
        {existingResponse ? 'Edita tu confirmación' : 'Confirmación de asistencia'}
      </h2>
      {existingResponse && (
        <p className='mt-2 text-sm leading-6 text-[#70796c]'>
          Ya habías confirmado tu respuesta, pero puedes actualizarla aquí.
        </p>
      )}
      <form
        ref={formRef}
        tabIndex={-1}
        className='mt-4 space-y-4'
        noValidate
        onSubmit={(event) => {
          event.preventDefault();
          void handleSubmit(submit)();
        }}
      >
        <input type='hidden' {...register('slug')} />
        <div className='grid grid-cols-2 gap-2'>
          <label
            className={`cursor-pointer rounded-xl border p-3 text-center text-sm ${response === 'attending' ? 'border-wine bg-rose/10 text-wine' : 'border-stone-200'}`}
          >
            <input {...register('response')} value='attending' type='radio' className='sr-only' />
            Sí asistiré
          </label>
          <label
            className={`cursor-pointer rounded-xl border p-3 text-center text-sm ${response === 'not_attending' ? 'border-wine bg-rose/10 text-wine' : 'border-stone-200'}`}
          >
            <input
              {...register('response')}
              value='not_attending'
              type='radio'
              className='sr-only'
            />
            No podré asistir
          </label>
        </div>
        {response === 'attending' && needsCounts ? (
          <div className='grid grid-cols-2 gap-3'>
            <label className='text-xs font-medium'>
              Personas nombradas
              <input
                {...register('namedGuestsAttending', { valueAsNumber: true })}
                type='number'
                min='0'
                max={invitation.namedGuestLimit}
                aria-invalid={Boolean(errors.namedGuestsAttending)}
                className='mt-1 min-h-11 w-full rounded-lg border border-stone-200 px-3 py-2 text-sm'
              />
              {errors.namedGuestsAttending && (
                <span className='mt-1 block text-red-700'>
                  {errors.namedGuestsAttending.message}
                </span>
              )}
            </label>
            {invitation.maxExtraGuests > 0 && (
              <label className='text-xs font-medium'>
                Acompañantes extras
                <input
                  {...register('extraGuestsAttending', { valueAsNumber: true })}
                  type='number'
                  min='0'
                  max={invitation.maxExtraGuests}
                  aria-invalid={Boolean(errors.extraGuestsAttending)}
                  className='mt-1 min-h-11 w-full rounded-lg border border-stone-200 px-3 py-2 text-sm'
                />
                {errors.extraGuestsAttending && (
                  <span className='mt-1 block text-red-700'>
                    {errors.extraGuestsAttending.message}
                  </span>
                )}
              </label>
            )}
          </div>
        ) : response === 'attending' ? (
          <>
            <input type='hidden' name='namedGuestsAttending' value='1' />
            <input type='hidden' name='extraGuestsAttending' value='0' />
          </>
        ) : (
          <>
            <input type='hidden' name='namedGuestsAttending' value='0' />
            <input type='hidden' name='extraGuestsAttending' value='0' />
          </>
        )}
        <label className='block text-xs font-medium'>
          Mensaje opcional
          <textarea
            {...register('message')}
            maxLength={500}
            aria-invalid={Boolean(errors.message)}
            className='mt-1 min-h-20 w-full rounded-lg border border-stone-200 px-3 py-2 text-sm'
          />
        </label>
        <label
          className='pointer-events-none absolute -left-[10000px] opacity-0'
          aria-hidden='true'
        >
          No completar
          <input {...register('website')} tabIndex={-1} autoComplete='off' />
        </label>
        {errors.message && (
          <p role='alert' className='text-xs text-red-700'>
            {errors.message.message}
          </p>
        )}
        <button
          disabled={pending}
          className='min-h-11 w-full rounded-xl bg-wine px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60'
        >
          {pending
            ? 'Guardando…'
            : existingResponse
              ? 'Actualizar respuesta'
              : 'Confirmar asistencia'}
        </button>
      </form>
      {state.status === 'success' && (
        <p
          role='status'
          aria-live='polite'
          className='mt-4 flex items-center gap-2 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-800'
        >
          <CheckCircle2 size={18} />
          {state.message}
        </p>
      )}
      {state.status === 'error' && (
        <p role='alert' className='mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-800'>
          {state.message}
        </p>
      )}
    </section>
  );
}
