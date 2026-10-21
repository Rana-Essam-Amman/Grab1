interface UpdateBannerProps {
  show: boolean;
}

export function UpdateBanner({ show }: UpdateBannerProps) {
  if (!show) return null;

  const isRTL =
    typeof document !== 'undefined' && document.documentElement.dir === 'rtl';
  const message = isRTL
    ? 'صدرت نسخة جديدة من التطبيق'
    : 'A new version of the app is available';
  const buttonText = isRTL ? 'تحديث الآن' : 'Refresh now';

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[9999] bg-[#1B2A4A] text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-4 max-w-[90vw]"
    >
      <span className="text-sm font-medium">{message}</span>
      <button
        onClick={() => window.location.reload()}
        className="bg-white text-[#1B2A4A] px-3 py-1 rounded-lg text-sm font-semibold hover:bg-gray-100 transition-colors"
      >
        {buttonText}
      </button>
    </div>
  );
}
