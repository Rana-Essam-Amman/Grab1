import type { CategoryFieldMap, ListingFieldOption } from './types';

const TV_BRANDS: ListingFieldOption[] = [
  { value: 'samsung', labelAr: 'سامسونج (Samsung)', labelEn: 'Samsung' },
  { value: 'lg', labelAr: 'إل جي (LG)', labelEn: 'LG' },
  { value: 'sony', labelAr: 'سوني (Sony)', labelEn: 'Sony' },
  { value: 'tcl', labelAr: 'تي سي إل (TCL)', labelEn: 'TCL' },
  { value: 'hisense', labelAr: 'هايسنس (Hisense)', labelEn: 'Hisense' },
  { value: 'philips', labelAr: 'فيليبس (Philips)', labelEn: 'Philips' },
  { value: 'xiaomi', labelAr: 'شاومي (Xiaomi)', labelEn: 'Xiaomi' },
  { value: 'sharp', labelAr: 'شارب (Sharp)', labelEn: 'Sharp' },
  { value: 'toshiba', labelAr: 'توشيبا (Toshiba)', labelEn: 'Toshiba' },
];

const TV_SCREEN_SIZES: ListingFieldOption[] = [
  { value: '32', labelAr: '32 بوصة', labelEn: '32"' },
  { value: '40_43', labelAr: '40 - 43 بوصة', labelEn: '40" - 43"' },
  { value: '50_55', labelAr: '50 - 55 بوصة', labelEn: '50" - 55"' },
  { value: '65', labelAr: '65 بوصة', labelEn: '65"' },
  { value: '70_75', labelAr: '70 - 75 بوصة', labelEn: '70" - 75"' },
  { value: '85_plus', labelAr: '85 بوصة فما فوق', labelEn: '85"+' },
];

const RESOLUTION_OPTIONS: ListingFieldOption[] = [
  { value: 'hd', labelAr: 'HD (720p)', labelEn: 'HD 720p' },
  { value: 'fhd', labelAr: 'Full HD (1080p)', labelEn: 'Full HD 1080p' },
  { value: '4k', labelAr: '4K Ultra HD', labelEn: '4K Ultra HD' },
  { value: '8k', labelAr: '8K Ultra HD', labelEn: '8K Ultra HD' },
];

const PANEL_TYPES: ListingFieldOption[] = [
  { value: 'led', labelAr: 'LED / LCD', labelEn: 'LED / LCD' },
  { value: 'oled', labelAr: 'OLED', labelEn: 'OLED' },
  { value: 'qled', labelAr: 'QLED / Neo QLED', labelEn: 'QLED / Neo QLED' },
  { value: 'nanocell', labelAr: 'NanoCell / Mini-LED', labelEn: 'NanoCell / Mini-LED' },
];

const SMART_OS_OPTIONS: ListingFieldOption[] = [
  { value: 'google_tv', labelAr: 'Google TV / Android TV', labelEn: 'Google TV / Android TV' },
  { value: 'tizen', labelAr: 'Samsung Tizen OS', labelEn: 'Tizen OS' },
  { value: 'webos', labelAr: 'LG webOS', labelEn: 'LG webOS' },
  { value: 'roku', labelAr: 'Roku OS', labelEn: 'Roku OS' },
  { value: 'apple_tv', labelAr: 'Apple tvOS', labelEn: 'Apple tvOS' },
  { value: 'non_smart', labelAr: 'غير ذكية (شاشة عادية)', labelEn: 'Non-Smart' },
];

const CONDITION_OPTIONS: ListingFieldOption[] = [
  { value: 'new', labelAr: 'جديد بالكرتونة', labelEn: 'Brand New' },
  { value: 'excellent', labelAr: 'ممتاز كالجديد', labelEn: 'Excellent / Like New' },
  { value: 'good', labelAr: 'جيد جداً', labelEn: 'Good' },
  { value: 'fair', labelAr: 'مستعمل بحالة مقبولة', labelEn: 'Fair' },
];

