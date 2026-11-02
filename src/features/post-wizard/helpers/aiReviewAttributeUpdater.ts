import { getListingFields } from '@/data/listingFields';
import type { PostDraft } from '@/types';

export function updateAiDraftAttribute(
  postDraft: PostDraft,
  key: string,
  value: string
) {
  const schema = getListingFields(postDraft.categorySlug, postDraft.subcategorySlug);
  const current = postDraft.generated?.fields ?? schema.map((f) => ({ key: f.key, label: f.labelAr, value: '' }));
  const exists = current.some((f) => f.key === key);
  const updated = exists ? current.map((f) => (f.key === key ? { ...f, value } : f)) : [...current, { key, label: key, value }];
  const base = postDraft.generated ?? {
    title: postDraft.title || '',
    description: postDraft.description || '',
    price: postDraft.price || '',
    categorySlug: postDraft.categorySlug,
    subcategorySlug: postDraft.subcategorySlug,
    missing: [],
  };
  return { generated: { ...base, fields: updated } };
}
