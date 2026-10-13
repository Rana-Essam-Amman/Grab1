import React from 'react';
import { AvatarUploader } from './AvatarUploader';
import { useAvatarUpload } from '../hooks/useAvatarUpload';
import { Spinner } from '@/shared/ui/Spinner';

interface EditProfileAvatarSectionProps {
  readonly userId: string | null;
  readonly currentAvatar: string | undefined;
  readonly fallbackInitial: string;
  readonly onAvatarChange: (url: string | undefined) => void;
}

/**
 * Wraps AvatarUploader with a Supabase upload flow. When the user picks
 * an image, it uploads to the avatars bucket and passes back the public
 * HTTP URL. Displays a spinner overlay while uploading and an inline
 * error on failure.
 */
export const EditProfileAvatarSection: React.FC<EditProfileAvatarSectionProps> = ({
  userId,
  currentAvatar,
  fallbackInitial,
  onAvatarChange,
}) => {
  const { upload, uploading, error } = useAvatarUpload(userId);

  const handleChange = async (dataUrl: string | null) => {
    if (!dataUrl) {
      onAvatarChange(undefined);
      return;
    }
    const url = await upload(dataUrl);
    if (url) onAvatarChange(url);
  };

  return (
    <div className="flex flex-col items-center py-4 bg-surface rounded-2xl border border-border shadow-2xs relative">
      <AvatarUploader
        currentAvatar={currentAvatar}
        fallbackInitial={fallbackInitial}
        onAvatarChange={handleChange}
      />
      {uploading && (
        <div className="absolute inset-0 bg-surface/60 flex items-center justify-center rounded-2xl">
          <Spinner size="md" />
        </div>
      )}
      {error && (
        <p className="text-xs text-red-500 mt-2">{error}</p>
      )}
    </div>
  );
};
