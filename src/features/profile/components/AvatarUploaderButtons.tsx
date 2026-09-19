import React from 'react';
import { Camera, Add } from 'iconsax-react';

interface AvatarUploaderButtonsProps {
  currentSize: { cameraBtn: string; cameraIcon: number; removeBtn: string; removeIcon: number };
  currentAvatar?: string;
  isCompressing: boolean;
  handleCameraClick: () => void;
  handleRemove: (e: React.MouseEvent) => void;
}

export const AvatarUploaderButtons: React.FC<AvatarUploaderButtonsProps> = ({
  currentSize,
  currentAvatar,
  isCompressing,
  handleCameraClick,
  handleRemove,
}) => {
  return (
    <>
      <button
        type="button"
        onClick={handleCameraClick}
        disabled={isCompressing}
        className={`absolute bottom-0 end-0 ${currentSize.cameraBtn} rounded-full bg-primary text-white border border-surface flex items-center justify-center shadow-md hover:bg-primary-hover transition-colors cursor-pointer disabled:opacity-50`}
      >
        <Camera size={currentSize.cameraIcon} variant="Linear" color="#FFFFFF" />
      </button>
      {currentAvatar && !isCompressing && (
        <button
          type="button"
          onClick={handleRemove}
          className={`absolute top-0 start-0 ${currentSize.removeBtn} rounded-full bg-danger text-white border border-surface flex items-center justify-center shadow-md hover:bg-danger/90 transition-colors cursor-pointer`}
        >
          <Add size={currentSize.removeIcon} variant="Linear" color="#FFFFFF" className="rotate-45" />
        </button>
      )}
    </>
  );
};
