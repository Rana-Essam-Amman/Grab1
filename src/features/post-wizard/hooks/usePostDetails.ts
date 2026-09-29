import { useState, useCallback, useMemo } from 'react';
import { usePostWizard } from './usePostWizard';
import { getFieldsForListing } from '@/data/subcategoryFields';
import { useUI } from '@/hooks/useUI';
import { getBrandOptions, getModelOptions } from '@/data/brands';

export function usePostDetails() {
  const { postDraft, updatePostDraft } = usePostWizard();
  const { isArabic, navigateTo } = useUI();
  const [title, setTitle] = useState(postDraft.title || '');
  const [price, setPrice] = useState(postDraft.price || '');
  const [description, setDescription] = useState(postDraft.description || '');
  const [values, setValues] = useState<Record<string, string>>(() => {
    const out: Record<string, string> = {};
    (postDraft.generated?.fields || []).forEach(f => { out[f.key] = f.value || ''; });
    return out;
  });
  const [submitAttempted, setSubmitAttempted] = useState(false);

  const cBrand = values.make || values.brand || values.carMake || '';
  const bOpts = useMemo(() => getBrandOptions(postDraft.categorySlug, isArabic), [postDraft.categorySlug, isArabic]);
  const mOpts = useMemo(() => cBrand ? getModelOptions(postDraft.categorySlug, cBrand, isArabic) : [], [postDraft.categorySlug, cBrand, isArabic]);

  const fields = useMemo(() => getFieldsForListing(postDraft.categorySlug, postDraft.subcategorySlug).map(f => {
    if (f.key === 'make' || f.key === 'brand' || f.key === 'carMake') {
      // Category has brand catalog → dropdown; otherwise → free text
      return bOpts.length > 0
        ? { ...f, type: 'select' as const, options: bOpts }
        : { ...f, type: 'text' as const };
    }
    if (f.key === 'model') {
      // Free text when: no brand yet, brand is "أخرى", or brand has no models
      if (!cBrand || cBrand === 'أخرى' || cBrand === 'Other' || mOpts.length === 0) {
        return { ...f, type: 'text' as const };
      }
      return { ...f, type: 'select' as const, options: mOpts };
    }
    return f;
  }), [postDraft.categorySlug, postDraft.subcategorySlug, bOpts, mOpts, cBrand]);

  const setField = useCallback((k: string, v: string) => setValues(p => ({ ...p, [k]: v })), []);
  const missing = fields.filter(f => f.required && !(values[f.key] || '').trim()).map(f => isArabic ? f.labelAr : f.labelEn);
  const canContinue = title.trim().length >= 5 && price.trim().length > 0 && description.trim().length >= 10 && missing.length === 0;

  const handleContinue = () => {
    setSubmitAttempted(true);
    if (!canContinue) return;
    const genFields = fields.map(f => {
      const v = (values[f.key] || '').trim();
      const custom = (values[`${f.key}_custom`] || '').trim();
      const isOther = v === 'أخرى' || v === 'Other';
      return { key: f.key, label: isArabic ? f.labelAr : f.labelEn, value: (f.type === 'select' && isOther && custom) ? custom : v, required: f.required };
    });
    const t = title.trim(); const p = price.trim(); const d = description.trim();
    updatePostDraft({
      title: t, price: p, description: d,
      generated: { title: t, description: d, price: p, categorySlug: postDraft.categorySlug, subcategorySlug: postDraft.subcategorySlug, missing: [], fields: genFields }
    });
    navigateTo('post-ai-review');
  };

  return { title, setTitle, price, setPrice, description, setDescription, values, setField, fields, missingRequired: missing, canContinue, handleContinue, isArabic, submitAttempted };
}
