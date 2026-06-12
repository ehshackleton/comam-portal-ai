'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ContentImageBlock } from '@/components/marketing/content-image';
import { homeCtas, homeHero } from '@/content/institutional/home';
import { getMedia } from '@/content/institutional/media';

export function HeroSection() {
  const heroImage = getMedia('home-hero');

  return (
    <section className="hero-glow relative overflow-hidden px-6 pb-20 pt-16 md:pb-28 md:pt-24">
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center lg:text-left"
        >
          {homeHero.badge ? (
            <Badge variant="default" className="mb-6">
              {homeHero.badge}
            </Badge>
          ) : null}
          <h1 className="text-balance text-4xl font-semibold tracking-tight text-foreground md:text-5xl lg:text-6xl lg:leading-[1.1]">
            {homeHero.title}
          </h1>
          <p className="text-prose mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl lg:mx-0">
            {homeHero.subtitle}
          </p>
          <p className="text-prose mx-auto mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground/90 lg:mx-0">
            {homeHero.description}
          </p>
          <div className="mx-auto mt-10 flex w-full max-w-sm flex-col items-stretch gap-3 sm:max-w-none sm:flex-row sm:flex-wrap lg:mx-0 lg:justify-start">
            {homeCtas.map((cta, index) => (
              <Button
                key={cta.href}
                asChild
                size="lg"
                variant={index === 0 ? 'default' : 'secondary'}
                className="w-full sm:w-auto"
              >
                <Link href={cta.href}>{cta.label}</Link>
              </Button>
            ))}
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          <ContentImageBlock image={heroImage} variant="hero" />
        </motion.div>
      </div>
    </section>
  );
}
