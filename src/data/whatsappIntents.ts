export interface WhatsAppIntent {
  readonly id: 'available' | 'price' | 'viewing';
  readonly label: string;
  readonly body: string;
}

export type WhatsAppMarketCode = 'JO' | 'SA' | 'LB' | 'PS' | 'SY';

const EN_INTENTS: readonly WhatsAppIntent[] = [
  { id: 'available', label: 'Available?',   body: 'Hi, is this still available?' },
  { id: 'price',     label: 'Negotiable?',  body: 'Hi, is the price negotiable?' },
  { id: 'viewing',   label: 'View it?',     body: 'Hi, when can I see this listing?' },
];

export const WHATSAPP_INTENTS: Record<
  WhatsAppMarketCode,
  Record<'ar' | 'en', readonly WhatsAppIntent[]>
> = {
  JO: {
    ar: [
      { id: 'available', label: 'متوفر؟',         body: 'مرحبا، الإعلان لسا متوفر؟' },
      { id: 'price',     label: 'قابل للتفاوض؟',   body: 'مرحبا، السعر قابل للتفاوض؟' },
      { id: 'viewing',   label: 'أشوفه؟',          body: 'مرحبا، متى بقدر أشوف الإعلان؟' },
    ],
    en: EN_INTENTS,
  },
  SA: {
    ar: [
      { id: 'available', label: 'متوفر؟',           body: 'السلام عليكم، الإعلان باقي متوفر؟' },
      { id: 'price',     label: 'السعر النهائي؟',   body: 'السلام عليكم، وش السعر النهائي؟' },
      { id: 'viewing',   label: 'أشوفه؟',            body: 'السلام عليكم، متى أقدر أشوف الإعلان؟' },
    ],
    en: EN_INTENTS,
  },
  LB: {
    ar: [
      { id: 'available', label: 'متوفر؟',   body: 'مرحبا، الإعلان لسا متوفر؟' },
      { id: 'price',     label: 'آخر سعر؟', body: 'مرحبا، شو آخر سعر؟' },
      { id: 'viewing',   label: 'أشوفه؟',   body: 'مرحبا، وين بقدر أشوف الإعلان؟' },
    ],
    en: EN_INTENTS,
  },
  PS: {
    ar: [
      { id: 'available', label: 'متوفر؟',         body: 'السلام عليكم، الإعلان متوفر؟' },
      { id: 'price',     label: 'قابل للتفاوض؟',   body: 'السلام عليكم، السعر قابل للتفاوض؟' },
      { id: 'viewing',   label: 'أشوفه؟',          body: 'السلام عليكم، ممكن أشوف الإعلان؟' },
    ],
    en: EN_INTENTS,
  },
  SY: {
    ar: [
      { id: 'available', label: 'متوفر؟',         body: 'مرحبا، الإعلان متوفر؟' },
      { id: 'price',     label: 'قابل للتفاوض؟',   body: 'مرحبا، السعر قابل للتفاوض؟' },
      { id: 'viewing',   label: 'وين الموقع؟',    body: 'مرحبا، وين موقع الإعلان بالضبط؟' },
    ],
    en: EN_INTENTS,
  },
};
