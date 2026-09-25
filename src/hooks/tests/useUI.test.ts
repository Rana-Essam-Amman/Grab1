import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useUI } from '../useUI';
import { useUIStore } from '@/store/ui.slice';

describe('useUI', () => {
  beforeEach(() => {
    useUIStore.setState({
      locale: 'ar',
      isArabic: true,
      currentScreen: 'main',
      activeTab: 'explore',
      screenHistory: ['main'],
      browseCountryCode: 'JO',
      activeCurrency: 'JOD',
    });
  });

  it('exposes locale + isArabic from the store', () => {
    const { result } = renderHook(() => useUI());
    expect(result.current.locale).toBe('ar');
    expect(result.current.isArabic).toBe(true);
  });

  it('navigateTo pushes screen onto history', () => {
    const { result } = renderHook(() => useUI());
    act(() => {
      result.current.navigateTo('listing-detail');
    });
    expect(result.current.currentScreen).toBe('listing-detail');
    expect(result.current.screenHistory).toContain('listing-detail');
  });

  it('goBack pops to previous screen when history has >1 entries', () => {
    useUIStore.setState({ currentScreen: 'listing-detail', screenHistory: ['main', 'listing-detail'] });
    const { result } = renderHook(() => useUI());
    act(() => {
      result.current.goBack();
    });
    expect(result.current.currentScreen).toBe('main');
  });

  it('goBack is a no-op when history has 1 entry', () => {
    useUIStore.setState({ currentScreen: 'main', screenHistory: ['main'] });
    const { result } = renderHook(() => useUI());
    act(() => {
      result.current.goBack();
    });
    expect(result.current.currentScreen).toBe('main');
  });

  it('setLocale toggles isArabic', () => {
    const { result } = renderHook(() => useUI());
    act(() => {
      result.current.setLocale('en');
    });
    expect(result.current.locale).toBe('en');
    expect(result.current.isArabic).toBe(false);
  });

  it('setBrowseLocation updates country + city', () => {
    const { result } = renderHook(() => useUI());
    act(() => {
      result.current.setBrowseLocation('SA', 'Riyadh', 'الرياض');
    });
    expect(result.current.browseCountryCode).toBe('SA');
    expect(result.current.browseCityEn).toBe('Riyadh');
  });
});
