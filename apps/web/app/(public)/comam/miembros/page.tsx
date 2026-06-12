import type { Metadata } from 'next';
import { InstitutionalPageView } from '@/components/marketing/institutional-page';
import { miembrosPage } from '@/content/institutional/miembros';

export const metadata: Metadata = {
  title: miembrosPage.metadata.title,
  description: miembrosPage.metadata.description,
};

export default function MiembrosPage() {
  return <InstitutionalPageView content={miembrosPage} />;
}
