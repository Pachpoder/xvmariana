import { DashboardStats } from '@/components/admin/dashboard-stats';
import { RefreshButton } from '@/components/admin/refresh-button';
import { getDashboardStats } from '@/lib/queries/dashboard';

export default async function AdminPage() {
  const stats = await getDashboardStats();
  return (
    <>
      <div className='flex flex-wrap items-end justify-between gap-4'>
        <div>
          <p className='text-sm font-medium text-gold'>RESUMEN DEL EVENTO</p>
          <h1 className='mt-2 font-serif text-4xl text-wine'>Panel de control</h1>
          <p className='mt-3 text-sm text-stone-500'>
            Conteo de familiares con pase y amigos que respondieron desde la landing pública.
          </p>
        </div>
        <RefreshButton />
      </div>
      <div className='mt-8'>
        <DashboardStats stats={stats} />
      </div>
    </>
  );
}
