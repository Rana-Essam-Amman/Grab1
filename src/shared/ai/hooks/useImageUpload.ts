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

    const validFiles: File[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const validation = validateImageFile(file);
      if (!validation.valid) continue;
      validFiles.push(file);
    }

    // Read as data URLs (base64) — persist in localStorage, survive page reload.
    const readPromises = validFiles.map(
      (file) =>
        new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = (ev) => {
            const result = ev.target?.result;
            resolve(typeof result === 'string' ? result : '');
          };
          reader.onerror = () => resolve('');
          reader.readAsDataURL(file);
        })
    );

    const newImages = (await Promise.all(readPromises)).filter((url) => url.length > 0);

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
