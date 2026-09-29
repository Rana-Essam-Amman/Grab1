import { getFieldsForListing } from '@/data/subcategoryFields';
import { getBrandOptions, getModelOptions } from '@/data/brands';
import type { CategoryFieldDef } from '@/data/categoryFields';
import type { PostDraft, UserProfile, Listing } from '@/types';
import { buildNewListingPayload } from './buildNewListingPayload';

export interface ResolveFieldsParams {
  readonly categorySlug: string;
  readonly subcategorySlug: string;
  readonly values: Record<string, string>;
  readonly isArabic: boolean;
}

export function resolvePostDetailsFields(params: ResolveFieldsParams): readonly CategoryFieldDef[] {
  const { categorySlug, subcategorySlug, values, isArabic } = params;
  const cBrand = values.make || values.brand || values.carMake || '';
  const bOpts = getBrandOptions(categorySlug, isArabic);
  const mOpts = cBrand ? getModelOptions(categorySlug, cBrand, isArabic) : [];

  return getFieldsForListing(categorySlug, subcategorySlug).map(f => {
    if (f.key === 'make' || f.key === 'brand' || f.key === 'carMake') {
      return bOpts.length > 0
        ? { ...f, type: 'select' as const, options: bOpts }
        : { ...f, type: 'text' as const };
    }
    if (f.key === 'model') {
      if (!cBrand || cBrand === 'أخرى' || cBrand === 'Other' || mOpts.length === 0) {
        return { ...f, type: 'text' as const };
      }
      return { ...f, type: 'select' as const, options: mOpts };
    }
    return f;
  });
}

export function buildGeneratedFields(
  fields: readonly CategoryFieldDef[],
  values: Record<string, string>,
  isArabic: boolean
) {
  return fields.map(f => {
    const v = (values[f.key] || '').trim();
    const custom = (values[`${f.key}_custom`] || '').trim();
    const isOther = v === 'أخرى' || v === 'Other';
    return {
      key: f.key,
      label: isArabic ? f.labelAr : f.labelEn,
      value: (f.type === 'select' && isOther && custom) ? custom : v,
      required: f.required,
    };
  });
}

export interface PreparePublishParams {
  readonly postDraft: PostDraft;
  readonly draftData: Partial<PostDraft>;
  readonly user: UserProfile | null;
  readonly browseCountryCode: string;
  readonly activeCurrency: string;
}

export interface PreparedPublish {
  readonly newListing: Listing;
  readonly targetMarket: string;
}

export function preparePublish(params: PreparePublishParams): PreparedPublish | null {
  const { postDraft, draftData, user, browseCountryCode, activeCurrency } = params;
  const mergedDraft = { ...postDraft, ...draftData };
  const { title, price, targetMarket, newListing } = buildNewListingPayload({
    postDraft: mergedDraft,
    user,
    browseCountryCode,
    activeCurrency,
  });
  if (!title || !price) return null;
  return { newListing, targetMarket };
}
