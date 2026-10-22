import { TAG_REGISTRY } from './tagRegistry';

interface ExtractInput {
  readonly title?: string;
  readonly description?: string;
  readonly categorySlug?: string;
  readonly subcategorySlug?: string;
  readonly attributes?: ReadonlyArray<{ readonly key: string; readonly value: string }>;
}

export function extractTags(listing: ExtractInput): string[] {
  const tags = new Set<string>();
  const title = String(listing.title || '').toLowerCase();
  const desc = String(listing.description || '').toLowerCase();
  const all = `${title} ${desc}`;
  const attrMap: Record<string, string> = {};
  for (const a of listing.attributes ?? []) {
    if (a?.key) attrMap[a.key.toLowerCase()] = String(a.value || '').toLowerCase();
  }

  const cat = listing.categorySlug || '';

  // Universal rules
  if (attrMap.condition === 'new') tags.add('brand-new');
  if (attrMap.condition === 'excellent') tags.add('excellent-condition');

  // Category-specific
  if (cat === 'mobiles') {
    if (attrMap.networktech === '5g' || /\b5g\b/.test(all)) tags.add('5g');
    if (attrMap.carrierlock === 'unlocked') tags.add('unlocked');
    if (attrMap.battery === 'excellent') tags.add('battery-excellent');
    if (attrMap.boxincluded === 'true' && attrMap.condition === 'new') tags.add('sealed');
    if (['256gb', '512gb', '1tb'].includes(attrMap.storage || '')) tags.add('high-storage');
    if (['12gb', '16gb'].includes(attrMap.ram || '')) tags.add('high-ram');
    if (attrMap.imeiverified === 'true') tags.add('imei-verified');
  }

  if (cat === 'motors') {
    const km = parseInt(attrMap.km || '0', 10);
    if (km > 0 && km < 50000) tags.add('low-mileage');
    if (km > 150000) tags.add('high-mileage');
    const yr = parseInt(attrMap.year || '0', 10);
    if (yr >= 2022) tags.add('recent-year');
    if (attrMap.fuel === 'hybrid' || attrMap.fuel === 'electric') tags.add('eco-friendly');
    if (attrMap.transmission === 'auto') tags.add('automatic');
    if (attrMap.installment === 'true') tags.add('installment-available');
    if (attrMap.inspected === 'true') tags.add('inspected');
  }

  if (cat === 'real-estate') {
    const beds = parseInt(attrMap.bedrooms || '0', 10);
    if (beds >= 4) tags.add('family-sized');
    const area = parseInt(attrMap.area || '0', 10);
    if (area >= 200) tags.add('spacious');
    if (attrMap.furnished === 'true') tags.add('furnished');
    if (/\bview\b|منظر|إطلالة|sea|بحر/.test(all)) tags.add('has-view');
    if (/luxury|فاخر|ديلوكس/.test(all)) tags.add('luxury');
  }

  if (cat === 'fashion') {
    if (/leather|جلد/.test(all)) tags.add('leather');
    if (/silk|حرير/.test(all)) tags.add('silk');
    if (attrMap.original === 'original') tags.add('authentic');
  }

  if (cat === 'electronics') {
    if (/oled|amoled/.test(all)) tags.add('oled');
    if (/\b[48]k\b/.test(all)) tags.add('4k-8k');
    if (/mini ?led/.test(all)) tags.add('mini-led');
    if (/smart ?tv|تلفزيون ذكي/.test(all)) tags.add('smart-tv');
  }

  if (cat === 'computers') {
    if (/gaming|لعبة|لعب/.test(all) || /\brtx\b|\bgtx\b/.test(all)) tags.add('gaming');
    if (/rtx ?4[0-9]{3}/.test(all)) tags.add('rtx-40');
    if (/m1|m2|m3|apple silicon/.test(all)) tags.add('apple-silicon');
    if (/\bssd\b/.test(all)) tags.add('ssd');
  }

  if (cat === 'watches') {
    if (attrMap.movement === 'automatic' || /automatic|أوتوماتيك/.test(all)) tags.add('automatic-watch');
    if (/sapphire|سافير/.test(all)) tags.add('sapphire');
    if (/chronograph|كرونوغراف/.test(all)) tags.add('chronograph');
  }

  if (cat === 'kids') {
    if (attrMap.condition === 'new' && /tags|تيكيت/.test(all)) tags.add('new-with-tags');
    if (/educational|تعليمي/.test(all)) tags.add('educational');
  }

  if (cat === 'sports') {
    if (attrMap.batteryRangeKm && /electric|كهربائية/.test(all)) tags.add('electric-bike');
    if (attrMap.adjustable === 'true') tags.add('adjustable');
  }

  const known = new Set(TAG_REGISTRY.map((t) => t.slug));
  return Array.from(tags).filter((t) => known.has(t));
}
