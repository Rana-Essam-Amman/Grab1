import { supabase } from '@/shared/lib/supabase';
import type {
  ChatMessage,
  ChatMessageRow,
  Conversation,
  ConversationRow,
  CreateConversationInput,
} from './chatService.types';

function rowToMessage(row: ChatMessageRow): ChatMessage {
  return {
    id: row.id,
    conversationId: row.conversation_id,
    senderId: row.sender_id,
    text: row.deleted_at ? '' : row.text,
    isDeleted: row.deleted_at !== null,
    createdAt: row.created_at,
  };
}

function rowToConversation(row: ConversationRow): Conversation {
  return {
    id: row.id,
    listingId: row.listing_id,
    buyerId: row.buyer_id,
    sellerId: row.seller_id,
    marketCode: row.market_code,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function createOrGetConversation(
  input: CreateConversationInput
): Promise<{ data: Conversation | null; error: string | null }> {
  try {
    const { data: existing } = await supabase
      .from('conversations')
      .select('*')
      .eq('listing_id', input.listingId)
      .eq('buyer_id', input.buyerId)
      .maybeSingle();
    if (existing) {
      return { data: rowToConversation(existing as ConversationRow), error: null };
    }
    const { data, error } = await supabase
      .from('conversations')
      .insert({
        listing_id: input.listingId,
        buyer_id: input.buyerId,
        seller_id: input.sellerId,
        market_code: input.marketCode,
      })
      .select('*')
      .single();
    if (error) return { data: null, error: error.message };
    return { data: rowToConversation(data as ConversationRow), error: null };
  } catch (err) {
    return { data: null, error: err instanceof Error ? err.message : 'Unknown error' };
  }
}

export async function getConversationsForUser(
  userId: string
): Promise<{ data: Conversation[] | null; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from('conversations')
      .select('*')
      .or(`buyer_id.eq.${userId},seller_id.eq.${userId}`)
      .order('updated_at', { ascending: false })
      .limit(200);
    if (error) return { data: null, error: error.message };
    return { data: (data || []).map((r) => rowToConversation(r as ConversationRow)), error: null };
  } catch (err) {
    return { data: null, error: err instanceof Error ? err.message : 'Unknown error' };
  }
}

export async function getMessagesForConversation(
  conversationId: string
): Promise<{ data: ChatMessage[] | null; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true })
      .limit(500);
    if (error) return { data: null, error: error.message };
    return { data: (data || []).map((r) => rowToMessage(r as ChatMessageRow)), error: null };
  } catch (err) {
    return { data: null, error: err instanceof Error ? err.message : 'Unknown error' };
  }
}

export async function sendMessage(
  conversationId: string,
  senderId: string,
  text: string
): Promise<{ data: ChatMessage | null; error: string | null }> {
  try {
    const trimmed = text.trim();
    if (!trimmed || trimmed.length > 2000) {
      return { data: null, error: 'Invalid message length' };
    }
    const { data, error } = await supabase
      .from('messages')
      .insert({ conversation_id: conversationId, sender_id: senderId, text: trimmed })
      .select('*')
      .single();
    if (error) return { data: null, error: error.message };
    return { data: rowToMessage(data as ChatMessageRow), error: null };
  } catch (err) {
    return { data: null, error: err instanceof Error ? err.message : 'Unknown error' };
  }
}

export async function softDeleteMessage(
  messageId: string
): Promise<{ error: string | null }> {
  try {
    const { error } = await supabase
      .from('messages')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', messageId);
    return { error: error ? error.message : null };
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Unknown error' };
  }
}

export async function deleteConversation(
  conversationId: string
): Promise<{ error: string | null }> {
  try {
    const { error } = await supabase
      .from('conversations')
      .delete()
      .eq('id', conversationId);
    return { error: error ? error.message : null };
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Unknown error' };
  }
}
