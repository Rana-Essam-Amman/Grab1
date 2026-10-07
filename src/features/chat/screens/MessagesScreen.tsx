import React, { useCallback, useMemo, useState } from 'react';
import { Icon } from '@iconify/react';
import { useUI } from '@/hooks/useUI';
import { useChat } from '@/hooks/useChat';
import { EmptyState } from '@/shared/ui/EmptyState';
import { ConfirmDialog } from '@/shared/ui/ConfirmDialog';
import { ConversationRow } from '../components/ConversationRow';
import { ChatMarketTabs } from '../components/ChatMarketTabs';
import type { MarketCode } from '@/shared/lib/marketGate';
import {
  deleteConversation as deleteConversationAction,
} from '../store/chat.slice.actions.mutate';

export const MessagesScreen: React.FC = () => {
  const { isArabic, setSelectedThreadId, navigateTo } = useUI();
  const { conversations } = useChat();

  const [activeMarket, setActiveMarket] = useState<MarketCode>('JO');

  const marketCounts = useMemo(() => {
    const out: Record<MarketCode, number> = { JO: 0, SA: 0, LB: 0, PS: 0, SY: 0 };
    for (const c of conversations) {
      const code = (c as { marketCode?: MarketCode }).marketCode;
      if (code && code in out) out[code] += 1;
    }
    return out;
  }, [conversations]);

  const filteredConversations = useMemo(
    () =>
      conversations.filter(
        (c) => (c as { marketCode?: MarketCode }).marketCode === activeMarket
      ),
    [conversations, activeMarket]
  );

  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleOpenThread = useCallback((threadId: string) => {
    setSelectedThreadId(threadId);
    navigateTo('thread');
  }, [setSelectedThreadId, navigateTo]);

  const handleImageError = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    (e.target as HTMLImageElement).src =
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="50" height="50"><rect width="50" height="50" fill="%23E5E7EB"/></svg>';
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (!pendingDeleteId) return;
    setIsDeleting(true);
    await deleteConversationAction(pendingDeleteId);
    setIsDeleting(false);
    setPendingDeleteId(null);
  }, [pendingDeleteId]);

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

      <ChatMarketTabs
        isArabic={isArabic}
        activeMarket={activeMarket}
        counts={marketCounts}
        onSelect={setActiveMarket}
      />

      {filteredConversations.length === 0 ? (
        <EmptyState
          icon={<Icon icon="fluent-emoji:speech-balloon" width={48} height={48} />}
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
          {filteredConversations.map((thread) => (
            <ConversationRow
              key={thread.id}
              thread={thread}
              isArabic={isArabic}
              onOpen={handleOpenThread}
              onLongPress={setPendingDeleteId}
              onImageError={handleImageError}
            />
          ))}
        </div>
      )}

      <ConfirmDialog
        open={pendingDeleteId !== null}
        onClose={() => !isDeleting && setPendingDeleteId(null)}
        onConfirm={handleConfirmDelete}
        isArabic={isArabic}
        isProcessing={isDeleting}
        destructive
        title={isArabic ? 'حذف المحادثة؟' : 'Delete conversation?'}
        description={
          isArabic
            ? 'سيتم حذف المحادثة بالكامل من حسابك ومن حساب الطرف الآخر. لا يمكن التراجع.'
            : 'This conversation will be permanently removed from your account and the other party’s. This cannot be undone.'
        }
        confirmLabel={isArabic ? 'حذف' : 'Delete'}
        cancelLabel={isArabic ? 'إلغاء' : 'Cancel'}
      />
    </div>
  );
};
