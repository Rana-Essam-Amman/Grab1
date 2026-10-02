import { normalize } from './normalize';
import { sha256 } from './seeded';

export function fingerprint(title: string, description: string): string {
  return sha256(normalize(`${title}\n${description}`));
}
