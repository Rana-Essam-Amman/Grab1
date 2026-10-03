import { GeneratedListing, ListingCopyResult, ListingFacts, VisionHints } from '../types';
import { validateRegionalSanity, reconcileLocation } from '../data/locations';
import { buildFieldsFromFacts } from './buildFieldsFromFacts';
import { realizeListing } from './surface/realizeListing';
import { extractColor } from './extractors/colors.extractor';
import { extractCondition } from './extractors/conditions.extractor';
import { extractSize } from './extractors/sizes.extractor';
import { extractSizes } from './extractors/size.extractor';
import { extractType } from './extractors/types.extractor';
import { extractPrice } from './extractors/price.extractor';
import { extractYear } from './extractors/year.extractor';
import { extractFuel } from './extractors/fuel.extractor';
import { extractTransmission } from './extractors/transmission.extractor';
import { extractMileage } from './extractors/mileage.extractor';
import { extractBrandModel } from './extractors/brandModel.extractor';
import { extractJobTitle } from './extractors/jobTitle.extractor';
import { extractExperience } from './extractors/experience.extractor';
import { extractTrade } from './extractors/trade.extractor';
import { extractWatchBrand } from './extractors/watchBrand.extractor';
import { extractBeautyBrand } from './extractors/beautyBrand.extractor';
import { extractPetBreed } from './extractors/petBreed.extractor';
import { extractKidsAge } from './extractors/kidsAge.extractor';
import { extractArea } from './extractors/area.extractor';
import { extractRooms } from './extractors/rooms.extractor';
import { extractBathrooms } from './extractors/bathrooms.extractor';
import { extractFloor } from './extractors/floor.extractor';
import { extractSeats, extractStorage } from './extractors/seatsStorage.extractor';
import { extractGender } from './extractors/gender.extractor';
import { extractMaterial } from './extractors/material.extractor';

export function getValueForKey(key: string, facts: ListingFacts, arabic: boolean): string {
  const v = facts[key];
  if (typeof v === 'string') return v;
  if (typeof v === 'boolean') return v ? (arabic ? 'نعم' : 'Yes') : '';
  if (key === 'make' || key === 'brand') return facts.make || '';
  if (key === 'inspection') return facts.inspect ? (arabic ? 'فحص كامل' : 'Full Inspection') : '';
  if (key === 'salary') return facts.price || '';
  return '';
}

