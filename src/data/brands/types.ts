export interface Brand {
  readonly id: string;
  readonly name: string;
  readonly nameAr: string;
  readonly en: string; // compatibility
  readonly ar: string; // compatibility
  readonly models: readonly (readonly [string, string])[]; // [ar, en]
}

export type BrandDef = Brand;
