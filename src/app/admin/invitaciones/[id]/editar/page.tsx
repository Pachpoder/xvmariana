import { notFound } from 'next/navigation';
import { InvitationForm } from '@/components/admin/invitation-form';
import { getFirstEvent, getInvitationById } from '@/lib/queries/invitations';
export default async function EditInvitationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [event, invitation] = await Promise.all([getFirstEvent(), getInvitationById(id)]);
  if (!event || !invitation) notFound();
  return (
    <>
      <p className='text-sm font-medium text-gold'>INVITACIONES</p>
      <h1 className='mt-2 font-serif text-4xl text-wine'>Editar invitación personalizada</h1>
      <div className='mt-8 max-w-2xl'>
        <InvitationForm event={event} invitation={invitation} />
      </div>
    </>
  );
}
