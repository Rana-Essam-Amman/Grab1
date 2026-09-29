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
  const { authStatus, user } = useAuth();
  const { addListing } = useListings();
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

    if (authStatus !== 'authenticated') {
      globalStorage().set('catch_pending_publish', 'true');
      navigateTo('register');
      return;
    }

    setIsPublishing(true);
    setError(null);
    try {
      const prepared = preparePublish({ postDraft, draftData, user, browseCountryCode, activeCurrency });
      if (!prepared) {
        setError('DEBUG: missing title or price');
        return;
      }
      addListing(prepared.newListing, prepared.targetMarket, isArabic);
      resetPostDraft();
      setActiveTab('my-ads');
      navigateTo('main');
    } catch (err) {
      console.error('[PUBLISH ERROR]', err);
      const msg = err instanceof Error ? err.message : String(err);
      const stack = err instanceof Error ? (err.stack || '').slice(0, 300) : '';
      setError(`DEBUG: ${msg} | ${stack}`);
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
