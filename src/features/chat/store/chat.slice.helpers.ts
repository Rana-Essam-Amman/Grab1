import { Conversation } from '@/types';

export const initialConversations: Conversation[] = [
  {
    id: 'thread-1',
    listingId: 'jo-1',
    title: 'Rolex Submariner Date 41mm',
    imageUrl: '/assets/listings/watch.jpg',
    sellerPhone: '+962791234567',
    messages: [
      {
        id: 'm-1',
        text: 'مرحبا، الساعة بعدها متوفرة؟ وفي مجال للمعاينة بعبدون؟',
        fromBuyer: true,
        timestamp: '10:30 AM',
      },
      {
        id: 'm-2',
        text: 'أهلاً بك، نعم متوفرة وأهلاً وسهلاً بالمعاينة بأي وقت.',
        fromBuyer: false,
        timestamp: '10:35 AM',
      },
    ],
  },
];
