import { useState } from 'react';
import { usePostWizard } from './usePostWizard';
import { useAuth } from '@/hooks/useAuth';
import { useUI } from '@/hooks/useUI';
import { useListings } from '@/hooks/useListings';
import { useDraft } from '@/hooks/useDraft';
import { buildNewListingPayload } from '../helpers/buildNewListingPayload';
import { setPendingPublish } from '../helpers/pendingPublishFlags';
import { MONETIZATION_MATRIX } from '@/data/monetization';
import { getListingFields } from '@/data/listingFields';
import { useAiReviewAttributes } from './useAiReviewAttributes';
import type { UseAiReviewReturn } from './useAiReview.types';
import { useRegenerateListing } from './useRegenerateListing';
import { getCurrentUser, requirePhoneForPublish } from '@/features/auth/helpers/publishPhoneGuard';
export type { UseAiReviewReturn } from './useAiReview.types';
export function useAiReview(): UseAiReviewReturn & { readonly regenerate: () => void } {
  const { postDraft, updatePostDraft } = usePostWizard();
  const { resetPostDraft } = useDraft();
  const { authStatus, user, isAnonymous } = useAuth();
  const { navigateTo, browseCountryCode, activeCurrency, isArabic } = useUI();
  const { publishListing } = useListings();
  const [isPublishing, setIsPublishing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const photos = postDraft.photos || [];
  const neighborhood = postDraft.neighborhood || '';
  const attributes = useAiReviewAttributes(postDraft.categorySlug, postDraft.generated?.fields || [], isArabic);
  const setAttributeValue = (key: string, value: string) => {
    const schema = getListingFields(postDraft.categorySlug, postDraft.subcategorySlug);
    const current = postDraft.generated?.fields ?? schema.map((f) => ({ key: f.key, label: f.labelAr, value: '' }));
    const exists = current.some((f) => f.key === key);
    const updated = exists ? current.map((f) => (f.key === key ? { ...f, value } : f)) : [...current, { key, label: key, value }];
    const baseGenerated = postDraft.generated ?? {
      title: postDraft.title || '', description: postDraft.description || '', price: postDraft.price || '',
      categorySlug: postDraft.categorySlug, subcategorySlug: postDraft.subcategorySlug, missing: [],
    };
    updatePostDraft({ generated: { ...baseGenerated, fields: updated } });
  };
  const addPhotos = (p: string[]) => updatePostDraft({ photos: [...photos, ...p].slice(0, MONETIZATION_MATRIX.freeLimits.photoLimit) });
  const removePhoto = (i: number) => {
    const url = photos[i];
    if (url?.startsWith('blob:')) URL.revokeObjectURL(url);
    updatePostDraft({ photos: photos.filter((_, idx) => idx !== i) });
  };
  const setNeighborhood = (n: string) => updatePostDraft({ neighborhood: n });
  const updateField = (key: 'title' | 'price' | 'city' | 'description', value: string) => {
    updatePostDraft({ [key]: value, ...(postDraft.generated ? { generated: { ...postDraft.generated, [key]: value } } : {}) });
  };
  const setTitle = (t: string) => updateField('title', t);
  const setPrice = (p: string) => updateField('price', p);
  const setCity = (c: string) => updateField('city', c);
  const setDescription = (d: string) => updateField('description', d);
  const handlePublish = async () => {
    if (!postDraft) return;
    if (authStatus !== 'authenticated' || isAnonymous) {
      setPendingPublish(browseCountryCode, 'post-ai-review');
      navigateTo('login');
      return;
    }
    if (!requirePhoneForPublish(() => void handlePublish())) return;
    const { title, price, targetMarket, newListing } = buildNewListingPayload({ postDraft, user: getCurrentUser(), browseCountryCode, activeCurrency });
    if (!title || !price) return;
    setIsPublishing(true);
    setError(null);
    try {
      const result = await publishListing(newListing, targetMarket, isArabic);
      if (!result.success) {
        setError(result.error || 'فشل نشر الإعلان');
        return;
      }
      resetPostDraft();
      navigateTo('post-publish-success');
    } catch {
      setError('فشل نشر الإعلان');
    } finally {
      setIsPublishing(false);
    }
  };
  const curT = postDraft.title || postDraft.generated?.title || '';
  const curP = postDraft.price || postDraft.generated?.price || '';
  const curC = postDraft.city || '';
  const curD = postDraft.description || postDraft.generated?.description || '';
  const missingRequiredLabels = (attributes || []).filter((a) => a.required && !String(a.value || '').trim()).map((a) => a.label);
  const regenerate = useRegenerateListing({
    postDraft, updatePostDraft, userId: (user as { id?: string })?.id || user?.email || user?.phone,
  });
  return {
    title: curT, price: curP, city: curC, description: curD, photos, addPhotos, removePhoto,
    neighborhood, setNeighborhood, setTitle, setPrice, setCity, setDescription,
    attributes, setAttributeValue, handlePublish, isPublishing, regenerate,
    hasMissingParams: !curT || !curP || missingRequiredLabels.length > 0, missingRequiredLabels, error,
  };
}
