import React from 'react';
import { Camera } from 'lucide-react';
import { listingMaxPhotos } from '@/data/photoRules';

interface Props {
  photoCount: number;
  isArabic: boolean;
  onFiles: (files: FileList | null) => void;
}

export const PhotoUploader: React.FC<Props> = ({ photoCount, isArabic, onFiles }) => {
  return photoCount < listingMaxPhotos ? (
    <label className="aspect-square rounded-2xl border-2 border-dashed border-border hover:border-primary bg-surface flex flex-col items-center justify-center gap-1 cursor-pointer transition-colors">
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={(e) => onFiles(e.target.files)}
        className="hidden"
      />
      <Camera size={24} className="text-ink-muted" />
      <span className="text-[11px] font-semibold text-ink-muted">
        {isArabic ? 'إضافة صورة' : 'Add Photo'}
      </span>
    </label>
  ) : null;
};
