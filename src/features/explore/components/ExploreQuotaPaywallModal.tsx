import React from 'react';
import { Modal } from '@/shared/ui/Modal';
import { Button } from '@/shared/ui/Button';

export interface ExploreQuotaPaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartPost: () => void;
  isArabic: boolean;
  turboAdCost: number;
  currencySymbol: string;
}

export const ExploreQuotaPaywallModal: React.FC<ExploreQuotaPaywallModalProps> = React.memo(({
  isOpen,
  onClose,
  onStartPost,
  isArabic,
  turboAdCost,
  currencySymbol,
}) => (
  <Modal open={isOpen} onClose={onClose} size="sm" className="font-cairo p-5" dir={isArabic ? 'rtl' : 'ltr'}>
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold">✨</div>
          <div>
            <h3 className="text-base font-extrabold text-ink">
              {isArabic ? 'استنفذت الحد المجاني للإعلانات' : 'Free Ad Quota Exhausted'}
            </h3>
            <p className="text-xs text-ink-soft">
              {isArabic ? 'تميّز الآن واحصل على ظهور فوري في قمة نتائج البحث' : 'Upgrade now for priority placement at top of feed'}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-surface border border-border rounded-2xl p-3 flex flex-col gap-1.5 text-xs text-ink-soft">
        <div className="font-bold text-ink">{isArabic ? 'مميزات إعلان توربو المدفوع:' : 'Turbo Ad Benefits:'}</div>
        <ul className="list-disc list-inside space-y-1 text-ink-soft">
          <li>{isArabic ? 'ظهور أولوية قصوى في أعلى نتائج البحث' : 'Top priority feed placement'}</li>
          <li>{isArabic ? 'شارة ذهبية لامعة ومميزة' : 'Luminous golden badge'}</li>
          <li>{isArabic ? 'مضاعفة المشاهدات 5 أضعاف' : '5x more views & inquiries'}</li>
        </ul>
      </div>

      <Button variant="primary" fullWidth size="lg" onClick={onStartPost} className="font-cairo">
        {isArabic ? `تميز الإعلان الآن بـ ${turboAdCost} ${currencySymbol}` : `Feature Ad Now for ${turboAdCost} ${currencySymbol}`}
      </Button>
    </div>
  </Modal>
));

ExploreQuotaPaywallModal.displayName = 'ExploreQuotaPaywallModal';
