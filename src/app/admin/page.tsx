import { DashboardStats } from '@/components/admin/dashboard-stats';
import { getDashboardStats } from '@/lib/queries/dashboard';

export default async function AdminPage() {
  const stats = await getDashboardStats();
  return (
    <>
      <p className='text-sm font-medium text-gold'>RESUMEN DEL EVENTO</p>
      <h1 className='mt-2 font-serif text-4xl text-wine'>Panel de control</h1>
      <p className='mt-3 text-sm text-stone-500'>Estado actual de confirmaciones.</p>
      <div className='mt-8'>
        <DashboardStats stats={stats} />
      </div>
    </>
  );
}
