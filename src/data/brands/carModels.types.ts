// ⚠️ RULE-14-EXCEPTION: Static type definition (config, capped at 500 lines)
export interface CarModel {
  readonly slug: string;
  readonly nameAr: string;
  readonly nameEn: string;
  readonly trims: readonly string[];
}
