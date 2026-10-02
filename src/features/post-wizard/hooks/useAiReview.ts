import { useState } from 'react';
import { usePostWizard } from './usePostWizard';
import { useAuth } from '@/hooks/useAuth';
import { useUI } from '@/hooks/useUI';
import { useListings } from '@/hooks/useListings';
import { useDraft } from '@/hooks/useDraft';
import { buildNewListingPayload } from '../helpers/buildNewListingPayload';
import { setPendingPublish } from '../helpers/pendingPublishFlags';
import { MONETIZATION_MATRIX } from '@/data/monetization';
import { useAiReviewAttributes } from './useAiReviewAttributes';
import type { UseAiReviewReturn } from './useAiReview.types';

export type { UseAiReviewReturn } from './useAiReview.types';

export function useAiReview(): UseAiReviewReturn {
  const { postDraft, updatePostDraft } = usePostWizard();
  const { resetPostDraft } = useDraft();
  const { authStatus, user, isAnonymous } = useAuth();
  const { navigateTo, setActiveTab, browseCountryCode, activeCurrency, isArabic } = useUI();
  const { publishListing } = useListings();

  const [isPublishing, setIsPublishing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const photos = postDraft.photos || [];
  const neighborhood = postDraft.neighborhood || '';
  const attributes = useAiReviewAttributes(
    postDraft.categorySlug,
    postDraft.generated?.fields || [],
    isArabic
  );
  const aiErrorHint = attributes.length === 0
    ? (isArabic ? 'لم يتمكن الذكاء الاصطناعي من توليد المواصفات — أعد المحاولة' : 'AI could not generate specs — retry')
    : null;

  const setAttributeValue = (key: string, value: string) => {
    const current = postDraft.generated?.fields || [];
    const updated = current.map((f) => (f.key === key ? { ...f, value } : f));
    updatePostDraft({ generated: postDraft.generated ? { ...postDraft.generated, fields: updated } : undefined });
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
    const { title, price, targetMarket, newListing } = buildNewListingPayload({ postDraft, user, browseCountryCode, activeCurrency });
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
      setActiveTab('my-ads');
      navigateTo('main');
    } catch (err) {
      console.error('[PUBLISH ERROR]', err);
      setError('فشل نشر الإعلان');
    } finally { setIsPublishing(false); }
  };

  const curT = postDraft.title || postDraft.generated?.title || '';
  const curP = postDraft.price || postDraft.generated?.price || '';
  const curC = postDraft.city || '';
  const curD = postDraft.description || postDraft.generated?.description || '';
  const missingRequiredLabels = (attributes || []).filter((a) => a.required && !String(a.value || '').trim()).map((a) => a.label);

  return {
    title: curT, price: curP, city: curC, description: curD, photos, addPhotos, removePhoto,
    neighborhood, setNeighborhood, setTitle, setPrice, setCity, setDescription,
    attributes, setAttributeValue, handlePublish, isPublishing,
    hasMissingParams: !curT || !curP || missingRequiredLabels.length > 0, missingRequiredLabels, error: error || aiErrorHint,
  };
}
