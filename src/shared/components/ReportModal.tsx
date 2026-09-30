import { useUI } from '@/hooks/useUI';
import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { Listing } from '@/types';
import { CloseCircle, Danger, TickCircle } from 'iconsax-react';
import { Modal } from '@/shared/ui/Modal';
import { Button } from '@/shared/ui/Button';
import { ReportReasonsList } from './ReportReasonsList';

interface ReportModalProps {
  listing: Listing;
  onClose: () => void;
}

export const ReportModal: React.FC<ReportModalProps> = ({ listing: _listing, onClose }) => {
  const { isArabic } = useUI();
  const [reason, setReason] = useState<string>('misleading');
  const [details, setDetails] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    };
  }, []);

  const reasons = useMemo(
    () => [
      { id: 'scam', labelAr: 'احتيال أو إعلان وهمي', labelEn: 'Scam or fake ad' },
      { id: 'misleading', labelAr: 'معلومات غير صحيحة أو مضللة', labelEn: 'Misleading / incorrect information' },
      { id: 'sold', labelAr: 'تم بيع السلعة وما زال الإعلان منشوراً', labelEn: 'Item already sold / unavailable' },
      { id: 'duplicate', labelAr: 'إعلان مكرر', labelEn: 'Duplicate listing' },
      { id: 'offensive', labelAr: 'محتوى غير لائق أو مخالف', labelEn: 'Inappropriate content' },
      { id: 'other', labelAr: 'سبب آخر', labelEn: 'Other issue' },
    ],
    []
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      setSubmitted(true);
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
      closeTimerRef.current = setTimeout(() => {
        onClose();
      }, 1500);
    },
    [onClose]
  );

  const handleReasonChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setReason(e.target.value);
  }, []);

  const handleDetailsChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDetails(e.target.value);
  }, []);

  return (
    <Modal
      open={true}
      onClose={onClose}
      size="md"
      className="max-w-[440px] rounded-3xl border border-[#E2E8F0] p-5 bg-white [&>button:first-child]:hidden"
    >
      <div dir={isArabic ? 'rtl' : 'ltr'}>
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div className="flex items-center gap-2 text-danger">
            <Danger variant="Bold" size={18} color="#EF4444" />
            <h3 className="text-base font-bold text-ink">
              {isArabic ? 'الإبلاغ عن الإعلان' : 'Report Listing'}
            </h3>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-background text-ink-soft hover:bg-border transition-colors cursor-pointer"
            aria-label={isArabic ? 'إغلاق' : 'Close'}
          >
            <CloseCircle variant="Linear" size={16} color="#94A3B8" />
          </Button>
        </div>

        {submitted ? (
          <div className="py-8 flex flex-col items-center justify-center text-center gap-2">
            <TickCircle variant="Bold" size={40} color="#10B981" />
            <h4 className="font-bold text-ink">
              {isArabic ? 'شكراً لك، تم استلام بلاغك' : 'Thank you, report submitted'}
            </h4>
            <p className="text-xs text-ink-muted">
              {isArabic
                ? 'سيقوم فريق إدارة FOX Marketplace بمراجعة الإعلان بأسرع وقت.'
                : 'Our moderation team will review this listing shortly.'}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="pt-3 flex flex-col gap-3">
            <p className="text-sm text-[#334155]">
              {isArabic
                ? 'يرجى تحديد سبب الإبلاغ لمساعدتنا في حماية مجتمع المستخدمين:'
                : 'Please choose why you are reporting this listing:'}
            </p>

            <ReportReasonsList
              reasons={reasons}
              reason={reason}
              isArabic={isArabic}
              handleReasonChange={handleReasonChange}
            />

            <textarea
              value={details}
              onChange={handleDetailsChange}
              placeholder={isArabic ? 'تفاصيل إضافية (اختياري)...' : 'Additional details (optional)...'}
              rows={2}
              className="w-full p-3 rounded-xl border border-[#E2E8F0] bg-white text-sm text-[#0F172A] outline-none focus:border-[#E57E25]"
            />
            <Button
              type="submit"
              variant="danger"
              fullWidth
              size="lg"
            >
              {isArabic ? 'إرسال البلاغ' : 'Submit Report'}
            </Button>
          </form>
        )}
      </div>
    </Modal>
  );
};
