const DEFAULT_CHUNK_SIZE = 800;
const OVERLAP = 100;

export function chunkText(text: string, chunkSize = DEFAULT_CHUNK_SIZE): string[] {
  const normalized = text.replace(/\s+/g, ' ').trim();
  if (!normalized) return [];

  if (normalized.length <= chunkSize) {
    return [normalized];
  }

  const chunks: string[] = [];
  let start = 0;

  while (start < normalized.length) {
    const end = Math.min(start + chunkSize, normalized.length);
    chunks.push(normalized.slice(start, end));
    if (end >= normalized.length) break;
    start = Math.max(end - OVERLAP, start + 1);
  }

  return chunks;
}
