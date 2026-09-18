import { describe, it, expect, beforeEach, vi } from 'vitest';
import { readValidated, writeValidated } from '../safeStorage';
import { z } from 'zod';

describe('safeStorage', () => {
  const schema = z.object({
    id: z.string(),
    count: z.number(),
  });

  const fallback = { id: 'default', count: 0 };
  const key = 'test_key';

  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  describe('readValidated', () => {
    it('returns fallback when key is missing', () => {
      const result = readValidated(key, schema, fallback);
      expect(result).toEqual(fallback);
    });

    it('returns data when valid JSON matches schema', () => {
      const validData = { id: '123', count: 5 };
      localStorage.setItem(key, JSON.stringify(validData));
      
      const result = readValidated(key, schema, fallback);
      expect(result).toEqual(validData);
    });

    it('returns fallback when JSON is malformed', () => {
      localStorage.setItem(key, 'not_json');
      
      const result = readValidated(key, schema, fallback);
      expect(result).toEqual(fallback);
    });

    it('returns fallback when Zod validation fails', () => {
      const invalidData = { id: '123', count: 'wrong_type' };
      localStorage.setItem(key, JSON.stringify(invalidData));
      
      const result = readValidated(key, schema, fallback);
      expect(result).toEqual(fallback);
    });

    it('handles null/undefined gracefully', () => {
      expect(readValidated(null as any, schema, fallback)).toEqual(fallback);
      expect(readValidated(key, null as any, fallback)).toEqual(fallback);
    });
  });

  describe('writeValidated', () => {
    it('writes valid data to localStorage', () => {
      const validData = { id: '456', count: 10 };
      writeValidated(key, schema, validData);
      
      const stored = JSON.parse(localStorage.getItem(key) || '{}');
      expect(stored).toEqual(validData);
    });

    it('does NOT write invalid data', () => {
      const invalidData = { id: '456', count: 'invalid' } as any;
      writeValidated(key, schema, invalidData);
      
      expect(localStorage.getItem(key)).toBeNull();
    });

    it('handles QuotaExceededError gracefully', () => {
      const spySet = vi.spyOn(Storage.prototype, 'setItem');
      spySet.mockImplementationOnce((k) => {
        if (k === key) throw { name: 'QuotaExceededError' };
        return;
      });

      const validData = { id: '789', count: 20 };
      localStorage.setItem('catch_conversations', 'some_big_data');
      
      writeValidated(key, schema, validData);

      // Should have cleared non-critical data
      expect(localStorage.getItem('catch_conversations')).toBeNull();
      spySet.mockRestore();
    });

    it('handles quota exceeded and subsequent failure', () => {
      const spySet = vi.spyOn(Storage.prototype, 'setItem');
      // Throw on every call
      spySet.mockImplementation(() => {
        throw { name: 'QuotaExceededError' };
      });

      const validData = { id: '789', count: 20 };
      writeValidated(key, schema, validData);

      // Should have hit the final catch block
      expect(localStorage.getItem(key)).toBeNull();
      spySet.mockRestore();
    });

    it('handles non-quota errors by rethrowing/logging', () => {
      const spySet = vi.spyOn(Storage.prototype, 'setItem');
      spySet.mockImplementationOnce(() => {
        throw new Error('Other error');
      });

      writeValidated(key, schema, { id: '1', count: 1 });
      expect(localStorage.getItem(key)).toBeNull();
      spySet.mockRestore();
    });

    it('handles null/undefined data by not writing', () => {
      writeValidated(key, schema, null as any);
      expect(localStorage.getItem(key)).toBeNull();
    });
  });
});
