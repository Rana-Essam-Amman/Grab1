import { useChatStore } from './chat.slice';
import {
  createOrGetConversation,
  sendMessage as sendMessageService,
  softDeleteMessage as softDeleteMessageService,
  deleteConversation as deleteConversationService,
  markMessagesRead as markMessagesReadService,
} from '../services/chatService';
import type { ChatMessage, ConversationView, MarketCode } from '../services/chatService.types';
import type { PendingMessage } from './chat.slice.types';

export const SOFT_MESSAGE_LIMIT = 30;

export interface OpenConversationInput {
  readonly listingId: string;
  readonly buyerId: string;
  readonly sellerId: string;
  readonly marketCode: MarketCode;
}

export async function openConversation(
  input: OpenConversationInput,
  activeCountry?: string
): Promise<ConversationView | null> {
  if (activeCountry && input.marketCode !== activeCountry) {
    throw new Error('Cross-market chat handshakes are strictly forbidden.');
  }
  const { data, error } = await createOrGetConversation(input);
  if (error || !data) {
    useChatStore.setState({ error: error || 'Failed to open conversation' });
    return null;
  }
  useChatStore.setState((s) => {
    const exists = s.conversations.some((c) => c.id === data.id);
    return { conversations: exists ? s.conversations : [data, ...s.conversations] };
  });
  return data;
}

export async function sendChatMessage(
  conversationId: string,
  senderId: string,
  text: string
): Promise<{ tempId: string | null; error: string | null }> {
  const trimmed = text.trim();
  if (!trimmed) return { tempId: null, error: 'Empty message' };
  const st = useChatStore.getState();
  const cMsgs = st.messagesByConversation[conversationId] ?? [];
  const pMsgs = st.pendingByConversation[conversationId] ?? [];
  if (cMsgs.length + pMsgs.length >= SOFT_MESSAGE_LIMIT) {
    return { tempId: null, error: 'MESSAGE_LIMIT_REACHED' };
  }
  const tempId = `pending-${crypto.randomUUID()}`;
  const pendingObj: PendingMessage = {
    tempId,
    text: trimmed,
    createdAt: new Date().toISOString(),
  };
  useChatStore.setState((s) => ({
    pendingByConversation: {
      ...s.pendingByConversation,
      [conversationId]: [...(s.pendingByConversation[conversationId] ?? []), pendingObj],
    },
  }));
  const { error } = await sendMessageService(conversationId, senderId, trimmed);
  if (error) {
    useChatStore.setState((s) => ({
      pendingByConversation: {
        ...s.pendingByConversation,
        [conversationId]: (s.pendingByConversation[conversationId] ?? []).filter(
          (p) => p.tempId !== tempId
        ),
      },
      error,
    }));
    return { tempId: null, error };
  }
  return { tempId, error: null };
}

export function reconcileConfirmedMessage(
  conversationId: string,
  senderId: string,
  confirmed: ChatMessage
): void {
  useChatStore.setState((s) => {
    const pendingList = s.pendingByConversation[conversationId] ?? [];
    const remaining = senderId
      ? (() => {
          const idx = pendingList.findIndex((p) => p.text === confirmed.text);
          if (idx === -1) return pendingList;
          return [...pendingList.slice(0, idx), ...pendingList.slice(idx + 1)];
        })()
      : pendingList;
    const existing = s.messagesByConversation[conversationId] ?? [];
    if (existing.some((m) => m.id === confirmed.id)) return s;
    return {
      pendingByConversation: { ...s.pendingByConversation, [conversationId]: remaining },
      messagesByConversation: {
        ...s.messagesByConversation,
        [conversationId]: [...existing, confirmed].sort((a, b) =>
          a.createdAt.localeCompare(b.createdAt)
        ),
      },
    };
  });
}

export async function softDeleteMessage(messageId: string): Promise<{ error: string | null }> {
  return softDeleteMessageService(messageId);
}

export function applyMessageUpdate(conversationId: string, updated: ChatMessage): void {
  useChatStore.setState((s) => {
    const existing = s.messagesByConversation[conversationId] ?? [];
    return {
      messagesByConversation: {
        ...s.messagesByConversation,
        [conversationId]: existing.map((m) => (m.id === updated.id ? updated : m)),
      },
    };
  });
}

export async function deleteConversation(conversationId: string): Promise<{ error: string | null }> {
  const { error } = await deleteConversationService(conversationId);
  if (error) return { error };
  useChatStore.setState((s) => {
    const nextConvs = s.conversations.filter((c) => c.id !== conversationId);
    const nextMsgs = { ...s.messagesByConversation };
    const nextPending = { ...s.pendingByConversation };
    const nextCursors = { ...s.cursorByConversation };
    delete nextMsgs[conversationId];
    delete nextPending[conversationId];
    delete nextCursors[conversationId];
    return {
      conversations: nextConvs,
      messagesByConversation: nextMsgs,
      pendingByConversation: nextPending,
      cursorByConversation: nextCursors,
    };
  });
  return { error: null };
}

export async function markMessagesRead(conversationId: string): Promise<void> {
  if (!conversationId) return;
  await markMessagesReadService(conversationId);
}
