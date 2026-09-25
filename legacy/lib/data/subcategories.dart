class SubcategoryDef {
  const SubcategoryDef({required this.slug, required this.nameAr, required this.nameEn});
  final String slug;
  final String nameAr;
  final String nameEn;
}

const subcategories = <String, List<SubcategoryDef>>{
  "motors": [
    SubcategoryDef(slug: "cars-sale", nameAr: "سيارات للبيع", nameEn: "Cars for sale"),
    SubcategoryDef(slug: "cars-rent", nameAr: "مركبات للإيجار", nameEn: "Vehicles for rent"),
    SubcategoryDef(slug: "motorcycles", nameAr: "دراجات نارية ومستلزماتها", nameEn: "Motorcycles and accessories"),
    SubcategoryDef(slug: "heavy", nameAr: "آليات ثقيلة", nameEn: "Heavy machinery"),
    SubcategoryDef(slug: "trucks-buses", nameAr: "الحافلات والشاحنات والمقطورات", nameEn: "Buses, trucks and trailers"),
    SubcategoryDef(slug: "boats", nameAr: "قوارب وجت سكي", nameEn: "Boats and jet skis"),
    SubcategoryDef(slug: "plate-numbers", nameAr: "أرقام مركبات مميزة للبيع", nameEn: "Distinctive plate numbers"),
    SubcategoryDef(slug: "tires-rims", nameAr: "إطارات وجنطات", nameEn: "Tires and rims"),
    SubcategoryDef(slug: "spare-parts", nameAr: "قطع غيار سيارات ومركبات", nameEn: "Vehicle spare parts"),
    SubcategoryDef(slug: "accessories", nameAr: "إكسسوارات السيارات والمركبات", nameEn: "Vehicle accessories"),
    SubcategoryDef(slug: "scrap", nameAr: "سكراب — سيارات ومركبات أخرى", nameEn: "Scrap and other vehicles"),
  ],
  "real-estate": [
    SubcategoryDef(slug: "sale", nameAr: "عقارات للبيع", nameEn: "Property for sale"),
    SubcategoryDef(slug: "rent", nameAr: "عقارات للإيجار", nameEn: "Property for rent"),
    SubcategoryDef(slug: "land", nameAr: "أراضي", nameEn: "Land"),
    SubcategoryDef(slug: "offices", nameAr: "مكاتب ومحلات", nameEn: "Offices and shops"),
  ],
  "services": [
    SubcategoryDef(slug: "home", nameAr: "خدمات منزلية", nameEn: "Home services"),
    SubcategoryDef(slug: "pro", nameAr: "خدمات مهنية", nameEn: "Professional services"),
    SubcategoryDef(slug: "education", nameAr: "تعليم وتدريب", nameEn: "Education and training"),
    SubcategoryDef(slug: "transport", nameAr: "نقل وتوصيل", nameEn: "Transport"),
  ],
  "jobs": [
    SubcategoryDef(slug: "full-time", nameAr: "دوام كامل", nameEn: "Full time"),
    SubcategoryDef(slug: "part-time", nameAr: "دوام جزئي", nameEn: "Part time"),
    SubcategoryDef(slug: "freelance", nameAr: "عمل حر", nameEn: "Freelance"),
  ],
  "mobiles": [
    SubcategoryDef(slug: "phones", nameAr: "هواتف", nameEn: "Phones"),
    SubcategoryDef(slug: "tablets", nameAr: "أجهزة لوحية", nameEn: "Tablets"),
    SubcategoryDef(slug: "accessories", nameAr: "إكسسوارات موبايل", nameEn: "Mobile accessories"),
  ],
  "electronics": [
    SubcategoryDef(slug: "tv", nameAr: "تلفزيونات", nameEn: "TVs"),
    SubcategoryDef(slug: "audio", nameAr: "صوتيات", nameEn: "Audio"),
    SubcategoryDef(slug: "other", nameAr: "إلكترونيات أخرى", nameEn: "Other electronics"),
  ],
  "computers": [
    SubcategoryDef(slug: "laptops", nameAr: "لابتوب", nameEn: "Laptops"),
    SubcategoryDef(slug: "desktops", nameAr: "أجهزة مكتبية", nameEn: "Desktops"),
    SubcategoryDef(slug: "parts", nameAr: "قطع كمبيوتر", nameEn: "Computer parts"),
  ],
  "watches": [
    SubcategoryDef(slug: "men", nameAr: "ساعات رجالية", nameEn: "Men's watches"),
    SubcategoryDef(slug: "women", nameAr: "ساعات نسائية", nameEn: "Women's watches"),
  ],
  "furniture": [
    SubcategoryDef(slug: "home", nameAr: "أثاث منزلي", nameEn: "Home furniture"),
    SubcategoryDef(slug: "office", nameAr: "أثاث مكتبي", nameEn: "Office furniture"),
  ],
  "fashion": [
    SubcategoryDef(slug: "men", nameAr: "ملابس رجالية", nameEn: "Men"),
    SubcategoryDef(slug: "women", nameAr: "ملابس نسائية", nameEn: "Women"),
    SubcategoryDef(slug: "shoes", nameAr: "أحذية", nameEn: "Shoes"),
  ],
  "kids": [
    SubcategoryDef(slug: "clothes", nameAr: "ملابس أطفال", nameEn: "Kids clothes"),
    SubcategoryDef(slug: "toys", nameAr: "ألعاب", nameEn: "Toys"),
  ],
  "beauty": [
    SubcategoryDef(slug: "products", nameAr: "منتجات تجميل", nameEn: "Beauty products"),
    SubcategoryDef(slug: "salon", nameAr: "خدمات تجميل", nameEn: "Salon services"),
  ],
  "pets": [
    SubcategoryDef(slug: "animals", nameAr: "حيوانات", nameEn: "Pets"),
    SubcategoryDef(slug: "supplies", nameAr: "مستلزمات", nameEn: "Pet supplies"),
  ],
  "sports": [
    SubcategoryDef(slug: "gear", nameAr: "معدات رياضية", nameEn: "Sports gear"),
    SubcategoryDef(slug: "bikes", nameAr: "دراجات", nameEn: "Bikes"),
  ],
  "books": [
    SubcategoryDef(slug: "books", nameAr: "كتب", nameEn: "Books"),
    SubcategoryDef(slug: "stationery", nameAr: "قرطاسية", nameEn: "Stationery"),
  ],
  "home-garden": [
    SubcategoryDef(slug: "kitchen", nameAr: "مطبخ", nameEn: "Kitchen"),
    SubcategoryDef(slug: "garden", nameAr: "حديقة", nameEn: "Garden"),
  ],
  "krakeeb": [
    SubcategoryDef(slug: "used", nameAr: "كراكيب مستعملة", nameEn: "Used odds and ends"),
    SubcategoryDef(slug: "misc", nameAr: "متفرقات", nameEn: "Miscellaneous"),
  ],
};

List<SubcategoryDef> subsFor(String categorySlug) =>
    subcategories[categorySlug] ?? const [];
