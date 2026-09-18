import React from 'react';
import { ArrowLeft, ArrowRight, MapPin } from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { Avatar } from '@/shared/ui/Avatar';

interface ProfileHeaderSectionProps {
  isArabic: boolean;
  goBack: () => void;
  user: { avatar?: string; avatarUrl?: string; firstName?: string } | null;
  browseCountry: { nameAr: string; nameEn: string };
  browseCityAr: string;
  browseCityEn: string;
  profileTitle: string;
}

export const ProfileHeaderSection: React.FC<ProfileHeaderSectionProps> = ({
  isArabic,
  goBack,
  user,
  browseCountry,
  browseCityAr,
  browseCityEn,
  profileTitle,
}) => {
  return (
    <>
      {/* Top Bar Header */}
      <div className="flex items-center gap-3 py-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={goBack}
          className="w-9 h-9 rounded-full bg-background text-ink-muted hover:bg-border shrink-0 flex items-center justify-center cursor-pointer"
        >
          {isArabic ? <ArrowRight size={18} /> : <ArrowLeft size={18} />}
        </Button>
        <h1 className="text-base font-bold text-ink">
          {isArabic ? 'الملف الشخصي' : 'My Profile'}
        </h1>
      </div>

      {/* Profile Header Card */}
      <div className="bg-surface rounded-2xl border border-border p-4 flex items-center gap-3.5 shadow-2xs">
        <Avatar
          src={user?.avatar || user?.avatarUrl}
          fallback={user?.firstName?.charAt(0) || 'U'}
          size="lg"
          className="text-primary bg-background border border-border shrink-0"
        />
        <div className="flex flex-col gap-0.5">
          <h1 className="text-base font-bold text-ink font-cairo">
            {profileTitle}
          </h1>
          <div className="flex items-center gap-1.5 text-xs text-ink-muted">
            <MapPin size={13} className="text-primary" />
            <span>
              {isArabic
                ? `${browseCountry.nameAr} • ${browseCityAr}`
                : `${browseCountry.nameEn} • ${browseCityEn}`}
            </span>
          </div>
        </div>
      </div>
    </>
  );
};
