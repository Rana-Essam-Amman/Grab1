import React from 'react';
import { Button } from '@/shared/ui/Button';
import { PhotoPreviewList } from './PhotoPreviewList';
import { PhotoUploader } from './PhotoUploader';
import { PhotoUploadErrors } from './PhotoUploadErrors';
import { LocationFields } from './LocationFields';

type PreviewProps = React.ComponentProps<typeof PhotoPreviewList>;
type UploaderProps = React.ComponentProps<typeof PhotoUploader>;
type LocationProps = React.ComponentProps<typeof LocationFields>;

interface Props {
  isArabic: boolean;
  photos: PreviewProps['photos'];
  errors: React.ComponentProps<typeof PhotoUploadErrors>['errors'];
  onRemove: PreviewProps['onRemove'];
  onSetCover: PreviewProps['onSetCover'];
  onImageError: PreviewProps['onImageError'];
  onFiles: UploaderProps['onFiles'];
  onUseSample: () => void;
  location: Omit<LocationProps, 'isArabic'>;
}

export const PhotoUploadSections: React.FC<Props> = ({
  isArabic,
  photos,
  errors,
  onRemove,
  onSetCover,
  onImageError,
  onFiles,
  onUseSample,
  location,
}) => {
  return (
    <>
      <section className="flex flex-col gap-3">
        <h2 className="text-base font-semibold text-ink">
          {isArabic ? 'أضف صور إعلانك' : 'Add your listing photos'}
        </h2>
        <p className="text-xs text-ink-muted">
          {isArabic
            ? 'الصورة الواضحة تساعد المشتري يتعرف على سلعتك.'
            : 'Clear photos help buyers recognise your item.'}
        </p>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
          <PhotoPreviewList
            photos={photos}
            isArabic={isArabic}
            onRemove={onRemove}
            onSetCover={onSetCover}
            onImageError={onImageError}
          />
          <PhotoUploader
            photoCount={photos.length}
            isArabic={isArabic}
            onFiles={onFiles}
          />
        </div>
        <PhotoUploadErrors errors={errors} />
        {import.meta.env.DEV && photos.length === 0 && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onUseSample}
            className="self-start"
          >
            {isArabic ? 'استخدم صورة تجريبية' : 'Use sample photo'}
          </Button>
        )}
      </section>
      <section className="flex flex-col gap-3">
        <h2 className="text-base font-semibold text-ink">
          {isArabic ? 'وين موقع إعلانك؟' : 'Where is your listing?'}
        </h2>
        <p className="text-xs text-ink-muted">
          {isArabic
            ? 'اختَر المدينة والمنطقة، وإذا بتحب اكتب اسم الحي.'
            : 'Choose the city and area. You can optionally add a neighbourhood name.'}
        </p>
        <LocationFields isArabic={isArabic} {...location} />
      </section>
    </>
  );
};
