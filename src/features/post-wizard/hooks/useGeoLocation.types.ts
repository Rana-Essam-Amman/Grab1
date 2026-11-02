import { GeoMatch } from '../helpers/geoMatch';
import { CanonicalLocation } from '@/shared/lib/geo';

export type GeoStatus = 'idle' | 'loading' | 'success' | 'denied' | 'unavailable' | 'error';

export interface UseGeoLocationReturn {
  readonly status: GeoStatus;
  readonly match: GeoMatch | null;
  readonly canonicalLocation: CanonicalLocation | null;
  readonly deviceLat: number | null;
  readonly deviceLng: number | null;
  readonly candidates: readonly string[];
  readonly error: string | null;
  readonly requestId: number;
  readonly request: () => void;
  readonly reset: () => void;
}
