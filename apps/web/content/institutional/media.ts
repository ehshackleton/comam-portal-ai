import type { ContentImage } from './types';

export type MediaKey =
  | 'home-hero'
  | 'home-section-0'
  | 'home-section-1'
  | 'home-section-2'
  | 'que-es-comam-hero'
  | 'historia-hero'
  | 'historia-timeline'
  | 'objetivos-hero'
  | 'gobernanza-hero'
  | 'miembros-hero'
  | 'conferencia-hero';

export const institutionalMedia: Record<MediaKey, ContentImage> = {
  'home-hero': {
    alt: 'Encuentro institucional de la Conferencia Masónica Americana',
    caption: 'Imagen representativa del encuentro continental',
  },
  'home-section-0': {
    alt: 'Obediencias masónicas de América en diálogo fraternal',
  },
  'home-section-1': {
    alt: 'Memoria documental e historia de COMAM',
  },
  'home-section-2': {
    alt: 'Conferencia COMAM 2026 en Santiago de Chile',
  },
  'que-es-comam-hero': {
    alt: 'Fundación de COMAM en Santiago de Chile, 2004',
    caption: 'Ciudad fundacional de la Conferencia Masónica Americana',
  },
  'historia-hero': {
    alt: 'Hitos históricos de la Conferencia Masónica Americana',
  },
  'historia-timeline': {
    alt: 'Línea de tiempo institucional de COMAM',
    caption: 'Memoria y proyección continental',
  },
  'objetivos-hero': {
    alt: 'Principios y objetivos de COMAM',
  },
  'gobernanza-hero': {
    alt: 'Gobernanza institucional de COMAM',
  },
  'miembros-hero': {
    alt: 'Obediencias miembro de la Conferencia Masónica Americana',
  },
  'conferencia-hero': {
    alt: 'Conferencia COMAM 2026 en Santiago de Chile',
    caption: 'Encuentro continental en la ciudad fundacional',
  },
};

export function getMedia(key: MediaKey): ContentImage {
  return institutionalMedia[key];
}
