import type { Listing } from '@/types';
import {
  WHATSAPP_INTENTS,
  type WhatsAppIntent,
  type WhatsAppMarketCode,
} from '@/data/whatsappIntents';

export type { WhatsAppIntent } from '@/data/whatsappIntents';

export function getWhatsAppIntents(
  market: string,
  isArabic: boolean
): readonly WhatsAppIntent[] {
  const entry = WHATSAPP_INTENTS[market as WhatsAppMarketCode] ?? WHATSAPP_INTENTS.JO;
  return isArabic ? entry.ar : entry.en;
}

export function composeIntentMessage(
  body: string,
  listing: Listing,
  isArabic: boolean
): string {
  const title = (listing.title || '').trim();
  const suffix = title
    ? isArabic
      ? `\n\n(بخصوص إعلانك "${title}" على FOX Marketplace)`
      : `\n\n(About your listing "${title}" on FOX Marketplace)`
    : '';
  return `${body}${suffix}`;
}
