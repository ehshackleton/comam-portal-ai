import { SectionBreadcrumb } from '@/components/marketing/section-breadcrumb';

export default function ConferenciaLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SectionBreadcrumb />
      {children}
    </>
  );
}
