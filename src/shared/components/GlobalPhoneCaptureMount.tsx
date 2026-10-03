import React, { useEffect, useState } from 'react';
import { PhoneCaptureModal } from '@/features/auth/components/PhoneCaptureModal';
import { useAuthStore } from '@/features/auth/store/auth.slice';

export const GlobalPhoneCaptureMount: React.FC = () => {
  const user = useAuthStore((s) => s.user);
  const authStatus = useAuthStore((s) => s.authStatus);
  const profileHydrated = useAuthStore((s) => s.profileHydrated);
  const [open, setOpen] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const should =
      authStatus === 'authenticated' &&
      profileHydrated &&
      !!user?.id &&
      !user.phone &&
      !dismissed;
    setOpen(should);
  }, [authStatus, profileHydrated, user?.id, user?.phone, dismissed]);

  return (
    <PhoneCaptureModal
      open={open}
      onSaved={() => {
        setOpen(false);
        setDismissed(true);
      }}
    />
  );
};
