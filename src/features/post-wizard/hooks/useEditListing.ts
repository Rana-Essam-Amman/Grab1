import { useState, useCallback, useMemo } from 'react';
import { useUI } from '@/hooks/useUI';
import { useListings } from '@/hooks/useListings';
import { getFieldsForListing } from '@/data/subcategoryFields';
import { getBrandOptions, getModelOptions } from '@/data/brands';

export function useEditListing() {
  const { selectedListingId, goBack, isArabic } = useUI();
  const { getListing, updateListing } = useListings();
  const listing = selectedListingId ? getListing(selectedListingId) : null;

  const [title, setTitle] = useState(listing?.title || '');
  const [price, setPrice] = useState(listing?.price?.toString() || '');
  const [description, setDescription] = useState(listing?.description || '');
  const [values, setValues] = useState<Record<string, string>>(() => {
    const out: Record<string, string> = {};
    (listing?.attributes as Array<{ key?: string; label?: string; value?: unknown }> | undefined)?.forEach((a) => {
      if (a.key) {
        out[a.key] = String(a.value ?? '');
      }
    });
    return out;
  });
  const [submitAttempted, setSubmitAttempted] = useState(false);

  const categorySlug = listing?.categorySlug || '';
  const subcategorySlug = listing?.subcategorySlug || '';

  const cBrand = values.make || values.brand || values.carMake || '';
  const bOpts = useMemo(() => getBrandOptions(categorySlug, isArabic), [categorySlug, isArabic]);
  const mOpts = useMemo(() => cBrand ? getModelOptions(categorySlug, cBrand, isArabic) : [], [categorySlug, cBrand, isArabic]);

  const fields = useMemo(() => getFieldsForListing(categorySlug, subcategorySlug).map((f) => {
    if (f.key === 'make' || f.key === 'brand' || f.key === 'carMake') return { ...f, type: 'select' as const, options: bOpts };
    if (f.key === 'model') {
      // When brand is "أخرى", user types the model freely (no catalog exists)
      if (cBrand === 'أخرى' || cBrand === 'Other') {
        return { ...f, type: 'text' as const };
      }
      return { ...f, type: 'select' as const, options: mOpts, disabled: !cBrand };
    }
    return f;
  }), [categorySlug, subcategorySlug, bOpts, mOpts, cBrand]);

  const setField = useCallback((k: string, v: string) => setValues((p) => ({ ...p, [k]: v })), []);
  const missing = fields.filter((f) => f.required && !(values[f.key] || '').trim()).map((f) => isArabic ? f.labelAr : f.labelEn);
  const canSave = title.trim().length >= 5 && price.trim().length > 0 && description.trim().length >= 10 && missing.length === 0;

  const handleSave = useCallback(() => {
    setSubmitAttempted(true);
    if (!canSave || !listing) return;
    const attributes = fields
      .filter((f) => (values[f.key] || '').trim())
      .map((f) => ({ key: f.key, label: isArabic ? f.labelAr : f.labelEn, value: values[f.key] }));
    updateListing(listing.id, {
      title: title.trim(),
      price: price.trim(),
      description: description.trim(),
      attributes,
    });
    goBack();
  }, [canSave, listing, fields, values, isArabic, title, price, description, updateListing, goBack]);

  return {
    listing, title, setTitle, price, setPrice, description, setDescription,
    values, setField, fields, missingRequired: missing, canSave, handleSave, isArabic, submitAttempted,
  };
}
