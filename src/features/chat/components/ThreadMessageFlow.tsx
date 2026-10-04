import React from 'react';
import type { ChatMessage } from '@/types';

interface ThreadMessageFlowProps {
  messages: ChatMessage[];
  isArabic: boolean;
  isPending?: (id: string) => boolean;
}

const TickIcon: React.FC<{ pending: boolean; read: boolean }> = ({ pending, read }) => {
  if (pending) return <span className="text-ink-muted">✓</span>;
  if (read) return <span className="text-[#E57E25] font-bold">✓✓</span>;
  return <span className="text-ink-muted">✓✓</span>;
};

export const ThreadMessageFlow: React.FC<ThreadMessageFlowProps> = ({
  messages,
  isArabic,
  isPending,
}) => {
  return (
    <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3" dir="ltr">
      {messages.map((msg) => {
        const pending = isPending ? isPending(msg.id) : false;
        const read = !!msg.readAt;
        return (
          <div
            key={msg.id}
            className={`flex flex-col max-w-[80%] ${
              msg.fromBuyer ? 'self-end items-end' : 'self-start items-start'
            }`}
          >
            <div
              className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                msg.fromBuyer
                  ? 'bg-primary text-white rounded-tr-xs'
                  : 'bg-surface border border-border text-ink rounded-tl-xs'
              }`}
              dir="auto"
            >
              {msg.text}
            </div>
            <span
              className="text-[9px] text-ink-muted mt-1 px-1 flex items-center gap-1"
              dir={isArabic ? 'rtl' : 'ltr'}
            >
              {msg.fromBuyer && <TickIcon pending={pending} read={read} />}
              {msg.timestamp}
            </span>
          </div>
        );
      })}
    </div>
  );
};