const WARRANTY_OPTIONS: ListingFieldOption[] = [
  { value: 'active', labelAr: 'ساري الضمان', labelEn: 'Active Warranty' },
  { value: 'none', labelAr: 'بدون ضمان', labelEn: 'No Warranty' },
];

const HDR_OPTIONS: ListingFieldOption[] = [
  { value: 'hdr10', labelAr: 'HDR10', labelEn: 'HDR10' },
  { value: 'hdr10_plus', labelAr: 'HDR10+', labelEn: 'HDR10+' },
  { value: 'dolby_vision', labelAr: 'Dolby Vision', labelEn: 'Dolby Vision' },
  { value: 'none', labelAr: 'بدون HDR', labelEn: 'No HDR' },
];

const STREAMING_APPS: ListingFieldOption[] = [
  { value: 'netflix', labelAr: 'Netflix', labelEn: 'Netflix' },
  { value: 'youtube', labelAr: 'YouTube', labelEn: 'YouTube' },
  { value: 'shahid', labelAr: 'شاهد VIP', labelEn: 'Shahid VIP' },
  { value: 'disney', labelAr: 'Disney+', labelEn: 'Disney+' },
  { value: 'prime', labelAr: 'Amazon Prime', labelEn: 'Amazon Prime' },
  { value: 'apple_tv', labelAr: 'Apple TV+', labelEn: 'Apple TV+' },
  { value: 'osn', labelAr: 'OSN+', labelEn: 'OSN+' },
];

const GAME_REGION: ListingFieldOption[] = [
  { value: 'region_free', labelAr: 'Region Free', labelEn: 'Region Free' },
  { value: 'pal', labelAr: 'PAL (أوروبا)', labelEn: 'PAL (EU)' },
  { value: 'ntsc', labelAr: 'NTSC (أمريكا/اليابان)', labelEn: 'NTSC (US/JP)' },
];

const SENSOR_SIZE: ListingFieldOption[] = [
  { value: 'full_frame', labelAr: 'Full Frame (35mm)', labelEn: 'Full Frame' },
  { value: 'aps_c', labelAr: 'APS-C', labelEn: 'APS-C' },
  { value: 'micro_4_3', labelAr: 'Micro 4/3', labelEn: 'Micro 4/3' },
  { value: '1_inch', labelAr: '1 بوصة', labelEn: '1 inch' },
];

const CAMERA_KIT_CONTENTS: ListingFieldOption[] = [
  { value: 'battery', labelAr: 'بطارية إضافية', labelEn: 'Extra Battery' },
  { value: 'charger', labelAr: 'شاحن', labelEn: 'Charger' },
  { value: 'bag', labelAr: 'حقيبة كاميرا', labelEn: 'Camera Bag' },
  { value: 'strap', labelAr: 'حزام رقبة', labelEn: 'Neck Strap' },
  { value: 'memory', labelAr: 'بطاقة ذاكرة', labelEn: 'Memory Card' },
  { value: 'tripod', labelAr: 'ترايبود', labelEn: 'Tripod' },
  { value: 'filters', labelAr: 'فلاتر', labelEn: 'Filters' },
];

