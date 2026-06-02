import Link from 'next/link';
import { Button } from '@comam/ui';

export default function HomePage() {
  return (
    <div className="space-y-12">
      <section className="space-y-6 border-b border-stone-200 pb-12">
        <p className="text-sm uppercase tracking-widest text-stone-500">
          Conferencia Masónica Americana
        </p>
        <h1 className="max-w-3xl text-4xl font-semibold leading-tight text-stone-900 md:text-5xl">
          Fraternidad, comunicación e intercambio entre obediencias liberales de América
        </h1>
        <p className="max-w-2xl text-lg leading-relaxed text-stone-700">
          Bienvenido al portal institucional de COMAM. Aquí encontrará información sobre la
          organización, su historia en proceso de compilación, documentos autorizados y la
          Conferencia COMAM 2026 en Santiago de Chile.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link href="/conferencia">
            <Button>Conferencia 2026</Button>
          </Link>
          <Link href="/comam">
            <Button variant="secondary">Qué es COMAM</Button>
          </Link>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        {[
          {
            title: 'Institucional',
            text: 'Historia, visión y obediencias participantes, con contenido validado por la organización.',
            href: '/comam',
          },
          {
            title: 'Conferencia 2026',
            text: 'Información logística, programa y registro para Santiago de Chile.',
            href: '/conferencia',
          },
          {
            title: 'Biblioteca',
            text: 'Artículos, estatutos y documentos públicos disponibles para consulta.',
            href: '/biblioteca',
          },
        ].map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm transition hover:border-stone-300"
          >
            <h2 className="text-xl font-semibold text-stone-900">{card.title}</h2>
            <p className="mt-3 text-sm leading-relaxed text-stone-600">{card.text}</p>
          </Link>
        ))}
      </section>
    </div>
  );
}
