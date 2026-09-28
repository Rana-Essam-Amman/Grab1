import { useUI } from '@/hooks/useUI';
import { useAiReview } from '../hooks/useAiReview';
import React, { useRef, useState } from 'react';
import { Send2 } from 'iconsax-react';
import { AiReviewHeader } from '../components/AiReviewHeader';
import { AiReviewBody } from '../components/AiReviewBody';
import { AiReviewCityDrawer } from '../components/AiReviewCityDrawer';
import { ExploreLocationFilterDrawer } from '@/shared/components/filters/ExploreLocationFilterDrawer';
import { locations, locationsAr } from '@/data/locations';

export const AiReviewScreen: React.FC = () => {
  const { isArabic, goBack, activeCurrency, browseCountryCode } = useUI();
  const {
    title, price, city, neighborhood, description, photos,
    hasMissingParams, missingRequiredLabels, isPublishing, attributes, setAttributeValue,
    setTitle, setPrice, setCity, setNeighborhood, setDescription,
    addPhotos, removePhoto, handlePublish, error,
  } = useAiReview();

  const mapQuery = [neighborhood, city].filter(Boolean).join(', ') || 'Amman';

  const [isCityDrawerOpen, setIsCityDrawerOpen] = useState(false);
  const [isHoodDrawerOpen, setIsHoodDrawerOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddPhotos = () => fileInputRef.current?.click();

  const handleFilesSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const urls: string[] = [];
    for (let i = 0; i < files.length; i++) {
      try { urls.push(URL.createObjectURL(files[i])); } catch { /* ignore */ }
    }
    addPhotos(urls);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="flex flex-col min-h-screen bg-canvas " dir={isArabic ? 'rtl' : 'ltr'}>
      <AiReviewHeader isArabic={isArabic} onBack={goBack} />
      <AiReviewBody
        isArabic={isArabic}
        photos={photos}
        onAddPhotos={handleAddPhotos}
        onRemovePhoto={removePhoto}
        title={title}
        price={price}
        city={city}
        neighborhood={neighborhood}
        description={description}
        currency={activeCurrency}
        attributes={attributes}
        onAttributeChange={setAttributeValue}
        mapQuery={mapQuery}
        onTitleChange={setTitle}
        onPriceChange={setPrice}
        onOpenCityPicker={() => setIsCityDrawerOpen(true)}
        onOpenNeighborhoodPicker={() => setIsHoodDrawerOpen(true)}
        onDescriptionChange={setDescription}
        hasMissing={hasMissingParams}
        missingRequiredLabels={missingRequiredLabels}
      />
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[calc(100%-24px)] max-w-[440px] z-30 flex flex-col gap-2 pointer-events-none">
        {error && (
          <div className="rounded-xl border border-danger/30 bg-danger/5 px-3 py-2 text-xs text-danger shadow-md pointer-events-auto backdrop-blur-sm bg-white/90">{error}</div>
        )}
        <button
          type="button"
          onClick={handlePublish}
          disabled={hasMissingParams || isPublishing}
          className={`w-full h-14 rounded-2xl text-white font-bold text-base flex items-center justify-center gap-2 shadow-lg shadow-primary/30 active:scale-[0.98] transition-transform disabled:opacity-50 disabled:shadow-none bg-gradient-to-r from-primary to-primary-hover cursor-pointer pointer-events-auto ${!hasMissingParams && !isPublishing ? 'animate-[halo-pulse_2s_ease-in-out_infinite]' : ''}`}
        >
          <Send2 size={18} variant="Bold" color="#FFFFFF" />
          <span>
            {isPublishing
              ? (isArabic ? 'جاري النشر...' : 'Publishing...')
              : (isArabic ? 'انشر الإعلان الآن' : 'Publish Now')}
          </span>
        </button>
      </div>
      <AiReviewCityDrawer
        isArabic={isArabic}
        open={isCityDrawerOpen}
        onClose={() => setIsCityDrawerOpen(false)}
        browseCountryCode={browseCountryCode}
        currentCity={city}
        onSelect={(cityEn, cityAr) => setCity(isArabic ? cityAr : cityEn)}
      />
      <ExploreLocationFilterDrawer
        open={isHoodDrawerOpen}
        onClose={() => setIsHoodDrawerOpen(false)}
        isArabic={isArabic}
        activeNeighborhood={neighborhood}
        onSelectLocation={(loc: string | null) => setNeighborhood(loc || '')}
        onSelectCity={(cityEn: string, cityAr: string) => setCity(isArabic ? cityAr : cityEn)}
        currentLocations={
          (isArabic ? locationsAr[browseCountryCode] : locations[browseCountryCode]) || {}
        }
        browseCountryCode={browseCountryCode}
        initialCityForNeighs={city || undefined}
      />
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        hidden
        onChange={handleFilesSelected}
      />
    </div>
  );
};
