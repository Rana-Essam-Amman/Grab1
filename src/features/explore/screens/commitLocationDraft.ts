import type { MarketCode } from '@/shared/lib/marketGate';
import { useUIStore } from '@/store/ui.slice';

export interface LocationCommit {
  readonly countryCode: MarketCode;
  readonly city: string;
  readonly governorateSlug: string | null;
  readonly districtSlug: string | null;
  readonly neighborhoodSlug: string | null;
}

export function commitLocationDraft(draft: LocationCommit): void {
  useUIStore.getState().setBrowseLocation(draft.countryCode, draft.city, draft.city);
  useUIStore.setState({
    browseGovernorateSlug: draft.governorateSlug,
    browseDistrictSlug: draft.districtSlug,
    neighborhoodSlugFilter: draft.neighborhoodSlug,
  });
}
