import React from 'react';
import { PhoneCaptureModal } from '@/features/auth/components/PhoneCaptureModal';
import { usePhoneModalStore } from '@/features/auth/store/phoneModal.slice';

/**
 * Global mount for PhoneCaptureModal.
 *
 * Does NOT auto-open after sign-in. Modal opens only when a caller
 * invokes usePhoneModalStore().open() — e.g. publish guards.
 */
export const GlobalPhoneCaptureMount: React.FC = () => {
  const isOpen = usePhoneModalStore((s) => s.isOpen);
  const onSavedCallback = usePhoneModalStore((s) => s.onSavedCallback);
  const close = usePhoneModalStore((s) => s.close);

  return (
    <PhoneCaptureModal
      open={isOpen}
      onClose={close}
      onSaved={() => {
        close();
        onSavedCallback?.();
      }}
    />
  );
};
