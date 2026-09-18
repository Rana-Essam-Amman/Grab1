import React from 'react';

interface ChatMessage {
  id: string;
  fromBuyer: boolean;
  text: string;
  timestamp: string;
}

interface ThreadMessageFlowProps {
  messages: ChatMessage[];
  isArabic: boolean;
}

export const ThreadMessageFlow: React.FC<ThreadMessageFlowProps> = ({
  messages,
  isArabic,
}) => {
  return (
    <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3" dir="ltr">
      {messages.map((msg) => (
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
          <span className="text-[9px] text-ink-muted mt-1 px-1" dir={isArabic ? 'rtl' : 'ltr'}>
            {msg.timestamp}
          </span>
        </div>
      ))}
    </div>
  );
};
