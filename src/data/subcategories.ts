import { SubcategoryDef } from '../types';

export const subcategories: Record<string, SubcategoryDef[]> = {
  motors: [
    { slug: 'cars', nameEn: 'Cars for Sale', nameAr: 'سيارات للبيع' },
    { slug: 'motorbikes', nameEn: 'Motorcycles & Scooters', nameAr: 'دراجات وسكوتر' },
    { slug: 'heavy', nameEn: 'Heavy Vehicles & Trucks', nameAr: 'شاحنات وآليات ثقيلة' },
    { slug: 'plates', nameEn: 'Car Plates', nameAr: 'لوحات سيارات' },
    { slug: 'parts', nameEn: 'Auto Spare Parts', nameAr: 'قطع غيار سيارات' },
    { slug: 'boats', nameEn: 'Boats & Watercraft', nameAr: 'قوارب وجت سكي' },
    { slug: 'accessories', nameEn: 'Car Accessories', nameAr: 'إكسسوارات سيارات' },
  ],
  'real-estate': [
    { slug: 'for-sale', nameEn: 'Properties for Sale', nameAr: 'عقارات للبيع' },
    { slug: 'for-rent', nameEn: 'Properties for Rent', nameAr: 'عقارات للإيجار' },
    { slug: 'commercial', nameEn: 'Commercial Real Estate', nameAr: 'عقارات تجارية' },
    { slug: 'lands', nameEn: 'Lands for Sale', nameAr: 'أراضي للبيع' },
    { slug: 'chalets', nameEn: 'Chalets & Farmhouses', nameAr: 'شاليهات ومزارع' },
    { slug: 'foreign', nameEn: 'Foreign Real Estate', nameAr: 'عقارات بالخارج' },
  ],
  mobiles: [
    { slug: 'phones', nameEn: 'Mobile Phones', nameAr: 'هواتف محمولة' },
    { slug: 'tablets', nameEn: 'Tablets & iPads', nameAr: 'تابلت وآيباد' },
    { slug: 'smart-watches', nameEn: 'Smart Watches', nameAr: 'ساعات ذكية' },
    { slug: 'accessories', nameEn: 'Phone Accessories', nameAr: 'إكسسوارات هواتف' },
    { slug: 'numbers', nameEn: 'VIP Numbers', nameAr: 'أرقام مميزة' },
  ],
  watches: [
    { slug: 'luxury', nameEn: 'Luxury Watches', nameAr: 'ساعات فاخرة' },
    { slug: 'everyday', nameEn: 'Everyday Watches', nameAr: 'ساعات يومية' },
    { slug: 'vintage-watch', nameEn: 'Vintage Watches', nameAr: 'ساعات كلاسيكية' },
    { slug: 'straps', nameEn: 'Straps & Boxes', nameAr: 'أساور وصناديق' },
  ],
  computers: [
    { slug: 'laptops', nameEn: 'Laptops', nameAr: 'لابتوبات' },
    { slug: 'desktops', nameEn: 'Desktop Computers', nameAr: 'كمبيوترات مكتبية' },
    { slug: 'screens', nameEn: 'Monitors & Displays', nameAr: 'شاشات' },
    { slug: 'parts-pc', nameEn: 'Computer Parts', nameAr: 'قطع كمبيوتر' },
    { slug: 'accessories-pc', nameEn: 'Computer Accessories', nameAr: 'ملحقات وإكسسوارات' },
  ],
  electronics: [
    { slug: 'tv', nameEn: 'TVs & Displays', nameAr: 'شاشات وتلفزيونات' },
    { slug: 'audio', nameEn: 'Audio & Speakers', nameAr: 'سماعات وصوتيات' },
    { slug: 'gaming', nameEn: 'Video Games & Consoles', nameAr: 'ألعاب فيديو وأجهزة' },
    { slug: 'cameras', nameEn: 'Cameras & Lenses', nameAr: 'كاميرات وعدسات' },
    { slug: 'home-appliances', nameEn: 'Home Appliances', nameAr: 'أجهزة منزلية' },
  ],
  furniture: [
    { slug: 'living', nameEn: 'Living Room Furniture', nameAr: 'أثاث غرف جلوس' },
    { slug: 'bedroom', nameEn: 'Bedroom Furniture', nameAr: 'أثاث غرف نوم' },
    { slug: 'tables', nameEn: 'Dining & Tables', nameAr: 'سفرة وطاولات' },
    { slug: 'outdoor', nameEn: 'Outdoor Furniture', nameAr: 'أثاث حدائق وخارجي' },
    { slug: 'decor', nameEn: 'Home Decor', nameAr: 'ديكور ومفروشات' },
    { slug: 'office', nameEn: 'Office Furniture', nameAr: 'أثاث مكتبي' },
  ],
  fashion: [
    { slug: 'women', nameEn: "Women's Fashion", nameAr: 'أزياء نسائية' },
    { slug: 'men', nameEn: "Men's Fashion", nameAr: 'أزياء رجالية' },
    { slug: 'watches-jewelry', nameEn: 'Jewelry & Accessories', nameAr: 'مجوهرات وإكسسوارات' },
    { slug: 'bags', nameEn: 'Bags & Luggage', nameAr: 'حقائب وشنط' },
    { slug: 'shoes', nameEn: 'Footwear', nameAr: 'أحذية' },
    { slug: 'perfumes', nameEn: 'Perfumes & Fragrances', nameAr: 'عطور' },
  ],
  services: [
    { slug: 'maintenance', nameEn: 'Home Maintenance', nameAr: 'صيانة منزلية' },
    { slug: 'delivery', nameEn: 'Delivery & Transport', nameAr: 'توصيل ونقل' },
    { slug: 'events', nameEn: 'Events & Catering', nameAr: 'مناسبات وضيافة' },
    { slug: 'cleaning', nameEn: 'Cleaning Services', nameAr: 'خدمات تنظيف' },
    { slug: 'design', nameEn: 'Design & Marketing', nameAr: 'تصميم وتسويق' },
    { slug: 'tutor', nameEn: 'Private Tutoring', nameAr: 'دروس خصوصية' },
  ],
  jobs: [
    { slug: 'vacancies', nameEn: 'Job Openings', nameAr: 'وظائف شاغرة' },
    { slug: 'cvs', nameEn: 'Job Seekers & CVs', nameAr: 'باحثون عن عمل' },
  ],
  kids: [
    { slug: 'clothes', nameEn: 'Baby & Kids Clothes', nameAr: 'ملابس أطفال' },
    { slug: 'toys', nameEn: 'Toys & Games', nameAr: 'ألعاب أطفال' },
    { slug: 'strollers', nameEn: 'Strollers & Car Seats', nameAr: 'عربات ومقاعد' },
    { slug: 'feeding', nameEn: 'Feeding & Care', nameAr: 'مستلزمات رضاعة وعناية' },
  ],
  beauty: [
    { slug: 'perfumes-cosmetics', nameEn: 'Perfumes & Cosmetics', nameAr: 'عطور ومكياج' },
    { slug: 'hair', nameEn: 'Hair Care', nameAr: 'عناية بالشعر' },
    { slug: 'skin', nameEn: 'Skin Care', nameAr: 'عناية بالبشرة' },
    { slug: 'care', nameEn: 'Personal Care Devices', nameAr: 'أجهزة عناية شخصية' },
  ],
  pets: [
    { slug: 'dogs', nameEn: 'Dogs', nameAr: 'كلاب' },
    { slug: 'cats', nameEn: 'Cats', nameAr: 'قطط' },
    { slug: 'birds', nameEn: 'Birds', nameAr: 'طيور' },
    { slug: 'fish', nameEn: 'Fish & Aquariums', nameAr: 'أسماك وأحواض' },
    { slug: 'pet-supplies', nameEn: 'Pet Supplies', nameAr: 'مستلزمات حيوانات' },
  ],
  sports: [
    { slug: 'fitness', nameEn: 'Gym & Fitness', nameAr: 'أجهزة رياضية وللياقة' },
    { slug: 'bicycles', nameEn: 'Bicycles', nameAr: 'دراجات هوائية' },
    { slug: 'camping', nameEn: 'Camping & Outdoor', nameAr: 'تخييم ورحلات' },
    { slug: 'water-sports', nameEn: 'Water Sports', nameAr: 'رياضات مائية' },
  ],
  books: [
    { slug: 'books-magazines', nameEn: 'Books & Magazines', nameAr: 'كتب ومجلات' },
    { slug: 'instruments', nameEn: 'Musical Instruments', nameAr: 'آلات موسيقية' },
    { slug: 'antiques', nameEn: 'Antiques & Collectibles', nameAr: 'تحف ومقتنيات' },
    { slug: 'crafts', nameEn: 'Handicrafts', nameAr: 'أعمال يدوية وفنية' },
  ],
  'home-garden': [
    { slug: 'garden-furniture', nameEn: 'Garden Furniture', nameAr: 'أثاث حدائق' },
    { slug: 'plants', nameEn: 'Plants & Trees', nameAr: 'نباتات وأشجار' },
    { slug: 'bbq', nameEn: 'BBQ & Outdoor Cooking', nameAr: 'شوايات ومستلزمات' },
    { slug: 'tools', nameEn: 'Garden Tools', nameAr: 'أدوات حدائق' },
  ],
  krakeeb: [
    { slug: 'general', nameEn: 'General Used Items', nameAr: 'مستعمل عام' },
    { slug: 'vintage', nameEn: 'Vintage & Retro', nameAr: 'قديم وأنتيك' },
    { slug: 'clearances', nameEn: 'Clearance Deals', nameAr: 'تصفيات وشروات' },
  ],
  cleaning: [
    { slug: 'homes', nameEn: 'Home Cleaning', nameAr: 'تنظيف منازل' },
    { slug: 'offices', nameEn: 'Office Cleaning', nameAr: 'تنظيف مكاتب' },
    { slug: 'sofas-carpets', nameEn: 'Sofas & Carpets', nameAr: 'كنب وسجاد' },
    { slug: 'water-tanks', nameEn: 'Water Tanks', nameAr: 'خزانات مياه' },
    { slug: 'pools', nameEn: 'Pools', nameAr: 'مسابح' },
    { slug: 'post-construction', nameEn: 'Post-Construction', nameAr: 'تنظيف بعد التشطيب' },
    { slug: 'windows-facades', nameEn: 'Windows & Facades', nameAr: 'واجهات وزجاج' },
  ],
  handymen: [
    { slug: 'electrician', nameEn: 'Electrician', nameAr: 'كهربائي' },
    { slug: 'plumber', nameEn: 'Plumber', nameAr: 'سباك / مواسرجي' },
    { slug: 'carpenter', nameEn: 'Carpenter', nameAr: 'نجار' },
    { slug: 'painter', nameEn: 'Painter', nameAr: 'دهان' },
    { slug: 'blacksmith', nameEn: 'Blacksmith', nameAr: 'حداد' },
    { slug: 'ac-technician', nameEn: 'AC Technician', nameAr: 'فني تكييف' },
    { slug: 'aluminum', nameEn: 'Aluminum', nameAr: 'ألمنيوم' },
    { slug: 'gypsum', nameEn: 'Gypsum & Decor', nameAr: 'جبصين وديكور' },
    { slug: 'tiles-marble', nameEn: 'Tiles & Marble', nameAr: 'بلاط ورخام' },
    { slug: 'appliance-repair', nameEn: 'Appliance Repair', nameAr: 'صيانة أجهزة' },
    { slug: 'locksmith', nameEn: 'Locksmith', nameAr: 'فتح أقفال' },
    { slug: 'glass', nameEn: 'Glass & Mirrors', nameAr: 'زجاج ومرايا' },
    { slug: 'furniture-assembly', nameEn: 'Furniture Assembly', nameAr: 'تركيب أثاث' },
    { slug: 'general', nameEn: 'General Maintenance', nameAr: 'صيانة عامة' },
  ],
  projects: [
    { slug: 'restaurant', nameEn: 'Restaurant & Cafe', nameAr: 'مطعم أو كافيه' },
    { slug: 'shop', nameEn: 'Shop', nameAr: 'محل تجاري' },
    { slug: 'factory', nameEn: 'Factory', nameAr: 'مصنع وورشة' },
    { slug: 'online-store', nameEn: 'Online Store', nameAr: 'متجر إلكتروني' },
    { slug: 'franchise', nameEn: 'Franchise', nameAr: 'حق امتياز' },
    { slug: 'licenses', nameEn: 'Licenses', nameAr: 'تراخيص ورخص' },
    { slug: 'equipment', nameEn: 'Equipment', nameAr: 'معدات ومستلزمات' },
    { slug: 'partnership', nameEn: 'Partnership', nameAr: 'شراكة ومستثمر' },
    { slug: 'software', nameEn: 'Software Project', nameAr: 'مشروع برمجي' },
    { slug: 'agri', nameEn: 'Agricultural Project', nameAr: 'مشروع زراعي' },
    { slug: 'other', nameEn: 'Other', nameAr: 'مشاريع أخرى' },
  ],
};

export function subsFor(categorySlug: string): SubcategoryDef[] {
  return subcategories[categorySlug] || [];
}

export function subcategoriesByCategory(categorySlug: string): SubcategoryDef[] {
  return subsFor(categorySlug);
}

export function findSubcategoryBySlug(slug: string): SubcategoryDef | undefined {
  for (const list of Object.values(subcategories)) {
    const found = list.find((s) => s.slug === slug);
    if (found) return found;
  }
  return undefined;
}

