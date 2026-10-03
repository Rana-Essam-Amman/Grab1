export interface Facts {
  readonly subject: string;
  readonly intent: string;
  readonly place?: string;
  readonly city?: string;
  readonly district?: string;
  readonly lat?: number;
  readonly lng?: number;
  readonly area?: string;
  readonly rooms?: string;
  readonly bathrooms?: string;
  readonly floor?: string;
  readonly balcony?: boolean;
  readonly living?: boolean;
  readonly year?: string;
  readonly km?: string;
  readonly storage?: string;
  readonly price?: string;
  readonly priceLabel?: string;
  readonly extras: readonly string[];
  readonly traced: readonly string[];
}

export interface Listing {
  readonly title: string;
  readonly description: string;
  readonly planId: 'prose' | 'compact' | 'minimal';
  readonly seed: number;
  readonly fingerprint: string;
  readonly facts: Facts;
}

export interface GenerateInput {
  readonly userId: string;
  readonly draft: string;
  readonly categorySlug: string;
  readonly subcategorySlug: string;
  readonly market?: string;
}
