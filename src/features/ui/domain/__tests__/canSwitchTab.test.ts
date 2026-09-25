import { describe, it, expect } from 'vitest';
import { canSwitchTab, getInitialsForTab, ALL_TABS } from '../rules/canSwitchTab';

describe('canSwitchTab', () => {
  it('accepts all valid tabs', () => {
    ALL_TABS.forEach((tab) => {
      expect(canSwitchTab(tab)).toBe(true);
    });
  });

  it('rejects invalid tab', () => {
    expect(canSwitchTab('invalid')).toBe(false);
  });

  it('rejects empty string', () => {
    expect(canSwitchTab('')).toBe(false);
  });
});

describe('getInitialsForTab', () => {
  it('returns Arabic label for explore', () => {
    expect(getInitialsForTab('explore', 'ar')).toBe('استكشف');
  });

  it('returns English label for explore', () => {
    expect(getInitialsForTab('explore', 'en')).toBe('Explore');
  });

  it('returns correct post-ad label', () => {
    expect(getInitialsForTab('post', 'ar')).toBe('أضف إعلان');
    expect(getInitialsForTab('post', 'en')).toBe('Post Ad');
  });

  it('returns correct profile label', () => {
    expect(getInitialsForTab('profile', 'ar')).toBe('حسابي');
    expect(getInitialsForTab('profile', 'en')).toBe('Profile');
  });
});
