import type { CategoryFieldMap, ListingFieldOption } from './types';

const PET_GENDER_OPTIONS: ListingFieldOption[] = [
  { value: 'male', labelAr: 'ذكر', labelEn: 'Male' },
  { value: 'female', labelAr: 'أنثى', labelEn: 'Female' },
  { value: 'pair', labelAr: 'زوج (ذكر + أنثى)', labelEn: 'Pair' },
];

const HEALTH_OPTIONS: ListingFieldOption[] = [
  { value: 'excellent_healthy', labelAr: 'ممتازة وخالٍ من الأمراض', labelEn: 'Excellent & Healthy' },
  { value: 'vaccinated_checkup', labelAr: 'مفحوص بيطرياً ومطعم بالكامل', labelEn: 'Vaccinated & Vet Checked' },
  { value: 'needs_care', labelAr: 'يحتاج عناية خاصة', labelEn: 'Needs Special Care' },
];

const DOG_BREEDS: ListingFieldOption[] = [
  { value: 'german_shepherd', labelAr: 'جيرمن شيبرد (German Shepherd)', labelEn: 'German Shepherd' },
  { value: 'golden_retriever', labelAr: 'جولدن ريتريفر (Golden Retriever)', labelEn: 'Golden Retriever' },
  { value: 'husky', labelAr: 'هاسكي سيبيري (Husky)', labelEn: 'Husky' },
  { value: 'pomeranian', labelAr: 'بوميرانيان / بو (Pomeranian)', labelEn: 'Pomeranian' },
  { value: 'shih_tzu', labelAr: 'شيتزو (Shih Tzu)', labelEn: 'Shih Tzu' },
  { value: 'pitbull', labelAr: 'بيت بول (Pitbull)', labelEn: 'Pitbull' },
  { value: 'rottweiler', labelAr: 'روت وايلر (Rottweiler)', labelEn: 'Rottweiler' },
  { value: 'poodle', labelAr: 'بودل (Poodle)', labelEn: 'Poodle' },
  { value: 'chihuahua', labelAr: 'تشيواوا (Chihuahua)', labelEn: 'Chihuahua' },
  { value: 'malinois', labelAr: 'مالينو بلجيكي (Malinois)', labelEn: 'Belgian Malinois' },
];

const CAT_BREEDS: ListingFieldOption[] = [
  { value: 'shirazi_persian', labelAr: 'شيرازي / فارسي (Persian)', labelEn: 'Persian' },
  { value: 'scottish_fold', labelAr: 'سكوتش فولد (Scottish Fold)', labelEn: 'Scottish Fold' },
  { value: 'british_shorthair', labelAr: 'بريطاني قصير الشعر (British Shorthair)', labelEn: 'British Shorthair' },
  { value: 'siamese', labelAr: 'سيامي (Siamese)', labelEn: 'Siamese' },
  { value: 'ragdoll', labelAr: 'راج دول (Ragdoll)', labelEn: 'Ragdoll' },
  { value: 'himalayan', labelAr: 'هملايا (Himalayan)', labelEn: 'Himalayan' },
  { value: 'mainecoon', labelAr: 'مين كون (Maine Coon)', labelEn: 'Maine Coon' },
  { value: 'sphynx', labelAr: 'سفينكس فرعوني (Sphynx)', labelEn: 'Sphynx' },
];

