import React from 'react';
import { LoginGateway } from './LoginGateway';

interface LoginScreenBodyProps {
  isArabic: boolean;
  guestCountrySelect: boolean;
  handleSelectBrowseCountry: (code: any) => void;
  handleGuestCountryClose: () => void;
  handleGuestCountryOpen: () => void;
  toastMsg?: string;
}

export const LoginScreenBody: React.FC<LoginScreenBodyProps> = ({
  isArabic,
  guestCountrySelect,
  handleSelectBrowseCountry,
  handleGuestCountryClose,
  handleGuestCountryOpen,
  toastMsg,
}) => {
  return (
    <div className="p-6 flex flex-col gap-6 flex-1 max-w-sm mx-auto w-full justify-center animate-fadeIn">
      <LoginGateway
        isArabic={isArabic}
        onGuestCountrySelect={handleSelectBrowseCountry}
        guestCountrySelectOpen={guestCountrySelect}
        onToggleGuestCountrySelect={guestCountrySelect ? handleGuestCountryClose : handleGuestCountryOpen}
      />
    </div>
  );
};
