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
    
    expect(result.current.selectedCity).toBe(nextCity);
    expect(result.current.selectedNeighborhood).toBe('أخرى');
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
    expect(draft.city).toBe(result.current.selectedCity);
    expect(draft.city).toBe('العاصمة');
  });

  it('saveAndContinue handles custom city correctly (Other flow - back navigation)', () => {
    const fakeCity = 'مدينة_وهمية_للامتحان';
    const fakeNeighborhood = 'حي_وهمي_للامتحان';
    
    useDraftStore.setState({
      postDraft: {
        categorySlug: 'motors', subcategorySlug: 'cars', photos: [],
        city: fakeCity, neighborhood: fakeNeighborhood, site: '', noteText: '',
      },
    });
    
    const { result } = renderHook(() => useLocationPick());
    
    expect(result.current.selectedCity).toBe('أخرى');
    expect(result.current.customCity).toBe(fakeCity);
    expect(result.current.selectedNeighborhood).toBe('أخرى');
    expect(result.current.customNeighborhood).toBe(fakeNeighborhood);
    
    act(() => {
      result.current.saveAndContinue();
    });
    
    const draft = useDraftStore.getState().postDraft;
    expect(draft.city).toBe(fakeCity);
    expect(draft.neighborhood).toBe(fakeNeighborhood);
  });

  it('saveAndContinue BLOCKS save when city is Other but custom text is missing', () => {
    // Real-world test: user selects "Other" but forgets to type the custom city name.
    // The validation must block save and NOT write garbage to the draft.
    const { result } = renderHook(() => useLocationPick());
    
    act(() => {
      result.current.handleCityChange('أخرى');
    });
    
    // customCity is empty, customNeighborhood is empty → validation should fail
    expect(result.current.canContinue).toBe(false);
    expect(result.current.validationError).not.toBeNull();
    
    act(() => {
      result.current.saveAndContinue();
    });
    
    // Draft should NOT be updated (still the original value)
    const draft = useDraftStore.getState().postDraft;
    expect(draft.city).toBe('العاصمة');
  });

  it('saveAndContinue BLOCKS save when user selects Other with unresolved custom text', () => {
    const { result } = renderHook(() => useLocationPick());
    act(() => {
      result.current.handleCityChange('أخرى');
      result.current.setCustomCity('مدينة_مخصصة_جديدة');
      result.current.handleNeighborhoodChange('أخرى');
      result.current.setCustomNeighborhood('منطقة_مخصصة_جديدة');
    });

    const draftBefore = useDraftStore.getState().postDraft;
    const cityBefore = draftBefore.city;

    act(() => {
      result.current.saveAndContinue();
    });

    const draftAfter = useDraftStore.getState().postDraft;
    expect(draftAfter.city).toBe(cityBefore);
    expect(draftAfter.citySlug).toBeUndefined();
    expect(draftAfter.districtSlug).toBeUndefined();
  });
});
