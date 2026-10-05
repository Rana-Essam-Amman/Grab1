import { describe, it, expect } from 'vitest';
import { phoneticKey } from '../phoneticKey';

describe('phoneticKey', () => {
  const cases: Array<[string, string]> = [
    ['عبدون', 'Abdoun'],
    ['عبدون', 'Abdoon'],
    ['عبدون', 'abdun'],
    ['دابوق', 'Dabouq'],
    ['دابوق', 'Dabouk'],
    ['رولكس', 'Rolex'],
    ['رولكس', 'ROLEX'],
    ['الجبيهة', 'Jubeiha'],
    ['الجبيهة', 'jubaiha'],
    ['فيلا', 'villa'],
    ['فيلا', 'Villa'],
    ['شقة', 'shaqa'],
    ['محمد', 'Mohammed'],
    ['محمد', 'Muhammad'],
  ];

  it.each(cases)('"%s" and "%s" produce identical keys', (a, b) => {
    expect(phoneticKey(a)).toBe(phoneticKey(b));
    expect(phoneticKey(a).length).toBeGreaterThan(0);
  });

  it('returns empty string for empty input', () => {
    expect(phoneticKey('')).toBe('');
  });

  it('produces pure consonant skeleton (no vowels)', () => {
    expect(phoneticKey('Abdoun')).toBe('bdn');
    expect(phoneticKey('عبدون')).toBe('bdn');
    expect(phoneticKey('Rolex')).toBe('rlks');
    expect(phoneticKey('رولكس')).toBe('rlks');
  });
});
