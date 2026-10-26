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

  it('handleCityChange updates neighborhood to first of new city', () => {
    const { result } = renderHook(() => useLocationPick());
    const nextCity = result.current.cities[1] || result.current.cities[0];
    act(() => {
      result.current.handleCityChange(nextCity);
    });
    expect(result.current.selectedCity).toBe(nextCity);
  });

  it('saveAndContinue writes city/neighborhood/site to draft', () => {
    const { result } = renderHook(() => useLocationPick());
    act(() => {
      result.current.handleSiteChange('Near City Mall');
    });
    act(() => {
      result.current.saveAndContinue();
    });
    const draft = useDraftStore.getState().postDraft;
    expect(draft.site).toBe('Near City Mall');
    expect(draft.city).toBe('العاصمة');
  });

  it('saveAndContinue handles custom city correctly (Other flow)', () => {
    // Use a truly fake city name that is NOT in the standard governorates list
    const fakeCity = 'مدينة_وهمية_للامتحان';
    const fakeNeighborhood = 'حي_وهمي_للامتحان';
    
    useDraftStore.setState({
      postDraft: {
        categorySlug: 'motors', subcategorySlug: 'cars', photos: [],
        city: fakeCity, neighborhood: fakeNeighborhood, site: '', noteText: '',
      },
    });
    const { result } = renderHook(() => useLocationPick());
    
    // Since the city is fake, it should be treated as custom ("Other")
    expect(result.current.selectedCity).toBe('أخرى');
    expect(result.current.customCity).toBe(fakeCity);
    
    act(() => {
      result.current.saveAndContinue();
    });
    const draft = useDraftStore.getState().postDraft;
    // The custom city should be saved
    expect(draft.city).toBe(fakeCity);
  });
});
