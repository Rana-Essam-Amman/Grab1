import { useState } from 'react';
import { usePostWizard } from './usePostWizard';
import { useAuth } from '@/hooks/useAuth';
import { useUI } from '@/hooks/useUI';
import { useListings } from '@/hooks/useListings';
import { useDraft } from '@/hooks/useDraft';
import { buildNewListingPayload } from '../helpers/buildNewListingPayload';
import { globalStorage } from '@/shared/lib/marketStorage';

export interface UseAiReviewReturn {
  title: string;
  price: string;
  city: string;
  description: string;
  setTitle: (t: string) => void;
  setPrice: (p: string) => void;
  setCity: (c: string) => void;
  setDescription: (d: string) => void;
  handlePublish: () => Promise<void>;
  isPublishing: boolean;
  hasMissingParams: boolean;
  error?: string | null;
}

export function useAiReview(): UseAiReviewReturn {
  const { postDraft, updatePostDraft } = usePostWizard();
  const { resetPostDraft } = useDraft();
  const { authStatus, user } = useAuth();
  const { navigateTo, setActiveTab, browseCountryCode, activeCurrency, isArabic } = useUI();
  const { addListing } = useListings();
  const [isPublishing, setIsPublishing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateDraftField = (key: 'title' | 'price' | 'city' | 'description', value: string) => {
    updatePostDraft({
      [key]: value,
      ...(postDraft.generated ? { generated: { ...postDraft.generated, [key]: value } } : {}),
    });
  };

  const setTitle = (t: string) => updateDraftField('title', t);
  const setPrice = (p: string) => updateDraftField('price', p);
  const setCity = (c: string) => updateDraftField('city', c);
  const setDescription = (d: string) => updateDraftField('description', d);

  const handlePublish = async () => {
    if (!postDraft) return;
    if (authStatus !== 'authenticated') {
      globalStorage().set('catch_pending_publish', 'true');
      navigateTo('register');
      return;
    }

    const { title, price, targetMarket, newListing } = buildNewListingPayload({
      postDraft,
      user,
      browseCountryCode,
      activeCurrency,
    });

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
    } finally {
      setIsPublishing(false);
    }
  };

  const currentTitle = postDraft.title || postDraft.generated?.title || '';
  const currentPrice = postDraft.price || postDraft.generated?.price || '';
  const currentCity = postDraft.city || '';
  const currentDescription = postDraft.description || postDraft.generated?.description || '';

  return {
    title: currentTitle,
    price: currentPrice,
    city: currentCity,
    description: currentDescription,
    setTitle,
    setPrice,
    setCity,
    setDescription,
    handlePublish,
    isPublishing,
    hasMissingParams: !currentTitle || !currentPrice,
    error,
  };
}
