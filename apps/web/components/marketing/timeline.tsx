import type { TimelineEvent } from '@/content/institutional/types';

export function Timeline({ events }: { events: TimelineEvent[] }) {
  return (
    <ol className="relative space-y-8 border-l border-border pl-6">
      {events.map((event) => (
        <li key={`${event.year}-${event.title}`} className="relative">
          <span className="absolute -left-[1.6rem] top-1 flex h-3 w-3 rounded-full border-2 border-primary bg-background" />
          <p className="text-sm font-semibold text-primary">{event.year}</p>
          <h3 className="mt-1 text-lg font-semibold text-foreground">{event.title}</h3>
          <p className="text-prose mt-2 text-base leading-relaxed text-muted-foreground">
            {event.description}
          </p>
        </li>
      ))}
    </ol>
  );
}
