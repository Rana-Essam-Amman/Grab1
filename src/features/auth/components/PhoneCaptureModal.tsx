import React, { useState } from 'react';
import { Modal } from '@/shared/ui/Modal';
import { useUI } from '@/hooks/useUI';
import { useAuthStore } from '../store/auth.slice';
import { savePhone } from '@/shared/lib/profilesService';
import { validatePhone } from '../helpers/phoneValidation';

interface Props {
  readonly open: boolean;
  readonly onSaved: () => void;
}

export const PhoneCaptureModal: React.FC<Props> = ({ open, onSaved }) => {
  const { isArabic, browseCountryCode } = useUI();
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);

  const [phone, setPhone] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!user?.id) {
      setError(isArabic ? 'يجب تسجيل الدخول أولاً' : 'You must sign in first');
      return;
    }
    const v = validatePhone(phone);
    if (!v.valid) {
      setError(v.error);
      return;
    }

    setSaving(true);
    setError(null);
    try {
      const result = await savePhone(user.id, v.normalized);
      if (!result) {
        setError(isArabic ? 'تعذّر حفظ الرقم، حاول مرة أخرى' : 'Could not save phone, try again');
        return;
      }
      setUser({ ...user, phone: v.normalized });
      onSaved();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={() => {
        // Intentionally NOT closable — user must provide phone.
      }}
      title={isArabic ? 'رقم التواصل مطلوب' : 'Phone number required'}
      description={
        isArabic
          ? 'لنشر إعلانك، نحتاج رقم هاتف للتواصل معك. سيظهر للمشترين الجادين فقط.'
          : 'To publish your ad, we need a phone number. It will only be shown to serious buyers.'
      }
      size="sm"
    >
      <div className="flex flex-col gap-3">
        <label className="text-xs font-bold text-ink-soft">
          {isArabic ? `رقم الهاتف (${browseCountryCode})` : `Phone (${browseCountryCode})`}
        </label>
        <input
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          value={phone}
          onChange={(e) => {
            setPhone(e.target.value);
            if (error) setError(null);
          }}
          placeholder="+962 7X XXX XXXX"
          dir="ltr"
          className="w-full h-11 px-3 rounded-xl border border-line bg-canvas text-ink text-sm font-medium focus:outline-none focus:border-primary"
        />
        {error && <p className="text-xs font-bold text-danger">{error}</p>}
        <button
          type="button"
          onClick={handleSave}
          disabled={saving || !phone.trim()}
          className="w-full h-12 rounded-xl bg-primary text-white font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {saving
            ? (isArabic ? 'جاري الحفظ...' : 'Saving...')
            : (isArabic ? 'حفظ ومتابعة' : 'Save and continue')}
        </button>
      </div>
    </Modal>
  );
};