export function extractFacts(raw: string, countryCode?: string): ListingFacts {
  const text = raw.trim();
  let rest = text;
  const yearMatch = rest.match(/\b(20\d{2}|19\d{2})\b/);
  let year = yearMatch ? yearMatch[1] : undefined;
  if (year) rest = rest.replace(year, ' ');
  let km: string | undefined;
  const kmPatterns = [
    /(?:ماشية|ماشي|عداد|قطعت|مشيت)\s*(\d[\d,]*)\s*(?:الف|ألف|آلاف|k|K)?/i,
    /(\d[\d,]*)\s*(?:كم|km|كيلو|كيلومتر)\b/i,
  ];
  for (const p of kmPatterns) {
    const m = rest.match(p);
    if (m) {
      let val = parseFloat(m[1].replace(/,/g, ''));
      if (/الف|ألف|آلاف|k/i.test(m[0])) val *= 1000;
      if (!isNaN(val) && val > 0) {
        km = String(Math.round(val));
        rest = rest.replace(m[0], ' ');
        break;
      }
    }
  }
  let price: string | undefined;
  const explicitPrice = rest.match(/(?:بسعر|سعر|price)\s*(\d+)/i);
  if (explicitPrice) {
    price = explicitPrice[1];
    rest = rest.replace(explicitPrice[0], ' ');
  }
  const kMatch = rest.match(/(\d[\d,.]*)\s*(ألف|الف|آلاف|k|K|مليون|M)\b/);
  if (kMatch) {
    const num = parseFloat(kMatch[1].replace(/,/g, ''));
    const unit = kMatch[2].toLowerCase();
    let val = num;
    if (unit.includes('ألف') || unit.includes('الف') || unit === 'k') val *= 1000;
    else if (unit.includes('مليون') || unit === 'm') val *= 1000000;
    if (!isNaN(val)) price = String(Math.round(val));
  } else {
    const plain = rest.match(/\b(\d{4,})\b/);
    if (plain) price = plain[1].replace(/,/g, '');
  }
  let make: string | undefined;
  const brands = [
    'كامري', 'Camry', 'تويوتا', 'Toyota', 'هوندا', 'Honda', 'كيا', 'Kia',
    'هيونداي', 'Hyundai', 'مرسيدس', 'Mercedes', 'BMW', 'بي ام دبليو',
    'آيفون', 'iPhone', 'سامسونج', 'Samsung', 'Rolex', 'رولكس', 'Omega', 'أوميغا'
  ];
  for (const brand of brands) {
    if (text.toLowerCase().includes(brand.toLowerCase())) { make = brand; break; }
  }
  let candidateCity: string | undefined;
  const cityNames = [
    'عمّان', 'عمان', 'خلدا', 'إربد', 'اربد', 'الزرقاء', 'الزرقا', 'بيروت', 'دمشق', 'رام الله', 'رامالله', 'القدس', 'نابلس', 'الخليل', 'جنين', 'Amman', 'Khalda', 'Beirut', 'Damascus', 'Ramallah', 'Jerusalem'
  ];
  for (const name of cityNames) {
    if (text.includes(name)) { candidateCity = name; break; }
  }
  let city: string | undefined;
  if (candidateCity && countryCode) {
    const reconciled = reconcileLocation(countryCode, candidateCity);
    if (reconciled.confidence >= 0.80 && reconciled.city) city = reconciled.city;
  } else if (candidateCity) city = candidateCity;
  if (city && countryCode && !validateRegionalSanity(countryCode, city)) city = undefined;
  const inspect = text.includes('فحص') || text.toLowerCase().includes('inspect');
  const negotiable = text.includes('تفاوض') || text.toLowerCase().includes('negoti');
  const authPrice = extractPrice(text);
  if (authPrice) price = authPrice;
  const authYear = extractYear(text);
  if (authYear) year = authYear;
  const authMileage = extractMileage(text);
  if (authMileage) km = authMileage;
  const brandModel = extractBrandModel(text);
  const finalMake = brandModel?.make || make;
  const finalModel = brandModel?.model;
  const fuel = extractFuel(text);
  const transmission = extractTransmission(text);
  const jobTitle = extractJobTitle(text) || extractTrade(text);
  const experience = extractExperience(text);
  const watchBrand = extractWatchBrand(text);
  const beautyBrand = extractBeautyBrand(text);
  const petBreed = extractPetBreed(text);
  const kidsAge = extractKidsAge(text);
  const area = extractArea(text);
  const rooms = extractRooms(text);
  const bathrooms = extractBathrooms(text);
  const floor = extractFloor(text);
  const seats = extractSeats(text);
  const storage = extractStorage(text);
  const sizes = extractSizes(text);
  const gender = extractGender(text);
  const material = extractMaterial(text);
  const domainBrand = watchBrand || beautyBrand;
  const effectiveMake = domainBrand || finalMake;

  return {
    make: effectiveMake,
    model: finalModel,
    year, price, city, km, inspect, negotiable,
    color: extractColor(text),
    condition: extractCondition(text),
    size: extractSize(text),
    type: extractType(text),
    brand: effectiveMake,
    fuel,
    transmission,
    jobTitle,
    serviceType: jobTitle,
    experience,
    watchBrand,
    beautyBrand,
    petBreed,
    kidsAge,
    area,
    rooms,
    bathrooms,
    floor,
    seats,
    storage,
    weight: sizes.weight,
    length: sizes.length,
    gender,
    material,
  };
}

export function prettyNumber(n: string): string {
  const v = parseInt(n, 10);
  return isNaN(v) ? n : v.toLocaleString();
}

function buildHumanTitle({ subject, facts, raw, arabic, categorySlug }: {
  subject: string; facts: ListingFacts; raw: string;
  arabic: boolean; categorySlug: string;
}): string {
  if (subject) {
    if (arabic) {
      if (categorySlug === 'motors') {
        if (facts.inspect && facts.km) return `${subject} ماشية ${facts.km} كم - فحص كامل`;
        if (facts.inspect) return `${subject} فحص كامل بحالة ممتازة`;
        if (facts.km) return `${subject} ماشية ${facts.km} كم بحالة ممتازة`;
        return `${subject} بحالة ممتازة`;
      }
      return facts.inspect ? `${subject} فحص كامل بحالة ممتازة` : `${subject} للبيع`;
    }
    return `${subject}${facts.inspect ? ' Full Inspection' : ' For Sale'}`;
  }
  const clean = raw.replace(/[✨🌟⭐🤖]/gu, '').trim();
  const first = clean.split('\n')[0].trim();
  return first.length >= 5 && first.length <= 45 ? first : (arabic ? 'للبيع' : 'For Sale');
}

function buildHumanBody({ subject = '', facts, raw, arabic, categorySlug }: {
  subject?: string; facts: ListingFacts; raw: string;
  arabic: boolean; categorySlug: string;
}): string {
  const contact = arabic ? 'للتواصل عبر رسائل الإعلان.' : 'Contact via in-app messages.';
  const lines: string[] = [];
  const cleanRaw = raw.trim();
  const titleSubject = subject.trim();
  const rawIsTitle = cleanRaw.length > 0 &&
    (cleanRaw === titleSubject ||
     cleanRaw.replace(/\s+/g, ' ') === titleSubject.replace(/\s+/g, ' ') ||
     cleanRaw.length <= titleSubject.length + 5);
  if (cleanRaw && !rawIsTitle) lines.push(cleanRaw);
  if (categorySlug === 'motors' && cleanRaw) {
    const extras: string[] = [];
    if (facts.km) extras.push(arabic ? `العداد: ${facts.km} كم` : `Mileage: ${facts.km} km`);
    if (facts.color) extras.push(arabic ? `اللون: ${facts.color}` : `Color: ${facts.color}`);
    if (extras.length) lines.push('', ...extras);
  }
  if (lines.length > 0) lines.push('');
  lines.push(contact);
  return lines.join('\n').trim();
}

