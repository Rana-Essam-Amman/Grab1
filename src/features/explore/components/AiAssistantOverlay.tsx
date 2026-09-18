import React from 'react';

interface AiAssistantOverlayProps {
  toastMessage: string | null;
  isFocused: boolean;
  handleBlur: () => void;
}

export const AiAssistantOverlay: React.FC<AiAssistantOverlayProps> = ({
  toastMessage,
  isFocused,
  handleBlur,
}) => {
  return (
    <>
      {toastMessage && (
        <div className="fixed top-4 left-4 right-4 z-[100002] max-w-[408px] mx-auto bg-emerald-600 text-white p-3 rounded-2xl shadow-lg flex items-center justify-center text-xs font-bold font-cairo animate-in fade-in slide-in-from-top-2">
          {toastMessage}
        </div>
      )}
      {isFocused && (
        <div
          onClick={handleBlur}
          className="fixed inset-0 z-[9999] bg-stone-900/20 backdrop-blur-md transition-opacity duration-300"
        />
      )}
    </>
  );
};
