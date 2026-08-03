'use client';

import { startTransition, useActionState, useEffect, useRef, useState } from 'react';
import { CheckCircle2, Send, X } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useWatch } from 'react-hook-form';
import type { z } from 'zod';
import {
  submitLandingRsvp,
  type LandingRsvpSubmissionState,
} from '@/actions/landing-rsvp-submissions';
import {
  landingRsvpSubmissionSchema,
  type LandingRsvpSubmissionInput,
} from '@/lib/validation/landing-rsvp-submission';

type FormValues = z.input<typeof landingRsvpSubmissionSchema>;
const initialState: LandingRsvpSubmissionState = { status: 'idle' };

export function LandingRsvpCta({ label }: { label: string }) {
  const [open, setOpen] = useState(false);
  const [session, setSession] = useState(0);
  return (
    <>
      <button
        type='button'
        onClick={() => {
          setSession((value) => value + 1);
          setOpen(true);
        }}
        className='min-h-12 w-full rounded-full bg-[#59664d] px-6 py-3.5 text-sm font-semibold tracking-wide text-white shadow-[0_12px_24px_rgba(89,102,77,0.24)] transition-colors hover:bg-[#46513c]'
      >
        {label}
      </button>
      {open && <LandingRsvpDialog key={session} onClose={() => setOpen(false)} />}
    </>
  );
}

function LandingRsvpDialog({ onClose }: { onClose: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, pending] = useActionState(submitLandingRsvp, initialState);
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues, unknown, LandingRsvpSubmissionInput>({
    resolver: zodResolver(landingRsvpSubmissionSchema),
    defaultValues: { firstName: '', lastName: '', response: 'attending', website: '' },
  });
  const response = useWatch({ control, name: 'response' });
  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();
  }, []);
  useEffect(() => {
    if (state.status === 'success') formRef.current?.focus();
  }, [state.status]);
  function submit() {
    if (formRef.current) startTransition(() => formAction(new FormData(formRef.current!)));
  }

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      aria-labelledby='landing-rsvp-title'
      className='fixed inset-x-3 bottom-3 m-0 max-h-[calc(100svh-1.5rem)] w-[calc(100%-1.5rem)] max-w-none overflow-y-auto rounded-[1.5rem] border border-[#d7d5ba] bg-[#fffdf8] p-5 text-[#495343] shadow-2xl backdrop:bg-[#30382d]/45 sm:inset-0 sm:m-auto sm:w-full sm:max-w-md sm:rounded-[1.75rem] sm:p-6'
    >
      <div className='flex items-start justify-between gap-4'>
        <div>
          <p className='text-xs font-semibold tracking-[0.18em] text-[#8b9677]'>CONFIRMACIÓN</p>
          <h2 id='landing-rsvp-title' className='mt-2 font-serif text-2xl text-[#59664d]'>
            Confirma tu asistencia
          </h2>
        </div>
        <button
          type='button'
          onClick={() => dialogRef.current?.close()}
          className='grid size-11 shrink-0 place-items-center rounded-full text-[#59664d] hover:bg-[#f3f1e7]'
          aria-label='Cerrar confirmación'
        >
          <X size={19} />
        </button>
      </div>
      <p className='mt-4 text-sm leading-6 text-[#70796c]'>
        Déjanos tu respuesta para esta celebración.
      </p>
      <form
        ref={formRef}
        tabIndex={-1}
        className='mt-5 space-y-4'
        noValidate
        onSubmit={(event) => {
          event.preventDefault();
          void handleSubmit(submit)();
        }}
      >
        <div className='grid gap-3 sm:grid-cols-2'>
          <label className='text-sm font-medium'>
            Nombre
            <input
              {...register('firstName')}
              autoComplete='given-name'
              aria-invalid={Boolean(errors.firstName)}
              className='mt-2 min-h-11 w-full rounded-xl border border-stone-200 px-4 py-2.5'
            />
            {errors.firstName && (
              <span className='mt-1 block text-xs text-red-700'>{errors.firstName.message}</span>
            )}
          </label>
          <label className='text-sm font-medium'>
            Apellido
            <input
              {...register('lastName')}
              autoComplete='family-name'
              aria-invalid={Boolean(errors.lastName)}
              className='mt-2 min-h-11 w-full rounded-xl border border-stone-200 px-4 py-2.5'
            />
            {errors.lastName && (
              <span className='mt-1 block text-xs text-red-700'>{errors.lastName.message}</span>
            )}
          </label>
        </div>
        <div className='grid grid-cols-2 gap-2'>
          <label
            className={`min-h-11 cursor-pointer rounded-xl border px-2 py-2.5 text-center text-xs font-semibold sm:px-3 sm:text-sm ${response === 'attending' ? 'border-[#59664d] bg-[#e7ede0] text-[#46513c]' : 'border-stone-200'}`}
          >
            <input {...register('response')} value='attending' type='radio' className='sr-only' />
            Sí asistiré
          </label>
          <label
            className={`min-h-11 cursor-pointer rounded-xl border px-2 py-2.5 text-center text-xs font-semibold sm:px-3 sm:text-sm ${response === 'not_attending' ? 'border-[#8a6870] bg-[#f3e7e7] text-[#75555c]' : 'border-stone-200'}`}
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
        <label
          className='pointer-events-none absolute -left-[10000px] opacity-0'
          aria-hidden='true'
        >
          No completar
          <input {...register('website')} tabIndex={-1} autoComplete='off' />
        </label>
        <button
          disabled={pending}
          className='flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#59664d] px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60'
        >
          <Send size={17} />
          {pending ? 'Enviando…' : 'Enviar respuesta'}
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
    </dialog>
  );
}
