import { useState, useRef, useCallback } from 'react';
import { validateImageFile } from '@/shared/lib/imageUtils';

export interface UseImageUploadReturn {
  selectedImages: string[];
  fileInputRef: React.RefObject<HTMLInputElement>;
  handleImageSelect: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  handleRemoveImage: (index: number) => void;
  clearImages: () => void;
}

export const useImageUpload = (): UseImageUploadReturn => {
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newImages: string[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const validation = validateImageFile(file);
      if (!validation.valid) continue;

      try {
        const objectUrl = URL.createObjectURL(file);
        newImages.push(objectUrl);
      } catch {
        // ignore
      }
    }

    setSelectedImages((prev) => [...prev, ...newImages].slice(0, 4));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  const handleRemoveImage = useCallback((index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const clearImages = useCallback(() => {
    setSelectedImages([]);
  }, []);

  return {
    selectedImages,
    fileInputRef,
    handleImageSelect,
    handleRemoveImage,
    clearImages,
  };
};
