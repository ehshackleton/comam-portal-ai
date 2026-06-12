import type { InstitutionalPage } from './types';

export const gobernanzaPage: InstitutionalPage = {
  metadata: {
    title: 'Gobernanza de COMAM | Asamblea General y Secretarías',
    description:
      'Conoce la estructura institucional de COMAM, su Asamblea General, Secretariado General y Secretarías de Docencia y Comunicaciones.',
  },
  pageHeader: {
    eyebrow: 'Institucional',
    title: 'Gobernanza institucional',
    description:
      'COMAM se organiza a través de una Asamblea General y secretarías encargadas de la administración, docencia y comunicaciones institucionales.',
  },
  sections: [
    {
      paragraphs: [
        'La Asamblea General es el órgano supremo de la Conferencia Masónica Americana. Está integrada por representantes de las obediencias miembro. Los documentos revisados señalan que todos los masones y masonas de las obediencias miembro pueden asistir a las Asambleas, aunque el voto corresponde a un representante de cada obediencia miembro.',
        'Cada obediencia miembro cuenta con un voto. La Asamblea define la fecha y lugar de la próxima reunión, puede convocar sesiones extraordinarias y puede permitir la asistencia de obediencias no miembros como observadoras en todo o parte de sus trabajos.',
        'La administración institucional considera un Secretario General y Secretarías de Docencia y Comunicaciones. Estas autoridades son elegidas por la Asamblea General en escrutinio uninominal secreto, con posibilidad de reelección a criterio de la siguiente Asamblea.',
      ],
      note: 'Las referencias normativas exactas deben validarse con el Reglamento General oficial antes de su publicación definitiva.',
    },
    {
      title: 'Asamblea General',
      bullets: [
        'Actuar como órgano supremo de COMAM',
        'Reunir a representantes de las obediencias miembro',
        'Definir la sede de próximas reuniones',
        'Deliberar sobre el Orden del Día',
        'Admitir invitados u observadores',
        'Conocer y decidir materias reglamentarias',
        'Elegir autoridades',
        'Tomar conocimiento de informes de secretarías',
      ],
    },
    {
      title: 'Secretario General',
      bullets: [
        'Atender la administración de la asociación',
        'Recibir y difundir documentos entre miembros',
        'Redactar y circular el proyecto de Orden del Día',
        'Dirigir las reuniones de Asamblea',
        'Velar por la aplicación del Reglamento General',
        'Convocar sesiones extraordinarias cuando corresponda',
      ],
    },
    {
      title: 'Secretaría de Docencia',
      bullets: [
        'Moderar debates en los Coloquios de COMAM',
        'Redactar conclusiones para aprobación de la plenaria',
        'Coordinar la recepción de trabajos de las obediencias',
        'Fomentar la investigación sobre la masonería en las Américas',
      ],
    },
    {
      title: 'Secretaría de Comunicaciones',
      bullets: [
        'Actuar como punto focal de la comunicación institucional',
        'Mantener vínculo fluido con las obediencias miembro',
        'Editar boletines o comunicaciones periódicas',
        'Acompañar la evolución del sitio web institucional',
        'Asegurar que el contenido web represente la perspectiva institucional de COMAM',
      ],
    },
  ],
  heroImageKey: 'gobernanza-hero',
};
