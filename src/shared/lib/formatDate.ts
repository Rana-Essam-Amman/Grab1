export function formatRelativeDate(
  dateString: string | null | undefined,
  isArabic: boolean
): string {
  if (!dateString) return '';
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return '';

  const now = Date.now();
  const diffMs = now - d.getTime();
  if (diffMs < 0) return isArabic ? 'الآن' : 'Just now';

  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) {
    return isArabic ? 'الآن' : 'Just now';
  }

  if (diffMins < 60) {
    if (isArabic) {
      if (diffMins === 1) return 'منذ دقيقة';
      if (diffMins === 2) return 'منذ دقيقتين';
      if (diffMins >= 3 && diffMins <= 10) return `منذ ${diffMins} دقائق`;
      return `منذ ${diffMins} دقيقة`;
    }
    return `${diffMins}m ago`;
  }

  if (diffHours < 24) {
    if (isArabic) {
      if (diffHours === 1) return 'منذ ساعة';
      if (diffHours === 2) return 'منذ ساعتين';
      if (diffHours >= 3 && diffHours <= 10) return `منذ ${diffHours} ساعات`;
      return `منذ ${diffHours} ساعة`;
    }
    return `${diffHours}h ago`;
  }

  if (diffDays <= 30) {
    if (isArabic) {
      if (diffDays === 1) return 'منذ يوم';
      if (diffDays === 2) return 'منذ يومين';
      if (diffDays >= 3 && diffDays <= 10) return `منذ ${diffDays} أيام`;
      return `منذ ${diffDays} يوماً`;
    }
    return `${diffDays}d ago`;
  }

  // Older than 30 days: format as absolute date
  return d.toLocaleDateString(isArabic ? 'ar-JO' : 'en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}
