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
  const brandKey = categorySlug === 'motors' ? 'make' : 'brand';
  const currentBrand = rawFields.find((a) => a.key === brandKey)?.value || '';

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
      if (f.key === 'make' || f.key === 'brand') {
        return { ...f, type: 'select' as const, options: brandOptions };
      }
      if (f.key === 'model') {
        return { ...f, type: 'select' as const, options: modelOptions };
      }
      return f;
    });
  }, [rawFields, brandOptions, modelOptions]);
}
