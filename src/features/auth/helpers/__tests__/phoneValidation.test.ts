import { describe, it, expect } from 'vitest';
import { cleanAndVerifyPhone } from '../phoneValidation';

describe('cleanAndVerifyPhone', () => {
  describe('Jordan (JO)', () => {
    it('accepts valid 9-digit number without country code', () => {
      const result = cleanAndVerifyPhone('791234567', 'JO');
      expect(result.isValid).toBe(true);
      expect(result.cleaned).toBe('791234567');
    });

    it('accepts valid number with leading 0', () => {
      const result = cleanAndVerifyPhone('0781234567', 'JO');
      expect(result.isValid).toBe(true);
      expect(result.cleaned).toBe('781234567');
    });

    it('accepts valid number with +962 prefix', () => {
      const result = cleanAndVerifyPhone('+962771234567', 'JO');
      expect(result.isValid).toBe(true);
      expect(result.cleaned).toBe('771234567');
    });

    it('rejects invalid prefix', () => {
      const result = cleanAndVerifyPhone('601234567', 'JO');
      expect(result.isValid).toBe(false);
    });

    it('rejects invalid length', () => {
      const result = cleanAndVerifyPhone('7912345', 'JO');
      expect(result.isValid).toBe(false);
    });
  });

  describe('Saudi Arabia (SA)', () => {
    it('accepts valid 9-digit number starting with 5', () => {
      const result = cleanAndVerifyPhone('512345678', 'SA');
      expect(result.isValid).toBe(true);
      expect(result.cleaned).toBe('512345678');
    });

    it('accepts valid number with leading 0', () => {
      const result = cleanAndVerifyPhone('0512345678', 'SA');
      expect(result.isValid).toBe(true);
      expect(result.cleaned).toBe('512345678');
    });

    it('accepts valid number with +966 prefix', () => {
      const result = cleanAndVerifyPhone('+966512345678', 'SA');
      expect(result.isValid).toBe(true);
    });

    it('rejects invalid prefix', () => {
      const result = cleanAndVerifyPhone('412345678', 'SA');
      expect(result.isValid).toBe(false);
    });

    it('rejects invalid length', () => {
      const result = cleanAndVerifyPhone('5123456', 'SA');
      expect(result.isValid).toBe(false);
    });
  });

  describe('Palestine (PS)', () => {
    it('accepts valid number with 59, 58, 56 prefix', () => {
      expect(cleanAndVerifyPhone('599123456', 'PS').isValid).toBe(true);
      expect(cleanAndVerifyPhone('589123456', 'PS').isValid).toBe(true);
    });

    it('accepts valid number with leading 0', () => {
      const result = cleanAndVerifyPhone('0599123456', 'PS');
      expect(result.isValid).toBe(true);
      expect(result.cleaned).toBe('599123456');
    });

    it('accepts valid number with +970 prefix', () => {
      const result = cleanAndVerifyPhone('+970589123456', 'PS');
      expect(result.isValid).toBe(true);
    });

    it('rejects invalid prefix', () => {
      const result = cleanAndVerifyPhone('609123456', 'PS');
      expect(result.isValid).toBe(false);
    });

    it('rejects invalid length', () => {
      const result = cleanAndVerifyPhone('5991234', 'PS');
      expect(result.isValid).toBe(false);
    });
  });

  describe('Syria (SY)', () => {
    it('accepts valid 9-digit number starting with 9', () => {
      const result = cleanAndVerifyPhone('944123456', 'SY');
      expect(result.isValid).toBe(true);
      expect(result.cleaned).toBe('944123456');
    });

    it('accepts valid number with leading 0', () => {
      const result = cleanAndVerifyPhone('0944123456', 'SY');
      expect(result.isValid).toBe(true);
      expect(result.cleaned).toBe('944123456');
    });

    it('accepts valid number with +963 prefix', () => {
      const result = cleanAndVerifyPhone('+963944123456', 'SY');
      expect(result.isValid).toBe(true);
    });

    it('rejects invalid prefix', () => {
      const result = cleanAndVerifyPhone('844123456', 'SY');
      expect(result.isValid).toBe(false);
    });

    it('rejects invalid length (e.g. 8 digits)', () => {
      const result = cleanAndVerifyPhone('94412345', 'SY');
      expect(result.isValid).toBe(false);
    });
  });

  describe('Lebanon (LB)', () => {
    it('accepts valid 8-digit mobile number starting with 70/71/76/78/79/81', () => {
      expect(cleanAndVerifyPhone('71234567', 'LB').isValid).toBe(true);
      expect(cleanAndVerifyPhone('81234567', 'LB').isValid).toBe(true);
    });

    it('accepts valid 7-digit mobile starting with 3 (or 03)', () => {
      const result = cleanAndVerifyPhone('03123456', 'LB');
      expect(result.isValid).toBe(true);
      expect(result.cleaned).toBe('3123456');
    });

    it('accepts valid number with +961 prefix', () => {
      const result = cleanAndVerifyPhone('+96171234567', 'LB');
      expect(result.isValid).toBe(true);
    });

    it('rejects invalid prefix', () => {
      const result = cleanAndVerifyPhone('11234567', 'LB');
      expect(result.isValid).toBe(false);
    });

    it('rejects invalid length', () => {
      const result = cleanAndVerifyPhone('71234', 'LB');
      expect(result.isValid).toBe(false);
    });
  });
});
