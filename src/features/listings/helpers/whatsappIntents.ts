/**
 * Market-specific WhatsApp message presets.
 *
 * Users tap a message → WhatsApp opens prefilled. Zero typing.
 * Language matches the market's dialect (JO vs SA vs LB vs PS vs SY).
 */

import type { Listing } from '@/types';

export interface WhatsAppIntent {
  readonly id: 'available' | 'price' | 'viewing';
  readonly label: string;   // Short chip label
  readonly body: string;    // Full message body (no link — appended later)
}

type MarketCode = 'JO' | 'SA' | 'LB' | 'PS' | 'SY';

const INTENTS: Record<MarketCode, readonly WhatsAppIntent[]> = {
  JO: [
    { id: 'available', label: 'متوفر؟',       body: 'مرحبا، الإعلان لسا متوفر؟' },
    { id: 'price',     label: 'قابل للتفاوض؟', body: 'مرحبا، السعر قابل للتفاوض؟' },
    { id: 'viewing',   label: 'أشوفه؟',        body: 'مرحبا، متى بقدر أشوف الإعلان؟' },
  ],
  SA: [
    { id: 'available', label: 'متوفر؟',         body: 'السلام عليكم، الإعلان باقي متوفر؟' },
    { id: 'price',     label: 'السعر النهائي؟', body: 'السلام عليكم، وش السعر النهائي؟' },
    { id: 'viewing',   label: 'أشوفه؟',          body: 'السلام عليكم، متى أقدر أشوف الإعلان؟' },
  ],
  LB: [
    { id: 'available', label: 'متوفر؟',   body: 'مرحبا، الإعلان لسا متوفر؟' },
    { id: 'price',     label: 'آخر سعر؟', body: 'مرحبا، شو آخر سعر؟' },
    { id: 'viewing',   label: 'أشوفه؟',   body: 'مرحبا، وين بقدر أشوف الإعلان؟' },
  ],
  PS: [
    { id: 'available', label: 'متوفر؟',       body: 'السلام عليكم، الإعلان متوفر؟' },
    { id: 'price',     label: 'قابل للتفاوض؟', body: 'السلام عليكم، السعر قابل للتفاوض؟' },
    { id: 'viewing',   label: 'أشوفه؟',        body: 'السلام عليكم، ممكن أشوف الإعلان؟' },
  ],
  SY: [
    { id: 'available', label: 'متوفر؟',         body: 'مرحبا، الإعلان متوفر؟' },
    { id: 'price',     label: 'قابل للتفاوض؟',   body: 'مرحبا، السعر قابل للتفاوض؟' },
    { id: 'viewing',   label: 'وين الموقع؟',    body: 'مرحبا، وين موقع الإعلان بالضبط؟' },
  ],
};

/** Return the 3 intents for the given market, defaulting to JO. */
export function getWhatsAppIntents(market: string): readonly WhatsAppIntent[] {
  return INTENTS[market as MarketCode] ?? INTENTS.JO;
}

/** Compose the final message with title for context. */
export function composeIntentMessage(body: string, listing: Listing): string {
  const title = (listing.title || '').trim();
  const suffix = title ? `\n\n(بخصوص إعلانك "${title}" على FOX Marketplace)` : '';
  return `${body}${suffix}`;
}
