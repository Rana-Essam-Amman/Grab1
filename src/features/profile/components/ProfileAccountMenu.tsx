import React from 'react';
import { ProfileCircle, ShieldSecurity, Logout, Trash } from 'iconsax-react';
import { Button } from '@/shared/ui/Button';
import { ScreenType } from '@/store/ui.slice.types';

interface ProfileAccountMenuProps {
  isArabic: boolean;
  accountManagementText: string;
  signOutText: string;
  navigateTo: (screen: ScreenType) => void;
  setShowLogoutModal: (show: boolean) => void;
  setShowDeleteModal: (show: boolean) => void;
}

export const ProfileAccountMenu: React.FC<ProfileAccountMenuProps> = ({
  isArabic,
  accountManagementText,
  signOutText,
  navigateTo,
  setShowLogoutModal,
  setShowDeleteModal,
}) => {
  return (
    <div className="flex flex-col gap-3 pt-4 border-t border-border/60">
      <h2 className="text-sm font-bold text-ink font-cairo px-0.5">
        {accountManagementText}
      </h2>
      <div className="flex flex-col gap-2.5">
        {/* Edit Profile */}
        <Button
          variant="secondary"
          fullWidth
          size="lg"
          onClick={() => navigateTo('edit-profile')}
          className="flex items-center justify-between font-bold border border-border px-4 py-3"
        >
          <div className="flex items-center gap-2.5">
            <ProfileCircle size={18} variant="Linear" color="#E57E25" />
            <span>{isArabic ? 'تعديل الملف الشخصي' : 'Edit Profile'}</span>
          </div>
        </Button>
        {/* Privacy */}
        <Button
          variant="secondary"
          fullWidth
          size="lg"
          onClick={() => navigateTo('terms')}
          className="flex items-center justify-between font-bold border border-border px-4 py-3"
        >
          <div className="flex items-center gap-2.5">
            <ShieldSecurity size={18} variant="Linear" color="#E57E25" />
            <span>{isArabic ? 'سياسة الخصوصية والشروط' : 'Privacy Policy & Terms'}</span>
          </div>
        </Button>
        {/* Sign Out */}
        <Button
          variant="secondary"
          fullWidth
          size="lg"
          onClick={() => setShowLogoutModal(true)}
          className="flex items-center justify-between font-bold border border-danger/30 text-danger hover:bg-danger/5 px-4 py-3"
        >
          <div className="flex items-center gap-2.5">
            <Logout size={18} variant="Linear" color="#EF4444" />
            <span>{signOutText}</span>
          </div>
        </Button>
        {/* Delete Account */}
        <Button
          variant="ghost"
          fullWidth
          size="md"
          onClick={() => setShowDeleteModal(true)}
          className="flex items-center justify-center font-bold text-danger hover:bg-danger/5 gap-2"
        >
          <Trash size={16} variant="Linear" color="#EF4444" />
          <span>{isArabic ? 'حذف الحساب نهائياً' : 'Delete Account Permanently'}</span>
        </Button>
      </div>
    </div>
  );
};
