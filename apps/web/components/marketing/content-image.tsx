import Image from 'next/image';
import { ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ContentImage } from '@/content/institutional/types';

const aspectClasses = {
  hero: 'aspect-video',
  section: 'aspect-[4/3]',
  card: 'aspect-square',
  banner: 'aspect-[5/1]',
} as const;

export function ContentImageBlock({
  image,
  variant = 'section',
  className,
}: {
  image: ContentImage;
  variant?: keyof typeof aspectClasses;
  className?: string;
}) {
  if (image.src) {
    return (
      <figure className={cn('overflow-hidden', className)}>
        <div className={cn('relative w-full overflow-hidden rounded-xl border border-border/80', aspectClasses[variant])}>
          <Image
            src={image.src}
            alt={image.alt}
            fill
            className="object-cover"
            sizes={variant === 'hero' ? '(max-width: 1024px) 100vw, 50vw' : '(max-width: 768px) 100vw, 280px'}
          />
        </div>
        {image.caption ? (
          <figcaption className="mt-2 text-center text-xs text-muted-foreground">{image.caption}</figcaption>
        ) : null}
      </figure>
    );
  }

  return (
    <figure className={cn('overflow-hidden', className)}>
      <div
        className={cn(
          'flex w-full flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-primary/30 bg-gradient-to-br from-accent to-muted p-6',
          aspectClasses[variant],
        )}
      >
        <ImageIcon className="h-8 w-8 text-primary/50" aria-hidden />
        <span className="text-center text-xs text-muted-foreground">Imagen pendiente de selección</span>
      </div>
      {image.caption ? (
        <figcaption className="mt-2 text-center text-xs text-muted-foreground">{image.caption}</figcaption>
      ) : null}
    </figure>
  );
}
