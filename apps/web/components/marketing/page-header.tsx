import { SectionEyebrow } from './section-eyebrow';

export function PageHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="hero-glow border-b border-border px-6 py-16 md:py-20">
      <div className="mx-auto max-w-3xl">
        {eyebrow ? <SectionEyebrow>{eyebrow}</SectionEyebrow> : null}
        <h1 className="mt-4 text-4xl font-semibold tracking-tight md:text-5xl">{title}</h1>
        {description ? (
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{description}</p>
        ) : null}
      </div>
    </div>
  );
}
