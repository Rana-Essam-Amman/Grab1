import type { MarketCode } from './geo.types';
import type { CanonicalIdentitySlot } from '@/data/locations/types';

/**
 * Full parent path for a matched catalog entity.
 * Presentation labels are not treated as official administrative facts.
 */
export interface LocationParentPath {
  readonly citySlug: string | null;
  readonly cityEn: string | null;
  readonly cityAr: string | null;
  readonly districtSlug: string | null;
  readonly districtEn: string | null;
  readonly districtAr: string | null;
}

/**
 * Structured location candidate with exact persisted identity slots.
 * A district result never places its district slug in citySlug.
 * A neighborhood result preserves both city and district parents.
 */
export interface CanonicalLocationCandidate {
  readonly marketCode: MarketCode;
  readonly nameEn: string;
  readonly nameAr: string;
  readonly slug: string;
  readonly levelIndex: number;
  readonly canonicalSlot: CanonicalIdentitySlot;
  readonly citySlug: string | null;
  readonly districtSlug: string | null;
  readonly neighborhoodSlug: string | null;
  readonly parentPath: LocationParentPath;
}

export type ResolutionStatus = 'unique' | 'ambiguous' | 'none';

export interface ParentContext {
  readonly citySlug?: string;
  readonly districtSlug?: string;
}

export interface LocationSearchResult {
  readonly marketCode: string;
  readonly status: ResolutionStatus;
  readonly confidence: 'exact' | 'high' | 'approximate' | 'unresolved' | 'none';
  readonly candidates: readonly CanonicalLocationCandidate[];
  readonly resolved: CanonicalLocationCandidate | null;
}
