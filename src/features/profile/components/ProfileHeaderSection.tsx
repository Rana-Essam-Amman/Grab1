import React from 'react';
import { ArrowLeft, ArrowRight } from 'iconsax-react';
import { Icon } from '@iconify/react';
import { Button } from '@/shared/ui/Button';
import { Avatar } from '@/shared/ui/Avatar';
import { getUserAvatar } from '@/shared/lib/userDisplay';

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
      <div className="-mx-4 px-4 py-4 bg-brand border-b border-white/10 flex items-center gap-3 sticky top-0 z-20">
        <Button
          variant="ghost"
          size="icon"
          onClick={goBack}
          className="w-10 h-10 rounded-full bg-surface/15 hover:bg-surface/25 shrink-0 flex items-center justify-center p-0 cursor-pointer"
          aria-label={isArabic ? 'رجوع' : 'Back'}
        >
          {isArabic ? <ArrowRight size={18} variant="Linear" color="#FFFFFF" /> : <ArrowLeft size={18} variant="Linear" color="#FFFFFF" />}
        </Button>
        <h1 className="text-lg font-bold text-white">
          {isArabic ? 'الملف الشخصي' : 'My Profile'}
        </h1>
      </div>

      {/* Profile Header Card */}
      <div className="bg-surface rounded-2xl border border-border p-4 flex items-center gap-3.5 shadow-2xs">
        <Avatar
          src={getUserAvatar(user)}
          fallback={user?.firstName?.charAt(0) || 'U'}
          size="lg"
          className="text-primary bg-background border border-border shrink-0"
        />
        <div className="flex flex-col gap-0.5">
          <h1 className="text-base font-bold text-ink font-cairo">
            {profileTitle}
          </h1>
          <div className="flex items-center gap-1.5 text-xs text-ink-muted">
            <Icon icon="noto:round-pushpin" width={13} height={13} className="shrink-0" />
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
