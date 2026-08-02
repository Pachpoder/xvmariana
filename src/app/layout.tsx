import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "XV Mariana", template: "%s | XV Mariana" },
  description: "Administración de invitaciones para los XV años de Mariana.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
