import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function HermesDisabled() {
  return (
    <Card className="border-border/80">
      <CardContent className="space-y-4 p-8 text-center">
        <p className="text-muted-foreground">
          El agente Hermes no está disponible en este momento. Puede consultar la información
          institucional en las secciones públicas del portal.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Button asChild variant="secondary">
            <Link href="/comam">Qué es COMAM</Link>
          </Button>
          <Button asChild>
            <Link href="/conferencia">Conferencia 2026</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
