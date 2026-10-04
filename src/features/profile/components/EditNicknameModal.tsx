import React, { useEffect, useState } from 'react';
import { Modal } from '@/shared/ui/Modal';
import { Input } from '@/shared/ui/Input';
import { Button } from '@/shared/ui/Button';
import { saveNickname } from '@/shared/lib/profilesService';

interface EditNicknameModalProps {
  readonly open: boolean;
  readonly isArabic: boolean;
  readonly userId: string | null;
  readonly currentNickname: string | null;
  readonly initialFallback: string;
  readonly onClose: () => void;
  readonly onSaved: (nickname: string) => void;
}

const MIN_LEN = 2;
const MAX_LEN = 50;

export const EditNicknameModal: React.FC<EditNicknameModalProps> = ({
  open,
  isArabic,
  userId,
  currentNickname,
  initialFallback,
  onClose,
  onSaved,
}) => {
  const [value, setValue] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setValue(currentNickname ?? initialFallback ?? '');
    setError(null);
    setIsSaving(false);
  }, [open, currentNickname, initialFallback]);

  const trimmed = value.trim();
  const canSave = trimmed.length >= MIN_LEN && trimmed.length <= MAX_LEN && !isSaving && !!userId;

  const handleSave = async () => {
    if (!canSave || !userId) return;
    setIsSaving(true);
    setError(null);
    const result = await saveNickname(userId, trimmed);
    setIsSaving(false);
    if (!result) {
      setError(isArabic ? 'تعذّر الحفظ، حاول مرة أخرى' : 'Could not save, try again');
      return;
    }
    onSaved(trimmed);
  };

  return (
    <Modal
      open={open}
      onClose={() => !isSaving && onClose()}
      title={isArabic ? 'الاسم المستعار' : 'Nickname'}
      description={
        isArabic
          ? 'الاسم الذي يظهر للآخرين في التطبيق. من 2 إلى 50 حرفاً.'
          : 'How your name appears to others. Between 2 and 50 characters.'
      }
      size="sm"
    >
      <div className="flex flex-col gap-4" dir={isArabic ? 'rtl' : 'ltr'}>
        <Input
          label={isArabic ? 'الاسم المستعار' : 'Nickname'}
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            if (error) setError(null);
          }}
          placeholder={isArabic ? 'مثال: أبو محمد' : 'e.g., Alex'}
          maxLength={MAX_LEN}
          autoFocus
          className="font-cairo"
        />

        <div className="flex items-center justify-between text-xs text-ink-muted px-1">
          <span>
            {trimmed.length > 0 && trimmed.length < MIN_LEN
              ? (isArabic ? `الحد الأدنى ${MIN_LEN} أحرف` : `Minimum ${MIN_LEN} characters`)
              : ' '}
          </span>
          <span dir="ltr">{trimmed.length}/{MAX_LEN}</span>
        </div>

        {error && <p className="text-xs font-bold text-danger px-1">{error}</p>}

        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="md"
            fullWidth
            onClick={onClose}
            disabled={isSaving}
            className="font-bold justify-center"
          >
            {isArabic ? 'إلغاء' : 'Cancel'}
          </Button>
          <Button
            variant="primary"
            size="md"
            fullWidth
            onClick={handleSave}
            disabled={!canSave}
            className="font-bold justify-center"
          >
            {isSaving ? (isArabic ? 'جارٍ الحفظ...' : 'Saving...') : (isArabic ? 'حفظ' : 'Save')}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
