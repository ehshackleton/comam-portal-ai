import { desc, eq } from 'drizzle-orm';
import { documents, db } from '@comam/db';
import { PageHeader } from '@/components/marketing/page-header';
import { ContentListCard } from '@/components/marketing/content-list-card';
import { DbUnavailableNotice } from '@/components/marketing/db-unavailable-notice';
import { Card, CardContent } from '@/components/ui/card';
import { bibliotecaIntro } from '@/content/institutional/conferencia';
import { safeDbQuery } from '@/lib/db-safe';

export const metadata = {
  title: bibliotecaIntro.title,
  description: bibliotecaIntro.description,
};

export const dynamic = 'force-dynamic';

export default async function BibliotecaPage() {
  const { data: publicDocs, dbUnavailable } = await safeDbQuery(
    () =>
      db
        .select()
        .from(documents)
        .where(eq(documents.visibility, 'public'))
        .orderBy(desc(documents.updatedAt)),
    [],
  );

  return (
    <>
      <PageHeader
        eyebrow="Documentación"
        title={bibliotecaIntro.title}
        description={bibliotecaIntro.description}
      />
      <div className="mx-auto max-w-4xl space-y-6 px-4 py-12 sm:px-6 md:py-16">
        {dbUnavailable ? <DbUnavailableNotice /> : null}
        {!dbUnavailable && publicDocs.length === 0 ? (
          <Card className="card-hover border-border/80">
            <CardContent className="space-y-4 p-6 md:p-8">
              <p className="text-prose text-muted-foreground">
                Aún no hay documentos públicos disponibles en el portal. La biblioteca publicará
                material validado oficialmente conforme avance la revisión institucional.
              </p>
              <div>
                <p className="mb-2 text-sm font-medium text-foreground">Próxima publicación validada</p>
                <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                  {bibliotecaIntro.upcomingDocuments.map((doc) => (
                    <li key={doc}>{doc}</li>
                  ))}
                </ul>
              </div>
              <p className="text-prose rounded-lg border border-border bg-accent/50 p-4 text-sm text-accent-foreground">
                {bibliotecaIntro.note}
              </p>
            </CardContent>
          </Card>
        ) : null}
        {publicDocs.length > 0 ? (
          <div className="grid gap-4">
            {publicDocs.map((doc) => (
              <ContentListCard
                key={doc.id}
                title={doc.title}
                description={doc.type}
                href={doc.fileUrl ? `/api/files/${doc.id}` : '#'}
                badge="Público"
              />
            ))}
          </div>
        ) : null}
      </div>
    </>
  );
}
