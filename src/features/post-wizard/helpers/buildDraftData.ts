import type { PostDraft } from '@/types';
import type { CategoryFieldDef } from '@/data/categoryFields';
import { buildGeneratedFields } from './postDetailsHelpers';

interface BuildDraftDataParams {
  title: string;
  price: string;
  description: string;
  postDraft: PostDraft;
  fields: readonly CategoryFieldDef[];
  values: Record<string, string>;
  isArabic: boolean;
}

export function buildDraftData({
  title,
  price,
  description,
  postDraft,
  fields,
  values,
  isArabic,
}: BuildDraftDataParams): Partial<PostDraft> {
  return {
    title,
    price,
    description,
    generated: {
      title,
      description,
      price,
      categorySlug: postDraft.categorySlug,
      subcategorySlug: postDraft.subcategorySlug,
      missing: [],
      fields: buildGeneratedFields(fields, values, isArabic),
    },
  };
}
