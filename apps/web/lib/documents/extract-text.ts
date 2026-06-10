export async function extractTextFromBuffer(buffer: Buffer, mimeType: string): Promise<string> {
  const normalized = mimeType.toLowerCase();

  if (normalized === 'application/pdf' || normalized.endsWith('/pdf')) {
    const pdfParse = (await import('pdf-parse')).default;
    const result = await pdfParse(buffer);
    return result.text.trim();
  }

  if (normalized.startsWith('text/') || normalized === 'application/json') {
    return buffer.toString('utf-8').trim();
  }

  return '';
}