export const PETS_FIELDS: CategoryFieldMap = {
  dogs: [
    { key: 'breed', labelAr: 'السلالة / النوع', labelEn: 'Breed', type: 'select', allowOther: true, required: true, options: DOG_BREEDS },
    { key: 'age', labelAr: 'العمر', labelEn: 'Age', type: 'select', allowOther: true, required: true, options: [
      { value: 'puppy_under_6m', labelAr: 'جرو صغير (أقل من 6 أشهر)', labelEn: 'Puppy (< 6 Months)' },
      { value: 'young_6m_2y', labelAr: 'شاب (6 أشهر - سنتين)', labelEn: 'Young (6m - 2y)' },
      { value: 'adult_2_7y', labelAr: 'بالغ (2 - 7 سنوات)', labelEn: 'Adult (2 - 7y)' },
      { value: 'senior_7plus', labelAr: 'كبير سن (7+ سنوات)', labelEn: 'Senior (7+ y)' },
    ]},
    { key: 'gender', labelAr: 'الجنس', labelEn: 'Gender', type: 'select', allowOther: true, required: true, options: PET_GENDER_OPTIONS },
    { key: 'size', labelAr: 'حجم الكلب', labelEn: 'Size', type: 'select', allowOther: true, required: false, options: [
      { value: 'small_toy', labelAr: 'صغير / توي (Small / Toy)', labelEn: 'Small / Toy' },
      { value: 'medium', labelAr: 'متوسط (Medium)', labelEn: 'Medium' },
      { value: 'large_giant', labelAr: 'كبير / ضخم (Large / Giant)', labelEn: 'Large / Giant' },
    ]},
    { key: 'health', labelAr: 'الحالة الصحية', labelEn: 'Health Status', type: 'select', allowOther: true, required: false, options: HEALTH_OPTIONS },
    { key: 'vaccinated', labelAr: 'حاصل على كافة التطعيمات واللقاحات مع دفتر صحي', labelEn: 'Fully Vaccinated with Passport', type: 'boolean', required: false },
    { key: 'microchipped', labelAr: 'مركب له شريحة إلكترونية (Microchip)', labelEn: 'Microchipped', type: 'boolean', required: false },
    { key: 'trained', labelAr: 'مدرب على الطاعة وقضاء الحاجة في الخارج', labelEn: 'Trained & Housebroken', type: 'boolean', required: false },
    { key: 'papers', labelAr: 'مرفق شهادة نسب وبيدجري (Pedigree)', labelEn: 'Pedigree Papers Included', type: 'boolean', required: false },
    { key: 'forBreeding', labelAr: 'متاح للتزاوج / التلقيح', labelEn: 'Available for Stud / Breeding', type: 'boolean', required: false },
    { key: 'priceNegotiable', labelAr: 'السعر قابل للتفاوض', labelEn: 'Price Negotiable', type: 'boolean', required: false },
  ],
  cats: [
    { key: 'breed', labelAr: 'السلالة', labelEn: 'Breed', type: 'select', allowOther: true, required: true, options: CAT_BREEDS },
    { key: 'age', labelAr: 'العمر', labelEn: 'Age', type: 'select', allowOther: true, required: true, options: [
      { value: 'kitten_under_3m', labelAr: 'كتن صغير (أقل من 3 أشهر)', labelEn: 'Kitten (< 3 Months)' },
      { value: 'young_3_12m', labelAr: 'صغير (3 - 12 شهراً)', labelEn: 'Junior (3 - 12 Months)' },
      { value: 'adult_1_5y', labelAr: 'بالغ (1 - 5 سنوات)', labelEn: 'Adult (1 - 5 Years)' },
      { value: 'senior_5plus', labelAr: 'كبير (5+ سنوات)', labelEn: 'Senior (5+ Years)' },
    ]},
    { key: 'gender', labelAr: 'الجنس', labelEn: 'Gender', type: 'select', allowOther: true, required: true, options: PET_GENDER_OPTIONS },
    { key: 'hairType', labelAr: 'نوع وكثافة الفراء', labelEn: 'Fur Type', type: 'select', allowOther: true, required: false, options: [
      { value: 'long_fluffy', labelAr: 'شعر طويل وكثيف (Long Hair)', labelEn: 'Long Hair' },
      { value: 'short', labelAr: 'شعر قصير (Short Hair)', labelEn: 'Short Hair' },
      { value: 'hairless', labelAr: 'بدون شعر (Hairless)', labelEn: 'Hairless' },
    ]},
    { key: 'health', labelAr: 'الحالة الصحية', labelEn: 'Health Status', type: 'select', allowOther: true, required: false, options: HEALTH_OPTIONS },
    { key: 'vaccinated', labelAr: 'مطعم ومعه دفتر تطعيم بيطري', labelEn: 'Vaccinated with Vet Book', type: 'boolean', required: false },
    { key: 'litterTrained', labelAr: 'مدرب تماماً على الليتر بوكس (Litter Box)', labelEn: 'Litter Box Trained', type: 'boolean', required: false },
    { key: 'neutered', labelAr: 'معقم / مخصي (Neutered / Spayed)', labelEn: 'Neutered / Spayed', type: 'boolean', required: false },
    { key: 'papers', labelAr: 'مرفق شهادة أصالة ونسب', labelEn: 'Pedigree Included', type: 'boolean', required: false },
  ],
  birds: [
    { key: 'birdType', labelAr: 'نوع الطير', labelEn: 'Bird Species', type: 'select', allowOther: true, required: true, options: [
      { value: 'parrot_african_grey', labelAr: 'ببغاء كاسكو أفريقي رمادي (African Grey)', labelEn: 'African Grey' },
      { value: 'cockatiel', labelAr: 'كروان / كوكتيل (Cockatiel)', labelEn: 'Cockatiel' },
      { value: 'canary', labelAr: 'كناري مغرد (Canary)', labelEn: 'Canary' },
      { value: 'budgie', labelAr: 'بادجي / حب / طيور جنة (Budgie)', labelEn: 'Budgie' },
      { value: 'lovebird', labelAr: 'طيور الحب / روز / فيشر (Lovebirds)', labelEn: 'Lovebirds' },
      { value: 'conure', labelAr: 'ببغاء كونيور (Conure)', labelEn: 'Conure' },
      { value: 'falcon_hawk', labelAr: 'صقور وجوارح (Falcon)', labelEn: 'Falcon / Hawk' },
      { value: 'pigeon', labelAr: 'حمام زينة وقلابي', labelEn: 'Pigeons' },
    ]},
    { key: 'gender', labelAr: 'الجنس', labelEn: 'Gender', type: 'select', allowOther: true, required: false, options: PET_GENDER_OPTIONS },
    { key: 'health', labelAr: 'الحالة الصحية والريش', labelEn: 'Health & Feathers', type: 'select', allowOther: true, required: false, options: HEALTH_OPTIONS },
    { key: 'handTamed', labelAr: 'أليف ويقف على اليد / إطعام يدوي', labelEn: 'Hand Tamed / Friendly', type: 'boolean', required: false },
    { key: 'speaking', labelAr: 'متكلم وحافظ كلمات (للببغاوات)', labelEn: 'Talking Bird', type: 'boolean', required: false },
    { key: 'singing', labelAr: 'تغريد قوي ومستمر (للكناري والبلابل)', labelEn: 'Singing Bird', type: 'boolean', required: false },
    { key: 'cageIncluded', labelAr: 'يشمل القفص والمستلزمات', labelEn: 'Cage Included', type: 'boolean', required: false },
  ],
  fish: [
    { key: 'fishType', labelAr: 'نوع الأسماك / الكائنات', labelEn: 'Fish Type', type: 'select', allowOther: true, required: true, options: [
      { value: 'tropical_freshwater', labelAr: 'أسماك مياه عذبة استوائية (تترا، جوبي، مولي)', labelEn: 'Freshwater Tropical' },
      { value: 'cichlids', labelAr: 'سيكلد أفريقي / أمريكي (Cichlids)', labelEn: 'Cichlids' },
      { value: 'goldfish_koi', labelAr: 'جولد فيش / كوي ياباني (Goldfish & Koi)', labelEn: 'Goldfish & Koi' },
      { value: 'marine_saltwater', labelAr: 'أسماك مياه مالحة وبحرية (Clownfish, Tang)', labelEn: 'Marine / Saltwater' },
      { value: 'corals_invertebrates', labelAr: 'مرجان وروبيان وقواقع حوض', labelEn: 'Corals & Invertebrates' },
      { value: 'full_aquarium_setup', labelAr: 'حوض سمك كامل للبيع مع أسماكه', labelEn: 'Complete Aquarium Setup' },
    ]},
    { key: 'aquariumSize', labelAr: 'سعة الحوض التقريبية (لتر)', labelEn: 'Tank Size (Liters)', type: 'number', required: false, placeholder: '100', placeholderAr: '100' },
    { key: 'equipmentIncluded', labelAr: 'يشمل الفلتر، السخان، الإضاءة ومضخة الهواء', labelEn: 'Includes Filter, Heater, Light', type: 'boolean', required: false },
    { key: 'livePlants', labelAr: 'حوض نباتي طبيعي مزروع', labelEn: 'Planted Live Aquarium', type: 'boolean', required: false },
    { key: 'health', labelAr: 'صحة وحيوية الأسماك', labelEn: 'Health', type: 'select', allowOther: true, required: false, options: HEALTH_OPTIONS },
  ],
  'pet-supplies': [
    { key: 'supplyType', labelAr: 'نوع المستلزم', labelEn: 'Supply Type', type: 'select', allowOther: true, required: true, options: [
      { value: 'cage_aquarium', labelAr: 'أقفاص طيور / بيوت كلاب / أحواض سمك', labelEn: 'Cage / House / Aquarium' },
      { value: 'food_treats', labelAr: 'أطعمة ومكملات (Dry Food / Wet Food)', labelEn: 'Food & Treats' },
      { value: 'litter_box_sand', labelAr: 'رمل قطط وليتر بوكس', labelEn: 'Cat Litter & Box' },
      { value: 'carrier_bag', labelAr: 'شنطة أو بوكس تنقل وسفر للطيران', labelEn: 'Pet Carrier / Travel Crate' },
      { value: 'toys_scratcher', labelAr: 'خداديات أظافر وألعاب', labelEn: 'Scratcher & Toys' },
      { value: 'grooming_hygiene', labelAr: 'أدوات حلاقة وشامبو وعناية', labelEn: 'Grooming & Hygiene' },
    ]},
    { key: 'petType', labelAr: 'مخصص لأي حيوان', labelEn: 'For Pet Type', type: 'select', allowOther: true, required: true, options: [
      { value: 'cats', labelAr: 'قطط', labelEn: 'Cats' },
      { value: 'dogs', labelAr: 'كلاب', labelEn: 'Dogs' },
      { value: 'birds', labelAr: 'طيور', labelEn: 'Birds' },
      { value: 'fish', labelAr: 'أسماك', labelEn: 'Fish' },
      { value: 'small_pets', labelAr: 'أرانب وهامستر وقوارض', labelEn: 'Rabbits & Small Pets' },
    ]},
    { key: 'brand', labelAr: 'الماركة المصنعة', labelEn: 'Brand', type: 'text', required: false, placeholder: 'Royal Canin, Josera, Purina, Ferplast...', placeholderAr: 'مثال: رويال كانين، جوزيرا...' },
    { key: 'condition', labelAr: 'الحالة', labelEn: 'Condition', type: 'select', allowOther: true, required: true, options: [
      { value: 'new', labelAr: 'جديد بالكرتونة / كيس مغلق', labelEn: 'Brand New / Sealed' },
      { value: 'used_clean', labelAr: 'مستعمل بحالة نظيفة وممتازة', labelEn: 'Used - Clean' },
    ]},
    { key: 'dimensions', labelAr: 'المقاسات / الأبعاد (إن وجدت)', labelEn: 'Dimensions', type: 'text', required: false, placeholder: 'LxWxH in cm', placeholderAr: 'الطول × العرض × الارتفاع' },
  ],
};
