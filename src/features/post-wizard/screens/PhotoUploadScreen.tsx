
import React, { useCallback } from 'react';
import { useUI } from '@/hooks/useUI';
import { listingMinPhotos } from '@/data/photoRules';
import { ArrowLeft, ArrowRight } from 'iconsax-react';
import { Button } from '@/shared/ui/Button';
import { categories } from '@/data/categories';
import { findSubcategoryBySlug } from '@/data/subcategories';
import { usePostWizard } from '../hooks/usePostWizard';
import { usePhotoUpload } from '../hooks/usePhotoUpload';
import { useLocationPick } from '../hooks/useLocationPick';
import { PostFlowHeader } from '../components/PostFlowHeader';
import { PhotoUploadSections } from '../components/PhotoUploadSections';

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
    const reordered = [
      currentPhotos[index],
      ...currentPhotos.filter((_, i) => i !== index),
    ];
    updatePostDraft({ photos: reordered });
  }, [postDraft.photos, updatePostDraft]);

  const handleImageError = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    (e.target as HTMLImageElement).src =
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect width="100" height="100" fill="%23E5E7EB"/></svg>';
  }, []);

  const handleNeighborhoodNameChange = useCallback((value: string) => {
    updatePostDraft({ neighborhoodName: value });
  }, [updatePostDraft]);

  return (
    <div
      className="flex flex-col min-h-screen bg-surface pb-12"
      dir={isArabic ? 'rtl' : 'ltr'}
    >
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
        <PhotoUploadSections
          isArabic={isArabic}
          photos={photos}
          errors={errors}
          onRemove={handleRemove}
          onSetCover={handleSetCover}
          onImageError={handleImageError}
          onFiles={handleFiles}
          onUseSample={() => handleUseSample(postDraft.categorySlug)}
          location={{
            autoFocusSearch: false,
            selectedCity,
            cities,
            selectedNeighborhood,
            neighborhoods,
            site,
            mapQuery,
            customCity,
            customNeighborhood,
            onCityChange: handleCityChange,
            onNeighborhoodChange: handleNeighborhoodChange,
            onSiteChange: handleSiteChange,
            onCustomCityChange: setCustomCity,
            onCustomNeighborhoodChange: setCustomNeighborhood,
            neighborhoodName: postDraft.neighborhoodName ?? '',
            onNeighborhoodNameChange: handleNeighborhoodNameChange,
          }}
        />

        <div className="mt-4">
          <Button
            variant="primary"
            fullWidth
            size="lg"
            disabled={photos.length < listingMinPhotos}
            onClick={handleContinue}
            className="gap-2"
          >
            <span>
              {isArabic ? 'متابعة لتفاصيل الإعلان' : 'Continue to Details'}
            </span>
            <NextIcon size={18} variant="Linear" />
          </Button>
        </div>
      </div>
    </div>
  );
};
