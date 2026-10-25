import { describe, it, expect } from 'vitest';
import { stripEmojis } from '../stripEmojis';

describe('stripEmojis', () => {
  it('returns empty string for null or undefined or empty text', () => {
    expect(stripEmojis('')).toBe('');
    expect(stripEmojis(null as any)).toBe('');
  });

  it('removes emojis and extended pictographs', () => {
    expect(stripEmojis('Hello 😀 world 🚀!')).toBe('Hello world !');
    expect(stripEmojis('🔥 Sale 50% Off 🎉')).toBe('Sale 50% Off');
  });

  it('preserves plain text and numbers', () => {
    expect(stripEmojis('iPhone 13 Pro Max - 256GB')).toBe('iPhone 13 Pro Max - 256GB');
  });
});
