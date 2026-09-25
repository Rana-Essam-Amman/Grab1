import { useUI } from '@/hooks/useUI';
import { usePostWizard } from '../hooks/usePostWizard';
import { usePhotoUpload } from '../hooks/usePhotoUpload';
import React, { useCallback } from 'react';
import { listingMinPhotos } from '@/data/photoRules';
import { ArrowLeft, ArrowRight, Warning2 } from 'iconsax-react';
import { Button } from '@/shared/ui/Button';
import { PhotoPreviewList } from '../components/PhotoPreviewList';
import { PhotoUploader } from '../components/PhotoUploader';
import { PostFlowHeader } from '../components/PostFlowHeader';

export const PhotoUploadScreen: React.FC = () => {
  const { isArabic, goBack, navigateTo } = useUI();
  const { postDraft } = usePostWizard();
  const { photos, handleFiles, handleRemove, handleUseSample } = usePhotoUpload();
  
  const NextIcon = isArabic ? ArrowLeft : ArrowRight;

  const handleContinue = useCallback(() => {
    if (photos.length < listingMinPhotos) return;
    navigateTo('post-location');
  }, [photos.length, navigateTo]);

  const handleImageError = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    (e.target as HTMLImageElement).src =
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect width="100" height="100" fill="%23E5E7EB"/></svg>';
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-surface pb-12" dir={isArabic ? 'rtl' : 'ltr'}>
      <PostFlowHeader
        step={3}
        titleAr="إضافة صور السلعة"
        titleEn="Upload Photos"
        isArabic={isArabic}
        onBack={goBack}
      />

      <div className="p-4 flex-1 flex flex-col gap-4">
        <div className="p-3.5 rounded-2xl bg-[#E57E25]/8 border border-[#E57E25]/20 flex items-start gap-2.5">
          <Warning2 size={16} variant="Bold" color="#E57E25" className="shrink-0 mt-0.5" />
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

        <div className="mt-auto pt-6">
          <Button
            variant="primary"
            fullWidth
            size="lg"
            disabled={photos.length < listingMinPhotos}
            onClick={handleContinue}
            className={`gap-2 ${photos.length >= listingMinPhotos ? 'animate-[halo-pulse_2s_ease-in-out_infinite]' : ''}`}
          >
            <span>{isArabic ? 'متابعة إلى تحديد الموقع' : 'Continue to Location'}</span>
            <NextIcon size={18} variant="Linear" />
          </Button>
        </div>
      </div>
    </div>
  );
};

