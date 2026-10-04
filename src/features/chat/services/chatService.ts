import { supabase } from '@/shared/lib/supabase';
import type {
  ChatMessage,
  ChatMessageRow,
  ConversationRow,
  ConversationView,
  CreateConversationInput,
} from './chatService.types';
import {
  rowToMessage,
  rowToConversation,
  getListingsByIds,
  toViews,
} from './chatService.mappers';

export async function createOrGetConversation(
  input: CreateConversationInput
): Promise<{ data: ConversationView | null; error: string | null }> {
  try {
    const { data: existing } = await supabase
      .from('conversations')
      .select('*')
      .eq('listing_id', input.listingId)
      .eq('buyer_id', input.buyerId)
      .maybeSingle();
    let row: ConversationRow | null = null;
    if (existing) {
      row = existing as ConversationRow;
    } else {
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
      row = data as ConversationRow;
    }
    const conversation = rowToConversation(row);
    const { data: listingMap, error: lErr } = await getListingsByIds([conversation.listingId]);
    if (lErr) return { data: null, error: lErr };
    return { data: toViews([conversation], listingMap)[0], error: null };
  } catch (err) {
    return { data: null, error: err instanceof Error ? err.message : 'Unknown error' };
  }
}

export async function getConversationsForUser(
  userId: string
): Promise<{ data: ConversationView[] | null; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from('conversations')
      .select('*')
      .or(`buyer_id.eq.${userId},seller_id.eq.${userId}`)
      .order('updated_at', { ascending: false })
      .limit(200);
    if (error) return { data: null, error: error.message };
    const conversations = (data || []).map((r) => rowToConversation(r as ConversationRow));
    const listingIds = Array.from(new Set(conversations.map((c) => c.listingId)));
    const { data: listingMap, error: lErr } = await getListingsByIds(listingIds);
    if (lErr) return { data: null, error: lErr };
    return { data: toViews(conversations, listingMap), error: null };
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

export async function softDeleteMessage(messageId: string): Promise<{ error: string | null }> {
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

export async function deleteConversation(conversationId: string): Promise<{ error: string | null }> {
  try {
    const { error } = await supabase.from('conversations').delete().eq('id', conversationId);
    return { error: error ? error.message : null };
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Unknown error' };
  }
}

export async function markMessagesRead(conversationId: string): Promise<{ error: string | null }> {
  try {
    const { error } = await supabase.rpc('mark_messages_read', { p_conversation_id: conversationId });
    return { error: error ? error.message : null };
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Unknown error' };
  }
}
