import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto min-h-[70vh] max-w-6xl px-6 py-10">{children}</main>
      <SiteFooter />
    </>
  );
}
