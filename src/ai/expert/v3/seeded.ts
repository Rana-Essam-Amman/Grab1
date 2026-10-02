function fnv(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function seedOf(userId: string, draft: string, version: string): number {
  return fnv(`${userId}|${normalizeDraft(draft)}|${version}`);
}

export function advance(seed: number, attempt: number): number {
  return fnv(`${seed}:${attempt}`);
}

export function normalizeDraft(draft: string): string {
  return draft.replace(/\s+/g, ' ').trim();
}

export function pick<T>(seed: number, items: readonly T[], salt: number): T {
  return items[(seed + salt) % items.length];
}
