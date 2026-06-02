import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function CtaBand() {
  return (
    <section className="px-6 py-20 md:py-28">
      <div className="mx-auto max-w-4xl rounded-2xl border border-border bg-gradient-to-br from-accent to-card px-8 py-14 text-center shadow-sm md:px-16">
        <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
          Participe en la Conferencia COMAM 2026
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
          Manténgase informado sobre el programa, la sede en Santiago de Chile y el proceso de
          inscripción institucional.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Button asChild size="lg">
            <Link href="/conferencia">Información de la conferencia</Link>
          </Button>
          <Button asChild variant="secondary" size="lg">
            <Link href="/biblioteca">Explorar biblioteca</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
