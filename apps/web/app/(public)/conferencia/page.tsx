import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHeader } from '@/components/marketing/page-header';
import { ContentImageBlock } from '@/components/marketing/content-image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { conferenciaContent } from '@/content/institutional/conferencia';
import { getMedia } from '@/content/institutional/media';

export const metadata: Metadata = {
  title: conferenciaContent.metadata.title,
  description: conferenciaContent.metadata.description,
};

export default function ConferenciaPage() {
  const registrationEnabled = process.env.REGISTRATION_ENABLED === 'true';
  const heroImage = getMedia('conferencia-hero');

  return (
    <>
      <PageHeader
        eyebrow={conferenciaContent.pageHeader.eyebrow}
        title={conferenciaContent.pageHeader.title}
        description={conferenciaContent.pageHeader.description}
      />
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-16">
        <div className="mb-10 grid items-start gap-8 lg:grid-cols-[1fr_360px]">
          <div className="space-y-4">
            {conferenciaContent.intro.map((paragraph) => (
              <p
                key={paragraph.slice(0, 48)}
                className="text-prose text-base leading-relaxed text-muted-foreground"
              >
                {paragraph}
              </p>
            ))}
          </div>
          <ContentImageBlock image={heroImage} variant="section" />
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {conferenciaContent.blocks.map((item) => (
            <Card key={item.title} className="card-hover border-border/80">
              <CardHeader>
                <CardTitle>{item.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-prose text-muted-foreground">{item.text}</p>
                {item.title === 'Preguntas frecuentes' ? (
                  <Link
                    href="/conferencia/preguntas-frecuentes"
                    className="mt-3 inline-block text-sm font-medium text-primary underline-offset-4 hover:underline"
                  >
                    Ver preguntas frecuentes
                  </Link>
                ) : null}
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          {registrationEnabled ? (
            <Button asChild size="lg">
              <Link href="/conferencia/registro">Inscribirse a la conferencia</Link>
            </Button>
          ) : null}
          <Button asChild size="lg" variant="outline">
            <Link href="/comam/preguntas-frecuentes">Preguntas sobre COMAM</Link>
          </Button>
        </div>
      </div>
    </>
  );
}
