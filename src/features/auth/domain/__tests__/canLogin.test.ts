import { describe, it, expect } from 'vitest';
import { canLogin } from '../rules/canLogin';

describe('canLogin', () => {
  it('allows valid credentials shape', () => {
    expect(canLogin({ phone: '0791234567', password: 'secret' }).allowed).toBe(true);
  });

  it('rejects empty phone', () => {
    const r = canLogin({ phone: '', password: 'secret' });
    expect(r.allowed).toBe(false);
    expect(r.reason).toBe('empty-phone');
  });

  it('rejects empty password', () => {
    const r = canLogin({ phone: '0791234567', password: '' });
    expect(r.allowed).toBe(false);
    expect(r.reason).toBe('empty-password');
  });

  it('rejects whitespace-only phone', () => {
    const r = canLogin({ phone: '   ', password: 'secret' });
    expect(r.allowed).toBe(false);
    expect(r.reason).toBe('empty-phone');
  });
});
