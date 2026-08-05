'use client';

import { useActionState, useEffect, useRef, startTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { createInvitation, updateInvitation } from '@/actions/invitations';
import type { InvitationActionState } from '@/actions/invitations';

const initialInvitationActionState: InvitationActionState = {};
type FormValues = {
  id?: string;
  eventId: string;
  recipientName: string;
  slug: string;
  maxGuests: number;
  internalNotes: string;
};
type InvitationFormProps = {
  event: { id: string; name: string };
  invitation?: {
    id: string;
    label: string;
    public_slug: string;
    max_extra_guests: number;
    internal_notes: string | null;
    guests: { full_name: string; is_primary: boolean }[];
  };
};

export function InvitationForm({ event, invitation }: InvitationFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const action = invitation ? updateInvitation : createInvitation;
  const [state, formAction, pending] = useActionState(action, initialInvitationActionState);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      id: invitation?.id,
      eventId: event.id,
      recipientName:
        invitation?.guests.find((guest) => guest.is_primary)?.full_name ??
        invitation?.guests[0]?.full_name ??
        invitation?.label ??
        '',
      slug: invitation?.public_slug ?? '',
      maxGuests: (invitation?.max_extra_guests ?? 0) + 1,
      internalNotes: invitation?.internal_notes ?? '',
    },
  });

  useEffect(() => {
    if (state.error) toast.error(state.error);
  }, [state.error]);
  function submit() {
    if (!formRef.current) return;
    const data = new FormData(formRef.current);
    const recipientName = String(data.get('recipientName') ?? '').trim();
    const maxGuests = Number(data.get('maxGuests'));
    data.set('label', recipientName);
    data.set('maxExtraGuests', String(Math.max(0, maxGuests - 1)));
    data.set('guests', JSON.stringify([{ fullName: recipientName, isPrimary: true }]));
    startTransition(() => formAction(data));
  }

  return (
    <form
      ref={formRef}
      className='space-y-7 rounded-3xl border border-rose/20 bg-white p-6 sm:p-8'
      noValidate
      onSubmit={(eventSubmit) => {
        eventSubmit.preventDefault();
        void handleSubmit(submit)();
      }}
    >
      <input type='hidden' {...register('id')} />
      <input type='hidden' {...register('eventId')} />
      <div>
        <p className='text-sm font-medium text-gold'>EVENTO: {event.name}</p>
        <h2 className='mt-2 font-serif text-2xl text-wine'>Datos de la invitación</h2>
      </div>
      <label className='block text-sm font-medium'>
        ¿Para quién es esta invitación?
        <input
          {...register('recipientName', { required: 'Indica una persona o familia.' })}
          className='mt-2 w-full rounded-xl border border-stone-200 px-4 py-3'
          placeholder='Ej. Familia Ovando o Ana Rousselin'
        />
        <span className='mt-1 block text-xs font-normal text-stone-500'>
          Escribe un solo nombre o el nombre de una familia; no necesitas agregar a cada persona.
        </span>
      </label>
      {errors.recipientName && <p className='text-sm text-red-700'>{errors.recipientName.message}</p>}
      <div className='grid gap-5 sm:grid-cols-2'>
        <label className='block text-sm font-medium'>
          Pase para
          <input
            {...register('maxGuests', { valueAsNumber: true, min: 1 })}
            type='number'
            min='1'
            className='mt-2 w-full rounded-xl border border-stone-200 px-4 py-3'
          />
          <span className='mt-1 block text-xs font-normal text-stone-500'>
            Número máximo de personas que pueden asistir con este pase, incluida la persona o familia.
          </span>
        </label>
        <label className='block text-sm font-medium'>
          Enlace personalizado <span className='font-normal text-stone-500'>(opcional)</span>
          <input
            {...register('slug')}
            className='mt-2 w-full rounded-xl border border-stone-200 px-4 py-3'
            placeholder='Se genera desde el nombre o familia'
          />
          <span className='mt-1 block text-xs font-normal text-stone-500'>
            Si lo dejas vacío, se genera automáticamente y añade un sufijo único.
          </span>
        </label>
      </div>
      {invitation && invitation.guests.length > 1 && (
        <p className='rounded-xl border border-gold/30 bg-gold/10 p-3 text-sm text-stone-700'>
          Esta invitación tenía varios nombres. Al guardar, se usará únicamente el nombre o familia
          indicado arriba.
        </p>
      )}
      <label className='block text-sm font-medium'>
        Notas internas{' '}
        <span className='font-normal text-stone-500'>(no se muestran a invitados)</span>
        <textarea
          {...register('internalNotes')}
          className='mt-2 min-h-28 w-full rounded-xl border border-stone-200 px-4 py-3'
          maxLength={1000}
        />
      </label>
      <button
        disabled={pending}
        className='rounded-full bg-wine px-6 py-3 text-sm font-semibold text-white disabled:opacity-60'
      >
        {pending ? 'Guardando…' : invitation ? 'Guardar cambios' : 'Crear invitación'}
      </button>
    </form>
  );
}
