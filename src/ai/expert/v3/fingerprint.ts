import { sha256 as nobleSha256 } from '@noble/hashes/sha2.js';
import { bytesToHex, utf8ToBytes } from '@noble/hashes/utils.js';
import { normalize } from './normalize';

function sha256(input: string): string {
  return bytesToHex(nobleSha256(utf8ToBytes(input)));
}

export function fingerprint(title: string, description: string): string {
  return sha256(normalize(`${title}\n${description}`));
}
