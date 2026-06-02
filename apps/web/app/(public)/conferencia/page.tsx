import Link from 'next/link';
import { PageHeader } from '@/components/marketing/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export const metadata = { title: 'Conferencia COMAM 2026' };

export default function ConferenciaPage() {
  const year = process.env.CONFERENCE_YEAR ?? '2026';
  const city = process.env.CONFERENCE_CITY ?? 'Santiago de Chile';
  const name = process.env.CONFERENCE_NAME ?? 'Conferencia COMAM 2026';

  return (
    <>
      <PageHeader
        eyebrow={`Conferencia ${year}`}
        title={name}
        description={`${city} — encuentro continental de obediencias participantes.`}
      />
      <div className="mx-auto max-w-6xl px-6 py-12 md:py-16">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              title: 'Sede',
              text: `La conferencia se realizará en ${city}, con detalles logísticos publicados oportunamente.`,
            },
            {
              title: 'Registro',
              text: 'El formulario público de inscripción estará disponible en una próxima iteración. El comité gestiona registros desde el backoffice.',
            },
            {
              title: 'Programa',
              text: 'Mesas, talleres y actividades institucionales serán comunicadas a inscritos y delegaciones confirmadas.',
            },
          ].map((item) => (
            <Card key={item.title} className="card-hover">
              <CardHeader>
                <CardTitle>{item.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{item.text}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        {process.env.REGISTRATION_ENABLED === 'true' ? (
          <p className="mt-8 text-center text-sm text-muted-foreground">
            Registro habilitado en configuración del sistema.
          </p>
        ) : null}
        <div className="mt-10 flex justify-center">
          <Button asChild size="lg">
            <Link href="/admin/login">Acceso comité organizador</Link>
          </Button>
        </div>
      </div>
    </>
  );
}
