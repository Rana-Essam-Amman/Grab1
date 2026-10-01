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
  'شقة': { categorySlug: 'real-estate', subcategorySlug: 'for-sale', labelAr: 'عقارات للبيع', labelEn: 'Properties for Sale' },
  'شقه': { categorySlug: 'real-estate', subcategorySlug: 'for-sale', labelAr: 'عقارات للبيع', labelEn: 'Properties for Sale' },
  'بيت': { categorySlug: 'real-estate', subcategorySlug: 'for-sale', labelAr: 'عقارات للبيع', labelEn: 'Properties for Sale' },
  'منزل': { categorySlug: 'real-estate', subcategorySlug: 'for-sale', labelAr: 'عقارات للبيع', labelEn: 'Properties for Sale' },
  'فيلا': { categorySlug: 'real-estate', subcategorySlug: 'for-sale', labelAr: 'عقارات للبيع', labelEn: 'Properties for Sale' },
  'دوبلكس': { categorySlug: 'real-estate', subcategorySlug: 'for-sale', labelAr: 'عقارات للبيع', labelEn: 'Properties for Sale' },
  'apartment': { categorySlug: 'real-estate', subcategorySlug: 'for-sale', labelAr: 'عقارات للبيع', labelEn: 'Properties for Sale' },
  'villa': { categorySlug: 'real-estate', subcategorySlug: 'for-sale', labelAr: 'عقارات للبيع', labelEn: 'Properties for Sale' },

  // ═══════════ REAL ESTATE / FOR RENT ═══════════
  'للايجار': { categorySlug: 'real-estate', subcategorySlug: 'for-rent', labelAr: 'عقارات للإيجار', labelEn: 'Properties for Rent' },
  'ايجار': { categorySlug: 'real-estate', subcategorySlug: 'for-rent', labelAr: 'عقارات للإيجار', labelEn: 'Properties for Rent' },
  'مفروشة': { categorySlug: 'real-estate', subcategorySlug: 'for-rent', labelAr: 'عقارات للإيجار', labelEn: 'Properties for Rent' },
  'for rent': { categorySlug: 'real-estate', subcategorySlug: 'for-rent', labelAr: 'عقارات للإيجار', labelEn: 'Properties for Rent' },
  'rent': { categorySlug: 'real-estate', subcategorySlug: 'for-rent', labelAr: 'عقارات للإيجار', labelEn: 'Properties for Rent' },

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

  // ═══════════ MOBILES / PHONES ═══════════
  'جوال': { categorySlug: 'mobiles', subcategorySlug: 'phones', labelAr: 'هواتف محمولة', labelEn: 'Mobile Phones' },
  'موبايل': { categorySlug: 'mobiles', subcategorySlug: 'phones', labelAr: 'هواتف محمولة', labelEn: 'Mobile Phones' },
  'هاتف': { categorySlug: 'mobiles', subcategorySlug: 'phones', labelAr: 'هواتف محمولة', labelEn: 'Mobile Phones' },
  'تلفون': { categorySlug: 'mobiles', subcategorySlug: 'phones', labelAr: 'هواتف محمولة', labelEn: 'Mobile Phones' },
  'ايفون': { categorySlug: 'mobiles', subcategorySlug: 'phones', labelAr: 'هواتف محمولة', labelEn: 'Mobile Phones' },
  'جوال سامسونج': { categorySlug: 'mobiles', subcategorySlug: 'phones', labelAr: 'هواتف محمولة', labelEn: 'Mobile Phones' },
  'هواوي': { categorySlug: 'mobiles', subcategorySlug: 'phones', labelAr: 'هواتف محمولة', labelEn: 'Mobile Phones' },
  'شاومي': { categorySlug: 'mobiles', subcategorySlug: 'phones', labelAr: 'هواتف محمولة', labelEn: 'Mobile Phones' },
  'اوبو': { categorySlug: 'mobiles', subcategorySlug: 'phones', labelAr: 'هواتف محمولة', labelEn: 'Mobile Phones' },
  'iphone': { categorySlug: 'mobiles', subcategorySlug: 'phones', labelAr: 'هواتف محمولة', labelEn: 'Mobile Phones' },
  'samsung': { categorySlug: 'mobiles', subcategorySlug: 'phones', labelAr: 'هواتف محمولة', labelEn: 'Mobile Phones' },
  'phone': { categorySlug: 'mobiles', subcategorySlug: 'phones', labelAr: 'هواتف محمولة', labelEn: 'Mobile Phones' },

  // ═══════════ MOBILES / TABLETS ═══════════
  'تابلت': { categorySlug: 'mobiles', subcategorySlug: 'tablets', labelAr: 'تابلت وآيباد', labelEn: 'Tablets & iPads' },
  'ايباد': { categorySlug: 'mobiles', subcategorySlug: 'tablets', labelAr: 'تابلت وآيباد', labelEn: 'Tablets & iPads' },
  'ipad': { categorySlug: 'mobiles', subcategorySlug: 'tablets', labelAr: 'تابلت وآيباد', labelEn: 'Tablets & iPads' },
  'tablet': { categorySlug: 'mobiles', subcategorySlug: 'tablets', labelAr: 'تابلت وآيباد', labelEn: 'Tablets & iPads' },

  // ═══════════ MOBILES / SMART WATCHES ═══════════
  'ساعة ذكية': { categorySlug: 'mobiles', subcategorySlug: 'smart-watches', labelAr: 'ساعات ذكية', labelEn: 'Smart Watches' },
  'ابل واتش': { categorySlug: 'mobiles', subcategorySlug: 'smart-watches', labelAr: 'ساعات ذكية', labelEn: 'Smart Watches' },
  'smart watch': { categorySlug: 'mobiles', subcategorySlug: 'smart-watches', labelAr: 'ساعات ذكية', labelEn: 'Smart Watches' },
  'apple watch': { categorySlug: 'mobiles', subcategorySlug: 'smart-watches', labelAr: 'ساعات ذكية', labelEn: 'Smart Watches' },

  // ═══════════ MOBILES / ACCESSORIES ═══════════
  'كفر': { categorySlug: 'mobiles', subcategorySlug: 'accessories', labelAr: 'إكسسوارات هواتف', labelEn: 'Phone Accessories' },
  'شاحن': { categorySlug: 'mobiles', subcategorySlug: 'accessories', labelAr: 'إكسسوارات هواتف', labelEn: 'Phone Accessories' },
  'باور بانك': { categorySlug: 'mobiles', subcategorySlug: 'accessories', labelAr: 'إكسسوارات هواتف', labelEn: 'Phone Accessories' },
  'power bank': { categorySlug: 'mobiles', subcategorySlug: 'accessories', labelAr: 'إكسسوارات هواتف', labelEn: 'Phone Accessories' },

  // ═══════════ MOBILES / NUMBERS ═══════════
  'رقم مميز': { categorySlug: 'mobiles', subcategorySlug: 'numbers', labelAr: 'أرقام مميزة', labelEn: 'VIP Numbers' },
  'رقم فضي': { categorySlug: 'mobiles', subcategorySlug: 'numbers', labelAr: 'أرقام مميزة', labelEn: 'VIP Numbers' },
  'رقم ذهبي': { categorySlug: 'mobiles', subcategorySlug: 'numbers', labelAr: 'أرقام مميزة', labelEn: 'VIP Numbers' },
  'vip number': { categorySlug: 'mobiles', subcategorySlug: 'numbers', labelAr: 'أرقام مميزة', labelEn: 'VIP Numbers' },

  // ═══════════ WATCHES / LUXURY ═══════════
  'رولكس': { categorySlug: 'watches', subcategorySlug: 'luxury', labelAr: 'ساعات فاخرة', labelEn: 'Luxury Watches' },
  'rolex': { categorySlug: 'watches', subcategorySlug: 'luxury', labelAr: 'ساعات فاخرة', labelEn: 'Luxury Watches' },
  'اوميغا': { categorySlug: 'watches', subcategorySlug: 'luxury', labelAr: 'ساعات فاخرة', labelEn: 'Luxury Watches' },
  'omega': { categorySlug: 'watches', subcategorySlug: 'luxury', labelAr: 'ساعات فاخرة', labelEn: 'Luxury Watches' },
  'باتيك فيليب': { categorySlug: 'watches', subcategorySlug: 'luxury', labelAr: 'ساعات فاخرة', labelEn: 'Luxury Watches' },
  'كارتييه': { categorySlug: 'watches', subcategorySlug: 'luxury', labelAr: 'ساعات فاخرة', labelEn: 'Luxury Watches' },
  'cartier': { categorySlug: 'watches', subcategorySlug: 'luxury', labelAr: 'ساعات فاخرة', labelEn: 'Luxury Watches' },

  // ═══════════ WATCHES / EVERYDAY ═══════════
  'ساعة': { categorySlug: 'watches', subcategorySlug: 'everyday', labelAr: 'ساعات يومية', labelEn: 'Everyday Watches' },
  'ساعه': { categorySlug: 'watches', subcategorySlug: 'everyday', labelAr: 'ساعات يومية', labelEn: 'Everyday Watches' },
  'كاسيو': { categorySlug: 'watches', subcategorySlug: 'everyday', labelAr: 'ساعات يومية', labelEn: 'Everyday Watches' },
  'casio': { categorySlug: 'watches', subcategorySlug: 'everyday', labelAr: 'ساعات يومية', labelEn: 'Everyday Watches' },
  'سيكو': { categorySlug: 'watches', subcategorySlug: 'everyday', labelAr: 'ساعات يومية', labelEn: 'Everyday Watches' },
  'seiko': { categorySlug: 'watches', subcategorySlug: 'everyday', labelAr: 'ساعات يومية', labelEn: 'Everyday Watches' },
  'watch': { categorySlug: 'watches', subcategorySlug: 'everyday', labelAr: 'ساعات يومية', labelEn: 'Everyday Watches' },

  // ═══════════ COMPUTERS / LAPTOPS ═══════════
  'لابتوب': { categorySlug: 'computers', subcategorySlug: 'laptops', labelAr: 'لابتوبات', labelEn: 'Laptops' },
  'لابتوبات': { categorySlug: 'computers', subcategorySlug: 'laptops', labelAr: 'لابتوبات', labelEn: 'Laptops' },
  'ماكبوك': { categorySlug: 'computers', subcategorySlug: 'laptops', labelAr: 'لابتوبات', labelEn: 'Laptops' },
  'ماك بوك': { categorySlug: 'computers', subcategorySlug: 'laptops', labelAr: 'لابتوبات', labelEn: 'Laptops' },
  'ديل': { categorySlug: 'computers', subcategorySlug: 'laptops', labelAr: 'لابتوبات', labelEn: 'Laptops' },
  'dell': { categorySlug: 'computers', subcategorySlug: 'laptops', labelAr: 'لابتوبات', labelEn: 'Laptops' },
  'لينوفو': { categorySlug: 'computers', subcategorySlug: 'laptops', labelAr: 'لابتوبات', labelEn: 'Laptops' },
  'lenovo': { categorySlug: 'computers', subcategorySlug: 'laptops', labelAr: 'لابتوبات', labelEn: 'Laptops' },
  'اسوس': { categorySlug: 'computers', subcategorySlug: 'laptops', labelAr: 'لابتوبات', labelEn: 'Laptops' },
  'asus': { categorySlug: 'computers', subcategorySlug: 'laptops', labelAr: 'لابتوبات', labelEn: 'Laptops' },
  'laptop': { categorySlug: 'computers', subcategorySlug: 'laptops', labelAr: 'لابتوبات', labelEn: 'Laptops' },
  'macbook': { categorySlug: 'computers', subcategorySlug: 'laptops', labelAr: 'لابتوبات', labelEn: 'Laptops' },

  // ═══════════ COMPUTERS / DESKTOPS ═══════════
  'كمبيوتر مكتبي': { categorySlug: 'computers', subcategorySlug: 'desktops', labelAr: 'كمبيوترات مكتبية', labelEn: 'Desktop Computers' },
  'pc': { categorySlug: 'computers', subcategorySlug: 'desktops', labelAr: 'كمبيوترات مكتبية', labelEn: 'Desktop Computers' },
  'desktop': { categorySlug: 'computers', subcategorySlug: 'desktops', labelAr: 'كمبيوترات مكتبية', labelEn: 'Desktop Computers' },

  // ═══════════ COMPUTERS / SCREENS ═══════════
  'شاشة': { categorySlug: 'computers', subcategorySlug: 'screens', labelAr: 'شاشات', labelEn: 'Monitors & Displays' },
  'شاشه': { categorySlug: 'computers', subcategorySlug: 'screens', labelAr: 'شاشات', labelEn: 'Monitors & Displays' },
  'مونيتور': { categorySlug: 'computers', subcategorySlug: 'screens', labelAr: 'شاشات', labelEn: 'Monitors & Displays' },
  'monitor': { categorySlug: 'computers', subcategorySlug: 'screens', labelAr: 'شاشات', labelEn: 'Monitors & Displays' },

  // ═══════════ COMPUTERS / PARTS ═══════════
  'كرت شاشة': { categorySlug: 'computers', subcategorySlug: 'parts-pc', labelAr: 'قطع كمبيوتر', labelEn: 'Computer Parts' },
  'معالج': { categorySlug: 'computers', subcategorySlug: 'parts-pc', labelAr: 'قطع كمبيوتر', labelEn: 'Computer Parts' },
  'بوردة': { categorySlug: 'computers', subcategorySlug: 'parts-pc', labelAr: 'قطع كمبيوتر', labelEn: 'Computer Parts' },
  'gpu': { categorySlug: 'computers', subcategorySlug: 'parts-pc', labelAr: 'قطع كمبيوتر', labelEn: 'Computer Parts' },
  'cpu': { categorySlug: 'computers', subcategorySlug: 'parts-pc', labelAr: 'قطع كمبيوتر', labelEn: 'Computer Parts' },

  // ═══════════ COMPUTERS / ACCESSORIES ═══════════
  'كيبورد': { categorySlug: 'computers', subcategorySlug: 'accessories-pc', labelAr: 'ملحقات وإكسسوارات', labelEn: 'Computer Accessories' },
  'ماوس': { categorySlug: 'computers', subcategorySlug: 'accessories-pc', labelAr: 'ملحقات وإكسسوارات', labelEn: 'Computer Accessories' },
  'keyboard': { categorySlug: 'computers', subcategorySlug: 'accessories-pc', labelAr: 'ملحقات وإكسسوارات', labelEn: 'Computer Accessories' },
  'mouse': { categorySlug: 'computers', subcategorySlug: 'accessories-pc', labelAr: 'ملحقات وإكسسوارات', labelEn: 'Computer Accessories' },

  // ═══════════ ELECTRONICS / TV ═══════════
  'تلفزيون': { categorySlug: 'electronics', subcategorySlug: 'tv', labelAr: 'شاشات وتلفزيونات', labelEn: 'TVs & Displays' },
  'تلفاز': { categorySlug: 'electronics', subcategorySlug: 'tv', labelAr: 'شاشات وتلفزيونات', labelEn: 'TVs & Displays' },
  'tv': { categorySlug: 'electronics', subcategorySlug: 'tv', labelAr: 'شاشات وتلفزيونات', labelEn: 'TVs & Displays' },
  'television': { categorySlug: 'electronics', subcategorySlug: 'tv', labelAr: 'شاشات وتلفزيونات', labelEn: 'TVs & Displays' },

  // ═══════════ ELECTRONICS / AUDIO ═══════════
  'سماعات': { categorySlug: 'electronics', subcategorySlug: 'audio', labelAr: 'سماعات وصوتيات', labelEn: 'Audio & Speakers' },
  'سبيكر': { categorySlug: 'electronics', subcategorySlug: 'audio', labelAr: 'سماعات وصوتيات', labelEn: 'Audio & Speakers' },
  'speaker': { categorySlug: 'electronics', subcategorySlug: 'audio', labelAr: 'سماعات وصوتيات', labelEn: 'Audio & Speakers' },
  'headphones': { categorySlug: 'electronics', subcategorySlug: 'audio', labelAr: 'سماعات وصوتيات', labelEn: 'Audio & Speakers' },

  // ═══════════ ELECTRONICS / GAMING ═══════════
  'بلايستيشن': { categorySlug: 'electronics', subcategorySlug: 'gaming', labelAr: 'ألعاب فيديو وأجهزة', labelEn: 'Video Games & Consoles' },
  'playstation': { categorySlug: 'electronics', subcategorySlug: 'gaming', labelAr: 'ألعاب فيديو وأجهزة', labelEn: 'Video Games & Consoles' },
  'ps5': { categorySlug: 'electronics', subcategorySlug: 'gaming', labelAr: 'ألعاب فيديو وأجهزة', labelEn: 'Video Games & Consoles' },
  'ps4': { categorySlug: 'electronics', subcategorySlug: 'gaming', labelAr: 'ألعاب فيديو وأجهزة', labelEn: 'Video Games & Consoles' },
  'xbox': { categorySlug: 'electronics', subcategorySlug: 'gaming', labelAr: 'ألعاب فيديو وأجهزة', labelEn: 'Video Games & Consoles' },
  'نينتندو': { categorySlug: 'electronics', subcategorySlug: 'gaming', labelAr: 'ألعاب فيديو وأجهزة', labelEn: 'Video Games & Consoles' },
  'nintendo': { categorySlug: 'electronics', subcategorySlug: 'gaming', labelAr: 'ألعاب فيديو وأجهزة', labelEn: 'Video Games & Consoles' },
  'switch': { categorySlug: 'electronics', subcategorySlug: 'gaming', labelAr: 'ألعاب فيديو وأجهزة', labelEn: 'Video Games & Consoles' },

  // ═══════════ ELECTRONICS / CAMERAS ═══════════
  'كاميرا': { categorySlug: 'electronics', subcategorySlug: 'cameras', labelAr: 'كاميرات وعدسات', labelEn: 'Cameras & Lenses' },
  'كاميرات': { categorySlug: 'electronics', subcategorySlug: 'cameras', labelAr: 'كاميرات وعدسات', labelEn: 'Cameras & Lenses' },
  'كانون': { categorySlug: 'electronics', subcategorySlug: 'cameras', labelAr: 'كاميرات وعدسات', labelEn: 'Cameras & Lenses' },
  'نيكون': { categorySlug: 'electronics', subcategorySlug: 'cameras', labelAr: 'كاميرات وعدسات', labelEn: 'Cameras & Lenses' },
  'camera': { categorySlug: 'electronics', subcategorySlug: 'cameras', labelAr: 'كاميرات وعدسات', labelEn: 'Cameras & Lenses' },
  'canon': { categorySlug: 'electronics', subcategorySlug: 'cameras', labelAr: 'كاميرات وعدسات', labelEn: 'Cameras & Lenses' },
  'nikon': { categorySlug: 'electronics', subcategorySlug: 'cameras', labelAr: 'كاميرات وعدسات', labelEn: 'Cameras & Lenses' },

  // ═══════════ ELECTRONICS / HOME APPLIANCES ═══════════
  'غسالة': { categorySlug: 'electronics', subcategorySlug: 'home-appliances', labelAr: 'أجهزة منزلية', labelEn: 'Home Appliances' },
  'غساله': { categorySlug: 'electronics', subcategorySlug: 'home-appliances', labelAr: 'أجهزة منزلية', labelEn: 'Home Appliances' },
  'ثلاجة': { categorySlug: 'electronics', subcategorySlug: 'home-appliances', labelAr: 'أجهزة منزلية', labelEn: 'Home Appliances' },
  'ثلاجه': { categorySlug: 'electronics', subcategorySlug: 'home-appliances', labelAr: 'أجهزة منزلية', labelEn: 'Home Appliances' },
  'مكيف': { categorySlug: 'electronics', subcategorySlug: 'home-appliances', labelAr: 'أجهزة منزلية', labelEn: 'Home Appliances' },
  'فريزر': { categorySlug: 'electronics', subcategorySlug: 'home-appliances', labelAr: 'أجهزة منزلية', labelEn: 'Home Appliances' },
  'washing machine': { categorySlug: 'electronics', subcategorySlug: 'home-appliances', labelAr: 'أجهزة منزلية', labelEn: 'Home Appliances' },
  'refrigerator': { categorySlug: 'electronics', subcategorySlug: 'home-appliances', labelAr: 'أجهزة منزلية', labelEn: 'Home Appliances' },

  // ═══════════ FURNITURE / LIVING ═══════════
  'كنبة': { categorySlug: 'furniture', subcategorySlug: 'living', labelAr: 'أثاث غرف جلوس', labelEn: 'Living Room Furniture' },
  'كنبه': { categorySlug: 'furniture', subcategorySlug: 'living', labelAr: 'أثاث غرف جلوس', labelEn: 'Living Room Furniture' },
  'صوفا': { categorySlug: 'furniture', subcategorySlug: 'living', labelAr: 'أثاث غرف جلوس', labelEn: 'Living Room Furniture' },
  'sofa': { categorySlug: 'furniture', subcategorySlug: 'living', labelAr: 'أثاث غرف جلوس', labelEn: 'Living Room Furniture' },
  'couch': { categorySlug: 'furniture', subcategorySlug: 'living', labelAr: 'أثاث غرف جلوس', labelEn: 'Living Room Furniture' },

  // ═══════════ FURNITURE / BEDROOM ═══════════
  'سرير': { categorySlug: 'furniture', subcategorySlug: 'bedroom', labelAr: 'أثاث غرف نوم', labelEn: 'Bedroom Furniture' },
  'دولاب': { categorySlug: 'furniture', subcategorySlug: 'bedroom', labelAr: 'أثاث غرف نوم', labelEn: 'Bedroom Furniture' },
  'غرفة نوم': { categorySlug: 'furniture', subcategorySlug: 'bedroom', labelAr: 'أثاث غرف نوم', labelEn: 'Bedroom Furniture' },
  'bed': { categorySlug: 'furniture', subcategorySlug: 'bedroom', labelAr: 'أثاث غرف نوم', labelEn: 'Bedroom Furniture' },
  'wardrobe': { categorySlug: 'furniture', subcategorySlug: 'bedroom', labelAr: 'أثاث غرف نوم', labelEn: 'Bedroom Furniture' },

  // ═══════════ FURNITURE / TABLES ═══════════
  'طاولة': { categorySlug: 'furniture', subcategorySlug: 'tables', labelAr: 'سفرة وطاولات', labelEn: 'Dining & Tables' },
  'طاوله': { categorySlug: 'furniture', subcategorySlug: 'tables', labelAr: 'سفرة وطاولات', labelEn: 'Dining & Tables' },
  'سفرة': { categorySlug: 'furniture', subcategorySlug: 'tables', labelAr: 'سفرة وطاولات', labelEn: 'Dining & Tables' },
  'table': { categorySlug: 'furniture', subcategorySlug: 'tables', labelAr: 'سفرة وطاولات', labelEn: 'Dining & Tables' },

  // ═══════════ FURNITURE / OUTDOOR ═══════════
  'اثاث حديقة': { categorySlug: 'furniture', subcategorySlug: 'outdoor', labelAr: 'أثاث حدائق وخارجي', labelEn: 'Outdoor Furniture' },
  'outdoor furniture': { categorySlug: 'furniture', subcategorySlug: 'outdoor', labelAr: 'أثاث حدائق وخارجي', labelEn: 'Outdoor Furniture' },

  // ═══════════ FURNITURE / DECOR ═══════════
  'ديكور': { categorySlug: 'furniture', subcategorySlug: 'decor', labelAr: 'ديكور ومفروشات', labelEn: 'Home Decor' },
  'سجاد': { categorySlug: 'furniture', subcategorySlug: 'decor', labelAr: 'ديكور ومفروشات', labelEn: 'Home Decor' },
  'decor': { categorySlug: 'furniture', subcategorySlug: 'decor', labelAr: 'ديكور ومفروشات', labelEn: 'Home Decor' },
  'carpet': { categorySlug: 'furniture', subcategorySlug: 'decor', labelAr: 'ديكور ومفروشات', labelEn: 'Home Decor' },

  // ═══════════ FURNITURE / OFFICE ═══════════
  'كرسي مكتب': { categorySlug: 'furniture', subcategorySlug: 'office', labelAr: 'أثاث مكتبي', labelEn: 'Office Furniture' },
  'desk': { categorySlug: 'furniture', subcategorySlug: 'office', labelAr: 'أثاث مكتبي', labelEn: 'Office Furniture' },
  'office chair': { categorySlug: 'furniture', subcategorySlug: 'office', labelAr: 'أثاث مكتبي', labelEn: 'Office Furniture' },

  // ═══════════ FASHION / WOMEN ═══════════
  'فستان': { categorySlug: 'fashion', subcategorySlug: 'women', labelAr: 'أزياء نسائية', labelEn: "Women's Fashion" },
  'عباية': { categorySlug: 'fashion', subcategorySlug: 'women', labelAr: 'أزياء نسائية', labelEn: "Women's Fashion" },
  'عبايه': { categorySlug: 'fashion', subcategorySlug: 'women', labelAr: 'أزياء نسائية', labelEn: "Women's Fashion" },
  'ملابس نسائية': { categorySlug: 'fashion', subcategorySlug: 'women', labelAr: 'أزياء نسائية', labelEn: "Women's Fashion" },
  'dress': { categorySlug: 'fashion', subcategorySlug: 'women', labelAr: 'أزياء نسائية', labelEn: "Women's Fashion" },

  // ═══════════ FASHION / MEN ═══════════
  'قميص': { categorySlug: 'fashion', subcategorySlug: 'men', labelAr: 'أزياء رجالية', labelEn: "Men's Fashion" },
  'بنطال': { categorySlug: 'fashion', subcategorySlug: 'men', labelAr: 'أزياء رجالية', labelEn: "Men's Fashion" },
  'بدلة': { categorySlug: 'fashion', subcategorySlug: 'men', labelAr: 'أزياء رجالية', labelEn: "Men's Fashion" },
  'ملابس رجالية': { categorySlug: 'fashion', subcategorySlug: 'men', labelAr: 'أزياء رجالية', labelEn: "Men's Fashion" },
  'shirt': { categorySlug: 'fashion', subcategorySlug: 'men', labelAr: 'أزياء رجالية', labelEn: "Men's Fashion" },

  // ═══════════ FASHION / JEWELRY ═══════════
  'مجوهرات': { categorySlug: 'fashion', subcategorySlug: 'watches-jewelry', labelAr: 'مجوهرات وإكسسوارات', labelEn: 'Jewelry & Accessories' },
  'ذهب': { categorySlug: 'fashion', subcategorySlug: 'watches-jewelry', labelAr: 'مجوهرات وإكسسوارات', labelEn: 'Jewelry & Accessories' },
  'خاتم': { categorySlug: 'fashion', subcategorySlug: 'watches-jewelry', labelAr: 'مجوهرات وإكسسوارات', labelEn: 'Jewelry & Accessories' },
  'سلسلة': { categorySlug: 'fashion', subcategorySlug: 'watches-jewelry', labelAr: 'مجوهرات وإكسسوارات', labelEn: 'Jewelry & Accessories' },
  'jewelry': { categorySlug: 'fashion', subcategorySlug: 'watches-jewelry', labelAr: 'مجوهرات وإكسسوارات', labelEn: 'Jewelry & Accessories' },
  'gold': { categorySlug: 'fashion', subcategorySlug: 'watches-jewelry', labelAr: 'مجوهرات وإكسسوارات', labelEn: 'Jewelry & Accessories' },

  // ═══════════ FASHION / BAGS ═══════════
  'حقيبة': { categorySlug: 'fashion', subcategorySlug: 'bags', labelAr: 'حقائب وشنط', labelEn: 'Bags & Luggage' },
  'شنطة': { categorySlug: 'fashion', subcategorySlug: 'bags', labelAr: 'حقائب وشنط', labelEn: 'Bags & Luggage' },
  'bag': { categorySlug: 'fashion', subcategorySlug: 'bags', labelAr: 'حقائب وشنط', labelEn: 'Bags & Luggage' },
  'handbag': { categorySlug: 'fashion', subcategorySlug: 'bags', labelAr: 'حقائب وشنط', labelEn: 'Bags & Luggage' },

  // ═══════════ FASHION / SHOES ═══════════
  'حذاء': { categorySlug: 'fashion', subcategorySlug: 'shoes', labelAr: 'أحذية', labelEn: 'Footwear' },
  'كعب': { categorySlug: 'fashion', subcategorySlug: 'shoes', labelAr: 'أحذية', labelEn: 'Footwear' },
  'shoes': { categorySlug: 'fashion', subcategorySlug: 'shoes', labelAr: 'أحذية', labelEn: 'Footwear' },
  'sneakers': { categorySlug: 'fashion', subcategorySlug: 'shoes', labelAr: 'أحذية', labelEn: 'Footwear' },

  // ═══════════ FASHION / PERFUMES ═══════════
  'عطر': { categorySlug: 'fashion', subcategorySlug: 'perfumes', labelAr: 'عطور', labelEn: 'Perfumes & Fragrances' },
  'عطور': { categorySlug: 'fashion', subcategorySlug: 'perfumes', labelAr: 'عطور', labelEn: 'Perfumes & Fragrances' },
  'perfume': { categorySlug: 'fashion', subcategorySlug: 'perfumes', labelAr: 'عطور', labelEn: 'Perfumes & Fragrances' },
  'fragrance': { categorySlug: 'fashion', subcategorySlug: 'perfumes', labelAr: 'عطور', labelEn: 'Perfumes & Fragrances' },

  // ═══════════ SERVICES ═══════════
  'توصيل': { categorySlug: 'services', subcategorySlug: 'delivery', labelAr: 'توصيل ونقل', labelEn: 'Delivery & Transport' },
  'نقل اثاث': { categorySlug: 'services', subcategorySlug: 'delivery', labelAr: 'توصيل ونقل', labelEn: 'Delivery & Transport' },
  'تنظيم حفلات': { categorySlug: 'services', subcategorySlug: 'events', labelAr: 'مناسبات وضيافة', labelEn: 'Events & Catering' },
  'تصميم': { categorySlug: 'services', subcategorySlug: 'design', labelAr: 'تصميم وتسويق', labelEn: 'Design & Marketing' },
  'دروس خصوصية': { categorySlug: 'services', subcategorySlug: 'tutor', labelAr: 'دروس خصوصية', labelEn: 'Private Tutoring' },
  'مدرس': { categorySlug: 'services', subcategorySlug: 'tutor', labelAr: 'دروس خصوصية', labelEn: 'Private Tutoring' },
  'tutor': { categorySlug: 'services', subcategorySlug: 'tutor', labelAr: 'دروس خصوصية', labelEn: 'Private Tutoring' },

  // ═══════════ JOBS ═══════════
  'وظيفة': { categorySlug: 'jobs', subcategorySlug: 'vacancies', labelAr: 'وظائف شاغرة', labelEn: 'Job Openings' },
  'وظائف': { categorySlug: 'jobs', subcategorySlug: 'vacancies', labelAr: 'وظائف شاغرة', labelEn: 'Job Openings' },
  'مطلوب موظف': { categorySlug: 'jobs', subcategorySlug: 'vacancies', labelAr: 'وظائف شاغرة', labelEn: 'Job Openings' },
  'مهندس': { categorySlug: 'jobs', subcategorySlug: 'vacancies', labelAr: 'وظائف شاغرة', labelEn: 'Job Openings' },
  'محاسب': { categorySlug: 'jobs', subcategorySlug: 'vacancies', labelAr: 'وظائف شاغرة', labelEn: 'Job Openings' },
  'hiring': { categorySlug: 'jobs', subcategorySlug: 'vacancies', labelAr: 'وظائف شاغرة', labelEn: 'Job Openings' },
  'job': { categorySlug: 'jobs', subcategorySlug: 'vacancies', labelAr: 'وظائف شاغرة', labelEn: 'Job Openings' },
  'باحث عن عمل': { categorySlug: 'jobs', subcategorySlug: 'cvs', labelAr: 'باحثون عن عمل', labelEn: 'Job Seekers & CVs' },
  'سيرة ذاتية': { categorySlug: 'jobs', subcategorySlug: 'cvs', labelAr: 'باحثون عن عمل', labelEn: 'Job Seekers & CVs' },
  'cv': { categorySlug: 'jobs', subcategorySlug: 'cvs', labelAr: 'باحثون عن عمل', labelEn: 'Job Seekers & CVs' },

  // ═══════════ KIDS ═══════════
  'ملابس اطفال': { categorySlug: 'kids', subcategorySlug: 'clothes', labelAr: 'ملابس أطفال', labelEn: 'Baby & Kids Clothes' },
  'العاب اطفال': { categorySlug: 'kids', subcategorySlug: 'toys', labelAr: 'ألعاب أطفال', labelEn: 'Toys & Games' },
  'العاب': { categorySlug: 'kids', subcategorySlug: 'toys', labelAr: 'ألعاب أطفال', labelEn: 'Toys & Games' },
  'toys': { categorySlug: 'kids', subcategorySlug: 'toys', labelAr: 'ألعاب أطفال', labelEn: 'Toys & Games' },
  'عربة اطفال': { categorySlug: 'kids', subcategorySlug: 'strollers', labelAr: 'عربات ومقاعد', labelEn: 'Strollers & Car Seats' },
  'كرسي سيارة': { categorySlug: 'kids', subcategorySlug: 'strollers', labelAr: 'عربات ومقاعد', labelEn: 'Strollers & Car Seats' },
  'stroller': { categorySlug: 'kids', subcategorySlug: 'strollers', labelAr: 'عربات ومقاعد', labelEn: 'Strollers & Car Seats' },
  'رضاعة': { categorySlug: 'kids', subcategorySlug: 'feeding', labelAr: 'مستلزمات رضاعة وعناية', labelEn: 'Feeding & Care' },

  // ═══════════ BEAUTY ═══════════
  'مكياج': { categorySlug: 'beauty', subcategorySlug: 'perfumes-cosmetics', labelAr: 'عطور ومكياج', labelEn: 'Perfumes & Cosmetics' },
  'makeup': { categorySlug: 'beauty', subcategorySlug: 'perfumes-cosmetics', labelAr: 'عطور ومكياج', labelEn: 'Perfumes & Cosmetics' },
  'شامبو': { categorySlug: 'beauty', subcategorySlug: 'hair', labelAr: 'عناية بالشعر', labelEn: 'Hair Care' },
  'صبغة شعر': { categorySlug: 'beauty', subcategorySlug: 'hair', labelAr: 'عناية بالشعر', labelEn: 'Hair Care' },
  'hair care': { categorySlug: 'beauty', subcategorySlug: 'hair', labelAr: 'عناية بالشعر', labelEn: 'Hair Care' },
  'سيروم': { categorySlug: 'beauty', subcategorySlug: 'skin', labelAr: 'عناية بالبشرة', labelEn: 'Skin Care' },
  'واقي شمس': { categorySlug: 'beauty', subcategorySlug: 'skin', labelAr: 'عناية بالبشرة', labelEn: 'Skin Care' },
  'skincare': { categorySlug: 'beauty', subcategorySlug: 'skin', labelAr: 'عناية بالبشرة', labelEn: 'Skin Care' },
  'مجفف شعر': { categorySlug: 'beauty', subcategorySlug: 'care', labelAr: 'أجهزة عناية شخصية', labelEn: 'Personal Care Devices' },
  'مكواة شعر': { categorySlug: 'beauty', subcategorySlug: 'care', labelAr: 'أجهزة عناية شخصية', labelEn: 'Personal Care Devices' },

  // ═══════════ PETS ═══════════
  'كلب': { categorySlug: 'pets', subcategorySlug: 'dogs', labelAr: 'كلاب', labelEn: 'Dogs' },
  'كلاب': { categorySlug: 'pets', subcategorySlug: 'dogs', labelAr: 'كلاب', labelEn: 'Dogs' },
  'dog': { categorySlug: 'pets', subcategorySlug: 'dogs', labelAr: 'كلاب', labelEn: 'Dogs' },
  'قطة': { categorySlug: 'pets', subcategorySlug: 'cats', labelAr: 'قطط', labelEn: 'Cats' },
  'قطط': { categorySlug: 'pets', subcategorySlug: 'cats', labelAr: 'قطط', labelEn: 'Cats' },
  'cat': { categorySlug: 'pets', subcategorySlug: 'cats', labelAr: 'قطط', labelEn: 'Cats' },
  'ببغاء': { categorySlug: 'pets', subcategorySlug: 'birds', labelAr: 'طيور', labelEn: 'Birds' },
  'طيور': { categorySlug: 'pets', subcategorySlug: 'birds', labelAr: 'طيور', labelEn: 'Birds' },
  'bird': { categorySlug: 'pets', subcategorySlug: 'birds', labelAr: 'طيور', labelEn: 'Birds' },
  'سمك': { categorySlug: 'pets', subcategorySlug: 'fish', labelAr: 'أسماك وأحواض', labelEn: 'Fish & Aquariums' },
  'fish': { categorySlug: 'pets', subcategorySlug: 'fish', labelAr: 'أسماك وأحواض', labelEn: 'Fish & Aquariums' },
  'مستلزمات حيوانات': { categorySlug: 'pets', subcategorySlug: 'pet-supplies', labelAr: 'مستلزمات حيوانات', labelEn: 'Pet Supplies' },

  // ═══════════ SPORTS ═══════════
  'دمبل': { categorySlug: 'sports', subcategorySlug: 'fitness', labelAr: 'أجهزة رياضية وللياقة', labelEn: 'Gym & Fitness' },
  'جهاز رياضي': { categorySlug: 'sports', subcategorySlug: 'fitness', labelAr: 'أجهزة رياضية وللياقة', labelEn: 'Gym & Fitness' },
  'fitness': { categorySlug: 'sports', subcategorySlug: 'fitness', labelAr: 'أجهزة رياضية وللياقة', labelEn: 'Gym & Fitness' },
  'treadmill': { categorySlug: 'sports', subcategorySlug: 'fitness', labelAr: 'أجهزة رياضية وللياقة', labelEn: 'Gym & Fitness' },
  'دراجة هوائية': { categorySlug: 'sports', subcategorySlug: 'bicycles', labelAr: 'دراجات هوائية', labelEn: 'Bicycles' },
  'بسكليت': { categorySlug: 'sports', subcategorySlug: 'bicycles', labelAr: 'دراجات هوائية', labelEn: 'Bicycles' },
  'bicycle': { categorySlug: 'sports', subcategorySlug: 'bicycles', labelAr: 'دراجات هوائية', labelEn: 'Bicycles' },
  'خيمة': { categorySlug: 'sports', subcategorySlug: 'camping', labelAr: 'تخييم ورحلات', labelEn: 'Camping & Outdoor' },
  'تخييم': { categorySlug: 'sports', subcategorySlug: 'camping', labelAr: 'تخييم ورحلات', labelEn: 'Camping & Outdoor' },
  'camping': { categorySlug: 'sports', subcategorySlug: 'camping', labelAr: 'تخييم ورحلات', labelEn: 'Camping & Outdoor' },
  'tent': { categorySlug: 'sports', subcategorySlug: 'camping', labelAr: 'تخييم ورحلات', labelEn: 'Camping & Outdoor' },

  // ═══════════ BOOKS ═══════════
  'كتاب': { categorySlug: 'books', subcategorySlug: 'books-magazines', labelAr: 'كتب ومجلات', labelEn: 'Books & Magazines' },
  'رواية': { categorySlug: 'books', subcategorySlug: 'books-magazines', labelAr: 'كتب ومجلات', labelEn: 'Books & Magazines' },
  'book': { categorySlug: 'books', subcategorySlug: 'books-magazines', labelAr: 'كتب ومجلات', labelEn: 'Books & Magazines' },
  'novel': { categorySlug: 'books', subcategorySlug: 'books-magazines', labelAr: 'كتب ومجلات', labelEn: 'Books & Magazines' },
  'جيتار': { categorySlug: 'books', subcategorySlug: 'instruments', labelAr: 'آلات موسيقية', labelEn: 'Musical Instruments' },
  'بيانو': { categorySlug: 'books', subcategorySlug: 'instruments', labelAr: 'آلات موسيقية', labelEn: 'Musical Instruments' },
  'guitar': { categorySlug: 'books', subcategorySlug: 'instruments', labelAr: 'آلات موسيقية', labelEn: 'Musical Instruments' },
  'تحف': { categorySlug: 'books', subcategorySlug: 'antiques', labelAr: 'تحف ومقتنيات', labelEn: 'Antiques & Collectibles' },
  'antiques': { categorySlug: 'books', subcategorySlug: 'antiques', labelAr: 'تحف ومقتنيات', labelEn: 'Antiques & Collectibles' },

  // ═══════════ HOME & GARDEN ═══════════
  'نبات': { categorySlug: 'home-garden', subcategorySlug: 'plants', labelAr: 'نباتات وأشجار', labelEn: 'Plants & Trees' },
  'شجرة': { categorySlug: 'home-garden', subcategorySlug: 'plants', labelAr: 'نباتات وأشجار', labelEn: 'Plants & Trees' },
  'plant': { categorySlug: 'home-garden', subcategorySlug: 'plants', labelAr: 'نباتات وأشجار', labelEn: 'Plants & Trees' },
  'شواية': { categorySlug: 'home-garden', subcategorySlug: 'bbq', labelAr: 'شوايات ومستلزمات', labelEn: 'BBQ & Outdoor Cooking' },
  'شوايه': { categorySlug: 'home-garden', subcategorySlug: 'bbq', labelAr: 'شوايات ومستلزمات', labelEn: 'BBQ & Outdoor Cooking' },
  'bbq': { categorySlug: 'home-garden', subcategorySlug: 'bbq', labelAr: 'شوايات ومستلزمات', labelEn: 'BBQ & Outdoor Cooking' },
  'grill': { categorySlug: 'home-garden', subcategorySlug: 'bbq', labelAr: 'شوايات ومستلزمات', labelEn: 'BBQ & Outdoor Cooking' },
  'garden tools': { categorySlug: 'home-garden', subcategorySlug: 'tools', labelAr: 'أدوات حدائق', labelEn: 'Garden Tools' },

  // ═══════════ KRAKEEB ═══════════
  'مستعمل عام': { categorySlug: 'krakeeb', subcategorySlug: 'general', labelAr: 'مستعمل عام', labelEn: 'General Used Items' },
  'قديم': { categorySlug: 'krakeeb', subcategorySlug: 'vintage', labelAr: 'قديم وأنتيك', labelEn: 'Vintage & Retro' },
  'vintage': { categorySlug: 'krakeeb', subcategorySlug: 'vintage', labelAr: 'قديم وأنتيك', labelEn: 'Vintage & Retro' },
  'retro': { categorySlug: 'krakeeb', subcategorySlug: 'vintage', labelAr: 'قديم وأنتيك', labelEn: 'Vintage & Retro' },
  'تصفية': { categorySlug: 'krakeeb', subcategorySlug: 'clearances', labelAr: 'تصفيات وشروات', labelEn: 'Clearance Deals' },
  'clearance': { categorySlug: 'krakeeb', subcategorySlug: 'clearances', labelAr: 'تصفيات وشروات', labelEn: 'Clearance Deals' },

  // ═══════════ CLEANING ═══════════
  'تنظيف منازل': { categorySlug: 'cleaning', subcategorySlug: 'homes', labelAr: 'تنظيف منازل', labelEn: 'Home Cleaning' },
  'تنظيف شقق': { categorySlug: 'cleaning', subcategorySlug: 'homes', labelAr: 'تنظيف منازل', labelEn: 'Home Cleaning' },
  'home cleaning': { categorySlug: 'cleaning', subcategorySlug: 'homes', labelAr: 'تنظيف منازل', labelEn: 'Home Cleaning' },
  'تنظيف مكاتب': { categorySlug: 'cleaning', subcategorySlug: 'offices', labelAr: 'تنظيف مكاتب', labelEn: 'Office Cleaning' },
  'تنظيف كنب': { categorySlug: 'cleaning', subcategorySlug: 'sofas-carpets', labelAr: 'كنب وسجاد', labelEn: 'Sofas & Carpets' },
  'تنظيف سجاد': { categorySlug: 'cleaning', subcategorySlug: 'sofas-carpets', labelAr: 'كنب وسجاد', labelEn: 'Sofas & Carpets' },
  'تنظيف خزانات': { categorySlug: 'cleaning', subcategorySlug: 'water-tanks', labelAr: 'خزانات مياه', labelEn: 'Water Tanks' },
  'تنظيف مسابح': { categorySlug: 'cleaning', subcategorySlug: 'pools', labelAr: 'مسابح', labelEn: 'Pools' },
  'تنظيف واجهات': { categorySlug: 'cleaning', subcategorySlug: 'windows-facades', labelAr: 'واجهات وزجاج', labelEn: 'Windows & Facades' },

  // ═══════════ HANDYMEN ═══════════
  'كهربائي': { categorySlug: 'handymen', subcategorySlug: 'electrician', labelAr: 'كهربائي', labelEn: 'Electrician' },
  'فني كهرباء': { categorySlug: 'handymen', subcategorySlug: 'electrician', labelAr: 'كهربائي', labelEn: 'Electrician' },
  'electrician': { categorySlug: 'handymen', subcategorySlug: 'electrician', labelAr: 'كهربائي', labelEn: 'Electrician' },
  'سباك': { categorySlug: 'handymen', subcategorySlug: 'plumber', labelAr: 'سباك / مواسرجي', labelEn: 'Plumber' },
  'مواسرجي': { categorySlug: 'handymen', subcategorySlug: 'plumber', labelAr: 'سباك / مواسرجي', labelEn: 'Plumber' },
  'plumber': { categorySlug: 'handymen', subcategorySlug: 'plumber', labelAr: 'سباك / مواسرجي', labelEn: 'Plumber' },
  'نجار': { categorySlug: 'handymen', subcategorySlug: 'carpenter', labelAr: 'نجار', labelEn: 'Carpenter' },
  'carpenter': { categorySlug: 'handymen', subcategorySlug: 'carpenter', labelAr: 'نجار', labelEn: 'Carpenter' },
  'دهان': { categorySlug: 'handymen', subcategorySlug: 'painter', labelAr: 'دهان', labelEn: 'Painter' },
  'painter': { categorySlug: 'handymen', subcategorySlug: 'painter', labelAr: 'دهان', labelEn: 'Painter' },
  'حداد': { categorySlug: 'handymen', subcategorySlug: 'blacksmith', labelAr: 'حداد', labelEn: 'Blacksmith' },
  'فني تكييف': { categorySlug: 'handymen', subcategorySlug: 'ac-technician', labelAr: 'فني تكييف', labelEn: 'AC Technician' },
  'صيانة مكيفات': { categorySlug: 'handymen', subcategorySlug: 'ac-technician', labelAr: 'فني تكييف', labelEn: 'AC Technician' },
  'المنيوم': { categorySlug: 'handymen', subcategorySlug: 'aluminum', labelAr: 'ألمنيوم', labelEn: 'Aluminum' },
  'جبصين': { categorySlug: 'handymen', subcategorySlug: 'gypsum', labelAr: 'جبصين وديكور', labelEn: 'Gypsum & Decor' },
  'بلاط': { categorySlug: 'handymen', subcategorySlug: 'tiles-marble', labelAr: 'بلاط ورخام', labelEn: 'Tiles & Marble' },
  'رخام': { categorySlug: 'handymen', subcategorySlug: 'tiles-marble', labelAr: 'بلاط ورخام', labelEn: 'Tiles & Marble' },
  'صيانة اجهزة': { categorySlug: 'handymen', subcategorySlug: 'appliance-repair', labelAr: 'صيانة أجهزة', labelEn: 'Appliance Repair' },
  'فتح اقفال': { categorySlug: 'handymen', subcategorySlug: 'locksmith', labelAr: 'فتح أقفال', labelEn: 'Locksmith' },
  'زجاج': { categorySlug: 'handymen', subcategorySlug: 'glass', labelAr: 'زجاج ومرايا', labelEn: 'Glass & Mirrors' },
  'تركيب اثاث': { categorySlug: 'handymen', subcategorySlug: 'furniture-assembly', labelAr: 'تركيب أثاث', labelEn: 'Furniture Assembly' },

  // ═══════════ PROJECTS ═══════════
  'مطعم': { categorySlug: 'projects', subcategorySlug: 'restaurant', labelAr: 'مطعم أو كافيه', labelEn: 'Restaurant & Cafe' },
  'كافيه': { categorySlug: 'projects', subcategorySlug: 'restaurant', labelAr: 'مطعم أو كافيه', labelEn: 'Restaurant & Cafe' },
  'restaurant': { categorySlug: 'projects', subcategorySlug: 'restaurant', labelAr: 'مطعم أو كافيه', labelEn: 'Restaurant & Cafe' },
  'cafe': { categorySlug: 'projects', subcategorySlug: 'restaurant', labelAr: 'مطعم أو كافيه', labelEn: 'Restaurant & Cafe' },
  'محل': { categorySlug: 'projects', subcategorySlug: 'shop', labelAr: 'محل تجاري', labelEn: 'Shop' },
  'دكان': { categorySlug: 'projects', subcategorySlug: 'shop', labelAr: 'محل تجاري', labelEn: 'Shop' },
  'مصنع': { categorySlug: 'projects', subcategorySlug: 'factory', labelAr: 'مصنع وورشة', labelEn: 'Factory' },
  'ورشة': { categorySlug: 'projects', subcategorySlug: 'factory', labelAr: 'مصنع وورشة', labelEn: 'Factory' },
  'factory': { categorySlug: 'projects', subcategorySlug: 'factory', labelAr: 'مصنع وورشة', labelEn: 'Factory' },
  'متجر الكتروني': { categorySlug: 'projects', subcategorySlug: 'online-store', labelAr: 'متجر إلكتروني', labelEn: 'Online Store' },
  'online store': { categorySlug: 'projects', subcategorySlug: 'online-store', labelAr: 'متجر إلكتروني', labelEn: 'Online Store' },
  'franchise': { categorySlug: 'projects', subcategorySlug: 'franchise', labelAr: 'حق امتياز', labelEn: 'Franchise' },
  'رخصة': { categorySlug: 'projects', subcategorySlug: 'licenses', labelAr: 'تراخيص ورخص', labelEn: 'Licenses' },
  'ترخيص': { categorySlug: 'projects', subcategorySlug: 'licenses', labelAr: 'تراخيص ورخص', labelEn: 'Licenses' },
  'license': { categorySlug: 'projects', subcategorySlug: 'licenses', labelAr: 'تراخيص ورخص', labelEn: 'Licenses' },
  'معدات': { categorySlug: 'projects', subcategorySlug: 'equipment', labelAr: 'معدات ومستلزمات', labelEn: 'Equipment' },
  'equipment': { categorySlug: 'projects', subcategorySlug: 'equipment', labelAr: 'معدات ومستلزمات', labelEn: 'Equipment' },
  'شراكة': { categorySlug: 'projects', subcategorySlug: 'partnership', labelAr: 'شراكة ومستثمر', labelEn: 'Partnership' },
  'مستثمر': { categorySlug: 'projects', subcategorySlug: 'partnership', labelAr: 'شراكة ومستثمر', labelEn: 'Partnership' },
  'partnership': { categorySlug: 'projects', subcategorySlug: 'partnership', labelAr: 'شراكة ومستثمر', labelEn: 'Partnership' },
  'مشروع برمجي': { categorySlug: 'projects', subcategorySlug: 'software', labelAr: 'مشروع برمجي', labelEn: 'Software Project' },
  'software': { categorySlug: 'projects', subcategorySlug: 'software', labelAr: 'مشروع برمجي', labelEn: 'Software Project' },
  'مشروع زراعي': { categorySlug: 'projects', subcategorySlug: 'agri', labelAr: 'مشروع زراعي', labelEn: 'Agricultural Project' },
};
