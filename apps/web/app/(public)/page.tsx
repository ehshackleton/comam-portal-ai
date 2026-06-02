import { desc, eq } from 'drizzle-orm';
import { BookOpen, Calendar, FileText, Sparkles } from 'lucide-react';
import { articles, db } from '@comam/db';
import { HeroSection } from '@/components/marketing/hero-section';
import { FeatureGrid } from '@/components/marketing/feature-grid';
import { DarkBand } from '@/components/marketing/dark-band';
import { LogoStrip } from '@/components/marketing/logo-strip';
import { StoryCards } from '@/components/marketing/story-cards';
import { CtaBand } from '@/components/marketing/cta-band';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  let recentArticles: { title: string; summary: string | null; slug: string }[] = [];

  try {
    recentArticles = await db
      .select({
        title: articles.title,
        summary: articles.summary,
        slug: articles.slug,
      })
      .from(articles)
      .where(eq(articles.status, 'published'))
      .orderBy(desc(articles.publishedAt))
      .limit(3);
  } catch {
    recentArticles = [];
  }

  const stories =
    recentArticles.length > 0
      ? recentArticles.map((a) => ({
          title: a.title,
          summary: a.summary ?? 'Artículo institucional COMAM.',
          href: `/articulos/${a.slug}`,
          badge: 'Artículo',
        }))
      : [
          {
            title: 'Historia y propósito de COMAM',
            summary:
              'Conozca el origen de la Conferencia Masónica Americana y su rol continental.',
            href: '/comam',
            badge: 'Institucional',
          },
          {
            title: 'Conferencia COMAM 2026',
            summary: 'Santiago de Chile — información logística y programa.',
            href: '/conferencia',
            badge: 'Conferencia',
          },
          {
            title: 'Biblioteca documental',
            summary: 'Estatutos, documentos y archivo histórico autorizado.',
            href: '/biblioteca',
            badge: 'Documentos',
          },
        ];

  return (
    <>
      <HeroSection />
      <FeatureGrid
        eyebrow="Plataforma institucional"
        title="Construido para la comunidad masónica americana"
        subtitle="Documentación, conferencias y comunicación con claridad y trazabilidad."
        features={[
          {
            title: 'Historia y visión',
            description:
              'Información institucional validada sobre COMAM, su propósito y participación continental.',
            href: '/comam',
            icon: BookOpen,
          },
          {
            title: 'Conferencia 2026',
            description:
              'Todo lo necesario para la Conferencia COMAM en Santiago de Chile: sede, programa y registro.',
            href: '/conferencia',
            icon: Calendar,
          },
          {
            title: 'Biblioteca y artículos',
            description:
              'Documentos públicos, estatutos y artículos editoriales con control de visibilidad.',
            href: '/biblioteca',
            icon: FileText,
          },
          {
            title: 'Agente Hermes COMAM',
            description:
              'Orientación pública con fuentes autorizadas y política de no certeza documental.',
            href: '/comam',
            icon: Sparkles,
          },
        ]}
      />
      <DarkBand />
      <StoryCards eyebrow="Destacados" title="Actualidad institucional" stories={stories} />
      <LogoStrip />
      <CtaBand />
    </>
  );
}
