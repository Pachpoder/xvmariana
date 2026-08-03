import type { Metadata } from 'next';
import { PublicLandingPage } from '@/components/landing/event-landing';

export const metadata: Metadata = {
  title: 'XV Mariana',
  description: 'Celebración de los XV años de Mariana.',
  openGraph: { title: 'XV Mariana', description: 'Una celebración especial.', type: 'website' },
};

export default function Home() {
  return <PublicLandingPage />;
}
