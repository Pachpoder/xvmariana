import Link from 'next/link';
import { Toaster } from 'sonner';
import { InvitationList } from '@/components/admin/invitation-list';
import { RefreshButton } from '@/components/admin/refresh-button';
import { adminAudienceCopy } from '@/lib/admin-audience-copy';
import { getInvitationSummaries, type RsvpStatus } from '@/lib/queries/invitations';

const pageSize = 10;
export default async function InvitationsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; page?: string; notice?: string }>;
}) {
  const params = await searchParams;
  const query = params.q?.trim().toLocaleLowerCase('es-GT') ?? '';
  const status = params.status ?? '';
  const validStatus = ['pending', 'attending', 'not_attending'].includes(status)
    ? (status as RsvpStatus)
    : '';
  const invitations = await getInvitationSummaries();
  const filtered = invitations.filter(
    (invitation) =>
      (!query ||
        invitation.label.toLocaleLowerCase('es-GT').includes(query) ||
        invitation.guests.some((guest) =>
          guest.full_name.toLocaleLowerCase('es-GT').includes(query)
        )) &&
      (!validStatus || invitation.status === validStatus)
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const page = Math.min(Math.max(Number(params.page) || 1, 1), totalPages);
  const currentPage = filtered.slice((page - 1) * pageSize, page * pageSize);
  return (
    <>
      <div className='flex flex-wrap items-end justify-between gap-4'>
        <div>
          <p className='text-sm font-medium text-gold'>{adminAudienceCopy.personalized.eyebrow}</p>
          <h1 className='mt-2 font-serif text-4xl text-wine'>
            {adminAudienceCopy.personalized.heading}
          </h1>
          <p className='mt-3 text-sm text-stone-500'>
            {adminAudienceCopy.personalized.description}
          </p>
        </div>
        <div className='flex flex-wrap gap-3'>
          <RefreshButton />
          <Link
            href='/admin/invitaciones/nueva'
            className='inline-flex min-h-11 items-center rounded-full bg-wine px-5 py-3 text-sm font-semibold text-white'
          >
            Nueva invitación
          </Link>
        </div>
      </div>
      <div className='mt-8'>
        <InvitationList
          invitations={currentPage}
          query={query}
          status={validStatus}
          page={page}
          totalPages={totalPages}
          totalInvitations={invitations.length}
          confirmedAttendeesTotal={invitations.reduce(
            (total, invitation) => total + invitation.confirmedAttendees,
            0
          )}
          startIndex={(page - 1) * pageSize}
          notice={params.notice}
        />
      </div>
      <Toaster richColors position='top-center' />
    </>
  );
}
