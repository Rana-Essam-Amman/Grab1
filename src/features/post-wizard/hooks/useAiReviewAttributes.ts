import { useMemo } from 'react';
import { getBrandOptions, getModelOptions } from '@/data/brands';

interface RawField {
  readonly key: string;
  readonly label: string;
  readonly value: string;
  readonly required?: boolean;
}

export interface AttributeWithOptions extends RawField {
  readonly type?: 'text' | 'number' | 'select' | 'textarea';
  readonly options?: readonly string[];
}

export function useAiReviewAttributes(
  categorySlug: string,
  rawFields: readonly RawField[],
  isArabic: boolean
): readonly AttributeWithOptions[] {
  const currentBrand =
    rawFields.find((a) => a.key === 'make')?.value ||
    rawFields.find((a) => a.key === 'brand')?.value ||
    rawFields.find((a) => a.key === 'carMake')?.value ||
    '';

  const brandOptions = useMemo(
    () => getBrandOptions(categorySlug, isArabic),
    [categorySlug, isArabic]
  );
  const modelOptions = useMemo(
    () => currentBrand ? getModelOptions(categorySlug, currentBrand, isArabic) : [],
    [categorySlug, currentBrand, isArabic]
  );

  return useMemo(() => {
    return rawFields.map((f) => {
      if (f.key === 'make' || f.key === 'brand' || f.key === 'carMake') {
        // Category has brand catalog → dropdown; otherwise → free text
        return brandOptions.length > 0
          ? { ...f, type: 'select' as const, options: brandOptions }
          : { ...f, type: 'text' as const };
      }
      if (f.key === 'model') {
        // Free text when: no brand yet, brand is "أخرى", or brand has no models
        if (!currentBrand || currentBrand === 'أخرى' || currentBrand === 'Other' || modelOptions.length === 0) {
          return { ...f, type: 'text' as const };
        }
        return { ...f, type: 'select' as const, options: modelOptions };
      }
      return f;
    });
  }, [rawFields, brandOptions, modelOptions, currentBrand]);
}
