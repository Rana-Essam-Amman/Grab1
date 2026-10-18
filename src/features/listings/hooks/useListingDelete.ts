import { useState, useCallback } from 'react';
import { useListings } from '@/hooks/useListings';
import { toast } from 'sonner';

export function useListingDelete(isArabic: boolean) {
  const { deleteListing } = useListings();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = useCallback(async (id: string, onSuccess: () => void) => {
    if (isDeleting) return;
    setIsDeleting(true);
    try {
      const result = await deleteListing(id);
      if (result.success) {
        onSuccess();
        return;
      }
      toast.error(isArabic ? 'فشل حذف الإعلان — حاول مرة أخرى' : 'Failed to delete — try again');
    } finally {
      setIsDeleting(false);
    }
  }, [deleteListing, isDeleting, isArabic]);

  return { handleDelete, isDeleting };
}
