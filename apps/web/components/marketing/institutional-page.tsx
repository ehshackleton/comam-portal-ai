import { PageHeader } from '@/components/marketing/page-header';
import { ContentImageBlock } from '@/components/marketing/content-image';
import { Timeline } from '@/components/marketing/timeline';
import { Card, CardContent } from '@/components/ui/card';
import type { InstitutionalPage } from '@/content/institutional/types';
import { getMedia, type MediaKey } from '@/content/institutional/media';

function resolveImage(key?: string) {
  if (!key) return null;
  return getMedia(key as MediaKey);
}

export function InstitutionalPageView({ content }: { content: InstitutionalPage }) {
  const heroImage = resolveImage(content.heroImageKey);
  const timelineImage = resolveImage(content.timelineImageKey);
  const hasImages = Boolean(heroImage || content.sections.some((s) => s.imageKey));

  return (
    <>
      <PageHeader
        eyebrow={content.pageHeader.eyebrow}
        title={content.pageHeader.title}
        description={content.pageHeader.description}
      />
      <div
        className={`mx-auto space-y-8 px-4 py-12 sm:px-6 md:py-16 ${hasImages ? 'max-w-5xl' : 'max-w-3xl'}`}
      >
        {content.sections.map((section, index) => {
          const sectionImage = resolveImage(section.imageKey);
          const showSideImage = index === 0 && (sectionImage || heroImage);
          const image = sectionImage ?? (index === 0 ? heroImage : null);

          return (
            <Card key={index} className="card-hover border-border/80 shadow-sm">
              <CardContent className="space-y-4 p-6 md:p-8">
                {showSideImage && image ? (
                  <div className="grid gap-6 md:grid-cols-[1fr_280px] md:items-start">
                    <div className="space-y-4">
                      {section.title ? (
                        <h2 className="text-xl font-semibold text-foreground">{section.title}</h2>
                      ) : null}
                      {section.paragraphs?.map((paragraph) => (
                        <p
                          key={paragraph.slice(0, 40)}
                          className="text-prose text-base leading-relaxed text-muted-foreground"
                        >
                          {paragraph}
                        </p>
                      ))}
                    </div>
                    <ContentImageBlock image={image} variant="section" className="md:order-last" />
                  </div>
                ) : (
                  <>
                    {section.title ? (
                      <h2 className="text-xl font-semibold text-foreground">{section.title}</h2>
                    ) : null}
                    {section.paragraphs?.map((paragraph) => (
                      <p
                        key={paragraph.slice(0, 40)}
                        className="text-prose text-base leading-relaxed text-muted-foreground"
                      >
                        {paragraph}
                      </p>
                    ))}
                  </>
                )}
                {section.bullets ? (
                  <ul className="list-disc space-y-2 pl-5 text-muted-foreground">
                    {section.bullets.map((item) => (
                      <li key={item} className="text-prose">
                        {item}
                      </li>
                    ))}
                  </ul>
                ) : null}
                {section.note ? (
                  <p className="text-prose rounded-lg border border-border bg-accent/50 p-4 text-sm text-accent-foreground">
                    {section.note}
                  </p>
                ) : null}
              </CardContent>
            </Card>
          );
        })}

        {content.highlights && content.highlights.length > 0 ? (
          <Card className="card-hover border-primary/20 bg-accent/30">
            <CardContent className="space-y-3 p-6 md:p-8">
              <h2 className="text-lg font-semibold text-foreground">Ideas clave</h2>
              <ul className="grid gap-2 sm:grid-cols-2">
                {content.highlights.map((item) => (
                  <li key={item} className="text-prose text-sm text-muted-foreground">
                    {item}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ) : null}

        {content.timeline && content.timeline.length > 0 ? (
          <div className="space-y-6">
            {timelineImage ? <ContentImageBlock image={timelineImage} variant="section" /> : null}
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">Línea de tiempo</h2>
            <Timeline events={content.timeline} />
          </div>
        ) : null}
      </div>
    </>
  );
}
