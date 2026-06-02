import Link from 'next/link';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export function ContentListCard({
  title,
  description,
  href,
  badge,
  meta,
}: {
  title: string;
  description?: string | null;
  href: string;
  badge?: string;
  meta?: string;
}) {
  return (
    <Link href={href} className="block">
      <Card className="card-hover">
        <CardHeader>
          <div className="flex flex-wrap items-center gap-2">
            {badge ? <Badge variant="secondary">{badge}</Badge> : null}
            {meta ? <span className="text-xs text-muted-foreground">{meta}</span> : null}
          </div>
          <CardTitle className="mt-2">{title}</CardTitle>
          {description ? (
            <CardDescription className="text-base leading-relaxed">{description}</CardDescription>
          ) : null}
        </CardHeader>
      </Card>
    </Link>
  );
}
