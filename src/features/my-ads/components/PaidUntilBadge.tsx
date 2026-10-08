import React from 'react';
import { Icon } from '@iconify/react';
import { buildPaidUntilInfo, type PaidUntilTone } from '../helpers/paidUntil';

interface PaidUntilBadgeProps {
  readonly expiresAt: string;
  readonly isArabic: boolean;
}

const TONE_STYLES: Record<
  PaidUntilTone,
  { container: string; text: string; icon: string }
> = {
  calm: {
    container: 'bg-surface border-b border-border',
    text: 'text-ink-muted',
    icon: 'fluent-emoji:sparkles',
  },
  warn: {
    container: 'bg-warning/15 border-b border-warning/30',
    text: 'text-warning',
    icon: 'fluent-emoji:hourglass-not-done',
  },
  urgent: {
    container: 'bg-danger/15 border-b border-danger/30',
    text: 'text-danger',
    icon: 'fluent-emoji:warning',
  },
};

export const PaidUntilBadge: React.FC<PaidUntilBadgeProps> = ({
  expiresAt,
  isArabic,
}) => {
  const info = buildPaidUntilInfo(expiresAt, isArabic);
  const label = isArabic ? info.labelAr : info.labelEn;
  if (!label) return null;
  const styles = TONE_STYLES[info.tone];

  return (
    <div className={`flex items-center gap-1.5 px-3.5 py-2 ${styles.container}`}>
      <Icon icon={styles.icon} width={13} height={13} />
      <span className={`text-[11px] font-bold ${styles.text}`}>
        {label}
      </span>
    </div>
  );
};
