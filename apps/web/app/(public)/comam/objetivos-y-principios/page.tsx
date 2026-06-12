import type { Metadata } from 'next';
import { InstitutionalPageView } from '@/components/marketing/institutional-page';
import { objetivosPage } from '@/content/institutional/objetivos';

export const metadata: Metadata = {
  title: objetivosPage.metadata.title,
  description: objetivosPage.metadata.description,
};

export default function ObjetivosPage() {
  return <InstitutionalPageView content={objetivosPage} />;
}
