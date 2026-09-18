import React from 'react';
import { MessageSquare, ChevronRight } from 'lucide-react';

export interface ConversationItem {
  id: string;
  peerName: string;
  peerAvatar: string;
  lastMessage: string;
  time: string;
  itemTitle: string;
  itemPrice: string;
  itemImage: string;
  unreadCount: number;
}

interface ChatConversationListProps {
  filteredConversations: ConversationItem[];
  isArabic: boolean;
  handleOpenChat: (id: string) => void;
}

export const ChatConversationList: React.FC<ChatConversationListProps> = ({
  filteredConversations,
  isArabic,
  handleOpenChat,
}) => {
  return (
    <div className="flex flex-col gap-2.5">
      {filteredConversations.length > 0 ? (
        filteredConversations.map((conv) => (
          <div
            key={conv.id}
            onClick={() => handleOpenChat(conv.id)}
            className="bg-surface rounded-2xl border border-line p-3.5 flex items-center gap-3.5 shadow-2xs hover:border-brand transition-all cursor-pointer group"
          >
            {/* Peer Avatar */}
            <div className="relative w-12 h-12 rounded-full bg-surface-raised border border-line flex items-center justify-center font-bold text-ink shrink-0 overflow-hidden">
              <span className="text-sm font-cairo">{conv.peerName.charAt(0)}</span>
              {conv.unreadCount > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 rounded-full bg-brand text-white text-[9px] font-bold flex items-center justify-center ring-2 ring-white">
                  {conv.unreadCount}
                </span>
              )}
            </div>
            {/* Message Details */}
            <div className="flex-1 min-w-0 flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-ink font-cairo truncate">
                  {conv.peerName}
                </h3>
                <span className="text-[10px] font-mono text-ink-muted">{conv.time}</span>
              </div>
              <p className="text-xs text-ink-muted truncate font-cairo">
                {conv.lastMessage}
              </p>
              <div className="flex items-center gap-1 text-[10px] text-brand font-semibold truncate pt-0.5">
                <span>{conv.itemTitle}</span>
                <span>•</span>
                <span>{conv.itemPrice}</span>
              </div>
            </div>
            {/* Thumbnail Badge & Arrow */}
            <div className="flex items-center gap-2 shrink-0">
              <img
                src={conv.itemImage}
                alt={conv.itemTitle}
                className="w-11 h-11 rounded-xl object-cover border border-line"
                referrerPolicy="no-referrer"
              />
              <ChevronRight
                size={16}
                className="text-ink-muted group-hover:text-brand transition-transform group-hover:translate-x-0.5"
              />
            </div>
          </div>
        ))
      ) : (
        <div className="py-16 bg-surface rounded-2xl border border-line text-center flex flex-col items-center gap-2 shadow-2xs">
          <div className="w-12 h-12 rounded-full bg-surface-raised text-ink-muted flex items-center justify-center">
            <MessageSquare size={20} />
          </div>
          <p className="text-xs font-bold text-ink font-cairo">
            {isArabic ? 'لا توجد محادثات مطابقة' : 'No matching conversations'}
          </p>
        </div>
      )}
    </div>
  );
};
