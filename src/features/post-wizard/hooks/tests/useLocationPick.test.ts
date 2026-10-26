import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useLocationPick } from '../useLocationPick';
import { useDraftStore } from '../../store/draft.slice';
import { useUIStore } from '@/store/ui.slice';

describe('useLocationPick', () => {
  beforeEach(() => {
    useDraftStore.setState({
      postDraft: {
        categorySlug: 'motors', subcategorySlug: 'cars', photos: [],
        city: 'العاصمة', neighborhood: 'خلدا', site: '', noteText: '',
      },
    });
    useUIStore.setState({ isArabic: true, browseCountryCode: 'JO', currentScreen: 'post-location', screenHistory: ['main', 'post-location'] });
  });

  it('exposes cities list from browseCountryCode', () => {
    const { result } = renderHook(() => useLocationPick());
    expect(Array.isArray(result.current.cities)).toBe(true);
    expect(result.current.cities.length).toBeGreaterThan(0);
  });

  it('handleCityChange updates neighborhood and resets custom fields', () => {
    const { result } = renderHook(() => useLocationPick());
    const nextCity = result.current.cities[1] || result.current.cities[0];
    
    act(() => {
      result.current.handleCityChange(nextCity);
    });
    
    // The city changed
    expect(result.current.selectedCity).toBe(nextCity);
    // The neighborhood was reset to "Other" (safe default until user picks)
    expect(result.current.selectedNeighborhood).toBe('أخرى');
    // Custom fields were cleared
    expect(result.current.customCity).toBe('');
    expect(result.current.customNeighborhood).toBe('');
  });

  it('saveAndContinue writes city/neighborhood/site to draft (standard flow)', () => {
    const { result } = renderHook(() => useLocationPick());
    
    act(() => {
      result.current.handleSiteChange('Near City Mall');
    });
    act(() => {
      result.current.saveAndContinue();
    });
    
    const draft = useDraftStore.getState().postDraft;
    expect(draft.site).toBe('Near City Mall');
    // The hook syncs the draft city with the selected city
    expect(draft.city).toBe(result.current.selectedCity);
    expect(draft.city).toBe('العاصمة');
  });

  it('saveAndContinue handles custom city correctly (Other flow - back navigation)', () => {
    // Simulate: user previously entered a custom city, went back to location screen
    const fakeCity = 'مدينة_وهمية_للامتحان';
    const fakeNeighborhood = 'حي_وهمي_للامتحان';
    
    useDraftStore.setState({
      postDraft: {
        categorySlug: 'motors', subcategorySlug: 'cars', photos: [],
        city: fakeCity, neighborhood: fakeNeighborhood, site: '', noteText: '',
      },
    });
    
    const { result } = renderHook(() => useLocationPick());
    
    // The hook detects the saved city is not in the standard list, so it:
    // 1. Sets selectedCity to "Other" (so the custom input is visible)
    // 2. Pre-fills customCity with the saved value (so user can see and edit it)
    expect(result.current.selectedCity).toBe('أخرى');
    expect(result.current.customCity).toBe(fakeCity);
    expect(result.current.selectedNeighborhood).toBe('أخرى');
    expect(result.current.customNeighborhood).toBe(fakeNeighborhood);
    
    // When saving again, the custom values are preserved (not lost, not replaced by "أخرى")
    act(() => {
      result.current.saveAndContinue();
    });
    
    const draft = useDraftStore.getState().postDraft;
    expect(draft.city).toBe(fakeCity);
    expect(draft.neighborhood).toBe(fakeNeighborhood);
  });

  it('saveAndContinue uses custom text when user selects Other and types', () => {
    const { result } = renderHook(() => useLocationPick());
    const fakeCity = 'مدينة_مخصصة_جديدة';
    
    // Simulate user experience: selects "Other" from cities, then types in the custom input
    act(() => {
      result.current.handleCityChange('أخرى');
    });
    act(() => {
      result.current.setCustomCity(fakeCity);
    });
    act(() => {
      result.current.saveAndContinue();
    });
    
    const draft = useDraftStore.getState().postDraft;
    expect(draft.city).toBe(fakeCity);
  });
});
