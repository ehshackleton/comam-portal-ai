import type { Metadata } from 'next';
import { InstitutionalPageView } from '@/components/marketing/institutional-page';
import { gobernanzaPage } from '@/content/institutional/gobernanza';

export const metadata: Metadata = {
  title: gobernanzaPage.metadata.title,
  description: gobernanzaPage.metadata.description,
};

export default function GobernanzaPage() {
  return <InstitutionalPageView content={gobernanzaPage} />;
}
