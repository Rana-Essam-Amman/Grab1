import { createJSONStorage, StateStorage } from 'zustand/middleware';
import { Conversation } from '@/types';
import { globalStorage } from '@/shared/lib/marketStorage';

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

export const chatStorage: StateStorage = {
  getItem: (name) => {
    const raw = globalStorage().get<unknown>(name);
    if (raw === null || raw === undefined) return null;
    if (Array.isArray(raw)) {
      // Convert legacy array format to Zustand state format
      return JSON.stringify({ state: { conversations: raw }, version: 0 });
    }
    if (raw && typeof raw === 'object') {
      return JSON.stringify(raw);
    }
    if (typeof raw === 'string') {
      try {
        JSON.parse(raw);
        return raw;
      } catch {
        return null;
      }
    }
    return null;
  },
  setItem: (name, value) => {
    try {
      const parsed = JSON.parse(value);
      // Extract conversations and store as a simple array like the old Context did
      if (parsed.state && Array.isArray(parsed.state.conversations)) {
        globalStorage().set(name, parsed.state.conversations);
      } else {
        globalStorage().set(name, value);
      }
    } catch {
      globalStorage().set(name, value);
    }
  },
  removeItem: (name) => globalStorage().remove(name),
};

export const chatStorageOptions = {
  name: 'catch_conversations',
  storage: createJSONStorage(() => chatStorage),
};
