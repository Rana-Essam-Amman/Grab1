import React, { useState, useCallback } from 'react';
import { useUI } from '@/hooks/useUI';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import { ArrowLeft, ArrowRight, Lock, CheckCircle2 } from 'lucide-react';
import { AvatarUploader } from '../components/AvatarUploader';

export const EditProfileScreen: React.FC = () => {
  const { isArabic, goBack } = useUI();
  const { user, updateUser } = useAuth();

  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [localAvatar, setLocalAvatar] = useState<string | undefined>(user?.avatar);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const BackIcon = isArabic ? ArrowRight : ArrowLeft;

  const handleSave = useCallback(() => {
    if (!firstName.trim()) return;

    updateUser({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      avatar: localAvatar,
    });

    setToastMessage(isArabic ? 'تم حفظ التعديلات بنجاح' : 'Changes saved successfully');
    
    setTimeout(() => {
      setToastMessage(null);
      goBack();
    }, 1500);
  }, [firstName, lastName, email, localAvatar, updateUser, isArabic, goBack]);

  return (
    <div className="flex flex-col min-h-screen bg-background pb-16 font-cairo relative" dir={isArabic ? 'rtl' : 'ltr'}>
      {/* Top Bar */}
      <div className="px-4 py-4 border-b border-border flex items-center gap-3 bg-surface sticky top-0 z-20">
        <button
          onClick={goBack}
          className="w-9 h-9 rounded-full bg-background flex items-center justify-center text-ink-muted hover:bg-border transition-colors cursor-pointer"
        >
          <BackIcon size={18} />
        </button>
        <h1 className="text-base font-bold text-ink">
          {isArabic ? 'تعديل الملف الشخصي' : 'Edit Profile'}
        </h1>
      </div>

      <div className="p-4 flex flex-col gap-6 max-w-[440px] mx-auto w-full">
        {/* Avatar Uploader Section */}
        <div className="flex flex-col items-center py-4 bg-surface rounded-2xl border border-border shadow-2xs">
          <AvatarUploader
            currentAvatar={localAvatar}
            fallbackInitial={user?.firstName?.charAt(0) || 'U'}
            onAvatarChange={(dataUrl) => setLocalAvatar(dataUrl || undefined)}
          />
        </div>

        {/* Form Fields */}
        <div className="flex flex-col gap-4 bg-surface rounded-2xl border border-border p-5 shadow-2xs">
          <Input
            label={isArabic ? 'الاسم الأول (مطلوب)' : 'First Name (Required)'}
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            className="font-cairo"
          />

          <Input
            label={isArabic ? 'اسم العائلة' : 'Last Name'}
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="font-cairo"
          />

          <Input
            label={isArabic ? 'رقم الهاتف (لا يمكن تعديله)' : 'Phone Number (Read-only)'}
            value={user?.phone || ''}
            disabled
            icon={<Lock size={16} className="text-ink-muted" />}
            className="font-cairo opacity-70"
          />

          <Input
            label={isArabic ? 'البريد الإلكتروني' : 'Email Address'}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            className="font-cairo"
          />
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-3">
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={handleSave}
            disabled={!firstName.trim()}
            className="font-bold bg-primary hover:bg-primary-hover text-white py-3.5 rounded-xl justify-center"
          >
            {isArabic ? 'حفظ التعديلات' : 'Save Changes'}
          </Button>

          <Button
            variant="ghost"
            size="lg"
            fullWidth
            onClick={goBack}
            className="font-bold justify-center"
          >
            {isArabic ? 'إلغاء' : 'Cancel'}
          </Button>
        </div>
      </div>

      {/* Visual Toast Notification Overlay */}
      {toastMessage && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-ink text-surface px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-lg z-50 text-sm font-bold animate-in fade-in slide-in-from-bottom-4 duration-300">
          <CheckCircle2 size={16} className="text-primary" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
export default EditProfileScreen;
