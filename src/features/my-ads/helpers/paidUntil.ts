export type PaidUntilTone = 'calm' | 'warn' | 'urgent';

export interface PaidUntilInfo {
  readonly tone: PaidUntilTone;
  readonly labelAr: string;
  readonly labelEn: string;
}

const MS_PER_DAY = 24 * 60 * 60 * 1000;

function formatShortDate(iso: string, isArabic: boolean): string {
  try {
    return new Date(iso).toLocaleDateString(isArabic ? 'ar-JO' : 'en-GB', {
      day: 'numeric',
      month: 'short',
    });
  } catch {
    return '';
  }
}

export function buildPaidUntilInfo(
  expiresAt: string,
  isArabic: boolean,
  now: Date = new Date()
): PaidUntilInfo {
  const target = new Date(expiresAt).getTime();
  if (!Number.isFinite(target)) {
    return { tone: 'calm', labelAr: '', labelEn: '' };
  }
  const days = Math.ceil((target - now.getTime()) / MS_PER_DAY);

  if (days < 0) {
    return {
      tone: 'urgent',
      labelAr: 'انتهت الميزة',
      labelEn: 'Feature expired',
    };
  }
  if (days === 0) {
    return {
      tone: 'urgent',
      labelAr: 'ينتهي اليوم',
      labelEn: 'Expires today',
    };
  }
  if (days <= 3) {
    return {
      tone: 'urgent',
      labelAr: `ينتهي خلال ${days} ${days === 1 ? 'يوم' : 'أيام'}`,
      labelEn: `Expires in ${days} ${days === 1 ? 'day' : 'days'}`,
    };
  }
  if (days <= 7) {
    return {
      tone: 'warn',
      labelAr: `ينتهي خلال ${days} أيام`,
      labelEn: `Expires in ${days} days`,
    };
  }
  const date = formatShortDate(expiresAt, isArabic);
  return {
    tone: 'calm',
    labelAr: `مميز حتى ${date}`,
    labelEn: `Featured until ${date}`,
  };
}
