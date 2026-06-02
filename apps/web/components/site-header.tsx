import Link from 'next/link';

const links = [
  { href: '/comam', label: 'COMAM' },
  { href: '/conferencia', label: 'Conferencia 2026' },
  { href: '/articulos', label: 'Artículos' },
  { href: '/biblioteca', label: 'Biblioteca' },
];

export function SiteHeader() {
  return (
    <header className="border-b border-stone-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-4">
        <Link href="/" className="text-xl font-semibold tracking-tight text-stone-900">
          COMAM
        </Link>
        <nav className="flex flex-wrap gap-4 text-sm text-stone-700">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-stone-900">
              {link.label}
            </Link>
          ))}
          <Link href="/admin/login" className="text-stone-500 hover:text-stone-800">
            Administración
          </Link>
        </nav>
      </div>
    </header>
  );
}
