'use client';

import { startTransition, useActionState, useRef, useState } from 'react';
import { CheckCircle2, Minus, Plus } from 'lucide-react';
import { submitRsvp, type RsvpActionState } from '@/actions/rsvp';

type PersonalizedAttendanceFormProps = {
  slug: string;
  namedGuestLimit: number;
  maxExtraGuests: number;
  initialRsvp: {
    namedGuestsAttending: number;
    extraGuestsAttending: number;
  } | null;
};

const initialState: RsvpActionState = { status: 'idle' };

export function PersonalizedAttendanceForm({
  slug,
  namedGuestLimit,
  maxExtraGuests,
  initialRsvp,
}: PersonalizedAttendanceFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const maximumGuests = namedGuestLimit + maxExtraGuests;
  const initialAttendees = initialRsvp
    ? initialRsvp.namedGuestsAttending + initialRsvp.extraGuestsAttending
    : 0;
  const [attendees, setAttendees] = useState(initialAttendees);
  const [needsDeclineConfirmation, setNeedsDeclineConfirmation] = useState(false);
  const [submittedAttendees, setSubmittedAttendees] = useState<number | null>(null);
  const [state, formAction, pending] = useActionState(submitRsvp, initialState);
  const isAttending = attendees > 0;
  const namedGuestsAttending = Math.min(attendees, namedGuestLimit);
  const extraGuestsAttending = Math.max(0, attendees - namedGuestLimit);

  function sendResponse() {
    if (!formRef.current) return;
    setNeedsDeclineConfirmation(false);
    setSubmittedAttendees(attendees);
    startTransition(() => formAction(new FormData(formRef.current!)));
  }

  return (
    <form
      ref={formRef}
      className='mx-auto mt-6 max-w-xs text-left'
      onSubmit={(event) => {
        event.preventDefault();
        if (attendees === 0) {
          setNeedsDeclineConfirmation(true);
          return;
        }
        sendResponse();
      }}
    >
      <input type='hidden' name='slug' value={slug} />
      <input type='hidden' name='response' value={isAttending ? 'attending' : 'not_attending'} />
      <input type='hidden' name='namedGuestsAttending' value={namedGuestsAttending} />
      <input type='hidden' name='extraGuestsAttending' value={extraGuestsAttending} />
      <input type='hidden' name='website' value='' />

      <p className='text-center font-[family-name:var(--font-lora)] text-sm font-semibold text-[#8c713c]'>
        ¿Cuántas personas asistirán?
      </p>
      <div className='mt-3 flex items-center justify-between rounded-2xl border border-[#dfcdbd] bg-[#fffdf8]/90 p-1.5 shadow-sm'>
        <button
          type='button'
          onClick={() => setAttendees((value) => Math.max(0, value - 1))}
          disabled={pending || attendees === 0}
          className='grid size-11 place-items-center rounded-xl text-[#9e3e66] transition hover:bg-[#fbedf2] disabled:cursor-not-allowed disabled:opacity-40'
          aria-label='Reducir número de asistentes'
        >
          <Minus size={19} aria-hidden />
        </button>
        <output className='text-center'>
          <span className='block font-[family-name:var(--font-lora)] text-2xl font-semibold text-[#c65382]'>
            {attendees}
          </span>
          <span className='block text-xs text-[#8c713c]'>
            de {maximumGuests} persona{maximumGuests === 1 ? '' : 's'}
          </span>
        </output>
        <button
          type='button'
          onClick={() => setAttendees((value) => Math.min(maximumGuests, value + 1))}
          disabled={pending || attendees === maximumGuests}
          className='grid size-11 place-items-center rounded-xl text-[#9e3e66] transition hover:bg-[#fbedf2] disabled:cursor-not-allowed disabled:opacity-40'
          aria-label='Aumentar número de asistentes'
        >
          <Plus size={19} aria-hidden />
        </button>
      </div>
      <p
        aria-live='polite'
        className={`mt-3 rounded-xl px-3 py-2 text-center text-xs font-semibold leading-5 ${isAttending ? 'bg-[#fbedf2] text-[#9e3e66]' : 'bg-[#fff4ef] text-[#93462e]'}`}
      >
        {isAttending
          ? `Asistirán ${attendees} de ${maximumGuests} persona${maximumGuests === 1 ? '' : 's'}.`
          : 'No asistirá ninguna persona.'}
      </p>
      {needsDeclineConfirmation ? (
        <div
          role='alert'
          className='mt-4 rounded-2xl border border-[#e8c8bd] bg-[#fff7f3] p-4 text-center text-[#93462e]'
        >
          <p className='font-semibold'>
            ¿Confirmas que no asistirá ninguna persona?
          </p>
          <p className='mt-1 text-sm leading-5'>
            Aún puedes volver y cambiar la cantidad de asistentes.
          </p>
          <div className='mt-4 grid gap-2 sm:grid-cols-2'>
            <button
              type='button'
              onClick={() => setNeedsDeclineConfirmation(false)}
              className='min-h-11 rounded-xl border border-[#d7b7a9] bg-white px-3 text-sm font-semibold'
            >
              Volver
            </button>
            <button
              type='button'
              onClick={sendResponse}
              disabled={pending}
              className='min-h-11 rounded-xl bg-[#93462e] px-3 text-sm font-semibold text-white disabled:opacity-60'
            >
              Sí, no podremos asistir
            </button>
          </div>
        </div>
      ) : (
        <button
          type='submit'
          disabled={pending}
          className={`mt-4 min-h-11 w-full rounded-xl px-4 py-2.5 text-sm font-semibold text-[#fffaf0] shadow-[0_8px_18px_rgba(148,113,52,0.2)] transition-colors disabled:cursor-wait disabled:opacity-60 ${isAttending ? 'bg-[#947134] hover:bg-[#795a29]' : 'bg-[#93462e] hover:bg-[#79351f]'}`}
        >
          {pending
            ? 'Enviando respuesta…'
            : isAttending
              ? `Confirmar asistencia de ${attendees} persona${attendees === 1 ? '' : 's'}`
              : 'Indicar que no asistiré'}
        </button>
      )}
      {state.status === 'success' && (
        <div
          role='status'
          aria-live='polite'
          className='mt-4 flex gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-900'
        >
          <CheckCircle2 size={22} className='mt-0.5 shrink-0' aria-hidden />
          <div>
            <p className='font-semibold'>
              {submittedAttendees
                ? `¡Listo! Confirmaste ${submittedAttendees} persona${submittedAttendees === 1 ? '' : 's'}.`
                : '¡Listo! Registramos que no podrán asistir.'}
            </p>
            <p className='mt-0.5 text-sm leading-5'>Puedes cambiar tu respuesta desde este mismo enlace.</p>
          </div>
        </div>
      )}
      {state.status === 'error' && (
        <p role='alert' className='mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-800'>
          {state.message}
        </p>
      )}
    </form>
  );
}
