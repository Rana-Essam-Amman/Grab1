import { describe, it, expect } from 'vitest';
import { cn } from '../cn';

describe('cn utility', () => {
  it('merges simple classes', () => {
    expect(cn('class1', 'class2')).toBe('class1 class2');
  });

  it('handles conditional classes', () => {
    // eslint-disable-next-line no-constant-binary-expression -- intentionally testing falsy value handling
    expect(cn('class1', true && 'class2', false && 'class3')).toBe('class1 class2');
  });

  it('handles undefined/null/empty', () => {
    expect(cn('class1', undefined, null, '', 'class2')).toBe('class1 class2');
  });

  it('resolves tailwind-merge conflicts', () => {
    expect(cn('p-2', 'p-4')).toBe('p-4');
  });

  it('resolves multiple conflicts correctly', () => {
    expect(cn('text-sm p-2', 'p-4 text-lg')).toBe('p-4 text-lg');
  });

  it('handles nested arrays', () => {
    expect(cn(['c1', 'c2'], 'c3')).toBe('c1 c2 c3');
  });
});
