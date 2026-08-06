'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { Clipboard, Pencil, Search, TicketCheck, Trash2, UsersRound } from 'lucide-react';
import { toast } from 'sonner';
import { removeInvitationFromList } from '@/actions/invitations';
import { adminAudienceCopy } from '@/lib/admin-audience-copy';
import type { InvitationSummary, RsvpStatus } from '@/lib/queries/invitations';

type InvitationListProps = {
  invitations: InvitationSummary[];
  query: string;
  status: string;
  page: number;
  totalPages: number;
  totalInvitations: number;
  confirmedAttendeesTotal: number;
  startIndex: number;
  notice?: string;
};
const labels: Record<RsvpStatus, string> = {
  pending: 'Pendiente',
  attending: 'Asiste',
  not_attending: 'No asiste',
};

function invitationUrl(slug: string) {
  const base = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, '');
  return base ? `${base}/${slug}` : `/${slug}`;
}

function passSize(invitation: InvitationSummary) {
  return invitation.guests.length + invitation.max_extra_guests;
}

function passLabel(invitation: InvitationSummary) {
  const total = passSize(invitation);
  return `${total} persona${total === 1 ? '' : 's'}`;
}

export function InvitationList({
  invitations,
  query,
  status,
  page,
  totalPages,
  totalInvitations,
  confirmedAttendeesTotal,
  startIndex,
  notice,
}: InvitationListProps) {
  useEffect(() => {
    if (notice)
      toast.success(
        {
          created: 'Invitación creada.',
          updated: 'Invitación actualizada.',
          removed: 'Invitación eliminada del listado.',
        }[notice] ?? 'Cambios guardados.'
      );
  }, [notice]);
  async function copyLink(slug: string) {
    await navigator.clipboard.writeText(invitationUrl(slug));
    toast.success('Enlace copiado al portapapeles.');
  }
  const paginationHref = (nextPage: number) =>
    `/admin/invitaciones?${new URLSearchParams({ ...(query ? { q: query } : {}), ...(status ? { status } : {}), page: String(nextPage) })}`;
  return (
    <>
      <div className='mb-4 grid gap-3 sm:grid-cols-2'>
        <div className='flex items-center gap-3 rounded-2xl border border-rose/20 bg-white p-4'>
          <span className='rounded-xl bg-gold/10 p-2 text-gold'>
            <TicketCheck size={18} />
          </span>
          <div>
            <p className='text-xs text-stone-500'>Invitaciones familiares</p>
            <p className='text-xl font-semibold text-wine'>{totalInvitations}</p>
          </div>
        </div>
        <div className='flex items-center gap-3 rounded-2xl border border-rose/20 bg-white p-4'>
          <span className='rounded-xl bg-emerald-50 p-2 text-emerald-700'>
            <UsersRound size={18} />
          </span>
          <div>
            <p className='text-xs text-stone-500'>Familiares confirmados</p>
            <p className='text-xl font-semibold text-wine'>{confirmedAttendeesTotal}</p>
          </div>
        </div>
      </div>
      <form
        className='mb-6 grid gap-3 rounded-2xl border border-rose/20 bg-white p-4 sm:grid-cols-[1fr_180px_auto]'
        method='get'
      >
        <label className='relative'>
          <Search className='absolute left-3 top-3 text-stone-400' size={18} />
          <input
            name='q'
            defaultValue={query}
            className='w-full rounded-xl border border-stone-200 py-2.5 pl-10 pr-3 text-sm'
            placeholder='Buscar por persona o familia'
          />
        </label>
        <select
          name='status'
          defaultValue={status}
          className='rounded-xl border border-stone-200 px-3 py-2.5 text-sm'
        >
          <option value=''>Todos los estados</option>
          <option value='pending'>Pendiente</option>
          <option value='attending'>Asiste</option>
          <option value='not_attending'>No asiste</option>
        </select>
        <button className='rounded-xl bg-wine px-4 py-2.5 text-sm font-semibold text-white'>
          Filtrar
        </button>
      </form>
      {!invitations.length ? (
        <div className='rounded-3xl border border-dashed border-rose/50 bg-white p-8 text-center text-sm text-stone-500'>
          No hay invitaciones que coincidan con los filtros.
        </div>
      ) : (
        <>
          <div className='hidden overflow-x-auto rounded-2xl border border-rose/20 bg-white md:block'>
            <table className='w-full min-w-[940px] text-left text-sm'>
              <thead className='bg-rose/10 text-stone-600'>
                <tr>
                  <th className='w-14 px-4 py-4 text-center'>#</th>
                  <th className='px-5 py-4'>Persona o familia</th>
                  <th className='px-4 py-4'>Estado</th>
                  <th className='px-4 py-4'>Pase</th>
                  <th className='px-4 py-4'>Confirmaron</th>
                  <th className='px-4 py-4'>Enlace</th>
                  <th className='px-5 py-4 text-right'>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {invitations.map((invitation, index) => (
                  <tr key={invitation.id} className='border-t border-stone-100'>
                    <td className='px-4 py-4 text-center font-semibold text-stone-400'>
                      {startIndex + index + 1}
                    </td>
                    <td className='px-5 py-4'>
                      <p className='font-semibold'>{invitation.label}</p>
                      <p className='mt-1 text-xs text-stone-500'>
                        {adminAudienceCopy.personalized.rowLabel}
                      </p>
                    </td>
                    <td className='px-4 py-4'>
                      <StatusBadge status={invitation.status} />
                    </td>
                    <td className='px-4 py-4 font-medium text-stone-700'>{passLabel(invitation)}</td>
                    <td className='px-4 py-4'>
                      <ConfirmedCount invitation={invitation} />
                    </td>
                    <td className='px-4 py-4'>
                      <button
                        onClick={() => void copyLink(invitation.public_slug)}
                        className='inline-flex items-center gap-1 text-wine'
                      >
                        <Clipboard size={15} />
                        Copiar
                      </button>
                    </td>
                    <td className='px-5 py-4'>
                      <Actions invitation={invitation} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className='space-y-3 md:hidden'>
            {invitations.map((invitation, index) => (
              <article
                key={invitation.id}
                className='rounded-2xl border border-rose/20 bg-white p-5'
              >
                <div className='flex items-start justify-between gap-3'>
                  <div>
                    <p className='mb-1 text-xs font-semibold text-gold'>
                      Invitación #{startIndex + index + 1}
                    </p>
                    <h2 className='font-semibold'>{invitation.label}</h2>
                    <p className='mt-1 text-xs text-stone-500'>
                      Pase para {passLabel(invitation)}
                    </p>
                    <p className='mt-2 text-sm font-medium text-stone-700'>
                      Confirmaron: {invitation.confirmedAttendees}
                    </p>
                  </div>
                  <StatusBadge status={invitation.status} />
                </div>
                <div className='mt-4'>
                  <Actions invitation={invitation} mobile />
                </div>
              </article>
            ))}
          </div>
        </>
      )}
      {totalPages > 1 && (
        <nav className='mt-6 flex items-center justify-center gap-3' aria-label='Paginación'>
          <Link
            aria-disabled={page <= 1}
            className='rounded-lg border border-stone-200 px-3 py-2 text-sm aria-disabled:pointer-events-none aria-disabled:opacity-40'
            href={paginationHref(page - 1)}
          >
            Anterior
          </Link>
          <span className='text-sm text-stone-500'>
            Página {page} de {totalPages}
          </span>
          <Link
            aria-disabled={page >= totalPages}
            className='rounded-lg border border-stone-200 px-3 py-2 text-sm aria-disabled:pointer-events-none aria-disabled:opacity-40'
            href={paginationHref(page + 1)}
          >
            Siguiente
          </Link>
        </nav>
      )}
    </>
  );
}

function StatusBadge({ status }: { status: RsvpStatus }) {
  return (
    <span className='rounded-full bg-rose/15 px-2.5 py-1 text-xs font-semibold text-wine'>
      {labels[status]}
    </span>
  );
}

function ConfirmedCount({ invitation }: { invitation: InvitationSummary }) {
  return (
    <span className='inline-flex items-center gap-1.5 font-semibold text-stone-700'>
      <UsersRound size={15} className='text-gold' />
      {invitation.confirmedAttendees}
    </span>
  );
}

function Actions({
  invitation,
  mobile = false,
}: {
  invitation: InvitationSummary;
  mobile?: boolean;
}) {
  return (
    <div className={`flex items-center ${mobile ? 'justify-start' : 'justify-end'} gap-3`}>
      <Link
        href={`/admin/invitaciones/${invitation.id}/editar`}
        aria-label='Editar invitación'
        className='text-wine'
      >
        <Pencil size={17} />
      </Link>
      <button
        onClick={() =>
          void navigator.clipboard
            .writeText(invitationUrl(invitation.public_slug))
            .then(() => toast.success('Enlace copiado al portapapeles.'))
        }
        aria-label='Copiar enlace'
        className='text-wine'
      >
        <Clipboard size={17} />
      </button>
      <form
        action={removeInvitationFromList}
        onSubmit={(event) => {
          if (
            !window.confirm(
              '¿Eliminar esta invitación del listado? Dejará de estar disponible, pero sus datos y respuestas se conservarán.'
            )
          )
            event.preventDefault();
        }}
      >
        <input type='hidden' name='id' value={invitation.id} />
        <button aria-label='Eliminar invitación del listado' className='text-stone-500 hover:text-wine'>
          <Trash2 size={17} />
        </button>
      </form>
    </div>
  );
}
