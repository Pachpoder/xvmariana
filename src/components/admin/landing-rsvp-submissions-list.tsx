import type { Database } from '@/types/database';

type Submission = Pick<
  Database['public']['Tables']['landing_rsvp_submissions']['Row'],
  'id' | 'first_name' | 'last_name' | 'response' | 'created_at'
>;
const formatter = new Intl.DateTimeFormat('es-GT', {
  dateStyle: 'medium',
  timeStyle: 'short',
  timeZone: 'America/Guatemala',
});

export function LandingRsvpSubmissionsList({ submissions }: { submissions: Submission[] }) {
  if (!submissions.length)
    return (
      <section className='rounded-2xl border border-dashed border-stone-300 bg-white p-8 text-center text-sm text-stone-500'>
        Aún no hay respuestas enviadas desde la landing.
      </section>
    );
  return (
    <section className='overflow-hidden rounded-2xl border border-rose/20 bg-white'>
      <div className='hidden overflow-x-auto sm:block'>
        <table className='w-full text-left text-sm'>
          <thead className='bg-[#fbf7f3] text-stone-600'>
            <tr>
              <th className='px-5 py-4 font-semibold'>Nombre</th>
              <th className='px-5 py-4 font-semibold'>Respuesta</th>
              <th className='px-5 py-4 font-semibold'>Enviada</th>
            </tr>
          </thead>
          <tbody>
            {submissions.map((submission) => (
              <tr key={submission.id} className='border-t border-stone-100'>
                <td className='px-5 py-4 font-medium'>
                  {submission.first_name} {submission.last_name}
                </td>
                <td className='px-5 py-4'>
                  <ResponseBadge response={submission.response} />
                </td>
                <td className='px-5 py-4 text-stone-500'>
                  {formatter.format(new Date(submission.created_at))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className='space-y-3 p-4 sm:hidden'>
        {submissions.map((submission) => (
          <article key={submission.id} className='rounded-xl border border-stone-100 p-4'>
            <p className='font-medium'>
              {submission.first_name} {submission.last_name}
            </p>
            <div className='mt-2 flex items-center justify-between gap-3'>
              <ResponseBadge response={submission.response} />
              <time className='text-xs text-stone-500' dateTime={submission.created_at}>
                {formatter.format(new Date(submission.created_at))}
              </time>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function ResponseBadge({ response }: { response: 'attending' | 'not_attending' }) {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${response === 'attending' ? 'bg-emerald-50 text-emerald-800' : 'bg-rose/15 text-wine'}`}
    >
      {response === 'attending' ? 'Sí asistirá' : 'No podrá asistir'}
    </span>
  );
}
