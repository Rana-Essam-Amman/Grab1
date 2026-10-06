import React from 'react';
import type { Conversation } from '@/types';
import { ArrowRight2, ArrowLeft2 } from 'iconsax-react';
import { Card } from '@/shared/ui/Card';
import { useLongPress } from '@/shared/hooks/useLongPress';

interface ConversationRowProps {
  readonly thread: Conversation;
  readonly isArabic: boolean;
  readonly onOpen: (id: string) => void;
  readonly onLongPress: (id: string) => void;
  readonly onImageError: (e: React.SyntheticEvent<HTMLImageElement>) => void;
}

export const ConversationRow: React.FC<ConversationRowProps> = ({
  thread,
  isArabic,
  onOpen,
  onLongPress,
  onImageError,
}) => {
  const ChevronIcon = isArabic ? ArrowLeft2 : ArrowRight2;
  const handlers = useLongPress({ onLongPress: () => onLongPress(thread.id) });

  const lastMsg =
    thread.messages.length > 0
      ? thread.messages[thread.messages.length - 1]
      : null;

  const lastText = lastMsg
    ? lastMsg.isDeleted
      ? (isArabic ? 'تم حذف الرسالة' : 'Message deleted')
      : lastMsg.text
    : (isArabic ? 'بدء محادثة جديدة' : 'New chat started');

  return (
    <Card
      data-testid="conversation-row"
      variant="interactive"
      onClick={() => onOpen(thread.id)}
      onTouchStart={handlers.onTouchStart}
      onTouchEnd={handlers.onTouchEnd}
      onTouchMove={handlers.onTouchMove}
      onContextMenu={handlers.onContextMenu}
      className="p-3.5 flex items-center gap-3.5 group select-none"
    >
      <div className="w-12 h-12 rounded-xl bg-background overflow-hidden border border-border shrink-0">
        <img
          src={thread.imageUrl}
          alt={thread.title}
          className="w-full h-full object-cover"
          onError={onImageError}
        />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-baseline justify-between mb-1">
          <div className="text-sm font-bold text-ink truncate group-hover:text-primary" dir="auto">
            {thread.title}
          </div>
          {lastMsg && (
            <span className="text-[10px] text-ink-muted shrink-0 ms-2">
              {lastMsg.timestamp}
            </span>
          )}
        </div>
        <div
          className={`text-xs truncate ${lastMsg?.isDeleted ? 'text-ink-muted italic' : 'text-ink-muted'}`}
          dir={lastMsg ? 'auto' : undefined}
        >
          {lastText}
        </div>
      </div>

      <ChevronIcon size={18} variant="Linear" className="text-ink-muted group-hover:text-primary shrink-0" />
    </Card>
  );
};
