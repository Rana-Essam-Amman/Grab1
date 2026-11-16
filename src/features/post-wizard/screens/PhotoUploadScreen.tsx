
import { useUI } from '@/hooks/useUI';
import { usePostWizard } from '../hooks/usePostWizard';
import { usePhotoUpload } from '../hooks/usePhotoUpload';
import { useLocationPick } from '../hooks/useLocationPick';
import React, { useCallback } from 'react';
import { listingMinPhotos } from '@/data/photoRules';
import { ArrowLeft, ArrowRight } from 'iconsax-react';
import { Button } from '@/shared/ui/Button';
import { PhotoPreviewList } from '../components/PhotoPreviewList';
import { PhotoUploader } from '../components/PhotoUploader';
import { PostFlowHeader } from '../components/PostFlowHeader';
import { LocationFields } from '../components/LocationFields';
import { PhotoUploadErrors } from '../components/PhotoUploadErrors';
import { categories } from '@/data/categories';
import { findSubcategoryBySlug } from '@/data/subcategories';

export const PhotoUploadScreen: React.FC = () => {
  const { isArabic, goBack } = useUI();
  const { postDraft, updatePostDraft } = usePostWizard();
  const cat = categories.find((c) => c.slug === postDraft.categorySlug);
  const sub = findSubcategoryBySlug(postDraft.subcategorySlug);
  const { photos, errors, handleFiles, handleRemove, handleUseSample } = usePhotoUpload();

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

  const handleSetCover = useCallback((index: number) => {
    const currentPhotos = postDraft.photos || [];
    if (index === 0) return;
    const reordered = [currentPhotos[index], ...currentPhotos.filter((_, i) => i !== index)];
    updatePostDraft({ photos: reordered });
  }, [postDraft.photos, updatePostDraft]);

  const handleImageError = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    (e.target as HTMLImageElement).src =
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect width="100" height="100" fill="%23E5E7EB"/></svg>';
  }, []);

  const handleNeighborhoodNameChange = useCallback((v: string) => {
    updatePostDraft({ neighborhoodName: v });
  }, [updatePostDraft]);

  return (
    <div className="flex flex-col min-h-screen bg-surface pb-12" dir={isArabic ? 'rtl' : 'ltr'}>
      <PostFlowHeader
        step={2}
        totalSteps={3}
        titleAr="الصور والموقع"
        titleEn="Photos & Location"
        isArabic={isArabic}
        onBack={goBack}
        categoryAsset={cat?.asset}
        categoryNameAr={cat?.nameAr}
        categoryNameEn={cat?.nameEn}
        subcategoryNameAr={sub?.nameAr}
        subcategoryNameEn={sub?.nameEn}
      />

      <div className="p-4 flex-1 flex flex-col gap-5">
        {/* Photos — compact */}
        <section className="flex flex-col gap-3">
          <h2 className="text-base font-semibold text-ink">
            {isArabic ? 'أضف صور إعلانك' : 'Add your listing photos'}
          </h2>
          <p className="text-xs text-ink-muted">
            {isArabic ? 'الصورة الواضحة تساعد المشتري يتعرف على سلعتك.' : 'Clear photos help buyers recognise your item.'}
          </p>

          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
            <PhotoPreviewList
              photos={photos}
              isArabic={isArabic}
              onRemove={handleRemove}
              onSetCover={handleSetCover}
              onImageError={handleImageError}
            />
            <PhotoUploader
              photoCount={photos.length}
              isArabic={isArabic}
              onFiles={handleFiles}
            />
          </div>

          <PhotoUploadErrors errors={errors} />

          {import.meta.env.DEV && photos.length === 0 && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleUseSample(postDraft.categorySlug)}
              className="self-start"
            >
              {isArabic ? 'استخدم صورة تجريبية' : 'Use sample photo'}
            </Button>
          )}
        </section>

        {/* Location — friendly section */}
        <section className="flex flex-col gap-3">
          <h2 className="text-base font-semibold text-ink">
            {isArabic ? 'وين موقع إعلانك؟' : 'Where is your listing?'}
          </h2>
          <p className="text-xs text-ink-muted">
            {isArabic
              ? 'اختَر المدينة والمنطقة، وإذا بتحب اكتب اسم الحي.'
              : 'Choose the city and area. You can optionally add a neighbourhood name.'}
          </p>

          <LocationFields
            isArabic={isArabic}
            autoFocusSearch={false}
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
            neighborhoodName={postDraft.neighborhoodName ?? ''}
            onNeighborhoodNameChange={handleNeighborhoodNameChange}
          />
        </section>

        <div className="mt-4">
          <Button
            variant="primary"
            fullWidth
            size="lg"
            disabled={photos.length < listingMinPhotos}
            onClick={handleContinue}
            className="gap-2"
          >
            <span>{isArabic ? 'متابعة لتفاصيل الإعلان' : 'Continue to Details'}</span>
            <NextIcon size={18} variant="Linear" />
          </Button>
        </div>
      </div>
    </div>
  );
};
