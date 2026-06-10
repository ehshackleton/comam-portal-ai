import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
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
      <body className={`${inter.variable} font-sans antialiased`}>{children}</body>
    </html>
  );
}
