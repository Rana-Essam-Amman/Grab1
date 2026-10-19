import React, { useRef } from 'react';
import HCaptcha from '@hcaptcha/react-hcaptcha';

interface CaptchaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerify: (token: string) => void;
  isArabic: boolean;
}

export const CaptchaModal: React.FC<CaptchaModalProps> = ({ isOpen, onClose, onVerify, isArabic }) => {
  const captchaRef = useRef<HCaptcha>(null);
  const siteKey = import.meta.env.VITE_HCAPTCHA_SITE_KEY || '10000000-ffff-ffff-ffff-000000000001'; // Fallback for dev

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="bg-surface rounded-2xl p-6 w-full max-w-sm flex flex-col items-center gap-4 shadow-xl">
        <h3 className="text-lg font-bold text-ink text-center">
          {isArabic ? 'تأكيد أمني' : 'Security Check'}
        </h3>
        <p className="text-sm text-ink-muted text-center">
          {isArabic ? 'يرجى إكمال التحقق التالي للمتابعة' : 'Please complete the check to continue'}
        </p>
        
        <div className="my-2 flex justify-center w-full">
          <HCaptcha
            ref={captchaRef}
            sitekey={siteKey}
            onVerify={(token) => {
              onVerify(token);
            }}
            onExpire={() => {
              // Token expired, do nothing, user must re-verify
            }}
          />
        </div>

        <button
          onClick={() => {
            captchaRef.current?.resetCaptcha();
            onClose();
          }}
          className="text-sm text-ink-muted hover:text-ink underline mt-2"
        >
          {isArabic ? 'إلغاء' : 'Cancel'}
        </button>
      </div>
    </div>
  );
};
