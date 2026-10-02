import { generate } from './engine';

const drafts = [
  ['real-estate', 'for-sale', 'شقة للبيع في شفا بدران مساحه 120م مكونه من 3 نوم و 3 حمامات و بلكونه بسعر 50 الف'],
  ['motors', 'cars', 'سيارة للبيع في عبدون موديل 2019 ماشية 80000 كم بسعر 9000 دينار'],
  ['mobiles', 'phones', 'ايفون للبيع في خلدا سعة 128 جيجا'],
];

for (const [category, sub, draft] of drafts) {
  for (const userId of ['a', 'b', 'c']) {
    const listing = generate({ userId, draft, categorySlug: category, subcategorySlug: sub });
    console.log(`=== ${userId} ${listing.planId} ${listing.fingerprint} ===`);
    console.log(listing.title);
    console.log(listing.description);
    console.log(listing.facts.district, listing.facts.lat, listing.facts.lng);
    console.log('');
  }
}
