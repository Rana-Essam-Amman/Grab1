import { useUI } from '@/hooks/useUI';
import { usePostWizard } from '../hooks/usePostWizard';
import { usePhotoUpload } from '../hooks/usePhotoUpload';
import { useLocationPick } from '../hooks/useLocationPick';
import React, { useCallback } from 'react';
import { listingMinPhotos } from '@/data/photoRules';
import { ArrowLeft, ArrowRight, Warning2 } from 'iconsax-react';
import { Button } from '@/shared/ui/Button';
import { PhotoPreviewList } from '../components/PhotoPreviewList';
import { PhotoUploader } from '../components/PhotoUploader';
import { PostFlowHeader } from '../components/PostFlowHeader';
import { LocationFields } from '../components/LocationFields';

export const PhotoUploadScreen: React.FC = () => {
  const { isArabic, goBack } = useUI();
  const { postDraft } = usePostWizard();
  const { photos, handleFiles, handleRemove, handleUseSample } = usePhotoUpload();
  const {
    cities,
    neighborhoods,
    selectedCity,
    selectedNeighborhood,
    site,
    customCity,
    setCustomCity,
    customNeighborhood,
    setCustomNeighborhood,
    handleCityChange,
    handleNeighborhoodChange,
    handleSiteChange,
    mapQuery,
    saveAndContinue,
  } = useLocationPick();
  
  const NextIcon = isArabic ? ArrowLeft : ArrowRight;

  const handleContinue = useCallback(() => {
    if (photos.length < listingMinPhotos) return;
    saveAndContinue();
  }, [photos.length, saveAndContinue]);

  const handleImageError = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    (e.target as HTMLImageElement).src =
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect width="100" height="100" fill="%23E5E7EB"/></svg>';
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-surface pb-12" dir={isArabic ? 'rtl' : 'ltr'}>
      <PostFlowHeader
        step={2}
        totalSteps={3}
        titleAr="الصور والموقع"
        titleEn="Photos & Location"
        isArabic={isArabic}
        onBack={goBack}
      />

      <div className="p-4 flex-1 flex flex-col gap-6">
        {/* Section 1: Photos */}
        <section className="flex flex-col gap-4">
          <div className="p-3.5 rounded-2xl bg-orange-50 border border-orange-100 flex items-start gap-2.5">
            <Warning2 size={16} variant="Bold" className="shrink-0 mt-0.5 text-orange-500" />
            <div className="text-[12px] font-medium text-ink leading-relaxed">
              {isArabic ? 'يجب إضافة صورة واحدة على الأقل. الصور الواضحة تضاعف سرعة بيع السلعة.' : 'Add at least 1 photo. Clear photos increase buyer interest.'}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <PhotoPreviewList photos={photos} isArabic={isArabic} onRemove={handleRemove} onImageError={handleImageError} />
            <PhotoUploader photoCount={photos.length} isArabic={isArabic} onFiles={handleFiles} />
          </div>

          {photos.length === 0 && (
            <Button type="button" variant="outline" size="sm" onClick={() => handleUseSample(postDraft.categorySlug)} className="self-start">
              {isArabic ? 'استخدم صورة تجريبية لهذا القسم' : 'Use sample photo for this category'}
            </Button>
          )}
        </section>

        <div className="border-t border-line" />

        {/* Section 2: Location */}
        <section className="flex flex-col gap-4">
          <h3 className="font-bold text-ink px-1 flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent text-sm">📍</span>
            {isArabic ? 'الموقع' : 'Location'}
          </h3>
          
          <LocationFields
            isArabic={isArabic}
            selectedCity={selectedCity}
            cities={cities}
            selectedNeighborhood={selectedNeighborhood}
            neighborhoods={neighborhoods}
            site={site}
            mapQuery={mapQuery}
            customCity={customCity}
            customNeighborhood={customNeighborhood}
            onCityChange={handleCityChange}
            onNeighborhoodChange={handleNeighborhoodChange}
            onSiteChange={handleSiteChange}
            onCustomCityChange={setCustomCity}
            onCustomNeighborhoodChange={setCustomNeighborhood}
          />
        </section>

        <div className="mt-8">
          <Button
            variant="primary"
            fullWidth
            size="lg"
            disabled={photos.length < listingMinPhotos}
            onClick={handleContinue}
            className={`gap-2 ${photos.length >= listingMinPhotos ? 'animate-[halo-pulse_2s_ease-in-out_infinite]' : ''}`}
          >
            <span>{isArabic ? 'متابعة لتفاصيل الإعلان' : 'Continue to Details'}</span>
            <NextIcon size={18} variant="Linear" />
          </Button>
        </div>
      </div>
    </div>
  );
};