export function writeListingCopy({
  raw, arabic, categorySlug = '', vision = {}, countryCode,
}: {
  raw: string; arabic: boolean; categorySlug?: string; vision?: VisionHints; countryCode?: string;
}): ListingCopyResult {
  const extracted = extractFacts(raw, countryCode);
  const facts: ListingFacts = { ...extracted, color: vision.color || extracted.color, body: vision.body || extracted.body };
  const subject = [facts.make, facts.year].filter(Boolean).join(' ');
  const missing: string[] = [];
  if (!facts.km && categorySlug === 'motors') missing.push(arabic ? 'العداد (كم)' : 'mileage');
  if (!facts.city) missing.push(arabic ? 'الموقع بالتفصيل' : 'location');
  if (!facts.price) missing.push(arabic ? 'السعر النهائي' : 'price');
  const title = buildHumanTitle({ subject, facts, raw, arabic, categorySlug });
  const body = buildHumanBody({ subject, facts, raw, arabic, categorySlug });
  return { title, body, facts, missing };
}

function placeFromSentence(raw: string): string {
  const match = raw.match(/في\s+([\u0600-\u06FF]+(?:\s[\u0600-\u06FF]+)?)/);
  if (!match) return '';
  return match[1].replace(/مساحه|مساحة|مكونة|مكونه|طابق.*/, '').trim().replace('شفابدران', 'شفا بدران').replace('ابو نصير', 'أبو نصير');
}

export async function generateListing({
  raw, categorySlug, subcategorySlug, arabic, city, countryCode,
  uniqueId = '',
}: {
  raw: string; categorySlug: string; subcategorySlug: string; arabic: boolean; city?: string; countryCode?: string; images?: string[]; variantSeed?: number; uniqueId?: string;
}): Promise<GeneratedListing> {
  const extracted = extractFacts(raw, countryCode);
  const mutable: Record<string, string | boolean | undefined> = { ...extracted };
  if (!mutable.rooms) {
    const beds = raw.match(/(\d{1,2})\s*نوم/);
    if (beds) mutable.rooms = beds[1];
  }
  if (!mutable.floor && /طابق\s*اول|طابق\s*أول|الطابق\s*الاول|الطابق\s*الأول/.test(raw)) {
    mutable.floor = 'الأول';
  }
  if (!mutable.unitType && typeof mutable.type === 'string') {
    mutable.unitType = mutable.type;
  }
  if (categorySlug === 'real-estate' && !/مقاس|قياس/.test(raw)) {
    mutable.size = undefined;
  }
  if (!/سعر|دينار|دولار|ريال|شيكل/.test(raw)) {
    mutable.price = undefined;
  }
  const spokenPlace = placeFromSentence(raw);
  if (spokenPlace) mutable.city = spokenPlace;
  const localFacts = mutable as ListingFacts;
  try {
    const { generate } = await import('./expert/v3/engine');
    const listing = generate({ userId: uniqueId || 'guest', draft: raw });
    const localFields = buildFieldsFromFacts(localFacts, categorySlug, subcategorySlug, arabic, raw);
    return {
      title: listing.title,
      description: listing.description,
      price: typeof localFacts.price === 'string' ? localFacts.price : '',
      categorySlug,
      subcategorySlug,
      city: listing.facts.district || spokenPlace || '',
      year: typeof localFacts.year === 'string' ? localFacts.year : undefined,
      make: typeof localFacts.make === 'string' ? localFacts.make : undefined,
      fields: localFields,
      missing: localFields.filter((field) => field.required && !field.value).map((field) => field.label),
      lat: listing.facts.lat,
      lng: listing.facts.lng,
    };
  } catch (error) {
    console.error('[AI FLOW] v3 guard fallback', error instanceof Error ? error.message : error);
  }
  const localFields = buildFieldsFromFacts(localFacts, categorySlug, subcategorySlug, arabic, raw);
  const missing: string[] = localFields
    .filter((f) => f.required && !f.value)
    .map((f) => f.label);
  const surface = realizeListing({
    raw,
    facts: localFacts,
    categorySlug,
    subcategorySlug,
    sellerId: uniqueId || 'guest',
    city,
  });

  return {
    title: surface.title,
    description: surface.description,
    price: typeof localFacts.price === 'string' && localFacts.price !== localFacts.area ? localFacts.price : '',
    categorySlug,
    subcategorySlug,
    city: placeFromSentence(raw) || (typeof localFacts.city === 'string' && localFacts.city) || '',
    year: typeof localFacts.year === 'string' ? localFacts.year : undefined,
    make: typeof localFacts.make === 'string' ? localFacts.make : undefined,
    fields: localFields,
    missing,
  };
}
