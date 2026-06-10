import { getContactEmail, isPublicAgentEnabled } from '@comam/ai/server';
import { MarketingNav } from '@/components/marketing/marketing-nav';
import { MarketingFooter } from '@/components/marketing/site-footer';
import { HermesPublicShell } from '@/components/hermes/hermes-public-shell';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const enabled = isPublicAgentEnabled();
  const contactEmail = getContactEmail();

  return (
    <div className="flex min-h-screen flex-col">
      <MarketingNav />
      <HermesPublicShell enabled={enabled} contactEmail={contactEmail}>
        <main className="flex-1">{children}</main>
      </HermesPublicShell>
      <MarketingFooter />
    </div>
  );
}
