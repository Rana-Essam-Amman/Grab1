import { useState, useRef, RefObject, useCallback } from 'react';
import { usePostWizard } from './usePostWizard';
import { listingMaxPhotos } from '@/data/photoRules';
import { compressImage } from '../helpers/compressImage';

export interface UsePhotoUploadReturn {
  photos: string[];
  uploading: boolean;
  fileInputRef: RefObject<HTMLInputElement>;
  handleFiles: (files: FileList | null) => void;
  handleRemove: (index: number) => void;
  handleUseSample: (category: string) => void;
  clearPhotos: () => void;
}

export function usePhotoUpload(): UsePhotoUploadReturn {
  const { postDraft, updatePostDraft } = usePostWizard();
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const photos = postDraft.photos || [];

  const handleFiles = useCallback(
    async (files: FileList | null) => {
      if (!files || files.length === 0) return;
      const remainingSlots = listingMaxPhotos - photos.length;
      if (remainingSlots <= 0) return;
      const filesToRead = Array.from(files).slice(0, remainingSlots);

      setUploading(true);
      try {
        const results = await Promise.all(filesToRead.map(compressImage));
        const newPhotos = results.map((r) => r.dataUrl);
        const existing = postDraft.photos || [];
        const merged = [...existing, ...newPhotos].slice(0, listingMaxPhotos);
        updatePostDraft({ photos: merged });
      } catch {
        // file reading error handled silently
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

  return { photos, uploading, fileInputRef, handleFiles, handleRemove, handleUseSample, clearPhotos };
}
