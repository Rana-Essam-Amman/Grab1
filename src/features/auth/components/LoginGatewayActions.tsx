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
      {/* Demo picker remains but is hidden behind existing logic */}
      {false && (
        <button onClick={onOpenDemoPicker} className="hidden">Demo</button>
      )}
    </div>
  );
};
