import { useChatStore } from '@/features/chat/store/chat.slice';
import { useAuthStore } from '@/features/auth/store/auth.slice';
import {
  openConversation,
  sendChatMessage as sendChatMessageAction,
} from '@/features/chat/store/chat.slice.actions.mutate';
import type { Conversation as LegacyConversation } from '@/types';
import type {
  ConversationView,
  ChatMessage as ServiceChatMessage,
} from '@/features/chat/services/chatService.types';
import type { PendingMessage } from '@/features/chat/store/chat.slice.types';

function toLegacyMessage(
  m: ServiceChatMessage | PendingMessage,
  currentUserId: string | null
): LegacyConversation['messages'][number] {
  if ('tempId' in m) {
    return {
      id: m.tempId,
      text: m.text,
      fromBuyer: true,
      timestamp: m.createdAt,
    };
  }
  return {
    id: m.id,
    text: m.text,
    fromBuyer: m.senderId === currentUserId,
    timestamp: m.createdAt,
    readAt: m.readAt,
    isDeleted: m.isDeleted,
  };
}

function toLegacyConversation(
  view: ConversationView,
  msgs: ReadonlyArray<ServiceChatMessage | PendingMessage>,
  currentUserId: string | null
): LegacyConversation {
  return {
    id: view.id,
    listingId: view.listingId,
    title: view.listing?.title ?? '',
    imageUrl: view.listing?.imageUrl ?? '',
    sellerPhone: view.listing?.sellerPhone ?? '',
    messages: msgs.map((m) => toLegacyMessage(m, currentUserId)),
  };
}

export const useChat = () => {
  const conversations = useChatStore((s) => s.conversations);
  const messagesByConversation = useChatStore((s) => s.messagesByConversation);
  const pendingByConversation = useChatStore((s) => s.pendingByConversation);
  const typingByConversation = useChatStore((s) => s.typingByConversation);
  const currentUserId = useAuthStore((s) => s.user?.id ?? null);

  const legacyConversations: LegacyConversation[] = conversations.map((c) => {
    const confirmed = messagesByConversation[c.id] ?? [];
    const pending = pendingByConversation[c.id] ?? [];
    const merged = [...confirmed, ...pending].sort((a, b) =>
      a.createdAt.localeCompare(b.createdAt)
    );
    return toLegacyConversation(c, merged, currentUserId);
  });

  return {
    conversations: legacyConversations,
    isTyping: (conversationId: string) => typingByConversation[conversationId] === true,
    openConversation,
    sendChatMessage: (conversationId: string, text: string, _country?: string) => {
      if (!currentUserId) return;
      void sendChatMessageAction(conversationId, currentUserId, text);
    },
    sendChatMessageAsync: sendChatMessageAction,
  };
};

export const useConversations = () => useChatStore((s) => s.conversations);
