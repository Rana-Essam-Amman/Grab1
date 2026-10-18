import React from 'react';

interface LoginGatewayActionsProps {
  isArabic: boolean;
  onToggleGuestCountrySelect: () => void;
}

export const LoginGatewayActions: React.FC<LoginGatewayActionsProps> = ({
  isArabic,
  onToggleGuestCountrySelect,
}) => {
  return (
    <div className="mt-4 flex flex-col gap-3">
      <button
        type="button"
        onClick={onToggleGuestCountrySelect}
        className="text-sm text-white font-semibold hover:underline font-cairo transition-colors"
      >
        {isArabic ? 'تصفح كضيف' : 'Browse as Guest'}
      </button>
    </div>
  );
};
