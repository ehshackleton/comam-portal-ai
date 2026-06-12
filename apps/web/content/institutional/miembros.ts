import type { InstitutionalPage } from './types';

export const miembrosPage: InstitutionalPage = {
  metadata: {
    title: 'Miembros y obediencias de COMAM',
    description:
      'COMAM reúne a obediencias masónicas de América, respetando la soberanía e independencia de cada institución miembro.',
  },
  pageHeader: {
    eyebrow: 'Institucional',
    title: 'Miembros y obediencias',
    description:
      'Las obediencias miembro de COMAM participan desde su propia soberanía institucional, compartiendo un espacio común de fraternidad, reflexión y cooperación.',
  },
  sections: [
    {
      paragraphs: [
        'Los documentos revisados establecen que los miembros de COMAM son obediencias que cumplen las condiciones definidas por el Reglamento General, entre ellas contar con al menos tres logias simbólicas y trabajar en los tres primeros grados, en un país de América. También se contempla la posibilidad de invitados especiales, cuya calidad es definida por la Asamblea General.',
        'COMAM reconoce que cada obediencia miembro conserva su soberanía. Esta definición es central: la organización busca unir, comunicar y fortalecer vínculos, sin sustituir la autonomía de sus instituciones participantes.',
      ],
      note: 'La nómina oficial de miembros vigentes está en proceso de validación institucional. No se publicará una lista de obediencias hasta su revisión formal.',
    },
    {
      title: 'Criterios de membresía',
      bullets: [
        'Ser una obediencia masónica',
        'Contar con existencia institucional mínima, según el Reglamento General',
        'Trabajar en los tres primeros grados',
        'Desarrollar su trabajo en un país de América',
        'Presentar solicitud ante la Asamblea General a través de la Secretaría General',
        'Acompañar antecedentes institucionales, estatutarios e históricos',
        'Aceptar expresamente el fortalecimiento de la Cadena de Unión de la masonería americana',
      ],
    },
    {
      title: 'Proceso general de admisión',
      paragraphs: [
        'El Reglamento General indica que las solicitudes de admisión se dirigen a la Asamblea General a través de la Secretaría General. La candidatura puede ser examinada por una Comisión de Investigación, que informa a la Secretaría General y a la Asamblea.',
        'Las decisiones de admisión se adoptan conforme a las reglas reglamentarias vigentes. Los documentos históricos muestran que COMAM ha considerado informes, visitas, antecedentes institucionales y deliberaciones antes de admitir nuevas obediencias.',
      ],
    },
  ],
  heroImageKey: 'miembros-hero',
};
