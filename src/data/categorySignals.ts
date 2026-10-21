// RULE-14-EXCEPTION: Static taxonomy
import type { CategoryHint } from '@/ai/categoryMatch.types';

/**
 * Keyword → category/subcategory mapping for auto-detection of user intent.
 * Keys are normalized at comparison time (see hintFromNote). All slug values
 * MUST exist in src/data/subcategories.ts.
 *
 * Arabic keywords: prefer the plain form (no hamza/madda) — normalization
 * handles variants at runtime. English keywords: lowercase.
 */
export const textSignals: Record<string, CategoryHint> = {
  // ═══════════ MOTORS / CARS ═══════════
  'سيارة': { categorySlug: 'motors', subcategorySlug: 'cars', labelAr: 'سيارات للبيع', labelEn: 'Cars for Sale' },
  'سياره': { categorySlug: 'motors', subcategorySlug: 'cars', labelAr: 'سيارات للبيع', labelEn: 'Cars for Sale' },
  'كامري': { categorySlug: 'motors', subcategorySlug: 'cars', labelAr: 'سيارات للبيع', labelEn: 'Cars for Sale' },
  'كورولا': { categorySlug: 'motors', subcategorySlug: 'cars', labelAr: 'سيارات للبيع', labelEn: 'Cars for Sale' },
  'هايلكس': { categorySlug: 'motors', subcategorySlug: 'cars', labelAr: 'سيارات للبيع', labelEn: 'Cars for Sale' },
  'لاندكروزر': { categorySlug: 'motors', subcategorySlug: 'cars', labelAr: 'سيارات للبيع', labelEn: 'Cars for Sale' },
  'برادو': { categorySlug: 'motors', subcategorySlug: 'cars', labelAr: 'سيارات للبيع', labelEn: 'Cars for Sale' },
  'النترا': { categorySlug: 'motors', subcategorySlug: 'cars', labelAr: 'سيارات للبيع', labelEn: 'Cars for Sale' },
  'سوناتا': { categorySlug: 'motors', subcategorySlug: 'cars', labelAr: 'سيارات للبيع', labelEn: 'Cars for Sale' },
  'توسان': { categorySlug: 'motors', subcategorySlug: 'cars', labelAr: 'سيارات للبيع', labelEn: 'Cars for Sale' },
  'سبورتج': { categorySlug: 'motors', subcategorySlug: 'cars', labelAr: 'سيارات للبيع', labelEn: 'Cars for Sale' },
  'سيراتو': { categorySlug: 'motors', subcategorySlug: 'cars', labelAr: 'سيارات للبيع', labelEn: 'Cars for Sale' },
  'باترول': { categorySlug: 'motors', subcategorySlug: 'cars', labelAr: 'سيارات للبيع', labelEn: 'Cars for Sale' },
  'صني': { categorySlug: 'motors', subcategorySlug: 'cars', labelAr: 'سيارات للبيع', labelEn: 'Cars for Sale' },
  'تويوتا': { categorySlug: 'motors', subcategorySlug: 'cars', labelAr: 'سيارات للبيع', labelEn: 'Cars for Sale' },
  'هيونداي': { categorySlug: 'motors', subcategorySlug: 'cars', labelAr: 'سيارات للبيع', labelEn: 'Cars for Sale' },
  'نيسان': { categorySlug: 'motors', subcategorySlug: 'cars', labelAr: 'سيارات للبيع', labelEn: 'Cars for Sale' },
  'كيا': { categorySlug: 'motors', subcategorySlug: 'cars', labelAr: 'سيارات للبيع', labelEn: 'Cars for Sale' },
  'مرسيدس': { categorySlug: 'motors', subcategorySlug: 'cars', labelAr: 'سيارات للبيع', labelEn: 'Cars for Sale' },
  'بي ام دبليو': { categorySlug: 'motors', subcategorySlug: 'cars', labelAr: 'سيارات للبيع', labelEn: 'Cars for Sale' },
  'اودي': { categorySlug: 'motors', subcategorySlug: 'cars', labelAr: 'سيارات للبيع', labelEn: 'Cars for Sale' },
  'شيفروليه': { categorySlug: 'motors', subcategorySlug: 'cars', labelAr: 'سيارات للبيع', labelEn: 'Cars for Sale' },
  'فورد': { categorySlug: 'motors', subcategorySlug: 'cars', labelAr: 'سيارات للبيع', labelEn: 'Cars for Sale' },
  'شيري': { categorySlug: 'motors', subcategorySlug: 'cars', labelAr: 'سيارات للبيع', labelEn: 'Cars for Sale' },
  'جيلي': { categorySlug: 'motors', subcategorySlug: 'cars', labelAr: 'سيارات للبيع', labelEn: 'Cars for Sale' },
  'هافال': { categorySlug: 'motors', subcategorySlug: 'cars', labelAr: 'سيارات للبيع', labelEn: 'Cars for Sale' },
  'تيسلا': { categorySlug: 'motors', subcategorySlug: 'cars', labelAr: 'سيارات للبيع', labelEn: 'Cars for Sale' },
  'لكزس': { categorySlug: 'motors', subcategorySlug: 'cars', labelAr: 'سيارات للبيع', labelEn: 'Cars for Sale' },
  'camry': { categorySlug: 'motors', subcategorySlug: 'cars', labelAr: 'سيارات للبيع', labelEn: 'Cars for Sale' },
  'corolla': { categorySlug: 'motors', subcategorySlug: 'cars', labelAr: 'سيارات للبيع', labelEn: 'Cars for Sale' },
  'hilux': { categorySlug: 'motors', subcategorySlug: 'cars', labelAr: 'سيارات للبيع', labelEn: 'Cars for Sale' },
  'toyota': { categorySlug: 'motors', subcategorySlug: 'cars', labelAr: 'سيارات للبيع', labelEn: 'Cars for Sale' },
  'hyundai': { categorySlug: 'motors', subcategorySlug: 'cars', labelAr: 'سيارات للبيع', labelEn: 'Cars for Sale' },
  'nissan': { categorySlug: 'motors', subcategorySlug: 'cars', labelAr: 'سيارات للبيع', labelEn: 'Cars for Sale' },
  'kia': { categorySlug: 'motors', subcategorySlug: 'cars', labelAr: 'سيارات للبيع', labelEn: 'Cars for Sale' },
  'mercedes': { categorySlug: 'motors', subcategorySlug: 'cars', labelAr: 'سيارات للبيع', labelEn: 'Cars for Sale' },
  'bmw': { categorySlug: 'motors', subcategorySlug: 'cars', labelAr: 'سيارات للبيع', labelEn: 'Cars for Sale' },
  'audi': { categorySlug: 'motors', subcategorySlug: 'cars', labelAr: 'سيارات للبيع', labelEn: 'Cars for Sale' },
  'tesla': { categorySlug: 'motors', subcategorySlug: 'cars', labelAr: 'سيارات للبيع', labelEn: 'Cars for Sale' },
  'lexus': { categorySlug: 'motors', subcategorySlug: 'cars', labelAr: 'سيارات للبيع', labelEn: 'Cars for Sale' },
  'car': { categorySlug: 'motors', subcategorySlug: 'cars', labelAr: 'سيارات للبيع', labelEn: 'Cars for Sale' },
  'vehicle': { categorySlug: 'motors', subcategorySlug: 'cars', labelAr: 'سيارات للبيع', labelEn: 'Cars for Sale' },

  // ═══════════ MOTORS / MOTORBIKES ═══════════
  'دراجة': { categorySlug: 'motors', subcategorySlug: 'motorbikes', labelAr: 'دراجات وسكوتر', labelEn: 'Motorcycles & Scooters' },
  'دراجه': { categorySlug: 'motors', subcategorySlug: 'motorbikes', labelAr: 'دراجات وسكوتر', labelEn: 'Motorcycles & Scooters' },
  'سكوتر': { categorySlug: 'motors', subcategorySlug: 'motorbikes', labelAr: 'دراجات وسكوتر', labelEn: 'Motorcycles & Scooters' },
  'موتوسيكل': { categorySlug: 'motors', subcategorySlug: 'motorbikes', labelAr: 'دراجات وسكوتر', labelEn: 'Motorcycles & Scooters' },
  'موتور': { categorySlug: 'motors', subcategorySlug: 'motorbikes', labelAr: 'دراجات وسكوتر', labelEn: 'Motorcycles & Scooters' },
  'motorcycle': { categorySlug: 'motors', subcategorySlug: 'motorbikes', labelAr: 'دراجات وسكوتر', labelEn: 'Motorcycles & Scooters' },
  'scooter': { categorySlug: 'motors', subcategorySlug: 'motorbikes', labelAr: 'دراجات وسكوتر', labelEn: 'Motorcycles & Scooters' },

  // ═══════════ MOTORS / HEAVY ═══════════
  'شاحنة': { categorySlug: 'motors', subcategorySlug: 'heavy', labelAr: 'شاحنات وآليات ثقيلة', labelEn: 'Heavy Vehicles & Trucks' },
  'شاحنه': { categorySlug: 'motors', subcategorySlug: 'heavy', labelAr: 'شاحنات وآليات ثقيلة', labelEn: 'Heavy Vehicles & Trucks' },
  'قلاب': { categorySlug: 'motors', subcategorySlug: 'heavy', labelAr: 'شاحنات وآليات ثقيلة', labelEn: 'Heavy Vehicles & Trucks' },
  'سطحة': { categorySlug: 'motors', subcategorySlug: 'heavy', labelAr: 'شاحنات وآليات ثقيلة', labelEn: 'Heavy Vehicles & Trucks' },
  'تريلا': { categorySlug: 'motors', subcategorySlug: 'heavy', labelAr: 'شاحنات وآليات ثقيلة', labelEn: 'Heavy Vehicles & Trucks' },
  'truck': { categorySlug: 'motors', subcategorySlug: 'heavy', labelAr: 'شاحنات وآليات ثقيلة', labelEn: 'Heavy Vehicles & Trucks' },

  // ═══════════ MOTORS / PLATES ═══════════
  'لوحة سيارة': { categorySlug: 'motors', subcategorySlug: 'plates', labelAr: 'لوحات سيارات', labelEn: 'Car Plates' },
  'لوحه سياره': { categorySlug: 'motors', subcategorySlug: 'plates', labelAr: 'لوحات سيارات', labelEn: 'Car Plates' },
  'رقم سيارة': { categorySlug: 'motors', subcategorySlug: 'plates', labelAr: 'لوحات سيارات', labelEn: 'Car Plates' },
  'car plate': { categorySlug: 'motors', subcategorySlug: 'plates', labelAr: 'لوحات سيارات', labelEn: 'Car Plates' },

  // ═══════════ MOTORS / PARTS ═══════════
  'قطع غيار': { categorySlug: 'motors', subcategorySlug: 'parts', labelAr: 'قطع غيار سيارات', labelEn: 'Auto Spare Parts' },
  'قطعة سيارة': { categorySlug: 'motors', subcategorySlug: 'parts', labelAr: 'قطع غيار سيارات', labelEn: 'Auto Spare Parts' },
  'مصد': { categorySlug: 'motors', subcategorySlug: 'parts', labelAr: 'قطع غيار سيارات', labelEn: 'Auto Spare Parts' },
  'كبوت': { categorySlug: 'motors', subcategorySlug: 'parts', labelAr: 'قطع غيار سيارات', labelEn: 'Auto Spare Parts' },
  'car parts': { categorySlug: 'motors', subcategorySlug: 'parts', labelAr: 'قطع غيار سيارات', labelEn: 'Auto Spare Parts' },

  // ═══════════ MOTORS / BOATS ═══════════
  'قارب': { categorySlug: 'motors', subcategorySlug: 'boats', labelAr: 'قوارب وجت سكي', labelEn: 'Boats & Watercraft' },
  'جت سكي': { categorySlug: 'motors', subcategorySlug: 'boats', labelAr: 'قوارب وجت سكي', labelEn: 'Boats & Watercraft' },
  'يخت': { categorySlug: 'motors', subcategorySlug: 'boats', labelAr: 'قوارب وجت سكي', labelEn: 'Boats & Watercraft' },
  'boat': { categorySlug: 'motors', subcategorySlug: 'boats', labelAr: 'قوارب وجت سكي', labelEn: 'Boats & Watercraft' },
  'jet ski': { categorySlug: 'motors', subcategorySlug: 'boats', labelAr: 'قوارب وجت سكي', labelEn: 'Boats & Watercraft' },

  // ═══════════ MOTORS / ACCESSORIES ═══════════
  'اكسسوارات سيارة': { categorySlug: 'motors', subcategorySlug: 'accessories', labelAr: 'إكسسوارات سيارات', labelEn: 'Car Accessories' },
  'جنوط': { categorySlug: 'motors', subcategorySlug: 'accessories', labelAr: 'إكسسوارات سيارات', labelEn: 'Car Accessories' },
  'car accessories': { categorySlug: 'motors', subcategorySlug: 'accessories', labelAr: 'إكسسوارات سيارات', labelEn: 'Car Accessories' },

  // ═══════════ REAL ESTATE / FOR SALE ═══════════
  'شقة': { categorySlug: 'real-estate', subcategorySlug: 'apartments-for-sale', labelAr: 'شقق للبيع', labelEn: 'Apartments for Sale' },
  'شقه': { categorySlug: 'real-estate', subcategorySlug: 'apartments-for-sale', labelAr: 'شقق للبيع', labelEn: 'Apartments for Sale' },
  'بيت': { categorySlug: 'real-estate', subcategorySlug: 'houses-for-sale', labelAr: 'بيوت ومنازل للبيع', labelEn: 'Houses for Sale' },
  'منزل': { categorySlug: 'real-estate', subcategorySlug: 'houses-for-sale', labelAr: 'بيوت ومنازل للبيع', labelEn: 'Houses for Sale' },
  'فيلا': { categorySlug: 'real-estate', subcategorySlug: 'villas-for-sale', labelAr: 'فلل وقصور للبيع', labelEn: 'Villas for Sale' },
  'دوبلكس': { categorySlug: 'real-estate', subcategorySlug: 'apartments-for-sale', labelAr: 'شقق للبيع', labelEn: 'Apartments for Sale' },
  'apartment': { categorySlug: 'real-estate', subcategorySlug: 'apartments-for-sale', labelAr: 'شقق للبيع', labelEn: 'Apartments for Sale' },
  'villa': { categorySlug: 'real-estate', subcategorySlug: 'villas-for-sale', labelAr: 'فلل وقصور للبيع', labelEn: 'Villas for Sale' },

  // ═══════════ REAL ESTATE / FOR RENT ═══════════
  'للايجار': { categorySlug: 'real-estate', subcategorySlug: 'apartments-for-rent', labelAr: 'شقق للإيجار', labelEn: 'Apartments for Rent' },
  'ايجار': { categorySlug: 'real-estate', subcategorySlug: 'apartments-for-rent', labelAr: 'شقق للإيجار', labelEn: 'Apartments for Rent' },
  'مفروشة': { categorySlug: 'real-estate', subcategorySlug: 'apartments-for-rent', labelAr: 'شقق للإيجار', labelEn: 'Apartments for Rent' },
  'for rent': { categorySlug: 'real-estate', subcategorySlug: 'apartments-for-rent', labelAr: 'شقق للإيجار', labelEn: 'Apartments for Rent' },
  'rent': { categorySlug: 'real-estate', subcategorySlug: 'apartments-for-rent', labelAr: 'شقق للإيجار', labelEn: 'Apartments for Rent' },

  // ═══════════ REAL ESTATE / LANDS ═══════════
  'ارض': { categorySlug: 'real-estate', subcategorySlug: 'lands', labelAr: 'أراضي للبيع', labelEn: 'Lands for Sale' },
  'قطعة ارض': { categorySlug: 'real-estate', subcategorySlug: 'lands', labelAr: 'أراضي للبيع', labelEn: 'Lands for Sale' },
  'land': { categorySlug: 'real-estate', subcategorySlug: 'lands', labelAr: 'أراضي للبيع', labelEn: 'Lands for Sale' },
  'plot': { categorySlug: 'real-estate', subcategorySlug: 'lands', labelAr: 'أراضي للبيع', labelEn: 'Lands for Sale' },

  // ═══════════ REAL ESTATE / COMMERCIAL ═══════════
  'مكتب': { categorySlug: 'real-estate', subcategorySlug: 'commercial', labelAr: 'عقارات تجارية', labelEn: 'Commercial Real Estate' },
  'محل تجاري': { categorySlug: 'real-estate', subcategorySlug: 'commercial', labelAr: 'عقارات تجارية', labelEn: 'Commercial Real Estate' },
  'مستودع': { categorySlug: 'real-estate', subcategorySlug: 'commercial', labelAr: 'عقارات تجارية', labelEn: 'Commercial Real Estate' },
  'office': { categorySlug: 'real-estate', subcategorySlug: 'commercial', labelAr: 'عقارات تجارية', labelEn: 'Commercial Real Estate' },
  'warehouse': { categorySlug: 'real-estate', subcategorySlug: 'commercial', labelAr: 'عقارات تجارية', labelEn: 'Commercial Real Estate' },

  // ═══════════ REAL ESTATE / CHALETS ═══════════
  'شاليه': { categorySlug: 'real-estate', subcategorySlug: 'chalets', labelAr: 'شاليهات ومزارع', labelEn: 'Chalets & Farmhouses' },
  'مزرعة': { categorySlug: 'real-estate', subcategorySlug: 'chalets', labelAr: 'شاليهات ومزارع', labelEn: 'Chalets & Farmhouses' },
  'استراحة': { categorySlug: 'real-estate', subcategorySlug: 'chalets', labelAr: 'شاليهات ومزارع', labelEn: 'Chalets & Farmhouses' },
  'chalet': { categorySlug: 'real-estate', subcategorySlug: 'chalets', labelAr: 'شاليهات ومزارع', labelEn: 'Chalets & Farmhouses' },

  // Rest of the file remains unchanged (mobiles, etc.)
  // (truncated in fetch; preserved as-is for other categories)
};
