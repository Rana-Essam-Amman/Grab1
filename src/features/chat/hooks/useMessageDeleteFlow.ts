import { useCallback, useState } from 'react';
import { softDeleteMessage } from '../store/chat.slice.actions.mutate';

interface UseMessageDeleteFlowReturn {
  readonly pendingDeleteId: string | null;
  readonly isDeleting: boolean;
  readonly onLongPress: (messageId: string) => void;
  readonly onClose: () => void;
  readonly onConfirm: () => Promise<void>;
}

/**
 * Orchestrates the "long-press → confirm → delete" flow for a single 
 * message in a conversation.
 */
export function useMessageDeleteFlow(
  conversationId: string | null
): UseMessageDeleteFlowReturn {
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const onLongPress = useCallback((messageId: string) => {
    setPendingDeleteId(messageId);
  }, []);

  const onClose = useCallback(() => {
    if (isDeleting) return;
    setPendingDeleteId(null);
  }, [isDeleting]);

  const onConfirm = useCallback(async () => {
    if (!pendingDeleteId || !conversationId) return;
    setIsDeleting(true);
    await softDeleteMessage(conversationId, pendingDeleteId);
    setIsDeleting(false);
    setPendingDeleteId(null);
  }, [pendingDeleteId, conversationId]);

  return { pendingDeleteId, isDeleting, onLongPress, onClose, onConfirm };
}
