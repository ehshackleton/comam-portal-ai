export const homeHero = {
  badge: 'Fundada en 2004 · Santiago de Chile',
  title: 'Conferencia Masónica Americana',
  subtitle:
    'Una red masónica americana de fraternidad, comunicación y reflexión para fortalecer la Cadena de Unión entre las obediencias del continente.',
  description:
    'Fundada en Santiago de Chile el 24 de mayo de 2004, COMAM reúne a obediencias masónicas soberanas e independientes de América, promoviendo el diálogo, la cooperación, el intercambio de experiencias y la reflexión sobre los grandes temas humanos, sociales y culturales de nuestro tiempo.',
};

export const homeSections = [
  {
    title: 'Una red americana',
    description:
      'COMAM reúne a Grandes Logias, Grandes Orientes y obediencias masónicas de América en un espacio común de encuentro, intercambio y reflexión. Su labor se basa en el respeto a la soberanía de cada institución y en la voluntad de construir fraternidad continental.',
    href: '/comam/que-es-comam',
    imageKey: 'home-section-0' as const,
  },
  {
    title: 'Memoria y futuro',
    description:
      'Desde sus primeras asambleas, COMAM ha desarrollado una memoria documental compuesta por reglamentos, actas, declaraciones, coloquios y comunicaciones. El portal digital busca ordenar, preservar y proyectar esa memoria hacia las nuevas generaciones.',
    href: '/comam/historia',
    imageKey: 'home-section-1' as const,
  },
  {
    title: 'Conferencia 2026',
    description:
      'Santiago de Chile será sede de la Conferencia COMAM 2026. El encuentro representa una oportunidad para volver al lugar fundacional de COMAM, fortalecer vínculos y abrir un nuevo ciclo de reflexión americana.',
    href: '/conferencia',
    imageKey: 'home-section-2' as const,
  },
];

export const homeCtas = [
  { label: 'Conocer COMAM', href: '/comam/que-es-comam' },
  { label: 'Inscribirse 2026', href: '/conferencia/registro' },
];
