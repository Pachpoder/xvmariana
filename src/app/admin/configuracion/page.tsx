import { notFound } from 'next/navigation';
import { EventSettingsForm } from '@/components/admin/event-settings-form';
import { LandingQrCard } from '@/components/admin/landing-qr-card';
import { getEventSettings } from '@/lib/queries/invitations';
export default async function SettingsPage() {
  const event = await getEventSettings();
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/+$/, '');
  const landingUrl = baseUrl && !/localhost|127\.0\.0\.1/.test(baseUrl) ? `${baseUrl}/` : null;
  if (!event) notFound();
  return (
    <>
      <p className='text-sm font-medium text-gold'>EVENTO</p>
      <h1 className='mt-2 font-serif text-4xl text-wine'>Configuración</h1>
      <p className='mt-3 max-w-3xl text-sm leading-6 text-stone-500'>
        Administra la información operativa del evento y las invitaciones personales. El contenido
        de la página pública se mantiene fijo en el código del proyecto.
      </p>
      <div className='mt-8 space-y-8'>
        <EventSettingsForm event={event} />
        <LandingQrCard landingUrl={landingUrl} />
      </div>
    </>
  );
}
