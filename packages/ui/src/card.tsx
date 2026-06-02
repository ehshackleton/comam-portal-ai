import type { ReactNode } from 'react';

export function Card({
  title,
  children,
}: {
  title?: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
      {title ? <h2 className="mb-4 text-lg font-semibold text-stone-900">{title}</h2> : null}
      {children}
    </div>
  );
}
