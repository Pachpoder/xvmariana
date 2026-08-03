'use client';

import { startTransition, useActionState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { z } from 'zod';
import { updateEventSettings, type EventSettingsState } from '@/actions/event-settings';
import { eventSettingsSchema, type EventSettingsInput } from '@/lib/validation/event-settings';

type EventFormValues = z.input<typeof eventSettingsSchema>;
type EventSettings = {
  id: string;
  name: string;
  slug: string;
  invitation_image_path: string;
  loading_image_path: string | null;
  event_date: string;
  rsvp_deadline: string | null;
  loading_duration_ms: number;
  is_published: boolean;
};
const initialState: EventSettingsState = { status: 'idle' };
const inputClass = 'mt-2 w-full rounded-xl border border-stone-200 bg-white px-4 py-3';
const asLocalDateTime = (value: string | null) =>
  value
    ? new Date(value)
        .toLocaleString('sv-SE', { timeZone: 'America/Guatemala' })
        .replace(' ', 'T')
        .slice(0, 16)
    : '';

export function EventSettingsForm({ event }: { event: EventSettings }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, pending] = useActionState(updateEventSettings, initialState);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EventFormValues, unknown, EventSettingsInput>({
    resolver: zodResolver(eventSettingsSchema),
    defaultValues: {
      id: event.id,
      name: event.name,
      slug: event.slug,
      invitationImagePath: event.invitation_image_path,
      loadingImagePath: event.loading_image_path ?? '',
      eventDate: asLocalDateTime(event.event_date),
      rsvpDeadline: asLocalDateTime(event.rsvp_deadline),
      loadingDurationMs: event.loading_duration_ms,
      isPublished: event.is_published,
    },
  });
  useEffect(() => {
    if (state.status === 'success') formRef.current?.focus();
  }, [state.status]);
  function submit() {
    const form = formRef.current;
    if (form) startTransition(() => formAction(new FormData(form)));
  }
  const firstError = Object.values(errors)[0]?.message;

  return (
    <form
      ref={formRef}
      tabIndex={-1}
      className='max-w-3xl space-y-8 rounded-3xl border border-rose/20 bg-white p-6 sm:p-8'
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        void handleSubmit(submit)();
      }}
    >
      <input type='hidden' {...register('id')} />
      <fieldset className='space-y-5'>
        <legend className='font-serif text-2xl text-wine'>Datos del evento</legend>
        <p className='mt-2 text-sm leading-6 text-stone-500'>
          Esta información se utiliza para las invitaciones personales y sus confirmaciones. La
          landing pública se edita directamente desde el código.
        </p>
        <div className='grid gap-5 sm:grid-cols-2'>
          <Field
            label='Nombre del evento'
            hint='El nombre que identifica este evento dentro del panel.'
          >
            <input {...register('name')} className={inputClass} />
          </Field>
          <Field
            label='Nombre corto del enlace'
            hint='Solo letras, números y guiones. Se usa en las direcciones de las invitaciones.'
          >
            <input {...register('slug')} className={inputClass} />
          </Field>
          <Field label='Fecha y hora del evento' hint='Se muestra según la hora de Guatemala.'>
            <input {...register('eventDate')} type='datetime-local' className={inputClass} />
          </Field>
          <Field
            label='Último día para confirmar (opcional)'
            hint='Después de esta fecha, las invitaciones ya no aceptarán respuestas.'
          >
            <input {...register('rsvpDeadline')} type='datetime-local' className={inputClass} />
          </Field>
          <Field
            label='Tiempo de espera antes de abrir la invitación'
            hint='En milisegundos: 1,000 equivale a 1 segundo. Recomendado: 1,500 a 3,000.'
          >
            <input
              {...register('loadingDurationMs', { valueAsNumber: true })}
              type='number'
              min='0'
              max='10000'
              className={inputClass}
            />
          </Field>
          <label className='flex items-center gap-3 self-end rounded-xl border border-rose/20 p-4 text-sm font-medium'>
            <input {...register('isPublished')} type='checkbox' className='size-4 accent-wine' />
            Hacer visibles las invitaciones activas
          </label>
        </div>
        <Field
          label='Imagen de las invitaciones personales'
          hint='Usa una ruta dentro del sitio o una URL de imagen.'
        >
          <input {...register('invitationImagePath')} className={inputClass} />
        </Field>
        <Field
          label='Imagen mientras carga (opcional)'
          hint='Se muestra unos instantes antes de abrir la invitación. Si queda vacío, se usa la imagen principal.'
        >
          <input {...register('loadingImagePath')} className={inputClass} />
        </Field>
      </fieldset>
      {firstError && (
        <p role='alert' className='text-sm text-red-700'>
          {firstError}
        </p>
      )}
      <button
        disabled={pending}
        className='rounded-full bg-wine px-6 py-3 text-sm font-semibold text-white disabled:opacity-60'
      >
        {pending ? 'Guardando…' : 'Guardar configuración'}
      </button>
      {state.status === 'success' && (
        <p role='status' aria-live='polite' className='text-sm text-emerald-800'>
          {state.message}
        </p>
      )}
      {state.status === 'error' && (
        <p role='alert' className='text-sm text-red-700'>
          {state.message}
        </p>
      )}
    </form>
  );
}
function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint: string;
  children: React.ReactNode;
}) {
  return (
    <label className='block text-sm font-medium'>
      {label}
      <span className='mt-1 block text-xs font-normal leading-5 text-stone-500'>{hint}</span>
      {children}
    </label>
  );
}
