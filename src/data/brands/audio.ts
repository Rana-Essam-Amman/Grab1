import type { GenericBrand, GenericModel } from '@/features/post-wizard/helpers/genericModelHelpers';

export const AUDIO_BRANDS: readonly GenericBrand[] = [
  { slug: 'jbl', nameAr: 'JBL', nameEn: 'JBL' },
  { slug: 'bose', nameAr: 'بوز', nameEn: 'Bose' },
  { slug: 'sony', nameAr: 'سوني', nameEn: 'Sony' },
  { slug: 'anker', nameAr: 'أنكر', nameEn: 'Anker' },
  { slug: 'marshall', nameAr: 'مارشال', nameEn: 'Marshall' },
  { slug: 'harman_kardon', nameAr: 'هارمان كاردون', nameEn: 'Harman Kardon' },
  { slug: 'sennheiser', nameAr: 'سينهايزر', nameEn: 'Sennheiser' },
  { slug: 'beats', nameAr: 'بيتس', nameEn: 'Beats' },
];

export const AUDIO_MODELS: Record<string, readonly GenericModel[]> = {
  jbl: [
    { slug: 'flip-6', nameAr: 'فليب 6', nameEn: 'Flip 6' },
    { slug: 'charge-5', nameAr: 'تشارج 5', nameEn: 'Charge 5' },
    { slug: 'xtreme-4', nameAr: 'إكستريم 4', nameEn: 'Xtreme 4' },
    { slug: 'boombox-3', nameAr: 'بوم بوكس 3', nameEn: 'Boombox 3' },
    { slug: 'partybox-110', nameAr: 'بارتي بوكس 110', nameEn: 'PartyBox 110' },
  ],
  bose: [
    { slug: 'soundlink-flex', nameAr: 'ساوند لينك فليكس', nameEn: 'SoundLink Flex' },
    { slug: 'soundlink-revolve-plus', nameAr: 'ساوند لينك ريفولف بلس', nameEn: 'SoundLink Revolve+' },
    { slug: 'quietcomfort-ultra', nameAr: 'كويت كومفورت ألترا', nameEn: 'QuietComfort Ultra' },
    { slug: 'home-speaker-500', nameAr: 'هوم سبيكر 500', nameEn: 'Home Speaker 500' },
  ],
  sony: [
    { slug: 'wh-1000xm5', nameAr: 'دبليو إتش 1000 إكس إم 5', nameEn: 'WH-1000XM5' },
    { slug: 'wf-1000xm5', nameAr: 'دبليو إف 1000 إكس إم 5', nameEn: 'WF-1000XM5' },
    { slug: 'srs-xb100', nameAr: 'إس آر إس إكس بي 100', nameEn: 'SRS-XB100' },
    { slug: 'ht-a7000', nameAr: 'إتش تي إيه 7000', nameEn: 'HT-A7000 Soundbar' },
  ],
  anker: [
    { slug: 'motion-plus', nameAr: 'موشن بلس', nameEn: 'Soundcore Motion+' },
    { slug: 'space-a40', nameAr: 'سبيس إيه 40', nameEn: 'Soundcore Space A40' },
    { slug: 'liberty-4-nc', nameAr: 'ليبرتي 4 إن سي', nameEn: 'Soundcore Liberty 4 NC' },
  ],
  marshall: [
    { slug: 'stanmore-iii', nameAr: 'ستانمور 3', nameEn: 'Stanmore III' },
    { slug: 'emberton-ii', nameAr: 'إمبرتون 2', nameEn: 'Emberton II' },
    { slug: 'willen', nameAr: 'ويلن', nameEn: 'Willen' },
  ],
  harman_kardon: [
    { slug: 'aura-studio-4', nameAr: 'أورا ستوديو 4', nameEn: 'Aura Studio 4' },
    { slug: 'onyx-studio-8', nameAr: 'أونيكس ستوديو 8', nameEn: 'Onyx Studio 8' },
  ],
  sennheiser: [
    { slug: 'momentum-4', nameAr: 'مومنتوم 4', nameEn: 'Momentum 4' },
    { slug: 'accentum-plus', nameAr: 'أكسنتوم بلس', nameEn: 'Accentum Plus' },
  ],
  beats: [
    { slug: 'studio-pro', nameAr: 'ستوديو برو', nameEn: 'Studio Pro' },
    { slug: 'fit-pro', nameAr: 'فيت برو', nameEn: 'Fit Pro' },
  ],
};
