import type { Metadata } from 'next';
import { InstitutionalPageView } from '@/components/marketing/institutional-page';
import { queEsComamPage } from '@/content/institutional/que-es-comam';

export const metadata: Metadata = {
  title: queEsComamPage.metadata.title,
  description: queEsComamPage.metadata.description,
};

export default function QueEsComamPage() {
  return <InstitutionalPageView content={queEsComamPage} />;
}
