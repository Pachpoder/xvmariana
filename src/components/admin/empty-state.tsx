import type { LucideIcon } from 'lucide-react';

export function EmptyState({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
}) {
  return (
    <div className='rounded-3xl border border-dashed border-rose/50 bg-white p-8 text-center'>
      <Icon className='mx-auto text-gold' size={30} />
      <h2 className='mt-4 font-serif text-2xl text-wine'>{title}</h2>
      <p className='mx-auto mt-2 max-w-md text-sm leading-6 text-stone-500'>{description}</p>
    </div>
  );
}
