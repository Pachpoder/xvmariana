import Link from 'next/link';
import { CalendarHeart, ClipboardList, LayoutDashboard, Settings, Ticket } from 'lucide-react';
import type { ReactNode } from 'react';
import { adminAudienceCopy } from '@/lib/admin-audience-copy';

const links = [
  { href: '/admin', label: 'Resumen', icon: LayoutDashboard },
  {
    href: '/admin/invitaciones',
    label: adminAudienceCopy.personalized.navLabel,
    icon: Ticket,
  },
  {
    href: '/admin/respuestas-landing',
    label: adminAudienceCopy.publicLanding.navLabel,
    icon: ClipboardList,
  },
  { href: '/admin/configuracion', label: 'Configuración', icon: Settings },
];

export function AdminShell({ children }: { children: ReactNode }) {
  return (
    <div className='min-h-screen bg-[#fbf7f3] text-stone-800'>
      <header className='border-b border-rose/20 bg-white px-5 py-4 lg:hidden'>
        <Link href='/admin' className='flex items-center gap-2 font-serif text-xl text-wine'>
          <CalendarHeart size={22} />
          XV Mariana
        </Link>
      </header>
      <aside className='fixed inset-y-0 hidden w-64 border-r border-rose/20 bg-white p-6 lg:block'>
        <Link href='/admin' className='flex items-center gap-2 font-serif text-2xl text-wine'>
          <CalendarHeart size={26} />
          XV Mariana
        </Link>
        <p className='mt-2 text-xs tracking-wider text-stone-500'>PANEL ADMINISTRATIVO</p>
        <nav className='mt-10 space-y-2' aria-label='Navegación administrativa'>
          {links.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className='flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-stone-600 transition hover:bg-rose/10 hover:text-wine'
            >
              <Icon size={18} />
              {label}
            </Link>
          ))}
        </nav>
        <p className='absolute bottom-7 text-xs text-stone-400'>Administración de invitaciones</p>
      </aside>
      <main className='mx-auto max-w-6xl px-5 py-8 lg:ml-64 lg:px-10'>{children}</main>
    </div>
  );
}
