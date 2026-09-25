import { describe, it, expect } from 'vitest';
import { canRegister } from '../rules/canRegister';

describe('canRegister', () => {
  const validInput = {
    name: 'Ahmad',
    phone: '0791234567',
    countryCode: 'JO' as const,
    activeMarket: 'JO' as const,
  };

  it('allows valid Jordanian registration', () => {
    expect(canRegister(validInput).allowed).toBe(true);
  });

  it('rejects empty name', () => {
    const r = canRegister({ ...validInput, name: '' });
    expect(r.allowed).toBe(false);
    expect(r.reason).toBe('empty-name');
  });

  it('rejects name shorter than 2 chars', () => {
    const r = canRegister({ ...validInput, name: 'A' });
    expect(r.allowed).toBe(false);
    expect(r.reason).toBe('name-too-short');
  });

  it('rejects empty phone', () => {
    const r = canRegister({ ...validInput, phone: '' });
    expect(r.allowed).toBe(false);
    expect(r.reason).toBe('empty-phone');
  });

  it('rejects invalid Jordanian phone', () => {
    const r = canRegister({ ...validInput, phone: '0512345678' });
    expect(r.allowed).toBe(false);
    expect(r.reason).toBe('invalid-phone-format');
  });

  it('rejects market mismatch', () => {
    const r = canRegister({ ...validInput, countryCode: 'SA', phone: '0512345678' });
    expect(r.allowed).toBe(false);
    expect(r.reason).toBe('market-mismatch');
  });

  it('allows valid Saudi phone', () => {
    const r = canRegister({
      name: 'Sara',
      phone: '0512345678',
      countryCode: 'SA',
      activeMarket: 'SA',
    });
    expect(r.allowed).toBe(true);
  });
});
