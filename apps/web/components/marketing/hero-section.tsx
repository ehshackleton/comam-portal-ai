'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export function HeroSection() {
  return (
    <section className="hero-glow relative overflow-hidden px-6 pb-20 pt-16 md:pb-28 md:pt-24">
      <div className="mx-auto max-w-4xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Badge variant="default" className="mb-6">
            Conferencia Masónica Americana
          </Badge>
          <h1 className="text-4xl font-semibold tracking-tight text-foreground md:text-6xl md:leading-[1.1]">
            El portal de conocimiento institucional para COMAM
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl">
            Fraternidad, comunicación e intercambio entre obediencias liberales de América.
            Documentos, conferencias y biblioteca en un solo lugar.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Button asChild size="lg">
              <Link href="/conferencia">Conferencia 2026</Link>
            </Button>
            <Button asChild variant="secondary" size="lg">
              <Link href="/comam">Conocer COMAM</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
