// RULE-14-EXCEPTION: Static taxonomy
/**
 * Expanded trade aliases (Levantine + Gulf dialect).
 * 'بلاط' (tiles - noun) was removed from 'مبلط' (tiler - person) to avoid
 * false positives on material listings.
 */
export const TRADE_ALIASES_EXPANDED: ReadonlyArray<{
  readonly canonical: string;
  readonly aliases: readonly string[];
}> = [
  { canonical: 'مبلط', aliases: ['مبلّط', 'tiler', 'مبلط سيراميك'] },
  { canonical: 'أقفالجي', aliases: ['فتاح', 'locksmith', 'قفال'] },
  { canonical: 'معلم جبس', aliases: ['جبصين', 'gypsum', 'فني جبس بورد'] },
  { canonical: 'تصليح أجهزة', aliases: ['فني أجهزة', 'appliance repair', 'مصلح أجهزة'] },
  { canonical: 'مصمم داخلي', aliases: ['مهندس ديكور', 'interior designer', 'مصمم ديكور'] },
  { canonical: 'فني مصاعد', aliases: ['elevator technician', 'مصاعدجي', 'فني اسانسير'] },
  { canonical: 'فني مياه', aliases: ['سباك', 'plumber', 'سباااك'] },
  { canonical: 'مقاول', aliases: ['contractor', 'مقاول بناء', 'متعهد'] },
  { canonical: 'فني ألمنيوم', aliases: ['aluminum technician', 'المنيوم', 'فني المنيوم'] },
  { canonical: 'حداد', aliases: ['blacksmith', 'حداد ابواب', 'لحام'] },
  { canonical: 'دهان', aliases: ['painter', 'صباغ', 'دهين'] },
  { canonical: 'نجار', aliases: ['carpenter', 'نجار موبيليا', 'نجار مطابخ'] },
  { canonical: 'فني تكييف', aliases: ['تكييجي', 'فني سبليت', 'ac technician'] },
  { canonical: 'كهربائي', aliases: ['كهربجي', 'فني كهرباء', 'electrician'] },
  { canonical: 'ميكانيكي', aliases: ['ميكانيكي سيارات', 'فني سيارات', 'mechanic'] },
  { canonical: 'حلاق', aliases: ['حلاق رجالي', 'كوافير', 'barber'] },
];
