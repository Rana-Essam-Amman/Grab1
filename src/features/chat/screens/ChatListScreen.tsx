import { useUI } from '@/hooks/useUI';
import React, { useState } from 'react';
import { Message, SearchNormal1, ShieldTick } from 'iconsax-react';
import { ChatConversationList, ConversationItem } from '../components/ChatConversationList';

const INITIAL_CONVERSATIONS: ConversationItem[] = [
  {
    id: 'conv-1',
    peerName: 'محمد أحمد',
    peerAvatar: '/assets/avatars/user1.jpg',
    lastMessage: 'مرحباً، هل السعر نهائي أم فيه تفاوض بالمعقول؟',
    time: '10:45 ص',
    itemTitle: 'تويوتا كامري ٢٠٢٢ فحص كامل',
    itemPrice: '19,500 دينار',
    itemImage: '/assets/listings/car.jpg',
    unreadCount: 2,
  },
  {
    id: 'conv-2',
    peerName: 'رامي خوري',
    peerAvatar: '/assets/avatars/user2.jpg',
    lastMessage: 'أنا جاد بالشراء، هل يمكن المعاينة اليوم بعد العصر؟',
    time: 'أمس',
    itemTitle: 'آيفون ١٤ برو ماكس 256 جيجا',
    itemPrice: '680 دينار',
    itemImage: '/assets/listings/phone.jpg',
    unreadCount: 0,
  },
  {
    id: 'conv-3',
    peerName: 'سارة حسن',
    peerAvatar: '/assets/avatars/user3.jpg',
    lastMessage: 'شكراً جزيلاً، تم الإتفاق وتنسيق الموعد.',
    time: 'منذ يومين',
    itemTitle: 'شقة مفروشة في خلدا موقع مميز',
    itemPrice: '450 دينار',
    itemImage: '/assets/listings/apartment.jpg',
    unreadCount: 0,
  },
];

export const ChatListScreen: React.FC = () => {
  const { isArabic, navigateTo, setSelectedThreadId } = useUI();
  const [conversations] = useState<ConversationItem[]>(INITIAL_CONVERSATIONS);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredConversations = conversations.filter(
    (c) =>
      c.peerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.itemTitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenChat = (id: string) => {
    setSelectedThreadId(id);
    navigateTo('thread');
  };

  return (
    <div
      dir={isArabic ? 'rtl' : 'ltr'}
      className="max-w-[440px] mx-auto w-full flex flex-col gap-3 pb-24 px-4 pt-3 font-cairo bg-surface-sunken min-h-screen"
    >
      {/* Header Banner */}
      <div className="bg-surface rounded-2xl border border-line p-4 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-surface-raised text-brand flex items-center justify-center">
            <Message size={20} variant="Linear" />
          </div>
          <div>
            <h1 className="text-base font-bold text-ink font-cairo">
              {isArabic ? 'الرسائل والمحادثات' : 'Messages & Chats'}
            </h1>
            <p className="text-xs text-ink-muted">
              {isArabic ? 'تواصل آمن ومباشر مع البائعين والمشترين' : 'Secure direct buyer & seller chat'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1 text-[11px] font-bold text-brand bg-brand/10 px-2.5 py-1 rounded-full">
          <ShieldTick size={14} variant="Linear" />
          <span>{isArabic ? 'محمي' : 'Secure'}</span>
        </div>
      </div>

      {/* Search Filter Input */}
      <div className="relative">
        <span className="absolute inset-y-0 right-0 flex items-center pr-3.5 pointer-events-none text-ink-muted">
          <SearchNormal1 size={16} variant="Linear" />
        </span>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={isArabic ? 'بحث في المحادثات أو الإعلانات...' : 'Search chats or listings...'}
          className="w-full h-11 bg-surface border border-line rounded-xl pr-10 pl-4 text-xs font-cairo text-ink placeholder-ink-muted focus:outline-none focus:border-brand transition-all shadow-2xs"
        />
      </div>

      {/* Roster List */}
      <ChatConversationList
        filteredConversations={filteredConversations}
        isArabic={isArabic}
        handleOpenChat={handleOpenChat}
      />
    </div>
  );
};
