import { z } from 'zod';

export const AI_FIELD_SCHEMA = z.object({
  key: z.string(),
  label: z.string(),
  value: z.string(),
  required: z.boolean().optional(),
});

export const AI_RESPONSE_SCHEMA = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  price: z.string().optional().default(''),
  categorySlug: z.string().optional().default(''),
  subcategorySlug: z.string().optional().default(''),
  city: z.string().optional(),
  year: z.string().optional(),
  make: z.string().optional(),
  missing: z.array(z.string()).optional().default([]),
  fields: z.array(AI_FIELD_SCHEMA).optional().default([]),
}).passthrough();

export async function withRetry<T>(fn: () => Promise<T>, attempts = 2): Promise<T> {
  let lastErr: unknown;
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (err) {
      lastErr = err;
      if (i < attempts - 1) {
        await new Promise((r) => setTimeout(r, 500));
      }
    }
  }
  throw lastErr;
}
