import { desc, eq } from 'drizzle-orm';
import { BookOpen, Calendar, Globe } from 'lucide-react';
import { articles, db } from '@comam/db';
import { HeroSection } from '@/components/marketing/hero-section';
import { FeatureGrid } from '@/components/marketing/feature-grid';
import { DarkBand } from '@/components/marketing/dark-band';
import { LogoStrip } from '@/components/marketing/logo-strip';
import { StoryCards } from '@/components/marketing/story-cards';
import { CtaBand } from '@/components/marketing/cta-band';
import { homeSections } from '@/content/institutional/home';
import { safeDbQuery } from '@/lib/db-safe';

export const dynamic = 'force-dynamic';

const sectionIcons = [Globe, BookOpen, Calendar] as const;

const fallbackStories = [
  {
    title: 'Historia y propósito de COMAM',
    summary: 'Conozca el origen de la Conferencia Masónica Americana y su rol continental.',
    href: '/comam/historia',
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

export default async function HomePage() {
  const { data: recentArticles } = await safeDbQuery(
    () =>
      db
        .select({
          title: articles.title,
          summary: articles.summary,
          slug: articles.slug,
        })
        .from(articles)
        .where(eq(articles.status, 'published'))
        .orderBy(desc(articles.publishedAt))
        .limit(3),
    [] as { title: string; summary: string | null; slug: string }[],
  );

  const stories =
    recentArticles.length > 0
      ? recentArticles.map((a) => ({
          title: a.title,
          summary: a.summary ?? 'Artículo institucional COMAM.',
          href: `/articulos/${a.slug}`,
          badge: 'Artículo',
        }))
      : fallbackStories;

  return (
    <>
      <HeroSection />
      <FeatureGrid
        eyebrow="Plataforma institucional"
        title="Una red americana de fraternidad y reflexión"
        subtitle="Memoria documental, conferencias y comunicación institucional con claridad y trazabilidad."
        features={homeSections.map((section, index) => ({
          title: section.title,
          description: section.description,
          href: section.href,
          icon: sectionIcons[index] ?? BookOpen,
          imageKey: section.imageKey,
        }))}
      />
      <DarkBand />
      <StoryCards eyebrow="Destacados" title="Actualidad institucional" stories={stories} />
      <LogoStrip />
      <CtaBand />
    </>
  );
}
