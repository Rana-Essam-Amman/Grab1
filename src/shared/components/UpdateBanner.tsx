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
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 bg-surface text-ink border border-border px-5 py-3 rounded-xl shadow-2xl flex items-center gap-4 max-w-md"
    >
      <span className="text-sm font-medium">{message}</span>
      <button
        onClick={() => window.location.reload()}
        className="bg-success/10 text-ink border border-border px-3 py-1 rounded-lg text-sm font-semibold"
      >
        {buttonText}
      </button>
    </div>
  );
}
