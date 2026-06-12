import type { Metadata } from 'next';
import { FaqList } from '@/components/marketing/faq-list';
import { PageHeader } from '@/components/marketing/page-header';
import { faqItems, faqMetadata } from '@/content/institutional/faq';

export const metadata: Metadata = {
  title: `Conferencia 2026 — ${faqMetadata.title}`,
  description: faqMetadata.description,
};

export default function ConferenciaFaqPage() {
  return (
    <>
      <PageHeader
        eyebrow="Conferencia 2026"
        title="Preguntas frecuentes"
        description="Consultas habituales sobre COMAM, la Conferencia 2026 y el proceso de participación."
      />
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 md:py-16">
        <FaqList items={faqItems} />
      </div>
    </>
  );
}
