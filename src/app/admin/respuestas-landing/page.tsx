import { CalendarClock, CheckCircle2, ClipboardList, XCircle } from 'lucide-react';
import { LandingRsvpSubmissionsList } from '@/components/admin/landing-rsvp-submissions-list';
import { RefreshButton } from '@/components/admin/refresh-button';
import { getLandingRsvpSubmissions } from '@/lib/queries/landing-rsvp-submissions';
import { adminAudienceCopy } from '@/lib/admin-audience-copy';

const formatter = new Intl.DateTimeFormat('es-GT', {
  dateStyle: 'medium',
  timeStyle: 'short',
  timeZone: 'America/Guatemala',
});

export default async function LandingResponsesPage() {
  const submissions = await getLandingRsvpSubmissions();
  const attending = submissions.filter((submission) => submission.response === 'attending').length;
  const notAttending = submissions.length - attending;
  const latestResponse = submissions[0]?.created_at ?? null;

  return (
    <>
      <div className='flex flex-wrap items-end justify-between gap-4'>
        <div>
          <p className='text-sm font-medium text-gold'>{adminAudienceCopy.publicLanding.eyebrow}</p>
          <h1 className='mt-2 font-serif text-4xl text-wine'>
            {adminAudienceCopy.publicLanding.heading}
          </h1>
          <p className='mt-3 max-w-2xl text-sm leading-6 text-stone-500'>
            {adminAudienceCopy.publicLanding.description} Estas respuestas son independientes de
            los pases personalizados para familiares.
          </p>
        </div>
        <RefreshButton />
      </div>

      <section className='mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4'>
        <SummaryCard label='Amigos que respondieron' value={submissions.length} icon={ClipboardList} />
        <SummaryCard label='Amigos que asistirán' value={attending} icon={CheckCircle2} tone='positive' />
        <SummaryCard label='Amigos que no asistirán' value={notAttending} icon={XCircle} />
        <article className='rounded-2xl border border-rose/20 bg-white p-5 shadow-sm'>
          <CalendarClock className='text-gold' size={20} />
          <p className='mt-5 text-xs text-stone-500'>Última respuesta</p>
          <p className='mt-1 text-sm font-semibold leading-5 text-wine'>
            {latestResponse ? formatter.format(new Date(latestResponse)) : 'Sin respuestas'}
          </p>
        </article>
      </section>

      <div className='mt-6 rounded-2xl border border-gold/20 bg-gold/5 px-5 py-4 text-sm leading-6 text-stone-600'>
        Para conocer el total general del evento, consulta el Resumen: allí se suman las personas
        confirmadas desde esta landing de amigos y las confirmadas mediante pases familiares.
      </div>

      <div className='mt-6'>
        <LandingRsvpSubmissionsList submissions={submissions} />
      </div>
    </>
  );
}

type SummaryIcon = typeof ClipboardList;

function SummaryCard({
  label,
  value,
  icon: Icon,
  tone = 'default',
}: {
  label: string;
  value: number;
  icon: SummaryIcon;
  tone?: 'default' | 'positive';
}) {
  return (
    <article className='rounded-2xl border border-rose/20 bg-white p-5 shadow-sm'>
      <span
        className={`inline-flex rounded-xl p-2 ${tone === 'positive' ? 'bg-emerald-50 text-emerald-700' : 'bg-gold/10 text-gold'}`}
      >
        <Icon size={20} />
      </span>
      <p className='mt-5 text-xs text-stone-500'>{label}</p>
      <p className='mt-1 text-2xl font-semibold text-wine'>{value}</p>
    </article>
  );
}
