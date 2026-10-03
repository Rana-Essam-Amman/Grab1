import { useMemo } from 'react';
import { getListingFields } from '@/data/listingFields';

export interface RawField {
  readonly key: string;
  readonly label: string;
  readonly value: string;
  readonly required?: boolean;
}

export interface AttributeWithOptions extends RawField {
  readonly type?: 'text' | 'number' | 'select' | 'textarea' | 'boolean' | 'cascading-model';
  readonly options?: readonly string[];
  readonly required?: boolean;
  readonly custom?: boolean;
  readonly dependsOn?: string;
}

export function useAiReviewAttributes(
  categorySlug: string,
  rawFields: readonly RawField[],
  isArabic: boolean,
  subcategorySlug?: string
): readonly (AttributeWithOptions & { type?: 'text' | 'number' | 'select' | 'textarea' })[] {
  return useMemo(() => {
    const schema = getListingFields(categorySlug, subcategorySlug);
    const schemaMap = new Map(schema.map((f) => [f.key, f]));

    if (rawFields && rawFields.length > 0) {
      return rawFields.map((f) => {
        const sf = schemaMap.get(f.key);
        const mappedType =
          sf?.type === 'number' ? 'number'
          : sf?.type === 'select' ? 'select'
          : sf?.type === 'cascading-model' ? 'cascading-model'
          : 'text';
        const displayOptions = sf?.options ? sf.options.map((o) => (isArabic ? o.labelAr : o.labelEn)) : [];
        const isCustom = Boolean(
          f.value &&
            f.value.trim() &&
            sf?.type === 'select' &&
            sf?.options &&
            !sf.options.some(
              (o) => o.value === f.value || o.labelAr === f.value || o.labelEn === f.value
            )
        );

        return {
          key: f.key,
          label: f.label || (sf ? (isArabic ? sf.labelAr : sf.labelEn) : f.key),
          value: f.value || '',
          type: mappedType,
          options: displayOptions,
          required: sf?.required ?? f.required ?? false,
          custom: isCustom,
          dependsOn: sf?.dependsOn,
        };
      });
    }

    return schema.map((f) => {
      const mappedType =
        f.type === 'number' ? 'number'
        : f.type === 'select' ? 'select'
        : f.type === 'cascading-model' ? 'cascading-model'
        : 'text';
      return {
        key: f.key,
        label: isArabic ? f.labelAr : f.labelEn,
        value: '',
        type: mappedType,
        options: f.options ? f.options.map((o) => (isArabic ? o.labelAr : o.labelEn)) : [],
        required: f.required,
        custom: false,
        dependsOn: f.dependsOn,
      };
    });
  }, [categorySlug, subcategorySlug, rawFields, isArabic]) as unknown as readonly (AttributeWithOptions & { type?: 'text' | 'number' | 'select' | 'textarea' })[];
}
