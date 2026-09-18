import { useChatStore } from '@/features/chat/store/chat.slice';

export const useChat = () => {
  const conversations = useChatStore((s) => s.conversations);
  const startOrOpenConversation = useChatStore((s) => s.startOrOpenConversation);
  const sendChatMessage = useChatStore((s) => s.sendChatMessage);

  return {
    conversations,
    startOrOpenConversation,
    sendChatMessage,
  };
};

export const useConversations = () => useChatStore((s) => s.conversations);
