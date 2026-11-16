
export interface CreateListingInput {
  readonly title: string;
  readonly description: string;
  readonly price: string;
  readonly currency: string;
  readonly countryCode: "JO" | "LB" | "PS" | "SY" | "SA" | "KW";
  readonly city: string;
  readonly neighborhood?: string;
  readonly neighborhoodName?: string;
  readonly citySlug?: string;
  readonly districtSlug?: string;
  readonly neighborhoodSlug?: string;
  readonly categorySlug: string;
  readonly subcategorySlug?: string;
  readonly images: string[];
  readonly imageWidth?: number;
  readonly imageHeight?: number;
  readonly attributes?: Array<{ key?: string; label: string; value: string }>;
  readonly sellerName?: string;
  readonly sellerPhone?: string;
}
