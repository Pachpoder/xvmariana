import type { ReactNode } from 'react';

export function PublicSectionContainer({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`relative mx-auto w-full max-w-[520px] overflow-hidden rounded-[2rem] border border-[#d7d5ba] bg-[#fffdf8] shadow-[0_24px_70px_rgba(76,87,68,0.12)] ${className}`}
    >
      {children}
    </section>
  );
}
