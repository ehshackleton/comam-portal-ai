import Link from 'next/link';
import { desc, eq } from 'drizzle-orm';
import { documents, db } from '@comam/db';

export const metadata = { title: 'Biblioteca' };

export const dynamic = 'force-dynamic';

export default async function BibliotecaPage() {
  const publicDocs = await db
    .select()
    .from(documents)
    .where(eq(documents.visibility, 'public'))
    .orderBy(desc(documents.updatedAt));

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-semibold text-stone-900">Biblioteca documental</h1>
      <p className="text-stone-700">
        Documentos y estatutos de visibilidad pública. Los archivos reservados no se listan aquí.
      </p>
      {publicDocs.length === 0 ? (
        <p className="text-stone-600">No hay documentos públicos disponibles.</p>
      ) : (
        <ul className="divide-y divide-stone-200 rounded-lg border border-stone-200 bg-white">
          {publicDocs.map((doc) => (
            <li key={doc.id} className="flex items-center justify-between px-4 py-3">
              <div>
                <p className="font-medium text-stone-900">{doc.title}</p>
                <p className="text-sm text-stone-500">{doc.type}</p>
              </div>
              {doc.fileUrl ? (
                <Link
                  href={`/api/files/${doc.id}`}
                  className="text-sm font-medium text-stone-800 underline"
                >
                  Descargar
                </Link>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
