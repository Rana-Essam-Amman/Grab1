import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { readValidated, writeValidated, removeStored } from '../safeStorage';
import { z } from 'zod';

class QuotaError extends Error {
  readonly code = 22;
  constructor(name: 'QuotaExceededError' | 'QuotaExceededError' = 'QuotaExceededError') {
    super('quota');
    this.name = name;
  }
}

describe('safeStorage', () => {
  const schema = z.object({
    id: z.string(),
    count: z.number(),
  });
  const strict = z.object({
    id: z.string().min(5),
    count: z.number().min(10),
  });

  const fallback = { id: 'default', count: 0 };
  const key = 'test_key';

  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('readValidated', () => {
    it('returns fallback when key is missing', () => {
      expect(readValidated(key, schema, fallback)).toEqual(fallback);
    });

    it('returns data when valid JSON matches schema', () => {
      const validData = { id: '123', count: 5 };
      localStorage.setItem(key, JSON.stringify(validData));
      expect(readValidated(key, schema, fallback)).toEqual(validData);
    });

    it('returns fallback when JSON is malformed', () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
      localStorage.setItem(key, 'not_json');
      expect(readValidated(key, schema, fallback)).toEqual(fallback);
      expect(warn).toHaveBeenCalled();
    });

    it('returns fallback when Zod validation fails', () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
      localStorage.setItem(key, JSON.stringify({ id: '123', count: 'wrong_type' }));
      expect(readValidated(key, schema, fallback)).toEqual(fallback);
      expect(warn).toHaveBeenCalled();
    });

    it('returns fallback when localStorage.getItem throws', () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
      vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
        throw new Error('read failed');
      });
      expect(readValidated(key, schema, fallback)).toEqual(fallback);
      expect(warn).toHaveBeenCalled();
    });

    it('returns fallback for an empty key', () => {
      expect(readValidated('', schema, fallback)).toEqual(fallback);
    });
  });

  describe('writeValidated', () => {
    it('writes valid data to localStorage', () => {
      const validData = { id: '456', count: 10 };
      writeValidated(key, schema, validData);
      expect(JSON.parse(localStorage.getItem(key) || '{}')).toEqual(validData);
    });

    it('does not write data that fails the schema', () => {
      const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);
      writeValidated(key, strict, { id: 'no', count: 1 });
      expect(localStorage.getItem(key)).toBeNull();
      expect(error).toHaveBeenCalled();
    });

    it('clears chat_conversations and retries after QuotaExceededError', () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
      localStorage.setItem('chat_conversations', 'stale');
      const spySet = vi.spyOn(Storage.prototype, 'setItem');
      spySet.mockImplementationOnce(() => {
        throw new QuotaError();
      });
      writeValidated(key, schema, { id: '789', count: 20 });
      expect(localStorage.getItem('chat_conversations')).toBeNull();
      expect(JSON.parse(localStorage.getItem(key) || '{}')).toEqual({ id: '789', count: 20 });
      expect(warn).toHaveBeenCalled();
    });

    it('treats DOMException code 22 as a quota error', () => {
      localStorage.setItem('chat_conversations', 'stale');
      const spySet = vi.spyOn(Storage.prototype, 'setItem');
      spySet.mockImplementationOnce(() => {
        const err = new QuotaError();
        Object.defineProperty(err, 'name', { value: 'NS_ERROR_DOM_QUOTA_REACHED' });
        throw err;
      });
      writeValidated(key, schema, { id: '789', count: 20 });
      expect(localStorage.getItem('chat_conversations')).toBeNull();
      expect(JSON.parse(localStorage.getItem(key) || '{}')).toEqual({ id: '789', count: 20 });
    });

    it('logs and skips when the quota retry also fails', () => {
      const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);
      vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new QuotaError();
      });
      writeValidated(key, schema, { id: '789', count: 20 });
      expect(localStorage.getItem(key)).toBeNull();
      expect(error).toHaveBeenCalled();
    });

    it('swallows a non-quota write error', () => {
      const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);
      vi.spyOn(Storage.prototype, 'setItem').mockImplementationOnce(() => {
        throw new Error('Other error');
      });
      writeValidated(key, schema, { id: '1', count: 1 });
      expect(localStorage.getItem(key)).toBeNull();
      expect(error).toHaveBeenCalled();
    });
  });

  describe('removeStored', () => {
    it('removes an existing key', () => {
      localStorage.setItem(key, 'something');
      removeStored(key);
      expect(localStorage.getItem(key)).toBeNull();
    });

    it('is a no-op when key does not exist', () => {
      expect(() => removeStored('nonexistent_key')).not.toThrow();
      expect(localStorage.getItem('nonexistent_key')).toBeNull();
    });

    it('handles empty string key gracefully', () => {
      expect(() => removeStored('')).not.toThrow();
    });

    it('swallows a removeItem failure', () => {
      const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);
      vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => {
        throw new Error('remove failed');
      });
      expect(() => removeStored(key)).not.toThrow();
      expect(error).toHaveBeenCalled();
    });
  });

  describe('readValidated edge cases', () => {
    it('handles array schema correctly', () => {
      const arrSchema = z.array(z.string());
      localStorage.setItem(key, JSON.stringify(['a', 'b', 'c']));
      expect(readValidated(key, arrSchema, [])).toEqual(['a', 'b', 'c']);
    });

    it('falls back when stored value is empty string', () => {
      localStorage.setItem(key, '');
      expect(readValidated(key, schema, fallback)).toEqual(fallback);
    });
  });
});
