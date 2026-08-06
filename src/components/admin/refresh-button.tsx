'use client';

import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { RefreshCw } from 'lucide-react';

export function RefreshButton({ label = 'Actualizar datos' }: { label?: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type='button'
      disabled={isPending}
      onClick={() => startTransition(() => router.refresh())}
      className='inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-wine/20 bg-white px-4 py-2.5 text-sm font-semibold text-wine shadow-sm transition hover:border-wine/40 hover:bg-rose/10 disabled:cursor-wait disabled:opacity-60'
    >
      <RefreshCw size={16} className={isPending ? 'animate-spin' : ''} />
      {isPending ? 'Actualizando…' : label}
    </button>
  );
}
