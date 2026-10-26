import { describe, it, expect } from 'vitest';
import { stripEmojis, stripEmojisFromInput } from '../stripEmojis';

describe('stripEmojis (display)', () => {
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

  it('collapses whitespace for display', () => {
    expect(stripEmojis('Line 1\n\nLine 2')).toBe('Line 1 Line 2');
  });
});

describe('stripEmojisFromInput (form)', () => {
  it('removes emojis only', () => {
    expect(stripEmojisFromInput('شقة 🔥 مميزة')).toBe('شقة  مميزة');
  });

  it('preserves newlines and multiline structure', () => {
    expect(stripEmojisFromInput('Line 1\nLine 2\nLine 3')).toBe('Line 1\nLine 2\nLine 3');
  });

  it('preserves newlines while removing emojis', () => {
    expect(stripEmojisFromInput('🔥 Sale\n🎉 50% Off\n🚀 Limited'))
      .toBe(' Sale\n 50% Off\n Limited');
  });

  it('preserves tabs and multiple spaces', () => {
    expect(stripEmojisFromInput('a\tb  c')).toBe('a\tb  c');
  });

  it('returns empty string for null/undefined/empty', () => {
    expect(stripEmojisFromInput('')).toBe('');
    expect(stripEmojisFromInput(null as any)).toBe('');
  });
});
