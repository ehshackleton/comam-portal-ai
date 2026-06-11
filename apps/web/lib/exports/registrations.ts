import PDFDocument from 'pdfkit';
import * as XLSX from 'xlsx';
import {
  ATTENDANCE_LABELS,
  PARTICIPANT_LABELS,
  STATUS_LABELS,
} from './registrations-labels';

export type RegistrationExportRow = {
  fullName: string;
  email: string;
  country: string | null;
  city: string | null;
  participantType: string;
  status: string;
  attendanceMode: string | null;
  dietaryRestrictions: string | null;
  accessibilityNeeds: string | null;
  imageAuthorization: boolean;
  institutionalData: { institutionName?: string; delegation?: string };
  createdAt: Date | string;
};

function label(map: Record<string, string>, value: string | null | undefined): string {
  if (!value) return '—';
  return map[value] ?? value;
}

function formatDate(value: Date | string): string {
  const date = value instanceof Date ? value : new Date(value);
  return date.toLocaleString('es-CL', {
    dateStyle: 'short',
    timeStyle: 'short',
  });
}

export function mapRegistrationToExport(row: RegistrationExportRow): Record<string, string> {
  return {
    Nombre: row.fullName,
    Email: row.email,
    País: row.country ?? '—',
    Ciudad: row.city ?? '—',
    'Tipo participante': label(PARTICIPANT_LABELS, row.participantType),
    Estado: label(STATUS_LABELS, row.status),
    Modalidad: label(ATTENDANCE_LABELS, row.attendanceMode),
    Institución: row.institutionalData?.institutionName ?? '—',
    Delegación: row.institutionalData?.delegation ?? '—',
    'Restricciones alimentarias': row.dietaryRestrictions ?? '—',
    Accesibilidad: row.accessibilityNeeds ?? '—',
    'Autorización imagen': row.imageAuthorization ? 'Sí' : 'No',
    'Fecha registro': formatDate(row.createdAt),
  };
}

export function buildRegistrationsXlsx(rows: RegistrationExportRow[]): Buffer {
  const data = rows.map((row) => mapRegistrationToExport(row));
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Registros');
  return Buffer.from(XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' }));
}

export function buildRegistrationsPdf(rows: RegistrationExportRow[]): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 40, size: 'A4', layout: 'landscape' });
    const chunks: Buffer[] = [];

    doc.on('data', (chunk: Buffer) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    const conferenceName = process.env.CONFERENCE_NAME ?? 'Conferencia COMAM 2026';
    doc.fontSize(16).fillColor('#0d9373').text('COMAM — Registros de conferencia', { align: 'left' });
    doc.fontSize(10).fillColor('#64748b').text(conferenceName, { align: 'left' });
    doc
      .fontSize(9)
      .fillColor('#64748b')
      .text(`Generado: ${new Date().toLocaleString('es-CL')}`, { align: 'left' });
    doc.moveDown(1);

    if (rows.length === 0) {
      doc.fontSize(11).fillColor('#0f172a').text('No hay registros para exportar.');
      doc.end();
      return;
    }

    const headers = [
      'Nombre',
      'Email',
      'País',
      'Tipo',
      'Estado',
      'Institución',
      'Fecha',
    ];
    const colWidths = [110, 130, 60, 70, 70, 110, 80];
    const startX = 40;
    let y = doc.y;

    doc.fontSize(8).fillColor('#ffffff');
    let x = startX;
    headers.forEach((header, index) => {
      doc.rect(x, y, colWidths[index], 18).fill('#0d9373');
      doc.fillColor('#ffffff').text(header, x + 4, y + 5, { width: colWidths[index] - 8 });
      x += colWidths[index];
    });
    y += 18;

    rows.forEach((row, rowIndex) => {
      if (y > 520) {
        doc.addPage({ layout: 'landscape', margin: 40 });
        y = 40;
      }

      const exported = mapRegistrationToExport(row);
      const values = [
        exported.Nombre,
        exported.Email,
        exported.País,
        exported['Tipo participante'],
        exported.Estado,
        exported.Institución,
        exported['Fecha registro'],
      ];

      x = startX;
      const fill = rowIndex % 2 === 0 ? '#f8fafc' : '#ffffff';
      values.forEach((value, index) => {
        doc.rect(x, y, colWidths[index], 20).fill(fill);
        doc.fillColor('#0f172a').fontSize(7).text(value, x + 4, y + 6, {
          width: colWidths[index] - 8,
          ellipsis: true,
        });
        x += colWidths[index];
      });
      y += 20;
    });

    doc.end();
  });
}
