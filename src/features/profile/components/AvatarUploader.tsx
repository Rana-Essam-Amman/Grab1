import React, { useRef, useState, useCallback } from 'react';
import { Avatar } from '@/shared/ui/Avatar';
import { Refresh } from 'iconsax-react';
import { validateImageFile, compressImageToDataUrl } from '@/shared/lib/imageUtils';
import { AvatarUploaderButtons } from './AvatarUploaderButtons';

interface AvatarUploaderProps {
  currentAvatar?: string;
  fallbackInitial: string;
  onAvatarChange: (dataUrl: string | null) => void;
  size?: 'md' | 'lg' | 'xl';
}

const sizeClasses = {
  md: { container: 'w-10 h-10', text: 'text-sm', cameraBtn: 'w-4 h-4', cameraIcon: 8, removeBtn: 'w-3 h-3', removeIcon: 6 },
  lg: { container: 'w-14 h-14', text: 'text-base', cameraBtn: 'w-6 h-6', cameraIcon: 10, removeBtn: 'w-4 h-4', removeIcon: 8 },
  xl: { container: 'w-24 h-24', text: 'text-3xl', cameraBtn: 'w-8 h-8', cameraIcon: 14, removeBtn: 'w-6 h-6', removeIcon: 12 },
};

export const AvatarUploader: React.FC<AvatarUploaderProps> = ({
  currentAvatar,
  fallbackInitial,
  onAvatarChange,
  size = 'xl',
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isArabic = typeof document !== 'undefined' && document.documentElement.dir === 'rtl';

  const handleCameraClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    const validation = validateImageFile(file);
    if (!validation.valid) {
      if (validation.error === 'invalid_type') {
        setError(isArabic ? 'صيغة الملف غير مدعومة. يرجى اختيار صورة.' : 'Unsupported format. Please select an image.');
      } else if (validation.error === 'too_large') {
        setError(isArabic ? 'حجم الصورة كبير جداً (الحد الأقصى ٥ ميجابايت).' : 'Image is too large (maximum 5MB).');
      } else {
        setError(isArabic ? 'ملف غير صالح.' : 'Invalid file.');
      }
      return;
    }
    try {
      setIsCompressing(true);
      const compressedDataUrl = await compressImageToDataUrl(file);
      onAvatarChange(compressedDataUrl);
    } catch (err) {
      setError(isArabic ? 'فشل تحميل الصورة وتحجيمها.' : 'Failed to compress and load image.');
    } finally {
      setIsCompressing(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }, [isArabic, onAvatarChange]);

  const handleRemove = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onAvatarChange(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [onAvatarChange]);

  const currentSize = sizeClasses[size];

  return (
    <div className="flex flex-col items-center gap-3">
      <div className={`relative ${currentSize.container}`}>
        <Avatar
          src={currentAvatar}
          fallback={fallbackInitial}
          size={size}
          className={`${currentSize.container} ${currentSize.text} border-2 border-border shadow-xs bg-background`}
        />
        {isCompressing && (
          <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center text-white backdrop-blur-xs">
            <Refresh size={24} variant="Linear" color="#E57E25" className="animate-spin w-1/3 h-1/3" />
          </div>
        )}
        <AvatarUploaderButtons
          currentSize={currentSize}
          currentAvatar={currentAvatar}
          isCompressing={isCompressing}
          handleCameraClick={handleCameraClick}
          handleRemove={handleRemove}
        />
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
      {error && (
        <p className="text-[11px] font-bold text-danger text-center max-w-[200px] leading-snug">
          {error}
        </p>
      )}
    </div>
  );
};
