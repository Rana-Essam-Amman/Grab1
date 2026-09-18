import { useUI } from '@/hooks/useUI';
import { useChat } from '@/hooks/useChat';
import React, { useCallback } from 'react';
import { Conversation } from '@/types';
import { MessageSquare, ChevronRight, ChevronLeft } from 'lucide-react';
import { Card } from '@/shared/ui/Card';
import { EmptyState } from '@/shared/ui/EmptyState';

export const MessagesScreen: React.FC = () => {
  const { isArabic, setSelectedThreadId, navigateTo } = useUI();
  const { conversations } = useChat();
  const ChevronIcon = isArabic ? ChevronLeft : ChevronRight;

  const handleOpenThread = useCallback((threadId: string) => {
    setSelectedThreadId(threadId);
    navigateTo('thread');
  }, [setSelectedThreadId, navigateTo]);

  const handleImageError = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    (e.target as HTMLImageElement).src =
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="50" height="50"><rect width="50" height="50" fill="%23E5E7EB"/></svg>';
  }, []);

  return (
    <div className="flex flex-col pb-24 px-4 pt-3 min-h-[70vh]" dir={isArabic ? 'rtl' : 'ltr'}>
      <div className="mb-4">
        <h1 className="text-xl font-bold text-ink">
          {isArabic ? 'الرسائل والمحادثات' : 'Messages & Inquiries'}
        </h1>
        <p className="text-xs text-ink-muted mt-0.5">
          {isArabic
            ? 'تواصل مباشرة مع المشترين والبائعين'
            : 'Chat directly with buyers and sellers regarding listings'}
        </p>
      </div>

      {conversations.length === 0 ? (
        <EmptyState
          icon={<MessageSquare size={36} />}
          title={isArabic ? 'لا توجد محادثات بعد' : 'No messages yet'}
          description={
            isArabic
              ? 'عندما ترسل رسالة لأي معلن، ستظهر محادثاتك هنا للمتابعة السريعة.'
              : 'When you inquire about a listing, the conversation will appear here.'
          }
          className="py-16"
        />
      ) : (
        <div className="flex flex-col gap-2.5">
          {conversations.map((thread: Conversation) => {
            const lastMsg =
              thread.messages.length > 0
                ? thread.messages[thread.messages.length - 1]
                : null;

            return (
              <Card
                key={thread.id}
                variant="interactive"
                onClick={() => handleOpenThread(thread.id)}
                className="p-3.5 flex items-center gap-3.5 group"
              >
                <div className="w-12 h-12 rounded-xl bg-background overflow-hidden border border-border shrink-0">
                  <img
                    src={thread.imageUrl}
                    alt={thread.title}
                    className="w-full h-full object-cover"
                    onError={handleImageError}
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

                  <div className="text-xs text-ink-muted truncate" dir={lastMsg ? "auto" : undefined}>
                    {lastMsg ? lastMsg.text : (isArabic ? 'بدء محادثة جديدة' : 'New chat started')}
                  </div>
                </div>

                <ChevronIcon size={18} className="text-ink-muted group-hover:text-primary shrink-0" />
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
