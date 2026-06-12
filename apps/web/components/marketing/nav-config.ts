export type NavChildLink = {
  href: string;
  label: string;
  description?: string;
};

export type NavGroup = {
  id: string;
  label: string;
  href?: string;
  children: NavChildLink[];
};

export const comamNavGroup: NavGroup = {
  id: 'comam',
  label: 'COMAM',
  href: '/comam/que-es-comam',
  children: [
    {
      href: '/comam/que-es-comam',
      label: 'Qué es COMAM',
      description: 'Definición, naturaleza y propósito institucional',
    },
    {
      href: '/comam/historia',
      label: 'Historia',
      description: 'Fundación, asambleas y línea de tiempo pública',
    },
    {
      href: '/comam/objetivos-y-principios',
      label: 'Objetivos y principios',
      description: 'Fines, valores y principios de la organización',
    },
    {
      href: '/comam/gobernanza',
      label: 'Gobernanza',
      description: 'Asamblea General, Secretario General y secretarías',
    },
    {
      href: '/comam/miembros',
      label: 'Miembros',
      description: 'Criterios de membresía y proceso de admisión',
    },
    {
      href: '/comam/preguntas-frecuentes',
      label: 'Preguntas frecuentes',
      description: 'Consultas habituales sobre COMAM',
    },
  ],
};

export const conferenciaNavGroup: NavGroup = {
  id: 'conferencia',
  label: 'Conferencia 2026',
  href: '/conferencia',
  children: [
    {
      href: '/conferencia',
      label: 'Inicio',
      description: 'Información general del encuentro en Santiago',
    },
    {
      href: '/conferencia/registro',
      label: 'Registro',
      description: 'Inscripción para delegaciones y participantes',
    },
    {
      href: '/conferencia/preguntas-frecuentes',
      label: 'Preguntas frecuentes',
      description: 'Logística, participación y consultas',
    },
  ],
};

export const directNavLinks = [
  { href: '/articulos', label: 'Artículos' },
  { href: '/biblioteca', label: 'Biblioteca' },
];

export function getBreadcrumb(pathname: string): { section: string; label: string } | null {
  const comamMatch = comamNavGroup.children.find((c) => c.href === pathname);
  if (comamMatch) {
    return { section: 'COMAM', label: comamMatch.label };
  }
  const confMatch = conferenciaNavGroup.children.find((c) => c.href === pathname);
  if (confMatch) {
    return { section: 'Conferencia 2026', label: confMatch.label };
  }
  return null;
}

export function isGroupActive(pathname: string, group: NavGroup): boolean {
  return group.children.some((child) => child.href === pathname);
}
