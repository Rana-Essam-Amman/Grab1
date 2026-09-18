// Chat domain — pure business logic
export type { ChatMessage, CreateMessageInput } from './entities/ChatMessage';
export { MAX_MESSAGE_LENGTH } from './entities/ChatMessage';
export type { Conversation } from './entities/Conversation';

export { canSendMessage, MAX_BUYER_MESSAGES } from './rules/canSendMessage';
export type { CanSendMessageResult } from './rules/canSendMessage';

export { canStartConversation } from './rules/canStartConversation';
export type {
  CanStartConversationInput,
  CanStartConversationResult,
} from './rules/canStartConversation';
