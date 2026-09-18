import { describe, it, expect } from 'vitest';
import { validateImageFile, IMAGE_CONFIG } from '../imageUtils';

describe('imageUtils', () => {
  describe('IMAGE_CONFIG', () => {
    it('should have correct configuration values', () => {
      expect(IMAGE_CONFIG.maxDimension).toBe(256);
      expect(IMAGE_CONFIG.quality).toBe(0.6);
      expect(IMAGE_CONFIG.maxInputSizeMB).toBe(5);
    });
  });

  describe('validateImageFile', () => {
    it('should accept valid image types', () => {
      const types = ['image/jpeg', 'image/png', 'image/webp'];
      types.forEach(type => {
        const file = new File([''], 'test.jpg', { type });
        expect(validateImageFile(file).valid).toBe(true);
      });
    });

    it('should reject invalid image types', () => {
      const types = ['image/gif', 'application/pdf', 'text/plain'];
      types.forEach(type => {
        const file = new File([''], 'test.ext', { type });
        const result = validateImageFile(file);
        expect(result.valid).toBe(false);
        expect(result.error).toBe('invalid_type');
      });
    });

    it('should reject files larger than max size', () => {
      // 6MB file
      const blob = new Blob([new ArrayBuffer(6 * 1024 * 1024)]);
      const file = new File([blob], 'large.jpg', { type: 'image/jpeg' });
      const result = validateImageFile(file);
      expect(result.valid).toBe(false);
      expect(result.error).toBe('too_large');
    });

    it('should accept files within size limit', () => {
      // 1MB file
      const blob = new Blob([new ArrayBuffer(1 * 1024 * 1024)]);
      const file = new File([blob], 'small.jpg', { type: 'image/jpeg' });
      expect(validateImageFile(file).valid).toBe(true);
    });
  });
});
