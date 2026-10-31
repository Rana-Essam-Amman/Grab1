import { useState, useCallback, useMemo, useRef } from 'react';
import { usePostWizard } from './usePostWizard';
import { useUI } from '@/hooks/useUI';
import { useAuth } from '@/hooks/useAuth';
import { useIsAdmin } from '@/hooks/useIsAdmin';
import { useListings } from '@/hooks/useListings';
import { useDraft } from '@/hooks/useDraft';
import { setPendingPublish } from '../helpers/pendingPublishFlags';
import { resolvePostDetailsFields, preparePublish } from '../helpers/postDetailsHelpers';
import { buildDraftData } from '../helpers/buildDraftData';
import { getCurrentUser, requirePhoneForPublish } from '@/features/auth/helpers/publishPhoneGuard';
import { capture } from '@/shared/analytics/posthog';
import { EVENTS } from '@/shared/analytics/events';
import { toast } from 'sonner';

export function usePostDetails() {
  const publishLock = useRef(false);
  const { postDraft, updatePostDraft } = usePostWizard();
  const { resetPostDraft } = useDraft();
  const { authStatus, isAnonymous } = useAuth();
  const { publishListing } = useListings();
  const { isAdmin, isLoading: isAdminLoading } = useIsAdmin();
  const { isArabic, navigateTo, setActiveTab, browseCountryCode, activeCurrency } = useUI();
  const [title, setTitle] = useState(postDraft.title || '');
  const [price, setPrice] = useState(postDraft.price || '');
  const [description, setDescription] = useState(postDraft.description || '');
  const [values, setValues] = useState<Record<string, string>>(() => {
    const out: Record<string, string> = {};
    (postDraft.generated?.fields || []).forEach(f => { out[f.key] = f.value || ''; });
    return out;
  });
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fields = useMemo(
    () => resolvePostDetailsFields({ categorySlug: postDraft.categorySlug, subcategorySlug: postDraft.subcategorySlug, values, isArabic }),
    [postDraft.categorySlug, postDraft.subcategorySlug, values, isArabic]
  );

  const setField = useCallback((k: string, v: string) => setValues(p => ({ ...p, [k]: v })), []);
  const missing = fields.filter(f => f.required && !(values[f.key] || '').trim()).map(f => isArabic ? f.labelAr : f.labelEn);
  const hasLocation = Boolean(postDraft.city?.trim());

  const priceNum = Number(price);
  const isPriceValid = price.trim().length > 0 && Number.isFinite(priceNum) && priceNum > 0;
  const canContinue = title.trim().length >= 5 && isPriceValid && missing.length === 0 && hasLocation;

  const handleContinue = async () => {
    if (isAdminLoading) return;
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      toast.error(isArabic ? 'لا يوجد اتصال بالإنترنت. يرجى المحاولة لاحقاً.' : 'No internet connection. Please try again later.');
      return;
    }
    if (publishLock.current) return;
    publishLock.current = true;
    try {
      setSubmitAttempted(true);
      if (!canContinue || isPublishing) return;
      const draftData = buildDraftData({ title: title.trim(), price: price.trim(), description: description.trim(), postDraft, fields, values, isArabic });
      updatePostDraft(draftData);
      if (authStatus !== 'authenticated' || isAnonymous) { setPendingPublish(browseCountryCode, 'post-details'); navigateTo('login'); return; }
      if (!requirePhoneForPublish(() => void handleContinue())) {
        publishLock.current = false;
        return;
      }
      const prepared = preparePublish({ postDraft, draftData, user: getCurrentUser(), browseCountryCode, activeCurrency, isAdmin });
      if (!prepared) return;

      setIsPublishing(true);
      setError(null);

      // Fire-and-forget: the optimistic temp listing is already in
      // state.listings (added synchronously by publishListing before the
      // network call). We navigate immediately so the user lands on
      // My Ads and sees their listing right away.
      const publishPromise = publishListing(prepared.newListing, prepared.targetMarket, isArabic);

      // Immediate navigation — do NOT await.
      resetPostDraft();
      setActiveTab('my-ads');
      capture(EVENTS.LISTING_PUBLISHED, { flow: 'manual' });
      navigateTo('main');

      // Background result handling via toast.
      publishPromise
        .then((result) => {
          if (result.success) return;
          let errorMsg = result.error || (isArabic ? 'فشل نشر الإعلان' : 'Failed to publish');
          if (errorMsg.includes('Rate limit') || errorMsg.includes('ACTIVE_LISTING_CAP_REACHED')) {
            errorMsg = isArabic
              ? 'لقد وصلت للحد الأقصى لعدد الإعلانات المسموح بها حالياً. يرجى المحاولة لاحقاً.'
              : 'You have reached the maximum allowed listings. Please try again later.';
          } else if (errorMsg.toLowerCase().includes('row-level security')) {
            errorMsg = isArabic ? 'يجب إضافة رقم هاتف أولاً' : 'Phone required';
            navigateTo('profile');
          }
          toast.error(errorMsg);
        })
        .catch((err) => {
          console.error('[PUBLISH ERROR]', err);
          toast.error(isArabic ? 'فشل نشر الإعلان' : 'Failed to publish');
        });
    } finally {
      publishLock.current = false;
    }
  };

  return { title, setTitle, price, setPrice, description, setDescription, values, setField, fields, missingRequired: missing, canContinue, handleContinue, isArabic, submitAttempted, isPublishing, error };
}
