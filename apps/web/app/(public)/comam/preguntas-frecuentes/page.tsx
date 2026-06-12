import type { Metadata } from 'next';
import { FaqList } from '@/components/marketing/faq-list';
import { PageHeader } from '@/components/marketing/page-header';
import { faqItems, faqMetadata } from '@/content/institutional/faq';

export const metadata: Metadata = {
  title: faqMetadata.title,
  description: faqMetadata.description,
};

export default function ComamFaqPage() {
  return (
    <>
      <PageHeader
        eyebrow="Institucional"
        title="Preguntas frecuentes"
        description="Respuestas a consultas habituales sobre COMAM, su historia, gobernanza y participación."
      />
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 md:py-16">
        <FaqList items={faqItems} />
      </div>
    </>
  );
}
