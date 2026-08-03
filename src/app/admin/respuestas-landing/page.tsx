import { LandingRsvpSubmissionsList } from '@/components/admin/landing-rsvp-submissions-list';
import { getLandingRsvpSubmissions } from '@/lib/queries/landing-rsvp-submissions';

export default async function LandingResponsesPage() {
  const submissions = await getLandingRsvpSubmissions();
  return (
    <>
      <p className='text-sm font-medium text-gold'>LANDING PÚBLICA</p>
      <h1 className='mt-2 font-serif text-4xl text-wine'>Respuestas recibidas</h1>
      <p className='mt-3 text-sm text-stone-500'>
        Confirmaciones enviadas directamente desde la landing, independientes de las invitaciones
        personales.
      </p>
      <div className='mt-8'>
        <LandingRsvpSubmissionsList submissions={submissions} />
      </div>
    </>
  );
}
