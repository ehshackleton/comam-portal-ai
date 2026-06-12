import type { Metadata } from 'next';
import { InstitutionalPageView } from '@/components/marketing/institutional-page';
import { historiaPage } from '@/content/institutional/historia';

export const metadata: Metadata = {
  title: historiaPage.metadata.title,
  description: historiaPage.metadata.description,
};

export default function HistoriaPage() {
  return <InstitutionalPageView content={historiaPage} />;
}
