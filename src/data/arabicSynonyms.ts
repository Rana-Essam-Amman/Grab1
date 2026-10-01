// RULE-14-EXCEPTION: Static dictionary
/**
 * Curated Arabic synonym groups for marketplace search.
 * Tokens are already normalized (ة→ه, أ→ا, ى→ي) before lookup.
 * A query token matching any entry expands to include all synonyms in the group.
 */
const SYNONYM_GROUPS: readonly (readonly string[])[] = [
  // Vehicles
  ['سياره', 'عربيه', 'موتر', 'car', 'vehicle', 'auto'],
  ['دراجه', 'موتوسيكل', 'موتور', 'motorcycle', 'bike'],
  ['شاحنه', 'تراك', 'truck', 'lorry'],
  ['تاكسي', 'taxi', 'cab'],
  // Real estate
  ['شقه', 'منزل', 'بيت', 'apartment', 'flat'],
  ['فيلا', 'villa'],
  ['ارض', 'قطعه', 'land', 'plot'],
  ['مكتب', 'اوفيس', 'office'],
  ['محل', 'دكان', 'shop', 'store'],
  ['مستودع', 'مخزن', 'warehouse', 'storage'],
  // Rooms
  ['غرفه', 'غرف', 'اوده', 'room', 'rooms'],
  ['حمام', 'دوره مياه', 'bathroom', 'wc'],
  ['صاله', 'صالون', 'living'],
  ['مطبخ', 'kitchen'],
  ['شرفه', 'بلكون', 'balcony'],
  // Furniture
  ['كنبه', 'اريكه', 'sofa', 'couch'],
  ['سرير', 'bed'],
  ['طاوله', 'table'],
  ['كرسي', 'chair'],
  ['خزانه', 'كبت', 'cabinet', 'closet'],
  // Electronics
  ['جوال', 'موبايل', 'تلفون', 'هاتف', 'phone', 'mobile'],
  ['لابتوب', 'كمبيوتر', 'حاسوب', 'laptop', 'computer'],
  ['تلفزيون', 'شاشه', 'tv', 'television'],
  ['ثلاجه', 'براد', 'refrigerator', 'fridge'],
  ['غساله', 'washing machine', 'washer'],
  ['مكيف', 'تكييف', 'ac', 'air conditioner'],
  // Spelled numbers (cross-language)
  ['0', 'صفر', 'zero'],
  ['1', 'واحد', 'one'],
  ['2', 'اثنين', 'اثنان', 'two'],
  ['3', 'ثلاث', 'ثلاثه', 'three'],
  ['4', 'اربعه', 'four'],
  ['5', 'خمسه', 'five'],
  ['6', 'سته', 'six'],
  ['7', 'سبعه', 'seven'],
  ['8', 'ثمانيه', 'eight'],
  ['9', 'تسعه', 'nine'],
  ['10', 'عشره', 'ten'],
];

const TOKEN_TO_GROUP: Map<string, readonly string[]> = (() => {
  const map = new Map<string, readonly string[]>();
  for (const group of SYNONYM_GROUPS) {
    for (const token of group) {
      map.set(token, group);
    }
  }
  return map;
})();

export function expandWithSynonyms(tokens: readonly string[]): string[] {
  const out = new Set<string>(tokens);
  for (const token of tokens) {
    const group = TOKEN_TO_GROUP.get(token);
    if (group) {
      for (const syn of group) out.add(syn);
    }
  }
  return [...out];
}
