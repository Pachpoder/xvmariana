'use client';

import { startTransition, useActionState, useEffect, useRef, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle2, CircleAlert, LoaderCircle } from 'lucide-react';
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
  const submittingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const submissionStartTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [state, formAction, pending] = useActionState(submitRsvp, initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);
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
  useEffect(
    () => () => {
      if (submittingTimerRef.current) clearTimeout(submittingTimerRef.current);
      if (submissionStartTimerRef.current) clearTimeout(submissionStartTimerRef.current);
    },
    []
  );
  function submit() {
    if (!formRef.current) return;
    if (submittingTimerRef.current) clearTimeout(submittingTimerRef.current);
    if (submissionStartTimerRef.current) clearTimeout(submissionStartTimerRef.current);
    const formData = new FormData(formRef.current);
    setIsSubmitting(true);
    submittingTimerRef.current = setTimeout(() => setIsSubmitting(false), 650);
    submissionStartTimerRef.current = setTimeout(() => {
      startTransition(() => formAction(formData));
    }, 180);
  }
  const isSaving = pending || isSubmitting;

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
            ? 'font-[family-name:var(--font-luxurious-script)] text-4xl leading-none text-[#c65382]'
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
            className={`cursor-pointer rounded-xl border p-3 text-center text-sm transition-colors ${response === 'attending' ? 'border-[#c65382] bg-[#fbedf2] font-semibold text-[#9e3e66] shadow-sm' : compact ? 'border-[#dfcdbd] bg-[#fffdf8]/85 text-[#8c713c] hover:bg-[#fff7f5]' : 'border-stone-200'}`}
          >
            <input {...register('response')} value='attending' type='radio' className='sr-only' />
            Sí asistiré
          </label>
          <label
            className={`cursor-pointer rounded-xl border p-3 text-center text-sm transition-colors ${response === 'not_attending' ? 'border-[#c65382] bg-[#fbedf2] font-semibold text-[#9e3e66] shadow-sm' : compact ? 'border-[#dfcdbd] bg-[#fffdf8]/85 text-[#8c713c] hover:bg-[#fff7f5]' : 'border-stone-200'}`}
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
            <label className={`text-xs font-medium ${compact ? 'text-[#8c713c]' : ''}`}>
              Personas nombradas
              <input
                {...register('namedGuestsAttending', { valueAsNumber: true })}
                type='number'
                min='0'
                max={invitation.namedGuestLimit}
                aria-invalid={Boolean(errors.namedGuestsAttending)}
                className={`mt-1 min-h-11 w-full rounded-lg border px-3 py-2 text-sm ${compact ? 'border-[#dfcdbd] bg-[#fffdf8]/85 text-[#5e4930]' : 'border-stone-200'}`}
              />
              {errors.namedGuestsAttending && (
                <span className='mt-1 block text-red-700'>
                  {errors.namedGuestsAttending.message}
                </span>
              )}
            </label>
            {invitation.maxExtraGuests > 0 && (
              <label className={`text-xs font-medium ${compact ? 'text-[#8c713c]' : ''}`}>
                Acompañantes extras
                <input
                  {...register('extraGuestsAttending', { valueAsNumber: true })}
                  type='number'
                  min='0'
                  max={invitation.maxExtraGuests}
                  aria-invalid={Boolean(errors.extraGuestsAttending)}
                  className={`mt-1 min-h-11 w-full rounded-lg border px-3 py-2 text-sm ${compact ? 'border-[#dfcdbd] bg-[#fffdf8]/85 text-[#5e4930]' : 'border-stone-200'}`}
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
          <label className={`block text-xs font-medium ${compact ? 'text-[#8c713c]' : ''}`}>
          Mensaje opcional
          <textarea
            {...register('message')}
            maxLength={500}
            aria-invalid={Boolean(errors.message)}
            className={`mt-1 min-h-20 w-full rounded-lg border px-3 py-2 text-sm ${compact ? 'border-[#dfcdbd] bg-[#fffdf8]/85 text-[#5e4930] placeholder:text-[#b8a58e]' : 'border-stone-200'}`}
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
          disabled={isSaving}
          className={compact ? 'min-h-11 w-full rounded-xl bg-[#947134] px-4 py-2.5 text-sm font-semibold text-[#fffaf0] shadow-[0_8px_18px_rgba(148,113,52,0.2)] transition-colors hover:bg-[#795a29] disabled:opacity-60' : 'min-h-11 w-full rounded-xl bg-wine px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60'}
        >
          {isSaving
            ? 'Guardando tu respuesta…'
            : existingResponse
              ? 'Actualizar respuesta'
              : 'Confirmar asistencia'}
        </button>
      </form>
      {isSaving && (
        <div
          role='status'
          aria-live='polite'
          className={`mt-4 flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold ${compact ? 'bg-[#fff1f6] text-[#9e3e66]' : 'bg-rose/10 text-wine'}`}
        >
          <LoaderCircle size={18} className='animate-spin' aria-hidden />
          Guardando los cambios…
        </div>
      )}
      {state.status === 'success' && !isSaving && (
        <div
          role='status'
          aria-live='polite'
          className={`mt-4 flex gap-3 rounded-2xl border p-4 shadow-sm ${compact ? 'border-[#e9c6d4] bg-[#fff6f9] text-[#873653]' : 'border-emerald-200 bg-emerald-50 text-emerald-900'}`}
        >
          <CheckCircle2 size={22} className='mt-0.5 shrink-0' aria-hidden />
          <div>
            <p className='font-semibold'>¡Listo, quedó guardado!</p>
            <p className='mt-0.5 text-sm leading-5'>{state.message}</p>
          </div>
        </div>
      )}
      {state.status === 'error' && !isSaving && (
        <div
          role='alert'
          className={`mt-4 flex gap-3 rounded-2xl border p-4 ${compact ? 'border-[#e8c8bd] bg-[#fff7f3] text-[#93462e]' : 'border-red-200 bg-red-50 text-red-800'}`}
        >
          <CircleAlert size={22} className='mt-0.5 shrink-0' aria-hidden />
          <div>
            <p className='font-semibold'>No pudimos guardar tu respuesta</p>
            <p className='mt-0.5 text-sm leading-5'>{state.message}</p>
          </div>
        </div>
      )}
    </section>
  );
}
