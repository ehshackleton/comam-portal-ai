import { PageHeader } from '@/components/marketing/page-header';
import { Card, CardContent } from '@/components/ui/card';

export const metadata = { title: 'Qué es COMAM' };

export default function ComamPage() {
  return (
    <>
      <PageHeader
        eyebrow="Institucional"
        title="Qué es COMAM"
        description="La Conferencia Masónica Americana agrupa instituciones liberales y adogmáticas del continente."
      />
      <div className="mx-auto max-w-3xl px-6 py-12 md:py-16">
        <Card className="border-border/80 shadow-sm">
          <CardContent className="space-y-6 p-8 text-base leading-relaxed text-muted-foreground">
            <p>
              La sigla COMAM hace referencia a la Conferencia Masónica Americana, fundada el 24 de
              mayo de 2004 en Santiago de Chile. Agrupa instituciones masónicas liberales y
              adogmáticas del continente americano, con el propósito de fomentar la fraternidad, la
              comunicación y el intercambio de experiencias.
            </p>
            <p>
              La historia detallada se encuentra en proceso de compilación institucional. Todo
              contenido definitivo será validado por la organización antes de su publicación en
              este portal.
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
