import React from 'react';

interface LoginGatewayActionsProps {
  isArabic: boolean;
  onOpenDemoPicker: () => void;
  onToggleGuestCountrySelect: () => void;
}

export const LoginGatewayActions: React.FC<LoginGatewayActionsProps> = ({
  isArabic,
  onOpenDemoPicker,
  onToggleGuestCountrySelect,
}) => {
  return (
    <div className="mt-4 flex flex-col gap-3">
      <button
        type="button"
        onClick={onToggleGuestCountrySelect}
        className="text-sm text-brand hover:underline font-cairo"
      >
        {isArabic ? 'تصفح كضيف' : 'Browse as Guest'}
      </button>
      <button
        type="button"
        onClick={onOpenDemoPicker}
        className="text-sm text-ink-muted hover:underline font-cairo"
        data-testid="demo-login-btn"
      >
        {isArabic ? 'الدخول كحساب تجريبي' : 'Bypass with Quick Demo'}
      </button>
    </div>
  );
};