export const ELECTRONICS_FIELDS: CategoryFieldMap = {
  tv: [
    { key: 'brand', labelAr: 'الماركة', labelEn: 'Brand', type: 'select', allowOther: true, required: true, options: TV_BRANDS },
    { key: 'model', labelAr: 'الموديل', labelEn: 'Model', type: 'text', required: false, placeholder: 'C3, QN90C, C745...', placeholderAr: 'مثال: سي 3، كيو إن 90...' },
    { key: 'screenSize', labelAr: 'حجم الشاشة', labelEn: 'Screen Size', type: 'select', allowOther: true, required: true, options: TV_SCREEN_SIZES },
    { key: 'resolution', labelAr: 'دقة الشاشة', labelEn: 'Resolution', type: 'select', allowOther: true, required: true, options: RESOLUTION_OPTIONS },
    { key: 'panelType', labelAr: 'نوع اللوحة والتقنية', labelEn: 'Panel Type', type: 'select', allowOther: true, required: false, options: PANEL_TYPES },
    { key: 'smartOS', labelAr: 'النظام الذكي', labelEn: 'Smart OS', type: 'select', allowOther: true, required: false, options: SMART_OS_OPTIONS },
    { key: 'refreshRate', labelAr: 'معدل التحديث', labelEn: 'Refresh Rate', type: 'select', allowOther: true, required: false, options: [
      { value: '60hz', labelAr: '60 Hz', labelEn: '60 Hz' },
      { value: '120hz', labelAr: '120 Hz (مثالي للبلايستيشن)', labelEn: '120 Hz' },
      { value: '144hz_plus', labelAr: '144 Hz+', labelEn: '144 Hz+' },
    ]},
    { key: 'hdr', labelAr: 'تقنية HDR', labelEn: 'HDR Support', type: 'select', allowOther: true, required: false, options: HDR_OPTIONS },
    { key: 'streamingApps', labelAr: 'تطبيقات مدمجة', labelEn: 'Built-in Apps', type: 'select', multiSelect: true, allowOther: true, required: false, options: STREAMING_APPS },
    { key: 'releaseYear', labelAr: 'سنة الإصدار', labelEn: 'Release Year', type: 'number', required: false, placeholder: '2023', placeholderAr: '2023' },
    { key: 'originalBox', labelAr: 'الكرتونة الأصلية متوفرة', labelEn: 'Original Box', type: 'boolean', required: false },
    { key: 'condition', labelAr: 'الحالة', labelEn: 'Condition', type: 'select', allowOther: true, required: true, options: CONDITION_OPTIONS },
    { key: 'age', labelAr: 'مدة الاستخدام (بالسنوات)', labelEn: 'Age (Years)', type: 'number', required: false, placeholder: '1', placeholderAr: '1' },
    { key: 'warranty', labelAr: 'الضمان', labelEn: 'Warranty', type: 'select', allowOther: true, required: false, options: WARRANTY_OPTIONS },
    { key: 'accessories', labelAr: 'الملحقات المتوفرة (ريموت، حامل جداري...)', labelEn: 'Included Accessories', type: 'text', required: false, placeholder: 'Remote, Wall mount...', placeholderAr: 'مثال: ريموت سحري، حامل جداري، كرتونة...' },
  ],
  audio: [
    { key: 'audioCategory', labelAr: 'نوع الجهاز الصوتي', labelEn: 'Type', type: 'select', allowOther: true, required: true, options: [
      { value: 'headphones', labelAr: 'سماعات رأس (Over-ear / On-ear)', labelEn: 'Headphones' },
      { value: 'earbuds', labelAr: 'سماعات داخل الأذن (Earbuds)', labelEn: 'Earbuds' },
      { value: 'soundbar', labelAr: 'ساوند بار للتلفزيون (Soundbar)', labelEn: 'Soundbar' },
      { value: 'portable_speaker', labelAr: 'سماعة بلوتوث متنقلة', labelEn: 'Portable Bluetooth Speaker' },
      { value: 'home_theater', labelAr: 'مسرح منزلي ونظام صوتي', labelEn: 'Home Theater' },
      { value: 'mic', labelAr: 'ميكروفون تسجيل وبودكاست', labelEn: 'Microphone' },
    ]},
    { key: 'brand', labelAr: 'الماركة', labelEn: 'Brand', type: 'select', allowOther: true, required: true, options: [
      { value: 'sony', labelAr: 'سوني (Sony)', labelEn: 'Sony' },
      { value: 'bose', labelAr: 'بوز (Bose)', labelEn: 'Bose' },
      { value: 'apple', labelAr: 'أبل (AirPods / Beats)', labelEn: 'Apple / Beats' },
      { value: 'jbl', labelAr: 'جي بي إل (JBL)', labelEn: 'JBL' },
      { value: 'sennheiser', labelAr: 'سنهايزر (Sennheiser)', labelEn: 'Sennheiser' },
      { value: 'marshall', labelAr: 'مارشال (Marshall)', labelEn: 'Marshall' },
      { value: 'harman_kardon', labelAr: 'هارمان كاردون (Harman Kardon)', labelEn: 'Harman Kardon' },
      { value: 'anker', labelAr: 'أنكر ساوندكور (Anker Soundcore)', labelEn: 'Anker Soundcore' },
    ]},
    { key: 'model', labelAr: 'الموديل', labelEn: 'Model', type: 'text', required: false, placeholder: 'WH-1000XM5, AirPods Pro 2...', placeholderAr: 'مثال: إيربودز برو 2...' },
    { key: 'connectivity', labelAr: 'نوع الاتصال', labelEn: 'Connectivity', type: 'select', allowOther: true, required: false, options: [
      { value: 'bluetooth', labelAr: 'بلوتوث لاسلكي', labelEn: 'Bluetooth Wireless' },
      { value: 'wired', labelAr: 'سلكي (Aux / 3.5mm)', labelEn: 'Wired 3.5mm' },
      { value: 'optical_hdmi', labelAr: 'Optical / HDMI eARC', labelEn: 'Optical / HDMI' },
    ]},
    { key: 'noiseCancelling', labelAr: 'ميزة عزل الضوضاء النشط (ANC)', labelEn: 'Active Noise Cancelling (ANC)', type: 'boolean', required: false },
    { key: 'condition', labelAr: 'الحالة', labelEn: 'Condition', type: 'select', allowOther: true, required: true, options: CONDITION_OPTIONS },
    { key: 'batteryLife', labelAr: 'عمر البطارية (ساعات)', labelEn: 'Battery Life (Hours)', type: 'number', required: false, placeholder: '30', placeholderAr: '30' },
    { key: 'driverSize', labelAr: 'حجم الـ Driver (ملم)', labelEn: 'Driver Size (mm)', type: 'number', required: false, placeholder: '40', placeholderAr: '40' },
    { key: 'waterResistance', labelAr: 'مقاومة الماء', labelEn: 'Water Resistance', type: 'select', allowOther: true, required: false, options: [
      { value: 'none', labelAr: 'بدون', labelEn: 'None' },
      { value: 'ipx4', labelAr: 'IPX4 (رذاذ)', labelEn: 'IPX4' },
      { value: 'ipx7', labelAr: 'IPX7 (غمر)', labelEn: 'IPX7' },
      { value: 'ip68', labelAr: 'IP68 (رياضي)', labelEn: 'IP68' },
    ]},
    { key: 'warranty', labelAr: 'الضمان', labelEn: 'Warranty', type: 'select', allowOther: true, required: false, options: WARRANTY_OPTIONS },
  ],
  gaming: [
    { key: 'platform', labelAr: 'المنصة / الجهاز', labelEn: 'Platform', type: 'select', allowOther: true, required: true, options: [
      { value: 'ps5', labelAr: 'بلايستيشن 5 (PlayStation 5)', labelEn: 'PlayStation 5' },
      { value: 'ps4', labelAr: 'بلايستيشن 4 (PlayStation 4)', labelEn: 'PlayStation 4' },
      { value: 'xbox_series_x', labelAr: 'إكس بوكس سيريس إكس (Xbox Series X)', labelEn: 'Xbox Series X' },
      { value: 'xbox_series_s', labelAr: 'إكس بوكس سيريس إس (Xbox Series S)', labelEn: 'Xbox Series S' },
      { value: 'nintendo_switch', labelAr: 'نينتندو سويتش (Nintendo Switch)', labelEn: 'Nintendo Switch' },
      { value: 'pc_gaming', labelAr: 'كمبيوتر ألعاب (PC)', labelEn: 'PC Gaming' },
      { value: 'vr', labelAr: 'نظارة واقع افتراضي (VR / Meta Quest)', labelEn: 'VR Headset' },
      { value: 'retro', labelAr: 'أجهزة كلاسيكية قديمة', labelEn: 'Retro Consoles' },
    ]},
    { key: 'itemType', labelAr: 'نوع المعروض', labelEn: 'Item Type', type: 'select', allowOther: true, required: true, options: [
      { value: 'console', labelAr: 'جهاز ألعاب (Console)', labelEn: 'Console' },
      { value: 'game_disc', labelAr: 'شريط / أسطوانة لعبة', labelEn: 'Game Disc / Cartridge' },
      { value: 'controller', labelAr: 'يد تحكم (Controller)', labelEn: 'Controller' },
      { value: 'headset', labelAr: 'سماعة ألعاب', labelEn: 'Gaming Headset' },
      { value: 'steering_wheel', labelAr: 'عجلة قيادة ودواسات', labelEn: 'Steering Wheel / Rig' },
      { value: 'accessory', labelAr: 'إكسسوارات أخرى', labelEn: 'Other Accessory' },
    ]},
    { key: 'storage', labelAr: 'السعة التخزينية', labelEn: 'Storage Capacity', type: 'select', allowOther: true, required: false, options: [
      { value: '500gb', labelAr: '500 GB', labelEn: '500 GB' },
      { value: '825gb_1tb', labelAr: '825 GB / 1 TB', labelEn: '825 GB / 1 TB' },
      { value: '2tb', labelAr: '2 TB', labelEn: '2 TB' },
    ]},
    { key: 'condition', labelAr: 'الحالة', labelEn: 'Condition', type: 'select', allowOther: true, required: true, options: CONDITION_OPTIONS },
    { key: 'includesControllers', labelAr: 'عدد أيادي التحكم المرفقة', labelEn: 'Controllers Included', type: 'number', required: false, placeholder: '2', placeholderAr: '2' },
    { key: 'includesGames', labelAr: 'يشمل ألعاب محملة أو أشرطة', labelEn: 'Includes Games', type: 'boolean', required: false },
    { key: 'gameTitle', labelAr: 'اسم اللعبة (إن كان شريطاً)', labelEn: 'Game Title', type: 'text', required: false, placeholder: 'FIFA 24, Spider-Man 2...', placeholderAr: 'مثال: فيفا 24...' },
    { key: 'region', labelAr: 'المنطقة / Region', labelEn: 'Region', type: 'select', allowOther: true, required: false, options: GAME_REGION },
    { key: 'subscription', labelAr: 'اشتراك مفعّل', labelEn: 'Active Subscription', type: 'select', allowOther: true, required: false, options: [
      { value: 'ps_plus', labelAr: 'PS Plus', labelEn: 'PS Plus' },
      { value: 'xbox_live', labelAr: 'Xbox Live Gold', labelEn: 'Xbox Live' },
      { value: 'game_pass', labelAr: 'Game Pass', labelEn: 'Game Pass' },
      { value: 'none', labelAr: 'بدون', labelEn: 'None' },
    ]},
    { key: 'warranty', labelAr: 'الضمان', labelEn: 'Warranty', type: 'select', allowOther: true, required: false, options: WARRANTY_OPTIONS },
  ],
  cameras: [
    { key: 'cameraType', labelAr: 'نوع الكاميرا', labelEn: 'Camera Type', type: 'select', allowOther: true, required: true, options: [
      { value: 'mirrorless', labelAr: 'ميرورليس احترافية (Mirrorless)', labelEn: 'Mirrorless' },
      { value: 'dslr', labelAr: 'كاميرا احترافية (DSLR)', labelEn: 'DSLR' },
      { value: 'action_cam', labelAr: 'كاميرا أكشن ومغامرات (GoPro/Insta360)', labelEn: 'Action Camera' },
      { value: 'drone', labelAr: 'طائرة تصوير درون (Drone)', labelEn: 'Drone' },
      { value: 'compact', labelAr: 'كاميرا مدمجة (Point & Shoot)', labelEn: 'Compact' },
      { value: 'lens_only', labelAr: 'عدسة فقط (Lens Only)', labelEn: 'Lens Only' },
      { value: 'film', labelAr: 'كاميرا فيلم كلاسيكية', labelEn: 'Film / Vintage' },
    ]},
    { key: 'brand', labelAr: 'الماركة', labelEn: 'Brand', type: 'select', allowOther: true, required: true, options: [
      { value: 'sony', labelAr: 'سوني (Sony)', labelEn: 'Sony' },
      { value: 'canon', labelAr: 'كانون (Canon)', labelEn: 'Canon' },
      { value: 'nikon', labelAr: 'نيكون (Nikon)', labelEn: 'Nikon' },
      { value: 'fujifilm', labelAr: 'فوجي فيلم (Fujifilm)', labelEn: 'Fujifilm' },
      { value: 'dji', labelAr: 'دي جي آي (DJI)', labelEn: 'DJI' },
      { value: 'gopro', labelAr: 'جو برو (GoPro)', labelEn: 'GoPro' },
      { value: 'panasonic', labelAr: 'باناسونيك (Lumix)', labelEn: 'Panasonic Lumix' },
      { value: 'sigma', labelAr: 'سيجما (Sigma)', labelEn: 'Sigma' },
    ]},
    { key: 'model', labelAr: 'الموديل', labelEn: 'Model', type: 'text', required: true, placeholder: 'A7 IV, EOS R6, Mini 4 Pro...', placeholderAr: 'مثال: الفا 7 4، ار 6، ميني 4 برو...' },
    { key: 'megapixels', labelAr: 'دقة الميجابكسل', labelEn: 'Megapixels', type: 'number', required: false, placeholder: '24', placeholderAr: '24' },
    { key: 'videoResolution', labelAr: 'دقة تصوير الفيديو', labelEn: 'Video Resolution', type: 'select', allowOther: true, required: false, options: [
      { value: '4k', labelAr: '4K', labelEn: '4K' },
      { value: '6k_8k', labelAr: '6K / 8K', labelEn: '6K / 8K' },
      { value: '1080p', labelAr: '1080p FHD', labelEn: '1080p FHD' },
    ]},
    { key: 'lensIncluded', labelAr: 'مرفق معها عدسة', labelEn: 'Lens Included', type: 'boolean', required: false },
    { key: 'lensDetails', labelAr: 'تفاصيل العدسة (إن وجدت)', labelEn: 'Lens Details', type: 'text', required: false, placeholder: '24-70mm f/2.8 GM...', placeholderAr: 'مثال: 24-70 ملم f/2.8...' },
    { key: 'shutterCount', labelAr: 'عدد الشتر التقريبي (Shutter Count)', labelEn: 'Shutter Count', type: 'number', required: false, placeholder: '5000', placeholderAr: '5000' },
    { key: 'sensorSize', labelAr: 'حجم المستشعر', labelEn: 'Sensor Size', type: 'select', allowOther: true, required: false, options: SENSOR_SIZE },
    { key: 'stabilization', labelAr: 'تثبيت الصورة', labelEn: 'Image Stabilization', type: 'select', allowOther: true, required: false, options: [
      { value: 'ibis', labelAr: 'IBIS (داخلي)', labelEn: 'IBIS (In-body)' },
      { value: 'ois', labelAr: 'OIS (في العدسة)', labelEn: 'OIS (Lens)' },
      { value: 'none', labelAr: 'بدون', labelEn: 'None' },
    ]},
    { key: 'kitContents', labelAr: 'محتويات العرض', labelEn: 'Kit Contents', type: 'select', multiSelect: true, allowOther: true, required: false, options: CAMERA_KIT_CONTENTS },
    { key: 'condition', labelAr: 'الحالة', labelEn: 'Condition', type: 'select', allowOther: true, required: true, options: CONDITION_OPTIONS },
    { key: 'warranty', labelAr: 'الضمان', labelEn: 'Warranty', type: 'select', allowOther: true, required: false, options: WARRANTY_OPTIONS },
  ],
  'home-appliances': [
    { key: 'applianceType', labelAr: 'نوع الجهاز المنزلي', labelEn: 'Appliance Type', type: 'select', allowOther: true, required: true, options: [
      { value: 'refrigerator', labelAr: 'ثلاجة / فريزر', labelEn: 'Refrigerator / Freezer' },
      { value: 'washing_machine', labelAr: 'غسالة / نشافة ملابس', labelEn: 'Washing Machine / Dryer' },
      { value: 'air_conditioner', labelAr: 'مكيف هواء / سبلت', labelEn: 'Air Conditioner / Split' },
      { value: 'oven_stove', labelAr: 'فرن / غاز / طباخ سطحي', labelEn: 'Oven / Stove' },
      { value: 'dishwasher', labelAr: 'جلاية صحون', labelEn: 'Dishwasher' },
      { value: 'microwave', labelAr: 'مايكرويف / قلاية هوائية', labelEn: 'Microwave / Air Fryer' },
      { value: 'vacuum', labelAr: 'مكنسة كهربائية / روبوت', labelEn: 'Vacuum Cleaner / Robot' },
      { value: 'water_dispenser', labelAr: 'كولر ماء / فلتر', labelEn: 'Water Dispenser / Filter' },
    ]},
    { key: 'brand', labelAr: 'الماركة المصنعة', labelEn: 'Brand', type: 'select', allowOther: true, required: true, options: [
      { value: 'samsung', labelAr: 'سامسونج (Samsung)', labelEn: 'Samsung' },
      { value: 'lg', labelAr: 'إل جي (LG)', labelEn: 'LG' },
      { value: 'bosch', labelAr: 'بوش (Bosch)', labelEn: 'Bosch' },
      { value: 'beko', labelAr: 'بيكو (Beko)', labelEn: 'Beko' },
      { value: 'gree', labelAr: 'جري (Gree)', labelEn: 'Gree' },
      { value: 'haier', labelAr: 'هاير (Haier)', labelEn: 'Haier' },
      { value: 'midea', labelAr: 'ميديا (Midea)', labelEn: 'Midea' },
      { value: 'ariston', labelAr: 'أريستون (Ariston)', labelEn: 'Ariston' },
      { value: 'siemens', labelAr: 'سيمنز (Siemens)', labelEn: 'Siemens' },
      { value: 'dyson', labelAr: 'دايسون (Dyson)', labelEn: 'Dyson' },
    ]},
    { key: 'model', labelAr: 'الموديل أو السعة', labelEn: 'Model / Capacity', type: 'text', required: false, placeholder: '8kg, 18 Cu Ft, 2 Ton...', placeholderAr: 'مثال: 8 كجم، 2 طن إنفرتر...' },
    { key: 'energyRating', labelAr: 'كفاءة الطاقة', labelEn: 'Energy Rating', type: 'select', allowOther: true, required: false, options: [
      { value: 'a_plus', labelAr: 'A+++ / موفر جداً للكهرباء (Inverter)', labelEn: 'A+++ / Inverter' },
      { value: 'a', labelAr: 'فئة A', labelEn: 'Class A' },
      { value: 'b_or_c', labelAr: 'فئة B أو C', labelEn: 'Class B/C' },
    ]},
    { key: 'condition', labelAr: 'الحالة', labelEn: 'Condition', type: 'select', allowOther: true, required: true, options: CONDITION_OPTIONS },
    { key: 'warranty', labelAr: 'الضمان', labelEn: 'Warranty', type: 'select', allowOther: true, required: false, options: WARRANTY_OPTIONS },
    { key: 'dimensions', labelAr: 'الأبعاد التقريبية', labelEn: 'Dimensions', type: 'text', required: false, placeholder: 'H x W x D in cm', placeholderAr: 'الارتفاع × العرض × العمق (سم)' },
    { key: 'capacity', labelAr: 'السعة (لتر / كجم / طن)', labelEn: 'Capacity (L / kg / Ton)', type: 'text', required: false, placeholder: '500L / 8kg / 2 Ton', placeholderAr: 'مثال: 500 لتر، 8 كجم، 2 طن' },
    { key: 'installationIncluded', labelAr: 'التوصيل والتركيب متوفر', labelEn: 'Installation Available', type: 'boolean', required: false },
  ],
};
