import type { CategoryMatch } from './categoryMatch';

export interface VisionHints {
  color?: string;
  body?: string;
  conditionLook?: string;
}

export interface ListingFacts {
  readonly [key: string]: string | boolean | undefined;
  // Well-known car fields (kept for backwards compat)
  make?: string;
  year?: string;
  price?: string;
  city?: string;
  km?: string;
  inspect?: boolean;
  negotiable?: boolean;
  color?: string;
  body?: string;
}

export interface ListingCopyResult {
  title: string;
  body: string;
  facts: ListingFacts;
  missing: string[];
}

export interface GeneratedListing {
  title: string;
  description: string;
  price: string;
  categorySlug: string;
  subcategorySlug: string;
  city?: string;
  lat?: number;
  lng?: number;
  year?: string;
  make?: string;
  missing: string[];
  categoryMatch?: CategoryMatch;
  readonly fields?: readonly {
    readonly key: string;
    readonly label: string;
    readonly value: string;
    readonly required?: boolean;
  }[];
}
