import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { SectionEyebrow } from './section-eyebrow';

export function DarkBand() {
  const year = process.env.CONFERENCE_YEAR ?? '2026';
  const city = process.env.CONFERENCE_CITY ?? 'Santiago de Chile';

  return (
    <section className="dark-band px-6 py-20 text-white md:py-28">
      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-2 md:items-center">
        <div>
          <SectionEyebrow className="text-emerald-300">Conferencia {year}</SectionEyebrow>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">
            COMAM {year} en {city}
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-slate-300">
            Información logística, programa y registro para delegaciones e invitados
            institucionales. El comité organizador gestiona inscripciones desde el backoffice
            seguro.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
              <Link href="/conferencia">Ver conferencia</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-slate-600 bg-transparent text-white hover:bg-slate-800"
            >
              <Link href="/admin/login">Acceso comité</Link>
            </Button>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            { label: 'Modalidad', value: 'Presencial' },
            { label: 'Ciudad', value: city },
            { label: 'Año', value: year },
            { label: 'Registro', value: 'Próximamente público' },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-xl border border-slate-700/80 bg-slate-800/50 p-5"
            >
              <p className="text-sm text-slate-400">{item.label}</p>
              <p className="mt-1 font-medium">{item.value}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
