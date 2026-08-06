import {
  CalendarClock,
  CheckCircle2,
  ClipboardCheck,
  Clock3,
  TicketCheck,
  UsersRound,
  XCircle,
} from 'lucide-react';
import type { DashboardStats as DashboardStatsType } from '@/lib/queries/dashboard';
import { adminAudienceCopy } from '@/lib/admin-audience-copy';

const formatter = new Intl.DateTimeFormat('es-GT', {
  dateStyle: 'medium',
  timeStyle: 'short',
  timeZone: 'America/Guatemala',
});

export function DashboardStats({ stats }: { stats: DashboardStatsType }) {
  const confirmationRate = stats.passesIssued
    ? Math.min(100, Math.round((stats.personalizedConfirmed / stats.passesIssued) * 100))
    : 0;

  return (
    <div className='space-y-6'>
      <section className='grid gap-4 lg:grid-cols-3'>
        <HighlightCard
          label='Personas confirmadas'
          value={stats.totalConfirmed}
          detail='Familiares con pase + amigos de la landing pública'
          icon={UsersRound}
          featured
        />
        <HighlightCard
          label='Personas con pase familiar'
          value={stats.passesIssued}
          detail='Capacidad total destinada a familiares con invitación personalizada'
          icon={TicketCheck}
        />
        <HighlightCard
          label='Respuestas recibidas'
          value={
            stats.invitationsTotal - stats.pendingInvitations + stats.landingResponsesTotal
          }
          detail='Pases familiares respondidos + respuestas de amigos'
          icon={ClipboardCheck}
        />
      </section>

      <section className='grid gap-6 xl:grid-cols-2'>
        <article className='rounded-3xl border border-rose/20 bg-white p-6 shadow-sm'>
          <div className='flex items-start justify-between gap-4'>
            <div>
              <p className='text-xs font-semibold tracking-[0.16em] text-gold'>
                {adminAudienceCopy.personalized.eyebrow}
              </p>
              <h2 className='mt-2 font-serif text-2xl text-wine'>Pases personalizados</h2>
            </div>
            <TicketCheck className='text-gold' size={26} />
          </div>
          <div className='mt-6 grid grid-cols-2 gap-3'>
            <MiniStat label='Pases familiares' value={stats.invitationsTotal} icon={TicketCheck} />
            <MiniStat label='Pases pendientes' value={stats.pendingInvitations} icon={Clock3} />
            <MiniStat label='Pases confirmados' value={stats.attendingInvitations} icon={CheckCircle2} />
            <MiniStat label='Pases rechazados' value={stats.notAttendingInvitations} icon={XCircle} />
          </div>
          <div className='mt-6 rounded-2xl bg-[#fbf7f3] p-4'>
            <div className='flex items-center justify-between gap-3 text-sm'>
              <span className='font-medium text-stone-600'>Personas confirmadas con pase</span>
              <strong className='text-wine'>
                {stats.personalizedConfirmed} de {stats.passesIssued}
              </strong>
            </div>
            <div className='mt-3 h-2 overflow-hidden rounded-full bg-rose/15'>
              <div
                className='h-full rounded-full bg-gradient-to-r from-wine to-[#d96f9d] transition-[width] duration-500'
                style={{ width: `${confirmationRate}%` }}
              />
            </div>
            <p className='mt-2 text-xs text-stone-500'>{confirmationRate}% del cupo confirmado</p>
          </div>
        </article>

        <article className='rounded-3xl border border-rose/20 bg-white p-6 shadow-sm'>
          <div className='flex items-start justify-between gap-4'>
            <div>
              <p className='text-xs font-semibold tracking-[0.16em] text-gold'>
                {adminAudienceCopy.publicLanding.eyebrow}
              </p>
              <h2 className='mt-2 font-serif text-2xl text-wine'>Respuestas de amigos</h2>
            </div>
            <ClipboardCheck className='text-gold' size={26} />
          </div>
          <div className='mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3'>
            <MiniStat label='Recibidas' value={stats.landingResponsesTotal} icon={ClipboardCheck} />
            <MiniStat label='Sí asistirán' value={stats.landingConfirmed} icon={CheckCircle2} />
            <MiniStat label='No asistirán' value={stats.landingNotAttending} icon={XCircle} />
          </div>
          <div className='mt-6 rounded-2xl border border-gold/20 bg-gold/5 p-4 text-sm leading-6 text-stone-600'>
            Cada amigo que responde desde la landing cuenta como una persona. Estas respuestas se
            muestran separadas de los pases familiares para evitar confusiones.
          </div>
        </article>
      </section>

      <div className='flex items-center gap-3 rounded-2xl border border-rose/20 bg-white p-5 text-sm text-stone-600 shadow-sm'>
        <CalendarClock className='shrink-0 text-gold' size={20} />
        <span>
          Última respuesta registrada:{' '}
          <strong className='text-stone-800'>
            {stats.lastResponseAt
              ? formatter.format(new Date(stats.lastResponseAt))
              : 'Aún no hay respuestas'}
          </strong>
        </span>
      </div>
    </div>
  );
}

type IconType = typeof UsersRound;

function HighlightCard({
  label,
  value,
  detail,
  icon: Icon,
  featured = false,
}: {
  label: string;
  value: number;
  detail: string;
  icon: IconType;
  featured?: boolean;
}) {
  return (
    <article
      className={`rounded-3xl border p-6 shadow-sm ${featured ? 'border-wine/15 bg-gradient-to-br from-wine to-[#9b4559] text-white' : 'border-rose/20 bg-white'}`}
    >
      <div className='flex items-start justify-between gap-3'>
        <div>
          <p className={`text-sm font-medium ${featured ? 'text-white/80' : 'text-stone-500'}`}>
            {label}
          </p>
          <p className={`mt-2 text-4xl font-semibold ${featured ? 'text-white' : 'text-wine'}`}>
            {value}
          </p>
        </div>
        <span className={`rounded-2xl p-3 ${featured ? 'bg-white/15' : 'bg-gold/10'}`}>
          <Icon size={22} className={featured ? 'text-white' : 'text-gold'} />
        </span>
      </div>
      <p className={`mt-5 text-xs leading-5 ${featured ? 'text-white/70' : 'text-stone-500'}`}>
        {detail}
      </p>
    </article>
  );
}

function MiniStat({ label, value, icon: Icon }: { label: string; value: number; icon: IconType }) {
  return (
    <div className='rounded-2xl border border-stone-100 bg-[#fffdfb] p-4'>
      <Icon size={17} className='text-gold' />
      <p className='mt-3 text-xs text-stone-500'>{label}</p>
      <p className='mt-1 text-2xl font-semibold text-wine'>{value}</p>
    </div>
  );
}
