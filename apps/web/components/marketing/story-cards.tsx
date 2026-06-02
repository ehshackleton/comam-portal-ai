import Link from 'next/link';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SectionEyebrow } from './section-eyebrow';

export type StoryItem = {
  title: string;
  summary: string;
  href: string;
  badge?: string;
};

export function StoryCards({
  eyebrow,
  title,
  stories,
}: {
  eyebrow: string;
  title: string;
  stories: StoryItem[];
}) {
  if (stories.length === 0) return null;

  return (
    <section className="px-6 py-20 md:py-28">
      <div className="mx-auto max-w-6xl">
        <SectionEyebrow>{eyebrow}</SectionEyebrow>
        <h2 className="mt-4 text-3xl font-semibold tracking-tight">{title}</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {stories.map((story) => (
            <Link key={story.href} href={story.href} className="block">
              <Card className="card-hover h-full">
                <CardHeader>
                  {story.badge ? <Badge variant="secondary">{story.badge}</Badge> : null}
                  <CardTitle className="mt-2 line-clamp-2">{story.title}</CardTitle>
                  <CardDescription className="line-clamp-3 text-base">
                    {story.summary}
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
        <div className="mt-8">
          <Link href="/articulos" className="text-sm font-medium text-primary hover:underline">
            Ver todos los artículos →
          </Link>
        </div>
      </div>
    </section>
  );
}
