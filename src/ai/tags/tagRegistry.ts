export interface TagDefinition {
  readonly slug: string;
  readonly labelAr: string;
  readonly labelEn: string;
  readonly categorySlug: string;
}

export const TAG_REGISTRY: readonly TagDefinition[] = [
  // Universal
  { slug: 'brand-new', labelAr: 'جديد', labelEn: 'Brand New', categorySlug: '*' },
  { slug: 'excellent-condition', labelAr: 'ممتاز', labelEn: 'Excellent', categorySlug: '*' },

  // Mobiles
  { slug: '5g', labelAr: '5G', labelEn: '5G', categorySlug: 'mobiles' },
  { slug: 'unlocked', labelAr: 'مفتوح الشبكة', labelEn: 'Unlocked', categorySlug: 'mobiles' },
  { slug: 'sealed', labelAr: 'مغلق', labelEn: 'Sealed', categorySlug: 'mobiles' },
  { slug: 'battery-excellent', labelAr: 'بطارية ممتازة', labelEn: 'Battery Excellent', categorySlug: 'mobiles' },
  { slug: 'high-storage', labelAr: 'ذاكرة كبيرة', labelEn: 'High Storage', categorySlug: 'mobiles' },
  { slug: 'high-ram', labelAr: 'رام كبير', labelEn: 'High RAM', categorySlug: 'mobiles' },
  { slug: 'imei-verified', labelAr: 'IMEI موثق', labelEn: 'IMEI Verified', categorySlug: 'mobiles' },

  // Motors
  { slug: 'low-mileage', labelAr: 'ممشى قليل', labelEn: 'Low Mileage', categorySlug: 'motors' },
  { slug: 'high-mileage', labelAr: 'ممشى مرتفع', labelEn: 'High Mileage', categorySlug: 'motors' },
  { slug: 'recent-year', labelAr: 'موديل حديث', labelEn: 'Recent Year', categorySlug: 'motors' },
  { slug: 'eco-friendly', labelAr: 'صديق للبيئة', labelEn: 'Eco-Friendly', categorySlug: 'motors' },
  { slug: 'automatic', labelAr: 'أوتوماتيك', labelEn: 'Automatic', categorySlug: 'motors' },
  { slug: 'installment-available', labelAr: 'تقسيط', labelEn: 'Installment Available', categorySlug: 'motors' },
  { slug: 'inspected', labelAr: 'مفحوصة', labelEn: 'Inspected', categorySlug: 'motors' },

  // Real Estate
  { slug: 'family-sized', labelAr: 'مناسب للعائلات', labelEn: 'Family Sized', categorySlug: 'real-estate' },
  { slug: 'spacious', labelAr: 'واسع', labelEn: 'Spacious', categorySlug: 'real-estate' },
  { slug: 'furnished', labelAr: 'مفروش', labelEn: 'Furnished', categorySlug: 'real-estate' },
  { slug: 'has-view', labelAr: 'إطلالة', labelEn: 'Has View', categorySlug: 'real-estate' },
  { slug: 'luxury', labelAr: 'فاخر', labelEn: 'Luxury', categorySlug: 'real-estate' },

  // Fashion
  { slug: 'leather', labelAr: 'جلد', labelEn: 'Leather', categorySlug: 'fashion' },
  { slug: 'silk', labelAr: 'حرير', labelEn: 'Silk', categorySlug: 'fashion' },
  { slug: 'authentic', labelAr: 'أصلي', labelEn: 'Authentic', categorySlug: 'fashion' },

  // Electronics
  { slug: 'oled', labelAr: 'OLED', labelEn: 'OLED', categorySlug: 'electronics' },
  { slug: '4k-8k', labelAr: '4K/8K', labelEn: '4K/8K', categorySlug: 'electronics' },
  { slug: 'mini-led', labelAr: 'Mini LED', labelEn: 'Mini LED', categorySlug: 'electronics' },
  { slug: 'smart-tv', labelAr: 'تلفزيون ذكي', labelEn: 'Smart TV', categorySlug: 'electronics' },

  // Computers
  { slug: 'gaming', labelAr: 'ألعاب', labelEn: 'Gaming', categorySlug: 'computers' },
  { slug: 'rtx-40', labelAr: 'RTX 40', labelEn: 'RTX 40', categorySlug: 'computers' },
  { slug: 'apple-silicon', labelAr: 'Apple Silicon', labelEn: 'Apple Silicon', categorySlug: 'computers' },
  { slug: 'ssd', labelAr: 'SSD', labelEn: 'SSD', categorySlug: 'computers' },

  // Watches
  { slug: 'automatic-watch', labelAr: 'أوتوماتيك', labelEn: 'Automatic Watch', categorySlug: 'watches' },
  { slug: 'sapphire', labelAr: 'سافير', labelEn: 'Sapphire', categorySlug: 'watches' },
  { slug: 'chronograph', labelAr: 'كرونوغراف', labelEn: 'Chronograph', categorySlug: 'watches' },

  // Kids
  { slug: 'new-with-tags', labelAr: 'بالتيكيت', labelEn: 'New with Tags', categorySlug: 'kids' },
  { slug: 'educational', labelAr: 'تعليمي', labelEn: 'Educational', categorySlug: 'kids' },

  // Sports
  { slug: 'electric-bike', labelAr: 'دراجة كهربائية', labelEn: 'Electric Bike', categorySlug: 'sports' },
  { slug: 'adjustable', labelAr: 'قابل للتعديل', labelEn: 'Adjustable', categorySlug: 'sports' },
];

export function getTagsForCategory(categorySlug: string): readonly TagDefinition[] {
  return TAG_REGISTRY.filter((t) => t.categorySlug === '*' || t.categorySlug === categorySlug);
}

export function getTagDefinition(slug: string): TagDefinition | undefined {
  return TAG_REGISTRY.find((t) => t.slug === slug);
}
