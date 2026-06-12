import type { FaqItem } from '@/content/institutional/types';
import { Card, CardContent } from '@/components/ui/card';

export function FaqList({ items }: { items: FaqItem[] }) {
  return (
    <div className="space-y-4">
      {items.map((item) => (
        <Card key={item.question} className="card-hover border-border/80">
          <CardContent className="space-y-2 p-6">
            <h3 className="text-base font-semibold text-foreground">{item.question}</h3>
            <p className="text-prose text-sm leading-relaxed text-muted-foreground">{item.answer}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
