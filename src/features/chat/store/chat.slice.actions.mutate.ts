import { useChatStore } from './chat.slice';
import {
  createOrGetConversation,
  sendMessage as sendMessageService,
  softDeleteMessage as softDeleteMessageService,
  deleteConversation as deleteConversationService,
} from '../services/chatService';
import type {
  ChatMessage,
  ConversationView,
  MarketCode,
} from '../services/chatService.types';
import type { PendingMessage } from './chat.slice.types';

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

  const tempId = `pending-${crypto.randomUUID()}`;
  const pending: PendingMessage = {
    tempId,
    text: trimmed,
    createdAt: new Date().toISOString(),
  };

  useChatStore.setState((s) => ({
    pendingByConversation: {
      ...s.pendingByConversation,
      [conversationId]: [...(s.pendingByConversation[conversationId] ?? []), pending],
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
    const pending = s.pendingByConversation[conversationId] ?? [];
    const remaining = senderId
      ? (() => {
          const idx = pending.findIndex((p) => p.text === confirmed.text);
          if (idx === -1) return pending;
          return [...pending.slice(0, idx), ...pending.slice(idx + 1)];
        })()
      : pending;

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

export function applyMessageUpdate(
  conversationId: string,
  updated: ChatMessage
): void {
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
