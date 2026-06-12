import { ContentImageBlock } from '@/components/marketing/content-image';
import { SectionEyebrow } from './section-eyebrow';
import type { ContentImage } from '@/content/institutional/types';

export function PageHeader({
  eyebrow,
  title,
  description,
  bannerImage,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  bannerImage?: ContentImage;
}) {
  return (
    <div className="hero-glow relative overflow-hidden border-b border-border px-6 py-16 md:py-20">
      {bannerImage ? (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 opacity-[0.07]">
          <ContentImageBlock image={bannerImage} variant="banner" className="mx-auto max-w-6xl" />
        </div>
      ) : null}
      <div className="relative mx-auto max-w-3xl">
        {eyebrow ? <SectionEyebrow>{eyebrow}</SectionEyebrow> : null}
        <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">{title}</h1>
        {description ? (
          <p className="text-prose mt-4 text-lg leading-relaxed text-muted-foreground">{description}</p>
        ) : null}
      </div>
    </div>
  );
}
