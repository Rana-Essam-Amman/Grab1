import { GeneratedListing, ListingCopyResult, ListingFacts, VisionHints } from '../types';
import { validateRegionalSanity, reconcileLocation } from '../data/locations';
import { requestAIGateway } from './aiGatewayClient';

export function extractFacts(raw: string, countryCode?: string): ListingFacts {
  const text = raw.trim();
  const yearMatch = text.match(/(20\d{2}|19\d{2})/);
  const year = yearMatch ? yearMatch[1] : undefined;

  const cleanPrice = text.replace(/٬/g, ',');
  const priceMatch = cleanPrice.match(/(\d[\d,]{2,})/);
  const price = priceMatch ? priceMatch[1].replace(/,/g, '') : undefined;

  let make: string | undefined;
  const brands = [
    'كامري', 'Camry', 'تويوتا', 'Toyota', 'هوندا', 'Honda', 'كيا', 'Kia',
    'هيونداي', 'Hyundai', 'مرسيدس', 'Mercedes', 'BMW', 'بي ام دبليو',
    'آيفون', 'iPhone', 'سامسونج', 'Samsung', 'Rolex', 'رولكس', 'Omega', 'أوميغا'
  ];
  for (const brand of brands) {
    if (text.toLowerCase().includes(brand.toLowerCase())) {
      make = brand;
      break;
    }
  }

  let candidateCity: string | undefined;
  const cityNames = [
    'عمّان', 'عمان', 'خلدا', 'إربد', 'اربد', 'الزرقاء', 'الزرقا', 'بيروت', 'دمشق', 'رام الله', 'رامالله', 'القدس', 'نابلس', 'الخليل', 'جنين', 'Amman', 'Khalda', 'Beirut', 'Damascus', 'Ramallah', 'Jerusalem'
  ];
  for (const name of cityNames) {
    if (text.includes(name)) {
      candidateCity = name;
      break;
    }
  }

  let city: string | undefined;
  if (candidateCity && countryCode) {
    const reconciled = reconcileLocation(countryCode, candidateCity);
    if (reconciled.confidence >= 0.80 && reconciled.city) {
      city = reconciled.city;
    } else {
      city = undefined;
    }
  } else if (candidateCity) {
    city = candidateCity;
  }

  if (city && countryCode && !validateRegionalSanity(countryCode, city)) {
    city = undefined;
  }

  const kmMatch = text.match(/(\d[\d,]*)\s*(ألف|الف|كم|km)/i);
  const km = kmMatch ? kmMatch[1] : undefined;

  const inspect = text.includes('فحص') || text.toLowerCase().includes('inspect');
  const negotiable = text.includes('تفاوض') || text.toLowerCase().includes('negoti');

  return {
    make,
    year,
    price,
    city,
    km,
    inspect,
    negotiable,
  };
}

function prettyNumber(n: string): string {
  const v = parseInt(n, 10);
  if (isNaN(v)) return n;
  return v.toLocaleString();
}

function buildHumanTitle({
  subject,
  facts,
  raw,
  arabic,
  categorySlug,
}: {
  subject: string;
  facts: ListingFacts;
  raw: string;
  arabic: boolean;
  categorySlug: string;
}): string {
  if (!arabic) {
    if (subject) {
      if (facts.inspect) return `${subject} Full Inspection Clean Condition`;
      if (categorySlug === 'motors') return `${subject} Excellent Condition`;
      if (categorySlug === 'electronics') return `${subject} Very Clean Ready to Use`;
      return `${subject} Clean Condition`;
    }
    const cleanRaw = raw.replace(/[^\w\s]/g, '').trim();
    return cleanRaw.length > 0 && cleanRaw.length <= 40
      ? cleanRaw
      : 'Item for Sale Clean Condition';
  }

  if (subject) {
    if (facts.inspect) {
      return `${subject} فحص كامل بحالة الوكالة`;
    }
    if (categorySlug === 'motors') {
      return `${subject} بحالة ممتازة جاهزة للاستعمال`;
    }
    if (categorySlug === 'electronics') {
      return `${subject} نظيف جداً بحالة ممتازة`;
    }
    if (categorySlug === 'real-estate') {
      return `${subject} موقع مميز جاهز للمعاينة`;
    }
    return `${subject} بحالة ممتازة للبيع`;
  }

  const cleanedText = raw.replace(/[✨🌟⭐🤖]/gu, '').trim();
  const firstLine = cleanedText.split('\n')[0].trim();
  if (firstLine && firstLine.length >= 5 && firstLine.length <= 45) {
    return firstLine;
  }

  return 'سلعة للبيع بحالة ممتازة';
}

