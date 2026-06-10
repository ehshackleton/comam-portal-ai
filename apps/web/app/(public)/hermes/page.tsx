import Link from 'next/link';
import { PUBLIC_AGENT_NAME } from '@comam/ai';
import { getContactEmail, isPublicAgentEnabled } from '@comam/ai/server';
import { PageHeader } from '@/components/marketing/page-header';
import { HermesChat } from '@/components/hermes/hermes-chat';
import { HermesDisabled } from '@/components/hermes/hermes-disabled';

export const metadata = {
  title: 'Hermes COMAM',
  description: 'Agente público de orientación institucional sobre COMAM y la conferencia 2026.',
};

export default function HermesPage() {
  const enabled = isPublicAgentEnabled();
  const contactEmail = getContactEmail();

  return (
    <>
      <PageHeader
        eyebrow="Asistente público"
        title={PUBLIC_AGENT_NAME}
        description="Orientación institucional sobre COMAM, la conferencia 2026 y temas logísticos públicos."
      />
      <div className="mx-auto max-w-3xl space-y-6 px-6 py-12 md:py-16">
        <p className="text-center text-sm text-muted-foreground">
          Las respuestas se basan en información pública validada. Para temas sensibles o sin
          certeza documental, Hermes derivará su consulta al comité organizador.{' '}
          <Link href="/conferencia" className="underline hover:text-foreground">
            Ver conferencia 2026
          </Link>
        </p>
        {enabled ? <HermesChat contactEmail={contactEmail} /> : <HermesDisabled />}
      </div>
    </>
  );
}
