import { useChatStore } from './chat.slice';
import {
  getConversationsForUser,
  getMessagesForConversation,
} from '../services/chatService';

const MESSAGES_PAGE_SIZE = 50;

export async function loadConversationsForUser(userId: string): Promise<void> {
  if (!userId) return;
  useChatStore.setState({ loadingConversations: true, error: null });
  const { data, error } = await getConversationsForUser(userId);
  if (error || !data) {
    useChatStore.setState({
      loadingConversations: false,
      error: error || 'Failed to load conversations',
    });
    return;
  }
  useChatStore.setState({
    conversations: data,
    loadingConversations: false,
    error: null,
  });
}

export async function loadInitialMessages(conversationId: string): Promise<void> {
  if (!conversationId) return;
  useChatStore.setState((s) => ({
    loadingByConversation: { ...s.loadingByConversation, [conversationId]: true },
  }));
  const { data, error } = await getMessagesForConversation(conversationId);
  if (error || !data) {
    useChatStore.setState((s) => ({
      loadingByConversation: { ...s.loadingByConversation, [conversationId]: false },
      error: error || 'Failed to load messages',
    }));
    return;
  }
  const lastPage = data.slice(-MESSAGES_PAGE_SIZE);
  const cursor = lastPage.length === MESSAGES_PAGE_SIZE ? lastPage[0].createdAt : null;

  useChatStore.setState((s) => ({
    messagesByConversation: { ...s.messagesByConversation, [conversationId]: lastPage },
    cursorByConversation: { ...s.cursorByConversation, [conversationId]: cursor },
    loadingByConversation: { ...s.loadingByConversation, [conversationId]: false },
  }));
}

export async function loadOlderMessages(conversationId: string): Promise<void> {
  const state = useChatStore.getState();
  const cursor = state.cursorByConversation[conversationId];
  if (!cursor) return;

  useChatStore.setState((s) => ({
    loadingByConversation: { ...s.loadingByConversation, [conversationId]: true },
  }));

  const { data, error } = await getMessagesForConversation(conversationId);
  if (error || !data) {
    useChatStore.setState((s) => ({
      loadingByConversation: { ...s.loadingByConversation, [conversationId]: false },
    }));
    return;
  }

  const older = data.filter((m) => m.createdAt < cursor).slice(-MESSAGES_PAGE_SIZE);
  const nextCursor = older.length === MESSAGES_PAGE_SIZE ? older[0].createdAt : null;

  useChatStore.setState((s) => {
    const existing = s.messagesByConversation[conversationId] ?? [];
    const merged = [...older, ...existing];
    return {
      messagesByConversation: { ...s.messagesByConversation, [conversationId]: merged },
      cursorByConversation: { ...s.cursorByConversation, [conversationId]: nextCursor },
      loadingByConversation: { ...s.loadingByConversation, [conversationId]: false },
    };
  });
}

export function resetChatStore(): void {
  useChatStore.setState({
    conversations: [],
    messagesByConversation: {},
    pendingByConversation: {},
    cursorByConversation: {},
    loadingConversations: false,
    loadingByConversation: {},
    error: null,
  });
}
