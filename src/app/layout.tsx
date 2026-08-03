import type { Metadata } from 'next';
import { Lora, Luxurious_Script } from 'next/font/google';
import './globals.css';

const luxuriousScript = Luxurious_Script({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-luxurious-script',
});
const lora = Lora({
  subsets: ['latin'],
  variable: '--font-lora',
});

export const metadata: Metadata = {
  title: { default: 'XV Mariana', template: '%s | XV Mariana' },
  description: 'Administración de invitaciones para los XV años de Mariana.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang='es'>
      <body className={`${luxuriousScript.variable} ${lora.variable}`}>{children}</body>
    </html>
  );
}
