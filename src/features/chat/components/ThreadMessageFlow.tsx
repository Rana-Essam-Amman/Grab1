import React from 'react';
import type { ChatMessage } from '@/types';
import { MessageBubble } from './MessageBubble';

interface ThreadMessageFlowProps {
  readonly messages: ChatMessage[];
  readonly isArabic: boolean;
  readonly isPending?: (id: string) => boolean;
  readonly onLongPress?: (id: string) => void;
  readonly canDelete?: (id: string) => boolean;
}

export const ThreadMessageFlow: React.FC<ThreadMessageFlowProps> = ({
  messages,
  isArabic,
  isPending,
  onLongPress,
  canDelete,
}) => {
  return (
    <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3" dir="ltr">
      {messages.map((msg) => {
        const pending = isPending ? isPending(msg.id) : false;
        const deleteAllowed = canDelete ? canDelete(msg.id) : false;
        return (
          <MessageBubble
            key={msg.id}
            msg={msg}
            isArabic={isArabic}
            pending={pending}
            canDelete={deleteAllowed}
            onLongPress={onLongPress ?? (() => {})}
          />
        );
      })}
    </div>
  );
};
