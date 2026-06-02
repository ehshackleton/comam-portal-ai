import { cn } from '@/lib/utils';

export function SectionEyebrow({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p
      className={cn(
        'text-sm font-medium uppercase tracking-widest text-primary',
        className,
      )}
    >
      {children}
    </p>
  );
}
