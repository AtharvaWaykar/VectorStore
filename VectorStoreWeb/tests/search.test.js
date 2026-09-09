import { describe, expect, it } from 'vitest';
import {
  buildEmbeddingText,
  cosineSimilarity,
  keywordScore,
  normalizeLabel,
  parseVector,
  toPgVector,
} from '../src/lib/search.js';

describe('search utilities', () => {
  it('normalizes labels and builds stable embedding text', () => {
    expect(normalizeLabel('  garage   shelf  ')).toBe('garage shelf');
    expect(buildEmbeddingText({ name: ' Drill ', description: ' cordless ', roomName: 'Garage', boxName: 'Tools' }))
      .toBe('Drill. cordless. Room Garage. Box Tools');
  });

  it('round-trips PostgreSQL vector values', () => {
    const vector = [0.123456789, -1, 0];
    expect(toPgVector(vector)).toBe('[0.12345679,-1.00000000,0.00000000]');
    expect(parseVector(toPgVector(vector))).toEqual([0.12345679, -1, 0]);
    expect(parseVector(vector)).toEqual(vector);
  });

  it('returns cosine similarity for valid vectors and zero for invalid input', () => {
    expect(cosineSimilarity([1, 0], [1, 0])).toBe(1);
    expect(cosineSimilarity([1, 0], [0, 1])).toBe(0);
    expect(cosineSimilarity([1], [1, 0])).toBe(0);
    expect(cosineSimilarity([0, 0], [1, 0])).toBe(0);
  });

  it('scores exact and token matches across inventory fields', () => {
    const item = { name: 'Cordless Drill', description: '18V tool', roomName: 'Garage', boxName: 'Tools', status: 'In Stock' };
    expect(keywordScore('garage', item)).toBe(1);
    expect(keywordScore('cordless tool', item)).toBeCloseTo(0.3);
    expect(keywordScore('', item)).toBe(0);
  });
});
