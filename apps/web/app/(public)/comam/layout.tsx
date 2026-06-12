import { SectionBreadcrumb } from '@/components/marketing/section-breadcrumb';

export default function ComamLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SectionBreadcrumb />
      {children}
    </>
  );
}
