import { useState, useEffect } from 'react';
import { useUI } from '@/hooks/useUI';
import { useAuthStore } from '../store/auth.slice';
import { savePhone } from '@/shared/lib/profilesService';
import { validatePhone } from '../helpers/phoneValidation';

type Step = 'input' | 'confirm';

interface Params {
  readonly open: boolean;
  readonly onSaved: () => void;
  readonly onClose?: () => void;
}

export function usePhoneCaptureModal({ open, onSaved, onClose }: Params) {
  const { isArabic } = useUI();
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);

  const [step, setStep] = useState<Step>('input');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setStep('input');
      setPhone('');
      setError(null);
    }
  }, [open]);

  const handleContinue = () => {
    if (!user?.id) {
      setError(isArabic ? 'يجب تسجيل الدخول أولاً' : 'You must sign in first');
      return;
    }
    const v = validatePhone(phone);
    if (!v.valid) {
      setError(v.error);
      return;
    }
    setError(null);
    setStep('confirm');
  };

  const handleConfirm = async () => {
    if (!user?.id) return;
    const v = validatePhone(phone);
    if (!v.valid) {
      setStep('input');
      setError(v.error);
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const result = await savePhone(user.id, v.normalized);
      if (!result) {
        setError(isArabic ? 'تعذّر حفظ الرقم، حاول مرة أخرى' : 'Could not save phone, try again');
        setStep('input');
        return;
      }
      setUser({ ...user, phone: v.normalized });
      onSaved();
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    if (step === 'confirm') {
      setStep('input');
      return;
    }
    onClose?.();
  };

  const handleBack = () => {
    setStep('input');
    setError(null);
  };

  const phonePreview = validatePhone(phone).normalized || phone;

  return {
    step, phone, setPhone, error, setError, saving,
    handleContinue, handleConfirm, handleClose, handleBack, phonePreview,
  };
}
