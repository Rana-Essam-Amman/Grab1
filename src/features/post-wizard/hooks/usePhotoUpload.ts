import { useState, useRef, RefObject, useCallback } from 'react';
import { usePostWizard } from './usePostWizard';
import { listingMaxPhotos } from '@/data/photoRules';

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

  const handleFiles = useCallback((files: FileList | null) => {
    if (!files) return;
    const remainingSlots = listingMaxPhotos - photos.length;
    const filesToRead = Array.from(files).slice(0, remainingSlots);

    filesToRead.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          updatePostDraft({ photos: [...(postDraft.photos || []), e.target.result as string] });
        }
      };
      reader.readAsDataURL(file);
    });
  }, [postDraft.photos, updatePostDraft, photos.length]);

  const handleRemove = (index: number) => updatePostDraft({ photos: photos.filter((_, i) => i !== index) });
  const handleUseSample = (category: string) => {
    const samples = (category === 'motors' ? ['/assets/listings/car.jpg'] : ['/assets/listings/item.jpg']);
    updatePostDraft({ photos: samples });
  };
  const clearPhotos = () => updatePostDraft({ photos: [] });

  return { photos, uploading, fileInputRef, handleFiles, handleRemove, handleUseSample, clearPhotos };
}
