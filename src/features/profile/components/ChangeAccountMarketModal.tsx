import React, { useState, useCallback } from 'react';
import { Modal } from '@/shared/ui/Modal';
import { Button } from '@/shared/ui/Button';
import { MARKETS, ALL_MARKET_CODES } from '@/data/markets/config';
import { useAuthStore } from '@/features/auth';
import { upsertProfile } from '@/shared/lib/profilesService';
import { toast } from 'sonner';
import type { MarketCode } from '@/data/markets/types';

export interface ChangeAccountMarketModalProps {
  readonly open: boolean;
  readonly isArabic: boolean;
  readonly currentMarket: MarketCode;
  readonly onClose: () => void;
}

export const ChangeAccountMarketModal: React.FC<ChangeAccountMarketModalProps> = ({
  open, isArabic, currentMarket, onClose,
}) => {
  const [selected, setSelected] = useState<MarketCode>(currentMarket);
  const [saving, setSaving] = useState(false);

  const handleSave = useCallback(async () => {
    if (selected === currentMarket) { onClose(); return; }
    const user = useAuthStore.getState().user;
    if (!user?.id) { onClose(); return; }
    setSaving(true);
    const result = await upsertProfile(user.id, { country_code: selected });
    setSaving(false);
    if (result) {
      useAuthStore.setState((s) => ({ user: s.user ? { ...s.user, countryCode: selected } : s.user }));
      toast.success(isArabic ? 'تم تحديث سوق حسابك' : 'Account market updated');
      onClose();
    } else {
      toast.error(isArabic ? 'فشل الحفظ — جرب مرة ثانية' : 'Save failed — try again');
    }
  }, [selected, currentMarket, isArabic, onClose]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isArabic ? 'تغيير سوق حسابك' : 'Change account market'}
      description={
        isArabic
          ? 'الإعلانات الحالية تبقى في سوقها الأصلي. الإعلانات الجديدة ستُنشر في السوق الجديد. لن تستطيع النشر في السوق القديم بعد هذا التغيير.'
          : 'Your existing listings stay in their original market. New listings will publish in the new market. You will not be able to publish in your old market after this change.'
      }
      footer={
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={onClose} disabled={saving}>
            {isArabic ? 'إلغاء' : 'Cancel'}
          </Button>
          <Button variant="primary" size="sm" onClick={handleSave} disabled={saving}>
            {saving ? (isArabic ? 'جاري الحفظ...' : 'Saving...') : (isArabic ? 'تأكيد' : 'Confirm')}
          </Button>
        </div>
      }
    >
      <div className="flex flex-col gap-2">
        {ALL_MARKET_CODES.map((code) => {
          const market = MARKETS[code];
          const isCurrent = code === currentMarket;
          const isSelected = code === selected;
          return (
            <button
              key={code}
              type="button"
              onClick={() => setSelected(code)}
              className={`w-full px-4 py-3 rounded-xl border text-start transition-all cursor-pointer ${
                isSelected
                  ? 'bg-brand text-white border-brand'
                  : 'bg-surface text-ink border-border hover:border-accent/50'
              }`}
              disabled={isCurrent}
            >
              <div className="text-sm font-bold">
                {isArabic ? market.nameAr : market.nameEn}
              </div>
              {isCurrent && (
                <div className={`text-[10px] mt-0.5 ${isSelected ? 'text-white/70' : 'text-ink-muted'}`}>
                  {isArabic ? 'السوق الحالي' : 'Current market'}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </Modal>
  );
};
