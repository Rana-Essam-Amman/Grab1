import React, { useState, useCallback } from 'react';
import { useUI } from '@/hooks/useUI';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import { ArrowLeft, ArrowRight, Lock1, TickCircle, CloseCircle } from 'iconsax-react';
import { AvatarUploader } from '../components/AvatarUploader';
import { BrandMark } from '@/shared/components/BrandMark';
import { useEditProfileDraft } from '../hooks/useEditProfileDraft';
import { upsertProfile } from '@/shared/lib/profilesService';

export const EditProfileScreen: React.FC = () => {
  const { isArabic, goBack } = useUI();
  const { user, updateUser } = useAuth();

  const { draft, setField, clearDraft } = useEditProfileDraft({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
  });

  const [localAvatar, setLocalAvatar] = useState<string | undefined>(user?.avatar);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const BackIcon = isArabic ? ArrowRight : ArrowLeft;

  const handleSave = useCallback(async () => {
    if (!draft.firstName.trim() || !user?.id || isSaving) return;

    setIsSaving(true);
    setErrorMessage(null);

    try {
      const saved = await upsertProfile(user.id, {
        first_name: draft.firstName.trim(),
        last_name: draft.lastName.trim() || undefined,
      });

      if (!saved) {
        setErrorMessage(isArabic ? 'تعذّر الحفظ، حاول مرة أخرى' : 'Could not save, try again');
        return;
      }

      updateUser({
        firstName: saved.first_name ?? '',
        lastName: saved.last_name ?? '',
        avatar: localAvatar,
      });

      clearDraft();
      setToastMessage(isArabic ? 'تم حفظ التعديلات بنجاح' : 'Changes saved successfully');

      setTimeout(() => {
        setToastMessage(null);
        goBack();
      }, 1500);
    } catch {
      setErrorMessage(isArabic ? 'تعذّر الحفظ، حاول مرة أخرى' : 'Could not save, try again');
    } finally {
      setIsSaving(false);
    }
  }, [draft, localAvatar, user?.id, updateUser, isArabic, goBack, clearDraft, isSaving]);

  return (
    <div className="flex flex-col min-h-screen bg-background pb-16 font-cairo relative" dir={isArabic ? 'rtl' : 'ltr'}>
      {/* Top Bar */}
      <div className="px-4 py-4 bg-brand border-b border-white/10 flex items-center gap-3 sticky top-0 z-20">
        <button onClick={goBack} aria-label="Back" className="w-10 h-10 rounded-full bg-surface/15 hover:bg-surface/25 flex items-center justify-center cursor-pointer">
          <BackIcon size={18} variant="Linear" color="#FFFFFF" />
        </button>
        <h1 className="text-lg font-bold text-white flex-1">{isArabic ? 'تعديل الملف الشخصي' : 'Edit Profile'}</h1>
        <BrandMark isArabic={isArabic} />
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
            value={draft.firstName}
            onChange={(e) => setField('firstName', e.target.value)}
            required
            className="font-cairo"
          />

          <Input
            label={isArabic ? 'اسم العائلة' : 'Last Name'}
            value={draft.lastName}
            onChange={(e) => setField('lastName', e.target.value)}
            className="font-cairo"
          />

          <Input
            label={isArabic ? 'رقم الهاتف (لا يمكن تعديله)' : 'Phone Number (Read-only)'}
            value={user?.phone || ''}
            disabled
            icon={<Lock1 size={16} variant="Linear" className="text-ink-muted" />}
            className="font-cairo opacity-70"
          />

          <Input
            label={isArabic ? 'البريد الإلكتروني' : 'Email Address'}
            value={draft.email}
            onChange={(e) => setField('email', e.target.value)}
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
            disabled={!draft.firstName.trim() || isSaving}
            className="font-bold bg-primary hover:bg-primary-hover text-white py-3.5 rounded-xl justify-center"
          >
            {isSaving
              ? (isArabic ? 'جارٍ الحفظ...' : 'Saving...')
              : (isArabic ? 'حفظ التعديلات' : 'Save Changes')}
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

      {/* Success Toast */}
      {toastMessage && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-ink text-surface px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-lg z-50 text-sm font-bold animate-in fade-in slide-in-from-bottom-4 duration-300">
          <TickCircle size={16} variant="Linear" color="currentColor" className="text-primary" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Error Toast */}
      {errorMessage && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-ink text-surface px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-lg z-50 text-sm font-bold">
          <CloseCircle size={16} variant="Linear" color="currentColor" className="text-red-400" />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
};
