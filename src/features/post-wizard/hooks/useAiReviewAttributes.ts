import { useMemo } from 'react';
import { getListingFields } from '@/data/listingFields';

export interface RawField {
  readonly key: string;
  readonly label: string;
  readonly value: string;
  readonly required?: boolean;
}

export interface AttributeWithOptions extends RawField {
  readonly type?: 'text' | 'number' | 'select' | 'textarea';
  readonly options?: readonly string[];
  readonly required?: boolean;
}

export function useAiReviewAttributes(
  categorySlug: string,
  rawFields: readonly RawField[],
  isArabic: boolean,
  subcategorySlug?: string
): readonly AttributeWithOptions[] {
  return useMemo(() => {
    const schema = getListingFields(categorySlug, subcategorySlug);
    const schemaMap = new Map(schema.map((f) => [f.key, f]));

    if (rawFields && rawFields.length > 0) {
      return rawFields.map((f) => {
        const sf = schemaMap.get(f.key);
        const mappedType = sf?.type === 'number' ? 'number' : sf?.type === 'select' ? 'select' : 'text';
        return {
          key: f.key,
          label: f.label || (sf ? (isArabic ? sf.labelAr : sf.labelEn) : f.key),
          value: f.value || '',
          type: mappedType,
          options: sf?.options ? sf.options.map((o) => (isArabic ? o.labelAr : o.labelEn)) : [],
          required: sf?.required ?? f.required ?? false,
        };
      });
    }

    return schema.map((f) => {
      const mappedType = f.type === 'number' ? 'number' : f.type === 'select' ? 'select' : 'text';
      return {
        key: f.key,
        label: isArabic ? f.labelAr : f.labelEn,
        value: '',
        type: mappedType,
        options: f.options ? f.options.map((o) => (isArabic ? o.labelAr : o.labelEn)) : [],
        required: f.required,
      };
    });
  }, [categorySlug, subcategorySlug, rawFields, isArabic]);
}
