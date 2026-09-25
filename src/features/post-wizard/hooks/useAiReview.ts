import { useState } from 'react';
import { usePostWizard } from './usePostWizard';
import { useAuth } from '@/hooks/useAuth';
import { useUI } from '@/hooks/useUI';
import { useListings } from '@/hooks/useListings';
import { useDraft } from '@/hooks/useDraft';
import { buildNewListingPayload } from '../helpers/buildNewListingPayload';
import { globalStorage } from '@/shared/lib/marketStorage';
import { useAiReviewAttributes } from './useAiReviewAttributes';

export interface UseAiReviewReturn {
  title: string; price: string; city: string; description: string; photos: string[];
  addPhotos: (newPhotos: string[]) => void; removePhoto: (index: number) => void;
  neighborhood: string; setNeighborhood: (n: string) => void;
  setTitle: (t: string) => void; setPrice: (p: string) => void;
  setCity: (c: string) => void; setDescription: (d: string) => void;
  attributes: readonly {
    key: string;
    label: string;
    value: string;
    required?: boolean;
    type?: 'text' | 'number' | 'select' | 'textarea';
    options?: readonly string[];
  }[];
  setAttributeValue: (key: string, value: string) => void;
  handlePublish: () => Promise<void>; isPublishing: boolean; hasMissingParams: boolean;
  readonly missingRequiredLabels: readonly string[]; error?: string | null;
}

export function useAiReview(): UseAiReviewReturn {
  const { postDraft, updatePostDraft } = usePostWizard();
  const { resetPostDraft } = useDraft();
  const { authStatus, user } = useAuth();
  const { navigateTo, setActiveTab, browseCountryCode, activeCurrency, isArabic } = useUI();
  const { addListing } = useListings();

  const [isPublishing, setIsPublishing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const photos = postDraft.photos || [];
  const neighborhood = postDraft.neighborhood || '';
  const attributes = useAiReviewAttributes(
    postDraft.categorySlug,
    postDraft.generated?.fields || [],
    isArabic
  );

  const setAttributeValue = (key: string, value: string) => {
    const current = postDraft.generated?.fields || [];
    const updated = current.map((f) => (f.key === key ? { ...f, value } : f));
    updatePostDraft({ generated: postDraft.generated ? { ...postDraft.generated, fields: updated } : undefined });
  };

  const addPhotos = (p: string[]) => updatePostDraft({ photos: [...photos, ...p].slice(0, 10) });
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
    if (authStatus !== 'authenticated') {
      globalStorage().set('catch_pending_publish', 'true');
      navigateTo('register');
      return;
    }
    const { title, price, targetMarket, newListing } = buildNewListingPayload({ postDraft, user, browseCountryCode, activeCurrency });
    if (!title || !price) return;
    setIsPublishing(true);
    setError(null);
    try {
      addListing(newListing, targetMarket, isArabic);
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
    hasMissingParams: !curT || !curP || missingRequiredLabels.length > 0, missingRequiredLabels, error,
  };
}
