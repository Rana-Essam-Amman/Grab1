import { describe, it, expect, beforeEach } from 'vitest';
import { useUIStore } from '../ui.slice';

describe('location slug reset', () => {
  beforeEach(() => {
    useUIStore.setState({
      browseGovernorateSlug: 'amman',
      browseDistrictSlug: 'marka',
      neighborhoodSlugFilter: 'wadi',
      neighborhoodFilter: 'Wadi',
    });
  });

  it('clears labels and slugs on market change', () => {
    useUIStore.getState().setBrowseMarketOverrideLocal('SA');
    const state = useUIStore.getState();
    expect(state.browseCountryCode).toBe('SA');
    expect(state.neighborhoodFilter).toBeNull();
    expect(state.browseGovernorateSlug).toBeNull();
    expect(state.browseDistrictSlug).toBeNull();
    expect(state.neighborhoodSlugFilter).toBeNull();
  });
});
