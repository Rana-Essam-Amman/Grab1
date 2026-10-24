import { useState, useRef, RefObject, useCallback } from 'react';
import { usePostWizard } from './usePostWizard';
import { listingMaxPhotos } from '@/data/photoRules';
import { compressImage } from '../helpers/compressImage';
import { capture } from '@/shared/analytics/posthog';
import { EVENTS } from '@/shared/analytics/events';

export interface UsePhotoUploadReturn {
  photos: string[];
  uploading: boolean;
  errors: string[];
  fileInputRef: RefObject<HTMLInputElement>;
  handleFiles: (files: FileList | null) => void;
  handleRemove: (index: number) => void;
  handleUseSample: (category: string) => void;
  clearPhotos: () => void;
}

export function usePhotoUpload(): UsePhotoUploadReturn {
  const { postDraft, updatePostDraft } = usePostWizard();
  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const photos = postDraft.photos || [];

  const handleFiles = useCallback(
    async (files: FileList | null) => {
      if (!files || files.length === 0) return;
      const remainingSlots = listingMaxPhotos - photos.length;
      if (remainingSlots <= 0) return;
      const filesToRead = Array.from(files).slice(0, remainingSlots);

      setUploading(true);
      setErrors([]);
      try {
        const results = await Promise.allSettled(filesToRead.map(compressImage));
        const newPhotos: string[] = [];
        let hasRejected = false;

        for (const res of results) {
          if (res.status === 'fulfilled') {
            newPhotos.push(res.value.dataUrl);
          } else {
            hasRejected = true;
          }
        }

        if (hasRejected) {
          setErrors((prev) => [...prev, 'Some images failed to process. The rest were saved.']);
        }

        if (newPhotos.length > 0) {
          const existing = postDraft.photos || [];
          const merged = [...existing, ...newPhotos].slice(0, listingMaxPhotos);
          updatePostDraft({ photos: merged });
          capture(EVENTS.PHOTO_UPLOADED, { count: newPhotos.length });
        }
      } catch (error) {
        setErrors((prev) => [...prev, 'Failed to process one or more images. Please try again.']);
      } finally {
        setUploading(false);
      }
    },
    [postDraft.photos, updatePostDraft, photos.length]
  );

  const handleRemove = (index: number) => updatePostDraft({ photos: photos.filter((_, i) => i !== index) });
  const handleUseSample = (category: string) => {
    const samples = (category === 'motors' ? ['/assets/listings/car.jpg'] : ['/assets/listings/item.jpg']);
    updatePostDraft({ photos: samples });
  };
  const clearPhotos = () => updatePostDraft({ photos: [] });

  return { photos, uploading, errors, fileInputRef, handleFiles, handleRemove, handleUseSample, clearPhotos };
}
