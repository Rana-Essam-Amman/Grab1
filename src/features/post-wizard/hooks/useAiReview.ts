import { useState } from 'react';
import { usePostWizard } from './usePostWizard';
import { useAuth } from '@/hooks/useAuth';
import { useUI } from '@/hooks/useUI';
import { useListings } from '@/hooks/useListings';
import { useDraft } from '@/hooks/useDraft';
import { useIsAdmin } from '@/hooks/useIsAdmin';
import { useTranslation } from '@/shared/i18n';
import { setPendingPublish } from '../helpers/pendingPublishFlags';
import { MONETIZATION_MATRIX } from '@/data/monetization';
import { useAiReviewAttributes } from './useAiReviewAttributes';
import type { UseAiReviewReturn } from './useAiReview.types';
import { useRegenerateListing } from './useRegenerateListing';
import { requirePhoneForPublish } from '@/features/auth/helpers/publishPhoneGuard';
import { resolveAiLocationSlugs } from '../helpers/aiLocationResolver';
import { executeAiPublish } from '../helpers/aiReviewPublishHandler';
import { updateAiDraftAttribute } from '../helpers/aiReviewAttributeUpdater';
import { buildMissingRequiredLabels } from '../helpers/missingRequiredLabels';

export type { UseAiReviewReturn } from './useAiReview.types';

export function useAiReview(): UseAiReviewReturn & { readonly regenerate: () => void } {
  const { postDraft, updatePostDraft } = usePostWizard();
  const { resetPostDraft } = useDraft();
  const { authStatus, user, isAnonymous } = useAuth();
  const { navigateTo, browseCountryCode, activeCurrency, isArabic } = useUI();
  const { t } = useTranslation();
  const { publishListing } = useListings();
  const { isAdmin, isLoading: isAdminLoading } = useIsAdmin();
  const [isPublishing, setIsPublishing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const photos = postDraft.photos || [];
  const neighborhood = postDraft.neighborhood || '';
  const attributes = useAiReviewAttributes(postDraft.categorySlug, postDraft.generated?.fields || [], isArabic, postDraft.subcategorySlug);

  const setAttributeValue = (key: string, value: string) => {
    updatePostDraft(updateAiDraftAttribute(postDraft, key, value));
  };
  const addPhotos = (p: string[]) => updatePostDraft({ photos: [...photos, ...p].slice(0, MONETIZATION_MATRIX.freeLimits.photoLimit) });
  const removePhoto = (i: number) => {
    const url = photos[i];
    if (url?.startsWith('blob:')) URL.revokeObjectURL(url);
    updatePostDraft({ photos: photos.filter((_, idx) => idx !== i) });
  };
  const setNeighborhood = (n: string) => {
    const { citySlug, districtSlug, neighborhoodSlug } = resolveAiLocationSlugs(browseCountryCode, postDraft.city || '', n);
    updatePostDraft({ neighborhood: n, citySlug: citySlug ?? undefined, districtSlug, neighborhoodSlug });
  };
  const setCity = (c: string) => {
    const { citySlug } = resolveAiLocationSlugs(browseCountryCode, c);
    updatePostDraft({
      city: c, neighborhood: '', citySlug, districtSlug: undefined, neighborhoodSlug: undefined,
      ...(postDraft.generated ? { generated: { ...postDraft.generated, city: c } } : {}),
    });
  };

  const updateField = (key: 'title' | 'price' | 'description', value: string) => {
    updatePostDraft({ [key]: value, ...(postDraft.generated ? { generated: { ...postDraft.generated, [key]: value } } : {}) });
  };

  const handlePublish = async () => {
    if (isAdminLoading || !postDraft) return;
    if (authStatus !== 'authenticated' || isAnonymous) {
      setPendingPublish(browseCountryCode, 'post-ai-review');
      navigateTo('login');
      return;
    }
    if (!requirePhoneForPublish(() => void handlePublish())) return;
    try {
      setError(null);
      const started = executeAiPublish({ postDraft, browseCountryCode, activeCurrency, isAdmin, isArabic, publishListing, resetPostDraft, navigateTo });
      if (started) {
        setIsPublishing(true);
      } else {
        setIsPublishing(false);
      }
    } catch (err) {
      setIsPublishing(false);
      setError(err instanceof Error ? err.message : (isArabic ? 'بيانات الموقع غير صالحة' : 'Invalid location data'));
    }
  };

  const curT = postDraft.title || postDraft.generated?.title || '';
  const curP = postDraft.price || postDraft.generated?.price || '';
  const curC = postDraft.city || '';
  const curD = postDraft.description || postDraft.generated?.description || '';
  const missingAttrLabels = (attributes || []).filter((a) => a.required && !String(a.value || '').trim()).map((a) => a.label);
  const missingRequiredLabels = buildMissingRequiredLabels(curT, curP, t('post-wizard.missingTitle'), t('post-wizard.missingPrice'), missingAttrLabels);
  const regenerate = useRegenerateListing({ postDraft, updatePostDraft, userId: (user as { id?: string })?.id || user?.email || user?.phone });

  return {
    title: curT, price: curP, city: curC, description: curD, photos, addPhotos, removePhoto, neighborhood, setNeighborhood,
    setTitle: (t) => updateField('title', t), setPrice: (p) => updateField('price', p), setCity, setDescription: (d) => updateField('description', d),
    attributes, setAttributeValue, handlePublish, isPublishing, regenerate,
    hasMissingParams: !curT || !curP || missingAttrLabels.length > 0,
    missingRequiredLabels, error,
  };
}
