import { describe, it, expect, beforeEach, vi } from 'vitest';
import { LocalStorageAuthAdapter } from '../LocalStorageAuthAdapter';

describe('LocalStorageAuthAdapter', () => {
  let adapter: LocalStorageAuthAdapter;
  let storage: Record<string, string>;

  beforeEach(() => {
    storage = {};
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(
      (key: string) => storage[key] ?? null,
    );
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(
      (key: string, value: string) => { storage[key] = value; },
    );
    vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(
      (key: string) => { delete storage[key]; },
    );
    adapter = new LocalStorageAuthAdapter();
  });

  it('returns null when no session exists', async () => {
    const session = await adapter.getCurrentSession();
    expect(session).toBeNull();
  });

  it('registers a new user successfully', async () => {
    const session = await adapter.register({
      name: 'Ahmad',
      phone: '0791234567',
      countryCode: 'JO',
      password: 'secret',
    });
    expect(session.user.name).toBe('Ahmad');
    expect(session.user.phone).toBe('0791234567');
    expect(session.token).toBeDefined();
  });

  it('rejects registration with duplicate phone', async () => {
    await adapter.register({
      name: 'Ahmad', phone: '0791234567', countryCode: 'JO', password: 'secret',
    });
    await expect(
      adapter.register({
        name: 'Sara', phone: '0791234567', countryCode: 'JO', password: 'other',
      }),
    ).rejects.toThrow('user-already-exists');
  });

  it('logs in with correct credentials', async () => {
    await adapter.register({
      name: 'Ahmad', phone: '0791234567', countryCode: 'JO', password: 'secret',
    });
    await adapter.logout();
    const session = await adapter.login({ phone: '0791234567', password: 'secret' });
    expect(session.user.name).toBe('Ahmad');
  });

  it('rejects login with wrong password', async () => {
    await adapter.register({
      name: 'Ahmad', phone: '0791234567', countryCode: 'JO', password: 'secret',
    });
    await expect(
      adapter.login({ phone: '0791234567', password: 'wrong' }),
    ).rejects.toThrow('invalid-credentials');
  });

  it('clears session on logout', async () => {
    await adapter.register({
      name: 'Ahmad', phone: '0791234567', countryCode: 'JO', password: 'secret',
    });
    await adapter.logout();
    const session = await adapter.getCurrentSession();
    expect(session).toBeNull();
  });

  it('updates profile name', async () => {
    await adapter.register({
      name: 'Ahmad', phone: '0791234567', countryCode: 'JO', password: 'secret',
    });
    const updated = await adapter.updateProfile({ name: 'Ahmad Updated' });
    expect(updated.name).toBe('Ahmad Updated');
  });

  it('throws on updateProfile without session', async () => {
    await expect(adapter.updateProfile({ name: 'X' })).rejects.toThrow('no-session');
  });
});
