import type { GenericBrand, GenericModel } from '@/features/post-wizard/helpers/genericModelHelpers';

export const APPLIANCE_BRANDS: readonly GenericBrand[] = [
  { slug: 'lg', nameAr: 'إل جي', nameEn: 'LG' },
  { slug: 'samsung', nameAr: 'سامسونج', nameEn: 'Samsung' },
  { slug: 'bosch', nameAr: 'بوش', nameEn: 'Bosch' },
  { slug: 'whirlpool', nameAr: 'ويرلبول', nameEn: 'Whirlpool' },
  { slug: 'electrolux', nameAr: 'إلكترولوكس', nameEn: 'Electrolux' },
  { slug: 'beko', nameAr: 'بيكو', nameEn: 'Beko' },
  { slug: 'haier', nameAr: 'هاير', nameEn: 'Haier' },
  { slug: 'midea', nameAr: 'ميديا', nameEn: 'Midea' },
];

export const APPLIANCE_MODELS: Record<string, readonly GenericModel[]> = {
  lg: [
    { slug: 'f4v5vyp2t', nameAr: 'غسالة إل جي 10.5 كجم', nameEn: 'F4V5VYP2T Washer' },
    { slug: 'f4wv909p2e', nameAr: 'غسالة إل جي 9 كجم', nameEn: 'F4WV909P2E Washer' },
    { slug: 'fv1450h2b', nameAr: 'غسالة إل جي 14 كجم', nameEn: 'FV1450H2B Washer' },
    { slug: 'gr-x257cses', nameAr: 'ثلاجة إل جي 617 لتر', nameEn: 'GR-X257CSES Fridge' },
    { slug: 'gr-j324slgl', nameAr: 'ثلاجة إل جي 306 لتر', nameEn: 'GR-J324SLGL Fridge' },
    { slug: 'df365fp', nameAr: 'غسالة صحون إل جي', nameEn: 'DF365FP Dishwasher' },
    { slug: 'dfb424ap', nameAr: 'غسالة صحون إل جي 14 طقم', nameEn: 'DFB424AP Dishwasher' },
  ],
  samsung: [
    { slug: 'ww90t986dsh', nameAr: 'غسالة سامسونج 9 كجم', nameEn: 'WW90T986DSH Washer' },
    { slug: 'ww80t534daw', nameAr: 'غسالة سامسونج 8 كجم', nameEn: 'WW80T534DAW Washer' },
    { slug: 'rf65a977fsr', nameAr: 'ثلاجة سامسونج 4 أبواب', nameEn: 'RF65A977FSR Fridge' },
    { slug: 'rs67a8810b1', nameAr: 'ثلاجة سامسونج جنب لجنب', nameEn: 'RS67A8810B1 Fridge' },
    { slug: 'rt47cg5640s9', nameAr: 'ثلاجة سامسونج توب مونت', nameEn: 'RT47CG5640S9 Fridge' },
    { slug: 'dw60m6050bb', nameAr: 'غسالة صحون سامسونج', nameEn: 'DW60M6050BB Dishwasher' },
  ],
  bosch: [
    { slug: 'wat28400me', nameAr: 'غسالة بوش 8 كجم', nameEn: 'WAT28400ME Washer' },
    { slug: 'wat24460me', nameAr: 'غسالة بوش 7 كجم', nameEn: 'WAT24460ME Washer' },
    { slug: 'kgn56lb31u', nameAr: 'ثلاجة بوش 2 باب', nameEn: 'KGN56LB31U Fridge' },
    { slug: 'kgn86ai30m', nameAr: 'ثلاجة بوش أمريكي', nameEn: 'KGN86AI30M Fridge' },
    { slug: 'sms6zcw00e', nameAr: 'غسالة صحون بوش', nameEn: 'SMS6ZCW00E Dishwasher' },
    { slug: 'sms4hmw48e', nameAr: 'غسالة صحون بوش 12 طقم', nameEn: 'SMS4HMW48E Dishwasher' },
  ],
  whirlpool: [
    { slug: 'fscr10432', nameAr: 'غسالة ويرلبول 10 كجم', nameEn: 'FSCR10432 Washer' },
    { slug: 'ffdb9458', nameAr: 'غسالة صحون ويرلبول', nameEn: 'FFDB9458 Dishwasher' },
    { slug: 'w7x82t', nameAr: 'ثلاجة ويرلبول', nameEn: 'W7X82T Fridge' },
  ],
  electrolux: [
    { slug: 'ew8f8669q9', nameAr: 'غسالة إلكترولوكس 8 كجم', nameEn: 'EW8F8669Q9 Washer' },
    { slug: 'ew7f3484lb', nameAr: 'غسالة إلكترولوكس 7 كجم', nameEn: 'EW7F3484LB Washer' },
    { slug: 'lnt7me36w0', nameAr: 'ثلاجة إلكترولوكس', nameEn: 'LNT7ME36W0 Fridge' },
  ],
  beko: [
    { slug: 'wtv8744xs0', nameAr: 'غسالة بيكو 8 كجم', nameEn: 'WTV8744XS0 Washer' },
    { slug: 'b3wfu4841w', nameAr: 'غسالة بيكو 8 كجم', nameEn: 'B3WFU4841W Washer' },
    { slug: 'gne60520dx', nameAr: 'ثلاجة بيكو', nameEn: 'GNE60520DX Fridge' },
    { slug: 'rcnk321e20xb', nameAr: 'ثلاجة بيكو', nameEn: 'RCNK321E20XB Fridge' },
  ],
  haier: [
    { slug: 'hw100-b14979', nameAr: 'غسالة هاير 10 كجم', nameEn: 'HW100-B14979 Washer' },
    { slug: 'hw90-b14979', nameAr: 'غسالة هاير 9 كجم', nameEn: 'HW90-B14979 Washer' },
    { slug: 'htf-456dm6', nameAr: 'ثلاجة هاير', nameEn: 'HTF-456DM6 Fridge' },
    { slug: 'hrf-663isb2', nameAr: 'ثلاجة هاير', nameEn: 'HRF-663ISB2 Fridge' },
  ],
  midea: [
    { slug: 'mf200w100wb', nameAr: 'غسالة ميديا 10 كجم', nameEn: 'MF200W100WB Washer' },
    { slug: 'mf100w70wb', nameAr: 'غسالة ميديا 7 كجم', nameEn: 'MF100W70WB Washer' },
    { slug: 'mdrb424fge02', nameAr: 'ثلاجة ميديا', nameEn: 'MDRB424FGE02 Fridge' },
    { slug: 'mdrs619fge01', nameAr: 'ثلاجة ميديا', nameEn: 'MDRS619FGE01 Fridge' },
  ],
};
