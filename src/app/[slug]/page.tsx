import type { Metadata } from 'next';
import { PublicInvitationExperience } from '@/components/invitation/public-invitation-experience';
import { getPublicInvitationBySlug } from '@/lib/queries/public-invitation';

export const metadata: Metadata = {
  title: 'Tienes una invitación especial',
  description: 'Tienes una invitación especial.',
  robots: { index: false, follow: false },
  openGraph: {
    title: 'Tienes una invitación especial',
    description: 'Abre tu invitación para descubrir los detalles.',
    type: 'website',
  },
};

export default async function PublicInvitationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const invitation = await getPublicInvitationBySlug(slug);
  if (!invitation) return <UnavailableInvitation />;
  return <PublicInvitationExperience invitation={invitation} slug={slug} />;
}

function UnavailableInvitation() {
  return (
    <main className='grid min-h-svh place-items-center bg-[#481c28] p-5 text-center'>
      <section className='max-w-sm rounded-[2rem] bg-cream p-8 shadow-2xl'>
        <p className='text-xs font-semibold tracking-[0.22em] text-gold'>XV MARIANA</p>
        <h1 className='mt-4 font-serif text-3xl text-wine'>Esta invitación no está disponible</h1>
        <p className='mt-4 text-sm leading-6 text-stone-600'>
          Verifica que el enlace sea correcto o comunícate con la familia anfitriona.
        </p>
      </section>
    </main>
  );
}
