import { z } from 'zod';
import type { ChatMessage as TypeScriptChatMessage, Conversation as TypeScriptConversation } from '../types';

export const ChatMessageSchema = z.object({
  id: z.string(),
  text: z.string(),
  fromBuyer: z.boolean(),
  timestamp: z.string(),
});

export const ConversationSchema = z.object({
  id: z.string(),
  listingId: z.string(),
  title: z.string(),
  imageUrl: z.string(),
  sellerPhone: z.string(),
  messages: z.array(ChatMessageSchema),
});

export type ChatMessage = z.infer<typeof ChatMessageSchema>;
export type Conversation = z.infer<typeof ConversationSchema>;

// Static type assertions ensuring structural compatibility with src/types.ts
type AssertMessageCompatible<T extends TypeScriptChatMessage> = true;
type _TestMessage = AssertMessageCompatible<ChatMessage>;

type AssertConversationCompatible<T extends TypeScriptConversation> = true;
type _TestConversation = AssertConversationCompatible<Conversation>;
