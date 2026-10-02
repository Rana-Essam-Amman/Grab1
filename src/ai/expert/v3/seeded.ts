import { createHash } from 'crypto';

export function sha256(input: string): string {
  return createHash('sha256').update(input, 'utf8').digest('hex');
}

export function seedOf(userId: string, draft: string, version: string): number {
  return Number.parseInt(sha256(`${userId}|${normalizeDraft(draft)}|${version}`).slice(0, 8), 16);
}

export function advance(seed: number, attempt: number): number {
  return Number.parseInt(sha256(`${seed}:${attempt}`).slice(0, 8), 16);
}

export function normalizeDraft(draft: string): string {
  return draft.replace(/\s+/g, ' ').trim();
}

export function pick<T>(seed: number, items: readonly T[], salt: number): T {
  return items[(seed + salt) % items.length];
}
