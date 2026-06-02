export const ARTICLE_STATUSES = [
  'draft',
  'review',
  'approved',
  'published',
  'archived',
] as const;

export type ArticleStatus = (typeof ARTICLE_STATUSES)[number];

export const DOCUMENT_VISIBILITIES = [
  'public',
  'registered',
  'delegates',
  'committee',
  'private',
] as const;

export type DocumentVisibility = (typeof DOCUMENT_VISIBILITIES)[number];

export function slugify(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
