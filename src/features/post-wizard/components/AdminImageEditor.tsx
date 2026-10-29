import React, { useRef } from 'react';
import { useAdminImageEditor } from '../hooks/useAdminImageEditor';
import { Trash, Add } from 'iconsax-react';

interface Props {
  images: string[];
  setImages: (imgs: string[]) => void;
  ownerUserId?: string;
  isArabic: boolean;
}

export const AdminImageEditor: React.FC<Props> = ({ images, setImages, ownerUserId, isArabic }) => {
  const { isProcessing, error, handleAddImages, handleRemoveImage } = useAdminImageEditor(images, setImages, ownerUserId, isArabic);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleAddImages(e.target.files);
      e.target.value = ''; // reset
    }
  };

  return (
    <div className="bg-surface border border-line rounded-2xl p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-ink">
          {isArabic ? 'صور الإعلان' : 'Listing Images'} ({images.length}/10)
        </h3>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isProcessing || images.length >= 10}
          className="flex items-center gap-1 text-xs font-semibold text-brand hover:text-brand/80 disabled:opacity-50"
        >
          <Add size={16} variant="Bold" />
          {isArabic ? 'إضافة صور' : 'Add Images'}
        </button>
        <input
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          ref={fileInputRef}
          onChange={onFileChange}
        />
      </div>

      {error && (
        <div className="text-xs text-danger bg-danger/10 p-2 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid grid-cols-3 gap-2">
        {images.map((url, idx) => (
          <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-line group">
            <img src={url} alt={`img-${idx}`} className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => handleRemoveImage(url)}
              disabled={isProcessing}
              className="absolute top-1 end-1 w-6 h-6 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-danger transition-colors disabled:opacity-50"
            >
              <Trash size={12} variant="Bold" />
            </button>
          </div>
        ))}
      </div>

      {isProcessing && (
        <div className="text-xs text-ink-muted text-center animate-pulse">
          {isArabic ? 'جارٍ المعالجة...' : 'Processing...'}
        </div>
      )}
    </div>
  );
};
