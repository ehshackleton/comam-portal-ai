import Link from 'next/link';

const columns = [
  {
    title: 'COMAM',
    links: [
      { href: '/comam', label: 'Qué es COMAM' },
      { href: '/articulos', label: 'Artículos' },
      { href: '/biblioteca', label: 'Biblioteca' },
    ],
  },
  {
    title: 'Conferencia',
    links: [
      { href: '/conferencia', label: 'COMAM 2026' },
      { href: '/conferencia', label: 'Santiago de Chile' },
    ],
  },
  {
    title: 'Acceso',
    links: [{ href: '/admin/login', label: 'Administración' }],
  },
];

export function MarketingFooter() {
  return (
    <footer className="safe-bottom border-t border-border bg-card px-4 py-14 sm:px-6">
      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-4">
        <div className="md:col-span-1">
          <p className="text-lg font-semibold">COMAM</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Conferencia Masónica Americana — portal institucional.
          </p>
        </div>
        {columns.map((col) => (
          <div key={col.title}>
            <p className="text-sm font-semibold text-foreground">{col.title}</p>
            <ul className="mt-4 space-y-2">
              {col.links.map((link) => (
                <li key={`${col.title}-${link.label}`}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mx-auto mt-12 max-w-6xl border-t border-border pt-8 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} COMAM — Conferencia Masónica Americana
      </div>
    </footer>
  );
}
