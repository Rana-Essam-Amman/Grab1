import React from 'react';
import { Modal } from '@/shared/ui/Modal';
import { useUI } from '@/hooks/useUI';
import { usePhoneCaptureModal } from '../hooks/usePhoneCaptureModal';
import { PhoneInputStep } from './PhoneInputStep';
import { PhoneConfirmStep } from './PhoneConfirmStep';

interface Props {
  readonly open: boolean;
  readonly onSaved: () => void;
  readonly onClose?: () => void;
}

export const PhoneCaptureModal: React.FC<Props> = ({ open, onSaved, onClose }) => {
  const { isArabic, browseCountryCode } = useUI();
  const {
    step, phone, setPhone, error, setError, saving,
    handleContinue, handleConfirm, handleClose, handleBack, phonePreview,
  } = usePhoneCaptureModal({ open, onSaved, onClose });

  const title = step === 'input'
    ? (isArabic ? 'رقم التواصل مطلوب' : 'Phone number required')
    : (isArabic ? 'تأكيد رقم الهاتف' : 'Confirm phone number');

  const description = step === 'input'
    ? (isArabic
        ? 'لنشر إعلانك، نحتاج رقم هاتف للتواصل معك. سيظهر للمشترين الجادين فقط.'
        : 'To publish your ad, we need a phone number. It will only be shown to serious buyers.')
    : (isArabic
        ? 'يرجى مراجعة رقمك قبل التثبيت.'
        : 'Please review your number before confirming.');

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={title}
      description={description}
      size="sm"
    >
      {step === 'input' && (
        <PhoneInputStep
          phone={phone}
          setPhone={setPhone}
          error={error}
          isArabic={isArabic}
          browseCountryCode={browseCountryCode}
          onContinue={handleContinue}
          onErrorClear={() => setError(null)}
        />
      )}
      {step === 'confirm' && (
        <PhoneConfirmStep
          phonePreview={phonePreview}
          error={error}
          saving={saving}
          isArabic={isArabic}
          onBack={handleBack}
          onConfirm={handleConfirm}
        />
      )}
    </Modal>
  );
};
