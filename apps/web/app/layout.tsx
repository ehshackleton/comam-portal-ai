import type { Metadata } from 'next';
import { Crimson_Pro, Source_Sans_3 } from 'next/font/google';
import './globals.css';

const display = Crimson_Pro({
  variable: '--font-display',
  subsets: ['latin'],
  weight: ['400', '600', '700'],
});

const body = Source_Sans_3({
  variable: '--font-body',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    default: 'COMAM — Conferencia Masónica Americana',
    template: '%s | COMAM',
  },
  description:
    'Portal institucional de la Conferencia Masónica Americana y la Conferencia COMAM 2026 en Santiago de Chile.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body className={`${display.variable} ${body.variable} antialiased`}>{children}</body>
    </html>
  );
}