function buildHumanBody({
  subject,
  facts,
  arabic,
  categorySlug,
}: {
  subject: string;
  facts: ListingFacts;
  arabic: boolean;
  categorySlug: string;
}): string {
  if (!arabic) {
    const lines: string[] = [];
    if (subject) {
      lines.push(`${subject} for sale in excellent condition.`);
    } else {
      lines.push('Item for sale in clean condition, ready for viewing.');
    }

    if (facts.inspect) {
      lines.push('Inspection: Fully inspected clean condition.');
    }
    if (facts.km) {
      lines.push(`Odometer: ${facts.km} km.`);
    }
    const look = [facts.color, facts.body].filter(Boolean).join(' - ');
    if (look) {
      lines.push(`Details: ${look}.`);
    }
    if (facts.city) {
      lines.push(`Location: ${facts.city}.`);
    }
    if (facts.price) {
      lines.push(`Asking Price: ${prettyNumber(facts.price)}.`);
    }

    lines.push('Clean and fully functional, ready for inspection.');
    lines.push('For serious buyers, please send a message to arrange viewing.');

    if (facts.negotiable) {
      lines.push('Price is reasonably negotiable after viewing.');
    }

    return lines.join('\n');
  }

  const lines: string[] = [];

  if (subject) {
    lines.push(`${subject} للبيع بحالة ممتازة ونظيفة جداً.`);
  } else {
    lines.push('سلعة للبيع بحالة ممتازة وجاهزة للمعاينة.');
  }

  if (facts.inspect) {
    lines.push('الفحص: فحص كامل 4 جيد بدون ملاحظات.');
  }
  if (facts.km) {
    lines.push(`العداد: ${facts.km} كم.`);
  }
  const look = [facts.color, facts.body].filter(Boolean).join(' - ');
  if (look) {
    lines.push(`المواصفات: ${look}.`);
  }
  if (facts.city) {
    lines.push(`الموقع: ${facts.city}.`);
  }
  if (facts.price) {
    lines.push(`السعر المطلوب: ${prettyNumber(facts.price)} دينار.`);
  }

  if (categorySlug === 'motors') {
    lines.push('السيارة ميكانيك وشاصي ممتاز، جاهزة للفحص والمعاينة في أي مركز.');
  } else if (categorySlug === 'real-estate') {
    lines.push('العقار بموقع مميز وجاهز للمعاينة الميدانية.');
  } else {
    lines.push('السلعة خالية من أية مشاكل وجاهزة للاستعمال مباشرة.');
  }

  lines.push('للمهتمين والجادين: التواصل عبر رسائل الإعلان لتنسيق الموعد.');

  if (facts.negotiable) {
    lines.push('السعر قابل للتفاوض بالمعقول بعد المعاينة.');
  }

  return lines.join('\n');
}

export function writeListingCopy({
  raw,
  arabic,
  categorySlug = '',
  vision = {},
  countryCode,
}: {
  raw: string;
  arabic: boolean;
  categorySlug?: string;
  vision?: VisionHints;
  countryCode?: string;
}): ListingCopyResult {
  const extracted = extractFacts(raw, countryCode);
  const facts: ListingFacts = {
    ...extracted,
    color: vision.color,
    body: vision.body,
  };

  const subject = [facts.make, facts.year].filter(Boolean).join(' ');
  const missing: string[] = [];

  if (!facts.km && categorySlug === 'motors') {
    missing.push(arabic ? 'العداد (كم)' : 'mileage');
  }
  if (!facts.city) {
    missing.push(arabic ? 'الموقع بالتفصيل' : 'location');
  }
  if (!facts.price) {
    missing.push(arabic ? 'السعر النهائي' : 'price');
  }

  const title = buildHumanTitle({ subject, facts, raw, arabic, categorySlug });
  const body = buildHumanBody({ subject, facts, arabic, categorySlug });

  return {
    title,
    body,
    facts,
    missing,
  };
}

export async function generateListing({
  raw,
  categorySlug,
  subcategorySlug,
  arabic,
  city,
  countryCode,
  images,
}: {
  raw: string;
  categorySlug: string;
  subcategorySlug: string;
  arabic: boolean;
  city?: string;
  countryCode?: string;
  images?: string[];
}): Promise<GeneratedListing> {
  try {
    const gatewayResult = await requestAIGateway({
      rawText: raw,
      categorySlug,
      subcategorySlug,
      arabic,
      countryCode,
      city,
      images,
    });
    return gatewayResult;
  } catch {
    // Fail-safe deterministic local fallback rescue loop
    const copy = writeListingCopy({ raw, arabic, categorySlug, countryCode });
    return {
      title: copy.title,
      description: copy.body,
      price: copy.facts.price || '',
      categorySlug,
      subcategorySlug,
      city: copy.facts.city || city,
      year: copy.facts.year,
      make: copy.facts.make,
      missing: copy.missing,
    };
  }
}
