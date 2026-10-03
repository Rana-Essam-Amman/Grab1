// RULE-14-EXCEPTION: Static taxonomy and listing fields
export interface ListingFieldOption {
  readonly value: string;
  readonly labelAr: string;
  readonly labelEn: string;
}

export interface ListingField {
  readonly key: string;
  readonly labelAr: string;
  readonly labelEn: string;
  readonly type: 'text' | 'number' | 'select' | 'boolean';
  readonly required: boolean;
  readonly options?: readonly ListingFieldOption[];
  readonly placeholder?: string;
}

export const LISTING_FIELDS: Record<string, Record<string, ListingField[]>> = {
  motors: {
    cars: [
      { key: 'make', labelAr: 'الماركة', labelEn: 'Make', type: 'text', required: true, placeholder: 'Toyota, BMW...' },
      { key: 'model', labelAr: 'الموديل', labelEn: 'Model', type: 'text', required: true, placeholder: 'Camry, X5...' },
      { key: 'year', labelAr: 'السنة', labelEn: 'Year', type: 'number', required: true, placeholder: '2022' },
      { key: 'km', labelAr: 'العداد (كم)', labelEn: 'KM', type: 'number', required: false, placeholder: '50000' },
      { key: 'transmission', labelAr: 'ناقل الحركة', labelEn: 'Transmission', type: 'select', required: true, options: [
        { value: 'auto', labelAr: 'أوتوماتيك', labelEn: 'Automatic' },
        { value: 'manual', labelAr: 'عادي', labelEn: 'Manual' },
      ]},
      { key: 'fuel', labelAr: 'الوقود', labelEn: 'Fuel', type: 'select', required: true, options: [
        { value: 'petrol', labelAr: 'بنزين', labelEn: 'Petrol' },
        { value: 'diesel', labelAr: 'ديزل', labelEn: 'Diesel' },
        { value: 'hybrid', labelAr: 'هايبرد', labelEn: 'Hybrid' },
        { value: 'electric', labelAr: 'كهربائي', labelEn: 'Electric' },
      ]},
      { key: 'installment', labelAr: 'متوفر تقسيط', labelEn: 'Installment Available', type: 'boolean', required: false },
    ],
    motorbikes: [
      { key: 'brand', labelAr: 'الماركة', labelEn: 'Brand', type: 'text', required: true, placeholder: 'Honda, Yamaha...' },
      { key: 'cc', labelAr: 'السعة (سي سي)', labelEn: 'Engine CC', type: 'number', required: false, placeholder: '250' },
      { key: 'year', labelAr: 'السنة', labelEn: 'Year', type: 'number', required: true, placeholder: '2023' },
    ],
    heavy: [
      { key: 'vehicleType', labelAr: 'نوع الآلية', labelEn: 'Vehicle Type', type: 'text', required: true, placeholder: 'شاحنة، حفار...' },
      { key: 'year', labelAr: 'السنة', labelEn: 'Year', type: 'number', required: true, placeholder: '2020' },
    ],
    plates: [
      { key: 'plateType', labelAr: 'نوع اللوحة', labelEn: 'Plate Type', type: 'select', required: true, options: [
        { value: 'private', labelAr: 'خصوصي', labelEn: 'Private' },
        { value: 'commercial', labelAr: 'عمومي', labelEn: 'Commercial' },
      ]},
      { key: 'digits', labelAr: 'عدد الأرقام', labelEn: 'Number of Digits', type: 'number', required: true },
    ],
    parts: [
      { key: 'partName', labelAr: 'اسم القطعة', labelEn: 'Part Name', type: 'text', required: true },
      { key: 'carCompatibility', labelAr: 'السيارة المتوافقة', labelEn: 'Compatible Car', type: 'text', required: false },
    ],
    boats: [
      { key: 'boatType', labelAr: 'نوع القارب', labelEn: 'Boat Type', type: 'text', required: true },
      { key: 'length', labelAr: 'الطول (قدم)', labelEn: 'Length (ft)', type: 'number', required: false },
    ],
    accessories: [
      { key: 'accessoryType', labelAr: 'نوع الإكسسوار', labelEn: 'Accessory Type', type: 'text', required: true },
    ],
  },
  'real-estate': {
    'for-sale': [
      { key: 'propertyType', labelAr: 'نوع العقار', labelEn: 'Property Type', type: 'select', required: true, options: [
        { value: 'apartment', labelAr: 'شقة', labelEn: 'Apartment' },
        { value: 'house', labelAr: 'منزل', labelEn: 'House' },
        { value: 'villa', labelAr: 'فيلا', labelEn: 'Villa' },
        { value: 'land', labelAr: 'أرض', labelEn: 'Land' },
      ]},
      { key: 'bedrooms', labelAr: 'غرف النوم', labelEn: 'Bedrooms', type: 'number', required: true },
      { key: 'bathrooms', labelAr: 'الحمامات', labelEn: 'Bathrooms', type: 'number', required: true },
      { key: 'area', labelAr: 'المساحة (م²)', labelEn: 'Area (m²)', type: 'number', required: true },
      { key: 'floor', labelAr: 'الطابق', labelEn: 'Floor', type: 'text', required: false },
      { key: 'furnished', labelAr: 'مفروشة', labelEn: 'Furnished', type: 'boolean', required: false },
    ],
    'for-rent': [
      { key: 'propertyType', labelAr: 'نوع العقار', labelEn: 'Property Type', type: 'select', required: true, options: [
        { value: 'apartment', labelAr: 'شقة', labelEn: 'Apartment' },
        { value: 'studio', labelAr: 'استديو', labelEn: 'Studio' },
        { value: 'villa', labelAr: 'فيلا', labelEn: 'Villa' },
      ]},
      { key: 'rentalPeriod', labelAr: 'فترة الإيجار', labelEn: 'Rental Period', type: 'select', required: true, options: [
        { value: 'monthly', labelAr: 'شهري', labelEn: 'Monthly' },
        { value: 'yearly', labelAr: 'سنوي', labelEn: 'Yearly' },
        { value: 'daily', labelAr: 'يومي', labelEn: 'Daily' },
      ]},
      { key: 'bedrooms', labelAr: 'غرف النوم', labelEn: 'Bedrooms', type: 'number', required: true },
      { key: 'furnished', labelAr: 'مفروشة', labelEn: 'Furnished', type: 'boolean', required: false },
    ],
    commercial: [
      { key: 'commercialType', labelAr: 'نوع العقار التجاري', labelEn: 'Commercial Type', type: 'text', required: true },
      { key: 'area', labelAr: 'المساحة (م²)', labelEn: 'Area (m²)', type: 'number', required: true },
    ],
    lands: [
      { key: 'landType', labelAr: 'نوع الأرض', labelEn: 'Land Type', type: 'text', required: true },
      { key: 'area', labelAr: 'المساحة (م²)', labelEn: 'Area (m²)', type: 'number', required: true },
    ],
    chalets: [
      { key: 'chaletType', labelAr: 'نوع الشاليه', labelEn: 'Chalet Type', type: 'text', required: true },
      { key: 'pool', labelAr: 'مسبح خاص', labelEn: 'Private Pool', type: 'boolean', required: false },
    ],
    foreign: [
      { key: 'country', labelAr: 'الدولة', labelEn: 'Country', type: 'text', required: true },
      { key: 'propertyType', labelAr: 'نوع العقار', labelEn: 'Property Type', type: 'text', required: true },
    ],
  },
  mobiles: {
    phones: [
      { key: 'brand', labelAr: 'الماركة', labelEn: 'Brand', type: 'text', required: true, placeholder: 'Apple, Samsung...' },
      { key: 'storage', labelAr: 'السعة التخزينية', labelEn: 'Storage', type: 'select', required: true, options: [
        { value: '64gb', labelAr: '64 جيجابايت', labelEn: '64 GB' },
        { value: '128gb', labelAr: '128 جيجابايت', labelEn: '128 GB' },
        { value: '256gb', labelAr: '256 جيجابايت', labelEn: '256 GB' },
        { value: '512gb', labelAr: '512 جيجابايت', labelEn: '512 GB' },
      ]},
      { key: 'condition', labelAr: 'الحالة', labelEn: 'Condition', type: 'select', required: true, options: [
        { value: 'new', labelAr: 'جديد', labelEn: 'New' },
        { value: 'used', labelAr: 'مستعمل', labelEn: 'Used' },
      ]},
    ],
    tablets: [
      { key: 'brand', labelAr: 'الماركة', labelEn: 'Brand', type: 'text', required: true },
      { key: 'storage', labelAr: 'السعة', labelEn: 'Storage', type: 'text', required: false },
    ],
    'smart-watches': [
      { key: 'brand', labelAr: 'الماركة', labelEn: 'Brand', type: 'text', required: true },
    ],
    accessories: [
      { key: 'accessoryType', labelAr: 'نوع الإكسسوار', labelEn: 'Type', type: 'text', required: true },
    ],
    numbers: [
      { key: 'operator', labelAr: 'المشغل', labelEn: 'Operator', type: 'text', required: true },
    ],
  },
  watches: {
    luxury: [
      { key: 'brand', labelAr: 'الماركة', labelEn: 'Brand', type: 'text', required: true, placeholder: 'Rolex, Omega...' },
      { key: 'gender', labelAr: 'الجنس', labelEn: 'Gender', type: 'select', required: true, options: [
        { value: 'men', labelAr: 'رجالي', labelEn: 'Men' },
        { value: 'women', labelAr: 'نسائي', labelEn: 'Women' },
        { value: 'unisex', labelAr: 'الجنسين', labelEn: 'Unisex' },
      ]},
    ],
    everyday: [
      { key: 'brand', labelAr: 'الماركة', labelEn: 'Brand', type: 'text', required: true },
    ],
    'vintage-watch': [
      { key: 'brand', labelAr: 'الماركة', labelEn: 'Brand', type: 'text', required: true },
    ],
    straps: [
      { key: 'material', labelAr: 'المادة', labelEn: 'Material', type: 'text', required: true },
    ],
  },
  computers: {
    laptops: [
      { key: 'brand', labelAr: 'الماركة', labelEn: 'Brand', type: 'text', required: true },
      { key: 'processor', labelAr: 'المعالج', labelEn: 'Processor', type: 'text', required: false },
      { key: 'ram', labelAr: 'الرام', labelEn: 'RAM', type: 'text', required: false },
    ],
    desktops: [
      { key: 'brand', labelAr: 'الماركة', labelEn: 'Brand', type: 'text', required: true },
    ],
    screens: [
      { key: 'size', labelAr: 'الحجم (بوصة)', labelEn: 'Size (inch)', type: 'number', required: false },
    ],
    'parts-pc': [
      { key: 'partType', labelAr: 'نوع القطعة', labelEn: 'Part Type', type: 'text', required: true },
    ],
    'accessories-pc': [
      { key: 'accessoryType', labelAr: 'نوع الملحق', labelEn: 'Type', type: 'text', required: true },
    ],
  },
  electronics: {
    tv: [
      { key: 'brand', labelAr: 'الماركة', labelEn: 'Brand', type: 'text', required: true },
      { key: 'size', labelAr: 'الحجم (بوصة)', labelEn: 'Size (inch)', type: 'number', required: true },
    ],
    audio: [
      { key: 'brand', labelAr: 'الماركة', labelEn: 'Brand', type: 'text', required: true },
    ],
    gaming: [
      { key: 'console', labelAr: 'الجهاز', labelEn: 'Console', type: 'text', required: true },
    ],
    cameras: [
      { key: 'brand', labelAr: 'الماركة', labelEn: 'Brand', type: 'text', required: true },
    ],
    'home-appliances': [
      { key: 'applianceType', labelAr: 'نوع الجهاز', labelEn: 'Appliance Type', type: 'text', required: true },
    ],
  },
  furniture: {
    living: [
      { key: 'itemType', labelAr: 'نوع القطعة', labelEn: 'Item Type', type: 'text', required: true },
      { key: 'material', labelAr: 'المادة', labelEn: 'Material', type: 'text', required: false },
    ],
    bedroom: [
      { key: 'itemType', labelAr: 'نوع القطعة', labelEn: 'Item Type', type: 'text', required: true },
    ],
    tables: [
      { key: 'material', labelAr: 'المادة', labelEn: 'Material', type: 'text', required: true },
    ],
    outdoor: [
      { key: 'itemType', labelAr: 'نوع القطعة', labelEn: 'Item Type', type: 'text', required: true },
    ],
    decor: [
      { key: 'decorType', labelAr: 'نوع الديكور', labelEn: 'Type', type: 'text', required: true },
    ],
    office: [
      { key: 'itemType', labelAr: 'نوع القطعة', labelEn: 'Item Type', type: 'text', required: true },
    ],
  },
  fashion: {
    women: [
      { key: 'size', labelAr: 'المقاس', labelEn: 'Size', type: 'text', required: true },
      { key: 'condition', labelAr: 'الحالة', labelEn: 'Condition', type: 'text', required: true },
    ],
    men: [
      { key: 'size', labelAr: 'المقاس', labelEn: 'Size', type: 'text', required: true },
    ],
    'watches-jewelry': [
      { key: 'material', labelAr: 'المادة', labelEn: 'Material', type: 'text', required: true },
    ],
    bags: [
      { key: 'brand', labelAr: 'الماركة', labelEn: 'Brand', type: 'text', required: true },
    ],
    shoes: [
      { key: 'size', labelAr: 'المقاس', labelEn: 'Size', type: 'number', required: true },
    ],
    perfumes: [
      { key: 'volume', labelAr: 'الحجم (مل)', labelEn: 'Volume (ml)', type: 'number', required: false },
    ],
  },
  services: {
    delivery: [
      { key: 'vehicle', labelAr: 'نوع المركبة', labelEn: 'Vehicle', type: 'text', required: true },
    ],
    events: [
      { key: 'eventType', labelAr: 'نوع الخدمة', labelEn: 'Service Type', type: 'text', required: true },
    ],
    design: [
      { key: 'specialty', labelAr: 'التخصص', labelEn: 'Specialty', type: 'text', required: true },
    ],
    tutor: [
      { key: 'subject', labelAr: 'المادة', labelEn: 'Subject', type: 'text', required: true },
    ],
  },
  jobs: {
    vacancies: [
      { key: 'jobTitle', labelAr: 'المسمى الوظيفي', labelEn: 'Job Title', type: 'text', required: true },
      { key: 'jobType', labelAr: 'نوع الدوام', labelEn: 'Job Type', type: 'select', required: true, options: [
        { value: 'full', labelAr: 'دوام كامل', labelEn: 'Full Time' },
        { value: 'part', labelAr: 'دوام جزئي', labelEn: 'Part Time' },
      ]},
    ],
    cvs: [
      { key: 'profession', labelAr: 'المجال المهني', labelEn: 'Profession', type: 'text', required: true },
      { key: 'experience', labelAr: 'سنوات الخبرة', labelEn: 'Experience Years', type: 'number', required: true },
    ],
  },
  kids: {
    clothes: [
      { key: 'ageGroup', labelAr: 'الفئة العمرية', labelEn: 'Age Group', type: 'text', required: true },
    ],
    toys: [
      { key: 'toyType', labelAr: 'نوع اللعبة', labelEn: 'Toy Type', type: 'text', required: true },
    ],
    strollers: [
      { key: 'brand', labelAr: 'الماركة', labelEn: 'Brand', type: 'text', required: true },
    ],
    feeding: [
      { key: 'itemType', labelAr: 'نوع المستلزم', labelEn: 'Type', type: 'text', required: true },
    ],
  },
  beauty: {
    'perfumes-cosmetics': [
      { key: 'brand', labelAr: 'الماركة', labelEn: 'Brand', type: 'text', required: true },
    ],
    hair: [
      { key: 'productType', labelAr: 'نوع المنتج', labelEn: 'Type', type: 'text', required: true },
    ],
    skin: [
      { key: 'productType', labelAr: 'نوع المنتج', labelEn: 'Type', type: 'text', required: true },
    ],
    care: [
      { key: 'deviceType', labelAr: 'نوع الجهاز', labelEn: 'Device Type', type: 'text', required: true },
    ],
  },
  pets: {
    dogs: [
      { key: 'breed', labelAr: 'السلالة', labelEn: 'Breed', type: 'text', required: true },
      { key: 'age', labelAr: 'العمر', labelEn: 'Age', type: 'text', required: false },
    ],
    cats: [
      { key: 'breed', labelAr: 'السلالة', labelEn: 'Breed', type: 'text', required: true },
    ],
    birds: [
      { key: 'birdType', labelAr: 'نوع الطير', labelEn: 'Bird Type', type: 'text', required: true },
    ],
    fish: [
      { key: 'fishType', labelAr: 'نوع السمك', labelEn: 'Fish Type', type: 'text', required: true },
    ],
    'pet-supplies': [
      { key: 'supplyType', labelAr: 'نوع المستلزم', labelEn: 'Type', type: 'text', required: true },
    ],
  },
  sports: {
    fitness: [
      { key: 'equipmentType', labelAr: 'نوع الجهاز', labelEn: 'Equipment Type', type: 'text', required: true },
    ],
    bicycles: [
      { key: 'bikeType', labelAr: 'نوع الدراجة', labelEn: 'Bike Type', type: 'text', required: true },
    ],
    camping: [
      { key: 'itemType', labelAr: 'نوع التجهيز', labelEn: 'Item Type', type: 'text', required: true },
    ],
    'water-sports': [
      { key: 'sportType', labelAr: 'نوع الرياضة', labelEn: 'Sport Type', type: 'text', required: true },
    ],
  },
  books: {
    'books-magazines': [
      { key: 'genre', labelAr: 'التصنيف', labelEn: 'Genre', type: 'text', required: true },
    ],
    instruments: [
      { key: 'instrumentType', labelAr: 'نوع الآلة', labelEn: 'Instrument Type', type: 'text', required: true },
    ],
    antiques: [
      { key: 'antiqueType', labelAr: 'نوع التحفة', labelEn: 'Type', type: 'text', required: true },
    ],
    crafts: [
      { key: 'craftType', labelAr: 'نوع العمل', labelEn: 'Craft Type', type: 'text', required: true },
    ],
  },
  'home-garden': {
    'garden-furniture': [
      { key: 'itemType', labelAr: 'نوع القطعة', labelEn: 'Item Type', type: 'text', required: true },
    ],
    plants: [
      { key: 'plantType', labelAr: 'نوع النبات', labelEn: 'Plant Type', type: 'text', required: true },
    ],
    bbq: [
      { key: 'bbqType', labelAr: 'نوع الشواية', labelEn: 'BBQ Type', type: 'text', required: true },
    ],
    tools: [
      { key: 'toolType', labelAr: 'نوع الأداة', labelEn: 'Tool Type', type: 'text', required: true },
    ],
  },
  krakeeb: {
    general: [
      { key: 'itemCondition', labelAr: 'الحالة', labelEn: 'Condition', type: 'text', required: true },
    ],
    vintage: [
      { key: 'era', labelAr: 'الفترة الزمنية', labelEn: 'Era', type: 'text', required: false },
    ],
    clearances: [
      { key: 'reason', labelAr: 'سبب التصفية', labelEn: 'Reason', type: 'text', required: false },
    ],
  },
  cleaning: {
    homes: [
      { key: 'serviceScope', labelAr: 'نطاق الخدمة', labelEn: 'Scope', type: 'text', required: true },
    ],
    offices: [
      { key: 'officeSize', labelAr: 'حجم المكتب', labelEn: 'Office Size', type: 'text', required: false },
    ],
    'sofas-carpets': [
      { key: 'itemsCount', labelAr: 'عدد القطع', labelEn: 'Items Count', type: 'number', required: true },
    ],
    'water-tanks': [
      { key: 'tankSize', labelAr: 'حجم الخزان', labelEn: 'Tank Size', type: 'text', required: true },
    ],
    pools: [
      { key: 'poolSize', labelAr: 'حجم المسبح', labelEn: 'Pool Size', type: 'text', required: false },
    ],
    'post-construction': [
      { key: 'area', labelAr: 'المساحة (م²)', labelEn: 'Area (m²)', type: 'number', required: false },
    ],
    'windows-facades': [
      { key: 'facadeType', labelAr: 'نوع الواجهة', labelEn: 'Facade Type', type: 'text', required: true },
    ],
  },
  handymen: {
    electrician: [
      { key: 'serviceType', labelAr: 'نوع الخدمة', labelEn: 'Service Type', type: 'text', required: true },
    ],
    plumber: [
      { key: 'serviceType', labelAr: 'نوع الخدمة', labelEn: 'Service Type', type: 'text', required: true },
    ],
    carpenter: [
      { key: 'serviceType', labelAr: 'نوع الخدمة', labelEn: 'Service Type', type: 'text', required: true },
    ],
    painter: [
      { key: 'serviceType', labelAr: 'نوع الخدمة', labelEn: 'Service Type', type: 'text', required: true },
    ],
    blacksmith: [
      { key: 'serviceType', labelAr: 'نوع الخدمة', labelEn: 'Service Type', type: 'text', required: true },
    ],
    'ac-technician': [
      { key: 'acType', labelAr: 'نوع المكيف', labelEn: 'AC Type', type: 'text', required: true },
    ],
    aluminum: [
      { key: 'workType', labelAr: 'نوع العمل', labelEn: 'Work Type', type: 'text', required: true },
    ],
    gypsum: [
      { key: 'workType', labelAr: 'نوع العمل', labelEn: 'Work Type', type: 'text', required: true },
    ],
    'tiles-marble': [
      { key: 'workType', labelAr: 'نوع العمل', labelEn: 'Work Type', type: 'text', required: true },
    ],
    'appliance-repair': [
      { key: 'applianceType', labelAr: 'نوع الجهاز', labelEn: 'Appliance Type', type: 'text', required: true },
    ],
    locksmith: [
      { key: 'serviceType', labelAr: 'نوع الخدمة', labelEn: 'Service Type', type: 'text', required: true },
    ],
    glass: [
      { key: 'glassType', labelAr: 'نوع الزجاج', labelEn: 'Glass Type', type: 'text', required: true },
    ],
    'furniture-assembly': [
      { key: 'brand', labelAr: 'ماركة الأثاث', labelEn: 'Brand', type: 'text', required: false },
    ],
    general: [
      { key: 'taskDescription', labelAr: 'نوع المهمة', labelEn: 'Task', type: 'text', required: true },
    ],
  },
  projects: {
    restaurant: [
      { key: 'equipmentIncluded', labelAr: 'تشمل المعدات', labelEn: 'Equipment Included', type: 'boolean', required: false },
    ],
    shop: [
      { key: 'area', labelAr: 'المساحة (م²)', labelEn: 'Area (m²)', type: 'number', required: false },
    ],
    factory: [
      { key: 'industry', labelAr: 'قطاع الصناعة', labelEn: 'Industry', type: 'text', required: true },
    ],
    'online-store': [
      { key: 'platform', labelAr: 'المنصة', labelEn: 'Platform', type: 'text', required: false },
    ],
    franchise: [
      { key: 'brandName', labelAr: 'اسم العلامة', labelEn: 'Brand Name', type: 'text', required: true },
    ],
    licenses: [
      { key: 'licenseType', labelAr: 'نوع الرخصة', labelEn: 'License Type', type: 'text', required: true },
    ],
    equipment: [
      { key: 'equipmentType', labelAr: 'نوع المعدات', labelEn: 'Equipment Type', type: 'text', required: true },
    ],
    partnership: [
      { key: 'partnershipType', labelAr: 'نوع الشراكة', labelEn: 'Partnership Type', type: 'text', required: true },
    ],
    software: [
      { key: 'techStack', labelAr: 'تقنيات البرمجة', labelEn: 'Tech Stack', type: 'text', required: false },
    ],
    agri: [
      { key: 'projectType', labelAr: 'نوع المشروع', labelEn: 'Project Type', type: 'text', required: true },
    ],
    other: [
      { key: 'details', labelAr: 'تفاصيل', labelEn: 'Details', type: 'text', required: true },
    ],
  },
};

export function getListingFields(categorySlug: string, subcategorySlug: string): ListingField[] {
  return LISTING_FIELDS[categorySlug]?.[subcategorySlug] ?? [];
}
