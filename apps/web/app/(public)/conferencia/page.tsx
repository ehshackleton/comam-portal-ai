export const metadata = { title: 'Conferencia COMAM 2026' };

export default function ConferenciaPage() {
  const year = process.env.CONFERENCE_YEAR ?? '2026';
  const city = process.env.CONFERENCE_CITY ?? 'Santiago de Chile';
  const name = process.env.CONFERENCE_NAME ?? 'Conferencia COMAM 2026';

  return (
    <article className="max-w-3xl space-y-6">
      <h1 className="text-4xl font-semibold text-stone-900">{name}</h1>
      <p className="text-lg text-stone-700">
        {year} · {city}
      </p>
      <p className="leading-relaxed text-stone-700">
        El módulo de inscripción público estará disponible en una próxima iteración. Mientras tanto,
        el comité organizador puede gestionar registros desde el backoffice administrativo.
      </p>
      {process.env.REGISTRATION_ENABLED === 'true' ? (
        <p className="text-sm text-stone-500">Registro habilitado en configuración del sistema.</p>
      ) : null}
    </article>
  );
}
