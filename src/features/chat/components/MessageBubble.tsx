import React from 'react';
import type { ChatMessage } from '@/types';
import { useLongPress } from '@/shared/hooks/useLongPress';

interface MessageBubbleProps {
  readonly msg: ChatMessage;
  readonly isArabic: boolean;
  readonly pending: boolean;
  readonly onLongPress: (id: string) => void;
}

const TickIcon: React.FC<{ pending: boolean; read: boolean }> = ({ pending, read }) => {
  if (pending) return <span className="text-ink-muted">✓</span>;
  if (read) return <span className="text-accent font-bold">✓✓</span>;
  return <span className="text-ink-muted">✓✓</span>;
};

/**
 * Format a timestamp for display. Accepts either an ISO 8601 string or an
 * already-formatted short string (HH:MM). Returns the input unchanged if it
 * cannot be parsed so users never see a raw timestamp.
 */
function formatTimestamp(value: string, isArabic: boolean): string {
  if (!value) return '';
  if (value.length <= 8 && !value.includes('T')) return value;
  try {
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return value;
    return d.toLocaleTimeString(isArabic ? 'ar-JO' : 'en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return value;
  }
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  msg,
  isArabic,
  pending,
  onLongPress,
}) => {
  // Own, not deleted, not pending
  const canLongPress = msg.fromBuyer && !msg.isDeleted && !pending;
  const handlers = useLongPress({
    onLongPress: () => {
      if (canLongPress) onLongPress(msg.id);
    },
  });

  const read = !!msg.readAt;
  const deleted = !!msg.isDeleted;

  return (
    <div
      className={`flex flex-col max-w-[80%] ${
        msg.fromBuyer ? 'self-end items-end' : 'self-start items-start'
      }`}
      onTouchStart={handlers.onTouchStart}
      onTouchEnd={handlers.onTouchEnd}
      onTouchMove={handlers.onTouchMove}
      onContextMenu={handlers.onContextMenu}
    >
      <div
        className={`p-3.5 rounded-2xl text-xs leading-relaxed select-none ${
          deleted
            ? 'bg-canvas border border-line text-ink-muted italic'
            : msg.fromBuyer
              ? 'bg-primary text-white rounded-tr-xs'
              : 'bg-surface border border-border text-ink rounded-tl-xs'
        }`}
        dir="auto"
      >
        {deleted ? (isArabic ? 'تم حذف الرسالة' : 'Message deleted') : msg.text}
      </div>

      <span
        className="text-[9px] text-ink-muted mt-1 px-1 flex items-center gap-1"
        dir={isArabic ? 'rtl' : 'ltr'}
      >
        {msg.fromBuyer && !deleted && <TickIcon pending={pending} read={read} />}
        {formatTimestamp(msg.timestamp, isArabic)}
      </span>
    </div>
  );
};
