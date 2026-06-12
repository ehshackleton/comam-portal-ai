import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';
import { ArrowRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ContentImageBlock } from '@/components/marketing/content-image';
import { getMedia, type MediaKey } from '@/content/institutional/media';
import { SectionEyebrow } from './section-eyebrow';

export type FeatureItem = {
  id?: string;
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
  imageKey?: MediaKey;
};

export function FeatureGrid({
  eyebrow,
  title,
  subtitle,
  features,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  features: FeatureItem[];
}) {
  return (
    <section className="px-6 py-20 md:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <SectionEyebrow>{eyebrow}</SectionEyebrow>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
          {subtitle ? (
            <p className="text-prose mt-4 text-lg text-muted-foreground">{subtitle}</p>
          ) : null}
        </div>
        <div
          className={`mt-14 grid gap-6 sm:grid-cols-2 ${features.length <= 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-4'}`}
        >
          {features.map((feature) => {
            const Icon = feature.icon;
            const image = feature.imageKey ? getMedia(feature.imageKey) : null;
            return (
              <Link key={feature.id ?? feature.title} href={feature.href} className="group block">
                <Card className="card-hover h-full overflow-hidden border-border/80">
                  {image ? (
                    <div className="p-4 pb-0">
                      <ContentImageBlock image={image} variant="card" />
                    </div>
                  ) : null}
                  <CardHeader>
                    <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                    <CardTitle className="flex items-center gap-2">
                      {feature.title}
                      <ArrowRight className="h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
                    </CardTitle>
                    <CardDescription className="text-prose text-base leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent />
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
