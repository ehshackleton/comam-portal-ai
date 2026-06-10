import { describe, expect, it } from 'vitest';
import { chunkText } from './chunking';

describe('chunkText', () => {
  it('returns empty array for blank input', () => {
    expect(chunkText('   ')).toEqual([]);
  });

  it('returns single chunk for short text', () => {
    expect(chunkText('Hola COMAM')).toEqual(['Hola COMAM']);
  });

  it('splits long text into multiple chunks', () => {
    const text = 'a'.repeat(2000);
    const chunks = chunkText(text, 800);
    expect(chunks.length).toBeGreaterThan(1);
    expect(chunks.every((chunk) => chunk.length <= 800)).toBe(true);
  });
});
