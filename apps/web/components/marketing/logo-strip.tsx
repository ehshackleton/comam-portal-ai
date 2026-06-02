import { SectionEyebrow } from './section-eyebrow';

const placeholders = [
  'Gran Logia Mixta de Chile',
  'Gran Logia Femenina de Chile',
  'Obediencias de América',
  'Delegaciones invitadas',
  'Comité organizador',
];

export function LogoStrip() {
  return (
    <section className="border-y border-border bg-card px-6 py-14">
      <div className="mx-auto max-w-6xl text-center">
        <SectionEyebrow>Participación continental</SectionEyebrow>
        <p className="mt-3 text-sm text-muted-foreground">
          Obediencias e instituciones participantes — logos en actualización institucional
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-8 md:gap-12">
          {placeholders.map((name) => (
            <span
              key={name}
              className="text-sm font-medium text-muted-foreground/80 transition-colors hover:text-foreground"
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
