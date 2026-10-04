import type { ChatMessage } from '../services/chatService.types';
import type { PendingMessage } from './chat.slice.types';

/**
 * Format an ISO timestamp for display. Arabic locale uses 12h.
 * Returns HH:MM in the browser's timezone.
 */
export function formatTime(iso: string, isArabic = true): string {
  try {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return '';
    return d.toLocaleTimeString(isArabic ? 'ar-JO' : 'en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return '';
  }
}

/** Merge confirmed messages + pending into a single ascending-sorted list. */
export function mergeMessages(
  confirmed: readonly ChatMessage[],
  pending: readonly PendingMessage[]
): Array<ChatMessage | PendingMessage> {
  return [...confirmed, ...pending].sort((a, b) => {
    const aT = 'createdAt' in a ? a.createdAt : '';
    const bT = 'createdAt' in b ? b.createdAt : '';
    return aT.localeCompare(bT);
  });
}
