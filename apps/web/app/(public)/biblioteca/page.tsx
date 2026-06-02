import { desc, eq } from 'drizzle-orm';
import { documents, db } from '@comam/db';
import { PageHeader } from '@/components/marketing/page-header';
import { ContentListCard } from '@/components/marketing/content-list-card';

export const metadata = { title: 'Biblioteca' };

export const dynamic = 'force-dynamic';

export default async function BibliotecaPage() {
  const publicDocs = await db
    .select()
    .from(documents)
    .where(eq(documents.visibility, 'public'))
    .orderBy(desc(documents.updatedAt));

  return (
    <>
      <PageHeader
        eyebrow="Documentación"
        title="Biblioteca documental"
        description="Documentos y estatutos de visibilidad pública. Los archivos reservados no se listan aquí."
      />
      <div className="mx-auto max-w-4xl px-6 py-12 md:py-16">
        {publicDocs.length === 0 ? (
          <p className="text-center text-muted-foreground">
            No hay documentos públicos disponibles.
          </p>
        ) : (
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
        )}
      </div>
    </>
  );
}
