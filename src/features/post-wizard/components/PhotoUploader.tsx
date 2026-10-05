import React from 'react';
import { Icon } from '@iconify/react';
import { listingMaxPhotos } from '@/data/photoRules';

interface Props {
  photoCount: number;
  isArabic: boolean;
  onFiles: (files: FileList | null) => void;
}

export const PhotoUploader: React.FC<Props> = ({ photoCount, isArabic, onFiles }) => {
  return photoCount < listingMaxPhotos ? (
    <label className="aspect-square rounded-2xl border-2 border-dashed border-line hover:border-[#E57E25]/60 bg-canvas flex flex-col items-center justify-center gap-1 cursor-pointer transition-colors">
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={(e) => onFiles(e.target.files)}
        className="hidden"
      />
      <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
        <Icon icon="fluent-emoji:camera" width={24} height={24} className="shrink-0" />
      </div>
      <span className="text-[11px] font-bold text-ink-soft">
        {isArabic ? 'إضافة صورة' : 'Add Photo'}
      </span>
    </label>
  ) : null;
};
