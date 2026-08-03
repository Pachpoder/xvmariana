'use client';

import { useActionState, useEffect, useRef, startTransition } from 'react';
import { useFieldArray, useForm, useWatch } from 'react-hook-form';
import { Plus, Star, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { createInvitation, updateInvitation } from '@/actions/invitations';
import type { InvitationActionState } from '@/actions/invitations';

type GuestField = { fullName: string; isPrimary: boolean };
const initialInvitationActionState: InvitationActionState = {};
type FormValues = {
  id?: string;
  eventId: string;
  label: string;
  slug: string;
  maxExtraGuests: number;
  internalNotes: string;
  guests: GuestField[];
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
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      id: invitation?.id,
      eventId: event.id,
      label: invitation?.label ?? '',
      slug: invitation?.public_slug ?? '',
      maxExtraGuests: invitation?.max_extra_guests ?? 0,
      internalNotes: invitation?.internal_notes ?? '',
      guests: invitation?.guests.map((guest) => ({
        fullName: guest.full_name,
        isPrimary: guest.is_primary,
      })) ?? [{ fullName: '', isPrimary: true }],
    },
  });
  const { fields, append, remove } = useFieldArray({ control, name: 'guests' });
  const guests = useWatch({ control, name: 'guests' }) ?? [];

  useEffect(() => {
    if (state.error) toast.error(state.error);
  }, [state.error]);
  function choosePrimary(index: number) {
    guests.forEach((_, guestIndex) =>
      setValue(`guests.${guestIndex}.isPrimary`, guestIndex === index)
    );
  }
  function submit() {
    if (!formRef.current) return;
    const data = new FormData(formRef.current);
    data.set('guests', JSON.stringify(guests));
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
        Etiqueta interna
        <input
          {...register('label', { required: 'La etiqueta es obligatoria.' })}
          className='mt-2 w-full rounded-xl border border-stone-200 px-4 py-3'
          placeholder='Ej. Familia Ovando'
        />
      </label>
      {errors.label && <p className='text-sm text-red-700'>{errors.label.message}</p>}
      <div className='grid gap-5 sm:grid-cols-2'>
        <label className='block text-sm font-medium'>
          Extras permitidos
          <input
            {...register('maxExtraGuests', { valueAsNumber: true, min: 0 })}
            type='number'
            min='0'
            className='mt-2 w-full rounded-xl border border-stone-200 px-4 py-3'
          />
        </label>
        <label className='block text-sm font-medium'>
          Slug personalizado <span className='font-normal text-stone-500'>(opcional)</span>
          <input
            {...register('slug')}
            className='mt-2 w-full rounded-xl border border-stone-200 px-4 py-3'
            placeholder='Se genera desde el primer nombre'
          />
          <span className='mt-1 block text-xs font-normal text-stone-500'>
            Se normaliza a minúsculas y añade un sufijo aleatorio si se deja vacío.
          </span>
        </label>
      </div>
      <fieldset>
        <legend className='text-sm font-medium'>Nombres invitados</legend>
        <p className='mt-1 text-xs text-stone-500'>
          Agrega al menos un nombre y selecciona el principal.
        </p>
        <div className='mt-3 space-y-3'>
          {fields.map((field, index) => (
            <div key={field.id} className='flex gap-2'>
              <input
                {...register(`guests.${index}.fullName` as const, {
                  required: 'El nombre es obligatorio.',
                })}
                className='min-w-0 flex-1 rounded-xl border border-stone-200 px-4 py-3'
                placeholder='Nombre completo'
              />
              <button
                type='button'
                aria-label='Elegir como principal'
                onClick={() => choosePrimary(index)}
                className={`rounded-xl border px-3 ${guests[index]?.isPrimary ? 'border-gold bg-gold/10 text-gold' : 'border-stone-200 text-stone-500'}`}
              >
                <Star size={18} fill={guests[index]?.isPrimary ? 'currentColor' : 'none'} />
              </button>
              <button
                type='button'
                aria-label='Eliminar nombre'
                disabled={fields.length === 1}
                onClick={() => remove(index)}
                className='rounded-xl border border-stone-200 px-3 text-stone-500 disabled:opacity-40'
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
        <button
          type='button'
          onClick={() => append({ fullName: '', isPrimary: false })}
          className='mt-4 inline-flex items-center gap-2 text-sm font-semibold text-wine'
        >
          <Plus size={17} />
          Agregar nombre
        </button>
      </fieldset>
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
