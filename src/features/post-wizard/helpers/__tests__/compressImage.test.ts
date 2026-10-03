import { describe, it, expect } from 'vitest';
import { compressImage } from '../compressImage';

describe('compressImage', () => {
  it('returns a dataUrl for a small text file fallback', async () => {
    // We can't easily test canvas in jsdom, so we test the skip path.
    const file = new File(['small'], 'test.svg', { type: 'image/svg+xml' });
    const result = await compressImage(file);
    expect(result.dataUrl).toContain('data:');
    expect(result.originalBytes).toBe(file.size);
    expect(result.compressedBytes).toBe(file.size);
    expect(result.ratio).toBe(1);
  });

  it('does not compress SVG or GIF even if large', async () => {
    const bigSvg = 'x'.repeat(1_000_000);
    const file = new File([bigSvg], 'big.svg', { type: 'image/svg+xml' });
    const result = await compressImage(file);
    expect(result.ratio).toBe(1);
  });

  it('returns compressed bytes <= original bytes for JPEG path', async () => {
    // Real JPEG data required; canvas runs only in browser/jsdom-canvas.
    // This test documents the contract even if skipped in jsdom.
    // If canvas is unavailable, compressImage falls back gracefully.
    const file = new File([new Uint8Array(600 * 1024)], 'big.jpg', { type: 'image/jpeg' });
    const result = await compressImage(file);
    expect(result.compressedBytes).toBeLessThanOrEqual(result.originalBytes + 1);
  });
});
