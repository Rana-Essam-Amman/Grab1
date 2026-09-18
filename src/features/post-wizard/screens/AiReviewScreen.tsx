import { useUI } from '@/hooks/useUI';
import { useAuth } from '@/hooks/useAuth';
import { useAiReview } from '../hooks/useAiReview';
import React, { useMemo } from 'react';
import { AiReviewHeader } from '../components/AiReviewHeader';
import { ReviewFormFields } from '../components/ReviewFormFields';

export const AiReviewScreen: React.FC = () => {
  const { isArabic, goBack, navigateTo } = useUI();
  const { 
    title, price, city, description,
    hasMissingParams,
    setTitle, setPrice, setCity, setDescription, handlePublish
  } = useAiReview();

  const isPriceMissing = false; // Placeholder until hook is updated
  const isCityMissing = false; // Placeholder until hook is updated
  const hasMismatch = false; // Placeholder until hook is updated
  const match = null; // Placeholder until hook is updated
  const lockedCurrency = 'JOD'; // Placeholder
  const photos: string[] = []; // Placeholder

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value);
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => setPrice(e.target.value);
  const handleCityChange = (e: React.ChangeEvent<HTMLInputElement>) => setCity(e.target.value);
  const handleDescChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value);
  const handleApplySuggestedCategory = () => {};

  return (
    <div className="flex flex-col min-h-screen bg-surface pb-12" dir={isArabic ? 'rtl' : 'ltr'}>
      <AiReviewHeader isArabic={isArabic} onBack={goBack} />
      <div className="p-4 flex flex-col gap-4 flex-1">
        {photos && photos.length > 0 && (
          <div className="flex gap-2 overflow-x-auto">
            {photos.map((p, i) => <img key={i} src={p} className="w-20 h-20 rounded-xl object-cover" />)}
          </div>
        )}
        <ReviewFormFields
          isArabic={isArabic}
          hasMissingParams={hasMissingParams}
          isPriceMissing={isPriceMissing}
          isCityMissing={isCityMissing}
          hasMismatch={hasMismatch}
          match={match}
          title={title}
          price={price}
          city={city}
          description={description}
          lockedCurrency={lockedCurrency}
          onTitleChange={handleTitleChange}
          onPriceChange={handlePriceChange}
          onCityChange={handleCityChange}
          onDescChange={handleDescChange}
          onApplyCategory={handleApplySuggestedCategory}
          onPublish={handlePublish}
        />
      </div>
    </div>
  );
};

