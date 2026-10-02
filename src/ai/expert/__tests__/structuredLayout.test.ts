import { describe, it, expect } from 'vitest';
import { buildStructured, generateFromTemplates } from '../templateEngine';
import type { StructuredLayout } from '../premium/types';

const MOCK_LAYOUT: StructuredLayout = {
  titleFormat: [
    { template: 'شقة {rooms} نوم في {area}', subcategories: [] },
    { template: '{area} — {rooms} غرف و{bathrooms} حمامات', subcategories: [] },
    { template: 'للبيع: {area} بسعر {price}', subcategories: [] },
  ],
  hooks: [
    { template: 'فرصة مميزة!', subcategories: [] },
    { template: 'عرض يستحق النظر.', subcategories: [] },
    { template: 'للجادين فقط.', subcategories: [] },
  ],
  introParagraphs: [
    { template: 'وحدة في {area} بقرب الخدمات.', subcategories: [] },
    { template: 'تشطيب حديث وجاهزة للسكن.', subcategories: [] },
    { template: 'موقع حيوي وهادئ في آن واحد.', subcategories: [] },
  ],
  detailsGroups: [
    { fact: 'rooms',     variants: [{ template: '• غرف: {rooms}', subcategories: [] }] },
    { fact: 'bathrooms', variants: [{ template: '• حمامات: {bathrooms}', subcategories: [] }] },
    { fact: 'area',      variants: [{ template: '• مساحة: {area} م²', subcategories: [] }] },
    { fact: 'floor',     variants: [{ template: '• طابق: {floor}', subcategories: [] }] },
    { fact: 'price',     variants: [{ template: '• سعر: {price}', subcategories: [] }] },
  ],
  featuresBullets: [
    { template: '• موقع ممتاز', subcategories: [] },
    { template: '• تشطيب حديث', subcategories: [] },
    { template: '• توزيع عملي', subcategories: [] },
    { template: '• إضاءة طبيعية', subcategories: [] },
    { template: '• هادئ وآمن', subcategories: [] },
  ],
  ctas: [
    { template: 'تواصل معنا.', subcategories: [] },
    { template: 'للمعاينة تواصل.', subcategories: [] },
  ],
  detailsLabel: '🔹 تفاصيل:',
  featuresLabel: '🔹 مميزات:',
  featuresCount: 3,
  introCount: 2,
  minDetails: 2,
};

const FULL_FACTS = { rooms: '3', bathrooms: '3', area: '150', price: '50000', floor: '1' };

describe('buildStructured — engine unit tests', () => {
  it('produces title + body when all facts present', () => {
    const r = buildStructured(MOCK_LAYOUT, FULL_FACTS, '', 0);
    expect(r.title).toBeTruthy();
    expect(r.body).toBeTruthy();
    expect(r.body!).toContain('🔹 تفاصيل:');
    expect(r.body!).toContain('🔹 مميزات:');
    expect(r.body!).not.toMatch(/\{\w+\}/);
  });

  it('title + body vary with seed', () => {
    const a = buildStructured(MOCK_LAYOUT, FULL_FACTS, '', 0);
    const b = buildStructured(MOCK_LAYOUT, FULL_FACTS, '', 1);
    expect(a.body).not.toBe(b.body);
  });

  it('returns body=null when mandatory facts missing (hook still pickable)', () => {
    // Only rooms present → details groups mostly fail → minDetails not met
    const r = buildStructured(MOCK_LAYOUT, { rooms: '3' }, '', 0);
    // Title may fill (needs rooms+area) → null
    // Body must be null (not enough details)
    expect(r.body).toBeNull();
  });

  it('no fact appears twice in details output', () => {
    const r = buildStructured(MOCK_LAYOUT, FULL_FACTS, '', 0);
    expect(r.body).toBeTruthy();
    const detailsSection = r.body!.split('🔹 تفاصيل:')[1].split('🔹 مميزات:')[0];
    // Each fact key appears at most once
    const roomsMatches = (detailsSection.match(/غرف:/g) ?? []).length;
    const bathMatches = (detailsSection.match(/حمامات:/g) ?? []).length;
    expect(roomsMatches).toBeLessThanOrEqual(1);
    expect(bathMatches).toBeLessThanOrEqual(1);
  });
});

describe('generateFromTemplates — no regression', () => {
  it('real-estate category has no structured field yet (commit A scope)', () => {
    const out = generateFromTemplates(FULL_FACTS, 'real-estate', 0);
    expect(out).not.toBeNull();
    expect(out!.structured).toBeUndefined();
  });

  it('determinism preserved for same seed + uniqueId', () => {
    const a = generateFromTemplates(FULL_FACTS, 'real-estate', 42, 'u:1', '');
    const b = generateFromTemplates(FULL_FACTS, 'real-estate', 42, 'u:1', '');
    expect(a?.title).toBe(b?.title);
    expect(a?.paragraph1).toBe(b?.paragraph1);
  });
});
