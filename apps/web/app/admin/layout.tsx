import Link from 'next/link';
import { LogoutButton } from '@/components/logout-button';
import { getSessionUser } from '@/lib/auth/session';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getSessionUser();

  return (
    <div className="min-h-screen bg-stone-100">
      {user ? (
        <header className="border-b border-stone-200 bg-white">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
            <span className="font-semibold text-stone-900">Backoffice COMAM</span>
            <nav className="flex gap-4 text-sm">
              <Link href="/admin/dashboard">Panel</Link>
              <Link href="/admin/articles">Artículos</Link>
              <Link href="/admin/documents">Documentos</Link>
              <LogoutButton />
            </nav>
          </div>
        </header>
      ) : null}
      <div className="mx-auto max-w-6xl px-6 py-8">{children}</div>
    </div>
  );
}
