import { normalize } from './normalize';

export function fingerprint(title: string, description: string): string {
  const folded = normalize(`${title}\n${description}`);
  let h = 2166136261;
  for (let i = 0; i < folded.length; i++) {
    h ^= folded.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0).toString(16).padStart(8, '0');
}
