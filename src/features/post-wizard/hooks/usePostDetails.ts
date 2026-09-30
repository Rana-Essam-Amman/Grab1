import { useState, useCallback, useMemo } from 'react';
import { usePostWizard } from './usePostWizard';
import { useUI } from '@/hooks/useUI';
import { useAuth } from '@/hooks/useAuth';
import { useListings } from '@/hooks/useListings';
import { useDraft } from '@/hooks/useDraft';
import { globalStorage } from '@/shared/lib/marketStorage';
import { resolvePostDetailsFields, buildGeneratedFields, preparePublish } from '../helpers/postDetailsHelpers';

export function usePostDetails() {
  const { postDraft, updatePostDraft } = usePostWizard();
  const { resetPostDraft } = useDraft();
  const { authStatus, user, isAnonymous } = useAuth();
  const { publishListing } = useListings();
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
    () => resolvePostDetailsFields({
      categorySlug: postDraft.categorySlug,
      subcategorySlug: postDraft.subcategorySlug,
      values,
      isArabic,
    }),
    [postDraft.categorySlug, postDraft.subcategorySlug, values, isArabic]
  );

  const setField = useCallback((k: string, v: string) => setValues(p => ({ ...p, [k]: v })), []);
  const missing = fields.filter(f => f.required && !(values[f.key] || '').trim()).map(f => isArabic ? f.labelAr : f.labelEn);
  const canContinue = title.trim().length >= 5 && price.trim().length > 0 && description.trim().length >= 10 && missing.length === 0;

  const handleContinue = async () => {
    setSubmitAttempted(true);
    if (!canContinue || isPublishing) return;

    const t = title.trim();
    const p = price.trim();
    const d = description.trim();
    const draftData = {
      title: t, price: p, description: d,
      generated: {
        title: t, description: d, price: p,
        categorySlug: postDraft.categorySlug,
        subcategorySlug: postDraft.subcategorySlug,
        missing: [] as string[],
        fields: buildGeneratedFields(fields, values, isArabic),
      },
    };
    updatePostDraft(draftData);

    // Visitors (anonymous session) must sign in before publishing.
    // Draft stays in postDraft; resumed after Google sign-in.
    if (authStatus !== 'authenticated' || isAnonymous) {
      globalStorage().set('catch_pending_publish', 'true');
      navigateTo('register');
      return;
    }

    const prepared = preparePublish({ postDraft, draftData, user, browseCountryCode, activeCurrency });
    if (!prepared) return;

    setIsPublishing(true);
    setError(null);
    try {
      const result = await publishListing(prepared.newListing, prepared.targetMarket, isArabic);
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
    } finally {
      setIsPublishing(false);
    }
  };

  return {
    title, setTitle, price, setPrice, description, setDescription,
    values, setField, fields, missingRequired: missing,
    canContinue, handleContinue, isArabic, submitAttempted,
    isPublishing, error,
  };
}
