import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { uploadListingImages, removeListingImages } from '@/features/listings/services/storageService';

export function useAdminImageEditor(
  images: string[],
  setImages: (imgs: string[]) => void,
  ownerUserId: string | undefined,
  isArabic: boolean
) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddImages = useCallback(async (files: FileList | File[]) => {
    if (!ownerUserId) {
      setError(isArabic ? 'خطأ: مالك الإعلان غير معروف' : 'Error: Listing owner unknown');
      return;
    }
    if (images.length + files.length > 10) {
      setError(isArabic ? 'الحد الأقصى 10 صور' : 'Maximum 10 images');
      return;
    }

    setIsProcessing(true);
    setError(null);
    try {
      const dataUrls: string[] = await Promise.all(
        Array.from(files).map((file) => new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        }))
      );

      const { urls, failedCount } = await uploadListingImages(dataUrls, ownerUserId);
      if (failedCount > 0) {
        setError(isArabic ? `فشل رفع ${failedCount} صورة` : `Failed to upload ${failedCount} image(s)`);
      }
      if (urls.length > 0) {
        setImages([...images, ...urls]);
      }
    } catch (err) {
      setError(isArabic ? 'حدث خطأ أثناء رفع الصور' : 'Error uploading images');
    } finally {
      setIsProcessing(false);
    }
  }, [images, setImages, ownerUserId, isArabic]);

  const handleRemoveImage = useCallback(async (url: string) => {
    setIsProcessing(true);
    setError(null);
    try {
      const result = await removeListingImages([url]);
      if (result.error || result.failed > 0) {
        const message = result.error ||
          (isArabic ? 'حدث خطأ أثناء حذف الصورة' : 'Error deleting image');
        setError(message);
        toast.error(message);
        return;
      }
      setImages(images.filter((img) => img !== url));
    } catch (err) {
      const message = isArabic ? 'حدث خطأ أثناء حذف الصورة' : 'Error deleting image';
      setError(message);
      toast.error(message);
    } finally {
      setIsProcessing(false);
    }
  }, [images, setImages, isArabic]);

  return { isProcessing, error, handleAddImages, handleRemoveImage };
}
