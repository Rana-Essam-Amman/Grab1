import { createHash } from 'crypto';
import { normalize } from './normalize';

export function fingerprint(title: string, description: string): string {
  return createHash('sha256').update(normalize(`${title}\n${description}`), 'utf8').digest('hex');
}
