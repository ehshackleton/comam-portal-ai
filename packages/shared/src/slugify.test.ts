import { describe, expect, it } from 'vitest';
import { slugify } from './index';

describe('slugify', () => {
  it('normalizes accents and spaces', () => {
    expect(slugify('Conferencia COMAM 2026')).toBe('conferencia-comam-2026');
  });

  it('removes special characters', () => {
    expect(slugify('¿Qué es COMAM?')).toBe('que-es-comam');
  });
});
