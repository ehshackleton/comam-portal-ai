'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useHermesDock } from '@/components/hermes/hermes-dock-context';

export function HeroSection() {
  const { openDock, isAvailable } = useHermesDock();
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
          <h1 className="text-balance text-4xl font-semibold tracking-tight text-foreground md:text-6xl md:leading-[1.1]">
            El portal de conocimiento institucional para COMAM
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl">
            Fraternidad, comunicación e intercambio entre obediencias liberales de América.
            Documentos, conferencias y biblioteca en un solo lugar.
          </p>
          <div className="mx-auto mt-10 flex w-full max-w-sm flex-col items-stretch gap-3 sm:max-w-none sm:flex-row sm:flex-wrap sm:items-center sm:justify-center">
            <Button asChild size="lg" className="w-full sm:w-auto">
              <Link href="/conferencia">Conferencia 2026</Link>
            </Button>
            <Button asChild variant="secondary" size="lg" className="w-full sm:w-auto">
              <Link href="/comam">Conocer COMAM</Link>
            </Button>
            {isAvailable ? (
              <Button
                type="button"
                variant="outline"
                size="lg"
                className="w-full sm:w-auto"
                onClick={openDock}
              >
                <MessageCircle className="mr-2 h-4 w-4" />
                Consultar a Hermes
              </Button>
            ) : null}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
