import type { CategoryFieldMap, ListingFieldOption } from './types';

const COMPUTER_BRANDS: ListingFieldOption[] = [
  { value: 'apple', labelAr: 'أبل (Apple)', labelEn: 'Apple' },
  { value: 'dell', labelAr: 'ديل (Dell)', labelEn: 'Dell' },
  { value: 'hp', labelAr: 'إتش بي (HP)', labelEn: 'HP' },
  { value: 'lenovo', labelAr: 'لينوفو (Lenovo)', labelEn: 'Lenovo' },
  { value: 'asus', labelAr: 'أسوس (Asus)', labelEn: 'Asus' },
  { value: 'acer', labelAr: 'أيسر (Acer)', labelEn: 'Acer' },
  { value: 'msi', labelAr: 'إم إس آي (MSI)', labelEn: 'MSI' },
  { value: 'microsoft', labelAr: 'مايكروسوفت (Microsoft)', labelEn: 'Microsoft' },
  { value: 'razer', labelAr: 'ريزر (Razer)', labelEn: 'Razer' },
  { value: 'samsung', labelAr: 'سامسونج (Samsung)', labelEn: 'Samsung' },
  { value: 'custom', labelAr: 'تجميع مخصص (Custom Built)', labelEn: 'Custom Built' },
];

const CPU_OPTIONS: ListingFieldOption[] = [
  { value: 'intel_i3', labelAr: 'Intel Core i3', labelEn: 'Intel Core i3' },
  { value: 'intel_i5', labelAr: 'Intel Core i5', labelEn: 'Intel Core i5' },
  { value: 'intel_i7', labelAr: 'Intel Core i7', labelEn: 'Intel Core i7' },
  { value: 'intel_i9', labelAr: 'Intel Core i9', labelEn: 'Intel Core i9' },
  { value: 'intel_core_ultra', labelAr: 'Intel Core Ultra', labelEn: 'Intel Core Ultra' },
  { value: 'ryzen_3', labelAr: 'AMD Ryzen 3', labelEn: 'AMD Ryzen 3' },
  { value: 'ryzen_5', labelAr: 'AMD Ryzen 5', labelEn: 'AMD Ryzen 5' },
  { value: 'ryzen_7', labelAr: 'AMD Ryzen 7', labelEn: 'AMD Ryzen 7' },
  { value: 'ryzen_9', labelAr: 'AMD Ryzen 9', labelEn: 'AMD Ryzen 9' },
  { value: 'apple_m1', labelAr: 'Apple M1 (Pro / Max)', labelEn: 'Apple M1' },
  { value: 'apple_m2', labelAr: 'Apple M2 (Pro / Max)', labelEn: 'Apple M2' },
  { value: 'apple_m3', labelAr: 'Apple M3 (Pro / Max)', labelEn: 'Apple M3' },
  { value: 'apple_m4', labelAr: 'Apple M4', labelEn: 'Apple M4' },
];

const RAM_OPTIONS: ListingFieldOption[] = [
  { value: '4gb', labelAr: '4 جيجابايت', labelEn: '4 GB' },
  { value: '8gb', labelAr: '8 جيجابايت', labelEn: '8 GB' },
  { value: '16gb', labelAr: '16 جيجابايت', labelEn: '16 GB' },
  { value: '32gb', labelAr: '32 جيجابايت', labelEn: '32 GB' },
  { value: '64gb', labelAr: '64 جيجابايت', labelEn: '64 GB' },
  { value: '128gb', labelAr: '128 جيجابايت', labelEn: '128 GB' },
];

const STORAGE_OPTIONS: ListingFieldOption[] = [
  { value: '128gb_ssd', labelAr: '128 GB SSD', labelEn: '128 GB SSD' },
  { value: '256gb_ssd', labelAr: '256 GB SSD', labelEn: '256 GB SSD' },
  { value: '512gb_ssd', labelAr: '512 GB SSD', labelEn: '512 GB SSD' },
  { value: '1tb_ssd', labelAr: '1 TB SSD', labelEn: '1 TB SSD' },
  { value: '2tb_ssd', labelAr: '2 TB SSD', labelEn: '2 TB SSD' },
  { value: '1tb_hdd', labelAr: '1 TB HDD', labelEn: '1 TB HDD' },
  { value: 'dual_storage', labelAr: 'مزدوج (SSD + HDD)', labelEn: 'SSD + HDD' },
];

const SCREEN_SIZE_OPTIONS: ListingFieldOption[] = [
  { value: '11_inch', labelAr: '11 بوصة أو أقل', labelEn: '11" or less' },
  { value: '13_inch', labelAr: '13 بوصة', labelEn: '13"' },
  { value: '14_inch', labelAr: '14 بوصة', labelEn: '14"' },
  { value: '15_inch', labelAr: '15.6 بوصة', labelEn: '15.6"' },
  { value: '16_inch', labelAr: '16 بوصة', labelEn: '16"' },
  { value: '17_inch', labelAr: '17 بوصة فما فوق', labelEn: '17"+' },
];

const GPU_OPTIONS: ListingFieldOption[] = [
  { value: 'integrated', labelAr: 'مدمج (Intel UHD / Iris / AMD Radeon)', labelEn: 'Integrated' },
  { value: 'gtx_1650', labelAr: 'NVIDIA GTX 1650', labelEn: 'GTX 1650' },
  { value: 'rtx_3050', labelAr: 'NVIDIA RTX 3050', labelEn: 'RTX 3050' },
  { value: 'rtx_3060', labelAr: 'NVIDIA RTX 3060', labelEn: 'RTX 3060' },
  { value: 'rtx_4060', labelAr: 'NVIDIA RTX 4060', labelEn: 'RTX 4060' },
  { value: 'rtx_4070', labelAr: 'NVIDIA RTX 4070', labelEn: 'RTX 4070' },
  { value: 'rtx_4080_4090', labelAr: 'NVIDIA RTX 4080 / 4090', labelEn: 'RTX 4080 / 4090' },
  { value: 'amd_rx', labelAr: 'AMD Radeon RX Series', labelEn: 'AMD RX Series' },
  { value: 'apple_silicon_gpu', labelAr: 'Apple GPU مدمج', labelEn: 'Apple Silicon GPU' },
];

const OS_OPTIONS: ListingFieldOption[] = [
  { value: 'win11', labelAr: 'Windows 11', labelEn: 'Windows 11' },
  { value: 'win10', labelAr: 'Windows 10', labelEn: 'Windows 10' },
  { value: 'macos', labelAr: 'macOS', labelEn: 'macOS' },
  { value: 'linux', labelAr: 'Linux / Ubuntu', labelEn: 'Linux / Ubuntu' },
  { value: 'chromeos', labelAr: 'Chrome OS', labelEn: 'Chrome OS' },
  { value: 'none', labelAr: 'بدون نظام (DOS)', labelEn: 'No OS / DOS' },
];

const CONDITION_OPTIONS: ListingFieldOption[] = [
  { value: 'new', labelAr: 'جديد بالكرتونة', labelEn: 'Brand New' },
  { value: 'open_box', labelAr: 'مفتوح للتجربة كرتونة كاملة', labelEn: 'Open Box' },
  { value: 'excellent', labelAr: 'مستعمل ممتاز', labelEn: 'Excellent' },
  { value: 'good', labelAr: 'مستعمل جيد', labelEn: 'Good' },
  { value: 'fair', labelAr: 'مستعمل مقبول', labelEn: 'Fair' },
];

const WARRANTY_OPTIONS: ListingFieldOption[] = [
  { value: 'official', labelAr: 'ضمان وكيل ساري', labelEn: 'Official Warranty' },
  { value: 'store', labelAr: 'ضمان محل', labelEn: 'Store Warranty' },
  { value: 'expired', labelAr: 'منتهي الضمان', labelEn: 'Expired' },
];

const COLOR_OPTIONS: ListingFieldOption[] = [
  { value: 'grey', labelAr: 'رمادي / Space Grey', labelEn: 'Space Grey / Grey' },
  { value: 'silver', labelAr: 'فضي', labelEn: 'Silver' },
  { value: 'black', labelAr: 'أسود', labelEn: 'Black' },
  { value: 'white', labelAr: 'أبيض', labelEn: 'White' },
  { value: 'blue', labelAr: 'أزرق', labelEn: 'Blue' },
];

const SELLER_TYPE: ListingFieldOption[] = [
  { value: 'owner', labelAr: 'مالك', labelEn: 'Owner' },
  { value: 'broker', labelAr: 'وسيط', labelEn: 'Broker' },
  { value: 'shop', labelAr: 'محل تجاري', labelEn: 'Shop / Store' },
];

const ASPECT_RATIO: ListingFieldOption[] = [
  { value: '16_9', labelAr: '16:9 قياسي', labelEn: '16:9 Standard' },
  { value: '21_9', labelAr: '21:9 Ultrawide', labelEn: '21:9 Ultrawide' },
  { value: '32_9', labelAr: '32:9 Super Ultrawide', labelEn: '32:9 Super Ultrawide' },
  { value: '4_3', labelAr: '4:3 قديم', labelEn: '4:3 Legacy' },
];

const PCIE_GEN: ListingFieldOption[] = [
  { value: 'pcie_3', labelAr: 'PCIe 3.0', labelEn: 'PCIe 3.0' },
  { value: 'pcie_4', labelAr: 'PCIe 4.0', labelEn: 'PCIe 4.0' },
  { value: 'pcie_5', labelAr: 'PCIe 5.0', labelEn: 'PCIe 5.0' },
  { value: 'sata', labelAr: 'SATA', labelEn: 'SATA' },
  { value: 'nvme', labelAr: 'NVMe M.2', labelEn: 'NVMe M.2' },
];

const KEY_SWITCH: ListingFieldOption[] = [
  { value: 'mechanical_red', labelAr: 'ميكانيكي أحمر (خطي)', labelEn: 'Mechanical Red (Linear)' },
  { value: 'mechanical_blue', labelAr: 'ميكانيكي أزرق (صوتي)', labelEn: 'Mechanical Blue (Clicky)' },
  { value: 'mechanical_brown', labelAr: 'ميكانيكي بني (تكتيلي)', labelEn: 'Mechanical Brown (Tactile)' },
  { value: 'membrane', labelAr: 'غشائي (Membrane)', labelEn: 'Membrane' },
  { value: 'scissor', labelAr: 'مقصي (Scissor / Laptop)', labelEn: 'Scissor / Laptop' },
];

export const COMPUTERS_FIELDS: CategoryFieldMap = {
  laptops: [
    { key: 'brand', labelAr: 'الماركة', labelEn: 'Brand', type: 'select', allowOther: true, required: true, options: COMPUTER_BRANDS },
    { key: 'model', labelAr: 'الموديل', labelEn: 'Model', type: 'text', required: true, placeholder: 'MacBook Pro, ThinkPad X1, XPS 15...', placeholderAr: 'مثال: ماك بوك برو، ثينك باد...' },
    { key: 'cpu', labelAr: 'المعالج (CPU)', labelEn: 'Processor', type: 'select', allowOther: true, required: true, options: CPU_OPTIONS },
    { key: 'ram', labelAr: 'حجم الرام', labelEn: 'RAM Size', type: 'select', allowOther: true, required: true, options: RAM_OPTIONS },
    { key: 'storage', labelAr: 'نوع وحجم التخزين', labelEn: 'Storage', type: 'select', allowOther: true, required: true, options: STORAGE_OPTIONS },
    { key: 'screenSize', labelAr: 'حجم الشاشة', labelEn: 'Screen Size', type: 'select', allowOther: true, required: false, options: SCREEN_SIZE_OPTIONS },
    { key: 'gpu', labelAr: 'كرت الشاشة (GPU)', labelEn: 'Graphics Card', type: 'select', allowOther: true, required: false, options: GPU_OPTIONS },
    { key: 'os', labelAr: 'نظام التشغيل', labelEn: 'Operating System', type: 'select', allowOther: true, required: false, options: OS_OPTIONS },
    { key: 'battery', labelAr: 'صحة البطارية', labelEn: 'Battery Condition', type: 'select', allowOther: true, required: false, options: [
      { value: 'excellent', labelAr: 'ممتازة (4+ ساعات)', labelEn: 'Excellent (4+ hrs)' },
      { value: 'good', labelAr: 'جيدة (2-4 ساعات)', labelEn: 'Good (2-4 hrs)' },
      { value: 'fair', labelAr: 'متوسطة (ساعة - ساعتين)', labelEn: 'Fair (1-2 hrs)' },
      { value: 'plugged_only', labelAr: 'تعمل بالشاحن فقط', labelEn: 'Plugged In Only' },
    ]},
    { key: 'condition', labelAr: 'الحالة', labelEn: 'Condition', type: 'select', allowOther: true, required: true, options: CONDITION_OPTIONS },
    { key: 'color', labelAr: 'اللون', labelEn: 'Color', type: 'select', allowOther: true, required: false, options: COLOR_OPTIONS },
    { key: 'warranty', labelAr: 'الضمان', labelEn: 'Warranty', type: 'select', allowOther: true, required: false, options: WARRANTY_OPTIONS },
    { key: 'age', labelAr: 'مدة الاستخدام (سنوات)', labelEn: 'Age (Years)', type: 'number', required: false, placeholder: '1', placeholderAr: '1' },
    { key: 'original', labelAr: 'الأصالة', labelEn: 'Authenticity', type: 'select', allowOther: true, required: false, options: [
      { value: 'original', labelAr: 'أصلي بالكامل', labelEn: 'Original' },
      { value: 'refurbished', labelAr: 'مجدد معتمد', labelEn: 'Refurbished' },
    ]},
    { key: 'touchscreen', labelAr: 'شاشة لمس', labelEn: 'Touchscreen', type: 'boolean', required: false },
    { key: 'backlitKeyboard', labelAr: 'كيبورد مضيء', labelEn: 'Backlit Keyboard', type: 'boolean', required: false },
    { key: 'sellerType', labelAr: 'نوع البائع', labelEn: 'Seller Type', type: 'select', allowOther: true, required: false, options: SELLER_TYPE },
    { key: 'negotiable', labelAr: 'قابل للتفاوض', labelEn: 'Negotiable', type: 'boolean', required: false },
  ],
  desktops: [
    { key: 'brand', labelAr: 'الماركة / التجميع', labelEn: 'Brand / Custom', type: 'select', allowOther: true, required: true, options: COMPUTER_BRANDS },
    { key: 'model', labelAr: 'الموديل / اسم التجميعة', labelEn: 'Model / Setup', type: 'text', required: false, placeholder: 'OptiPlex, iMac, Gaming Rig...', placeholderAr: 'مثال: تجميعة ألعاب، آي ماك...' },
    { key: 'cpu', labelAr: 'المعالج (CPU)', labelEn: 'Processor', type: 'select', allowOther: true, required: true, options: CPU_OPTIONS },
    { key: 'ram', labelAr: 'حجم الرام', labelEn: 'RAM Size', type: 'select', allowOther: true, required: true, options: RAM_OPTIONS },
    { key: 'storage', labelAr: 'التخزين', labelEn: 'Storage', type: 'select', allowOther: true, required: true, options: STORAGE_OPTIONS },
    { key: 'gpu', labelAr: 'كرت الشاشة', labelEn: 'GPU', type: 'select', allowOther: true, required: false, options: GPU_OPTIONS },
    { key: 'os', labelAr: 'نظام التشغيل', labelEn: 'OS', type: 'select', allowOther: true, required: false, options: OS_OPTIONS },
    { key: 'usageType', labelAr: 'الاستخدام الأساسي', labelEn: 'Usage Type', type: 'select', allowOther: true, required: false, options: [
      { value: 'gaming', labelAr: 'ألعاب وبث مباشر', labelEn: 'Gaming & Streaming' },
      { value: 'workstation', labelAr: 'مونتاج وتصميم 3D', labelEn: 'Workstation / Design' },
      { value: 'office', labelAr: 'مكتبي ودراسي', labelEn: 'Office / Study' },
    ]},
    { key: 'condition', labelAr: 'الحالة', labelEn: 'Condition', type: 'select', allowOther: true, required: true, options: CONDITION_OPTIONS },
    { key: 'warranty', labelAr: 'الضمان', labelEn: 'Warranty', type: 'select', allowOther: true, required: false, options: WARRANTY_OPTIONS },
    { key: 'original', labelAr: 'الأصالة', labelEn: 'Originality', type: 'select', allowOther: true, required: false, options: [
      { value: 'original', labelAr: 'أصلي', labelEn: 'Original' },
      { value: 'custom', labelAr: 'تجميع محلي', labelEn: 'Custom Assembly' },
    ]},
    { key: 'formFactor', labelAr: 'الشكل الفيزيائي', labelEn: 'Form Factor', type: 'select', allowOther: true, required: false, options: [
      { value: 'tower', labelAr: 'برج (Tower)', labelEn: 'Tower' },
      { value: 'mini', labelAr: 'ميني / SFF', labelEn: 'Mini / SFF' },
      { value: 'aio', labelAr: 'الكل في واحد (AIO)', labelEn: 'All-in-One' },
    ]},
    { key: 'sellerType', labelAr: 'نوع البائع', labelEn: 'Seller Type', type: 'select', allowOther: true, required: false, options: SELLER_TYPE },
    { key: 'negotiable', labelAr: 'قابل للتفاوض', labelEn: 'Negotiable', type: 'boolean', required: false },
  ],
  screens: [
    { key: 'brand', labelAr: 'الماركة', labelEn: 'Brand', type: 'select', allowOther: true, required: true, options: [
      { value: 'samsung', labelAr: 'سامسونج', labelEn: 'Samsung' },
      { value: 'lg', labelAr: 'إل جي', labelEn: 'LG' },
      { value: 'dell', labelAr: 'ديل', labelEn: 'Dell' },
      { value: 'asus', labelAr: 'أسوس', labelEn: 'Asus' },
      { value: 'benq', labelAr: 'بينكيو', labelEn: 'BenQ' },
      { value: 'acer', labelAr: 'أيسر', labelEn: 'Acer' },
      { value: 'msi', labelAr: 'إم إس آي', labelEn: 'MSI' },
      { value: 'viewsonic', labelAr: 'فيوسونيك', labelEn: 'ViewSonic' },
    ]},
    { key: 'model', labelAr: 'الموديل', labelEn: 'Model', type: 'text', required: false, placeholder: 'Odyssey G7, UltraSharp...', placeholderAr: 'مثال: أوديسي، ألترا شارب...' },
    { key: 'screenSize', labelAr: 'حجم الشاشة (بوصة)', labelEn: 'Screen Size (inch)', type: 'select', allowOther: true, required: true, options: [
      { value: '22', labelAr: '22 بوصة أو أصغر', labelEn: '22" or smaller' },
      { value: '24', labelAr: '24 بوصة', labelEn: '24"' },
      { value: '27', labelAr: '27 بوصة', labelEn: '27"' },
      { value: '32', labelAr: '32 بوصة', labelEn: '32"' },
      { value: '34_plus', labelAr: '34 بوصة فأكبر (Ultrawide)', labelEn: '34"+ Ultrawide' },
    ]},
    { key: 'resolution', labelAr: 'دقة العرض', labelEn: 'Resolution', type: 'select', allowOther: true, required: true, options: [
      { value: 'fhd', labelAr: '1080p Full HD', labelEn: '1080p FHD' },
      { value: '2k', labelAr: '2K QHD (1440p)', labelEn: '2K QHD' },
      { value: '4k', labelAr: '4K UHD', labelEn: '4K UHD' },
    ]},
    { key: 'refreshRate', labelAr: 'معدل التحديث (Hz)', labelEn: 'Refresh Rate', type: 'select', allowOther: true, required: false, options: [
      { value: '60hz', labelAr: '60Hz - 75Hz', labelEn: '60Hz - 75Hz' },
      { value: '144hz', labelAr: '144Hz', labelEn: '144Hz' },
      { value: '165hz', labelAr: '165Hz - 180Hz', labelEn: '165Hz - 180Hz' },
      { value: '240hz_plus', labelAr: '240Hz+', labelEn: '240Hz+' },
    ]},
    { key: 'panelType', labelAr: 'نوع اللوحة', labelEn: 'Panel Type', type: 'select', allowOther: true, required: false, options: [
      { value: 'ips', labelAr: 'IPS (ألوان وزوايا واسعة)', labelEn: 'IPS' },
      { value: 'va', labelAr: 'VA (تباين عالي)', labelEn: 'VA' },
      { value: 'oled', labelAr: 'OLED (سواد مطلق واستجابة فائقة)', labelEn: 'OLED' },
      { value: 'tn', labelAr: 'TN', labelEn: 'TN' },
    ]},
    { key: 'curved', labelAr: 'شاشة منحنية (Curved)', labelEn: 'Curved Screen', type: 'boolean', required: false },
    { key: 'ports', labelAr: 'المنافذ المتوفرة', labelEn: 'Ports', type: 'select', allowOther: true, multiSelect: true, required: false, options: [
      { value: 'hdmi', labelAr: 'HDMI', labelEn: 'HDMI' },
      { value: 'dp', labelAr: 'DisplayPort', labelEn: 'DisplayPort' },
      { value: 'usbc', labelAr: 'USB-C / Thunderbolt', labelEn: 'USB-C / Thunderbolt' },
      { value: 'vga', labelAr: 'VGA / DVI', labelEn: 'VGA / DVI' },
    ]},
    { key: 'condition', labelAr: 'الحالة', labelEn: 'Condition', type: 'select', allowOther: true, required: true, options: CONDITION_OPTIONS },
    { key: 'warranty', labelAr: 'الضمان', labelEn: 'Warranty', type: 'select', allowOther: true, required: false, options: WARRANTY_OPTIONS },
    { key: 'hdr', labelAr: 'دعم HDR', labelEn: 'HDR Support', type: 'boolean', required: false },
    { key: 'aspectRatio', labelAr: 'نسبة العرض للارتفاع', labelEn: 'Aspect Ratio', type: 'select', allowOther: true, required: false, options: ASPECT_RATIO },
    { key: 'sellerType', labelAr: 'نوع البائع', labelEn: 'Seller Type', type: 'select', allowOther: true, required: false, options: SELLER_TYPE },
    { key: 'negotiable', labelAr: 'قابل للتفاوض', labelEn: 'Negotiable', type: 'boolean', required: false },
  ],
  'parts-pc': [
    { key: 'partType', labelAr: 'نوع القطعة', labelEn: 'Part Type', type: 'select', allowOther: true, required: true, options: [
      { value: 'gpu', labelAr: 'كرت شاشة (GPU)', labelEn: 'Graphics Card (GPU)' },
      { value: 'cpu', labelAr: 'معالج (CPU)', labelEn: 'Processor (CPU)' },
      { value: 'ram', labelAr: 'ذاكرة رام (RAM)', labelEn: 'Memory (RAM)' },
      { value: 'motherboard', labelAr: 'لوحة أم (Motherboard)', labelEn: 'Motherboard' },
      { value: 'psu', labelAr: 'مزود طاقة (PSU)', labelEn: 'Power Supply (PSU)' },
      { value: 'storage', labelAr: 'تخزين (SSD / M.2 / HDD)', labelEn: 'Storage (SSD/HDD)' },
      { value: 'case', labelAr: 'كيس كمبيوتر (Case)', labelEn: 'PC Case' },
      { value: 'cooling', labelAr: 'تبريد مائي / هوائي', labelEn: 'Cooling / AIO' },
    ]},
    { key: 'brand', labelAr: 'الماركة المصنعة', labelEn: 'Brand', type: 'text', required: true, placeholder: 'Asus, Corsair, MSI, Kingston...', placeholderAr: 'مثال: أسوس، كورسير، إم إس آي...' },
    { key: 'model', labelAr: 'الموديل والمواصفات', labelEn: 'Model & Specs', type: 'text', required: true, placeholder: 'RTX 3070 Ti, DDR5 32GB 6000MHz...', placeholderAr: 'مثال: 32 جيجا رام DDR5 6000MHz...' },
    { key: 'condition', labelAr: 'الحالة', labelEn: 'Condition', type: 'select', allowOther: true, required: true, options: CONDITION_OPTIONS },
    { key: 'warranty', labelAr: 'الضمان', labelEn: 'Warranty', type: 'select', allowOther: true, required: false, options: WARRANTY_OPTIONS },
    { key: 'original', labelAr: 'الأصالة مع الصندوق الأصلي', labelEn: 'Authenticity & Box', type: 'select', allowOther: true, required: false, options: [
      { value: 'original_box', labelAr: 'أصلي بالكرتونة', labelEn: 'Original with Box' },
      { value: 'without_box', labelAr: 'أصلي بدون كرتونة', labelEn: 'Original without Box' },
    ]},
    { key: 'interfaceType', labelAr: 'واجهة الاتصال', labelEn: 'Interface', type: 'select', allowOther: true, required: false, options: PCIE_GEN },
    { key: 'sellerType', labelAr: 'نوع البائع', labelEn: 'Seller Type', type: 'select', allowOther: true, required: false, options: SELLER_TYPE },
    { key: 'negotiable', labelAr: 'قابل للتفاوض', labelEn: 'Negotiable', type: 'boolean', required: false },
  ],
  'accessories-pc': [
    { key: 'accessoryType', labelAr: 'نوع الملحق', labelEn: 'Accessory Type', type: 'select', allowOther: true, required: true, options: [
      { value: 'keyboard', labelAr: 'كيبورد ميكانيكي / عادي', labelEn: 'Keyboard' },
      { value: 'mouse', labelAr: 'ماوس ألعاب / مكتبي', labelEn: 'Mouse' },
      { value: 'headset', labelAr: 'سماعة رأس مع مايك', labelEn: 'Headset' },
      { value: 'webcam', labelAr: 'كاميرا ويب (Webcam)', labelEn: 'Webcam' },
      { value: 'dock', labelAr: 'قاعدة توصيل / Hub USB-C', labelEn: 'Docking Station / Hub' },
      { value: 'mousepad', labelAr: 'ماوس باد كبير / مكتبي', labelEn: 'Mousepad' },
      { value: 'speakers', labelAr: 'سماعات خارجية (Desktop Speakers)', labelEn: 'Desktop Speakers' },
    ]},
    { key: 'brand', labelAr: 'الماركة', labelEn: 'Brand', type: 'text', required: false, placeholder: 'Logitech, Razer, HyperX...', placeholderAr: 'مثال: لوجيتك، ريزر، هايبر اكس...' },
    { key: 'connectionType', labelAr: 'نوع التوصيل', labelEn: 'Connectivity', type: 'select', allowOther: true, required: false, options: [
      { value: 'wireless', labelAr: 'لاسلكي (Wireless 2.4GHz)', labelEn: 'Wireless 2.4GHz' },
      { value: 'bluetooth', labelAr: 'بلوتوث (Bluetooth)', labelEn: 'Bluetooth' },
      { value: 'wired', labelAr: 'سلكي (USB)', labelEn: 'Wired USB' },
    ]},
    { key: 'condition', labelAr: 'الحالة', labelEn: 'Condition', type: 'select', allowOther: true, required: true, options: CONDITION_OPTIONS },
    { key: 'color', labelAr: 'اللون', labelEn: 'Color', type: 'select', allowOther: true, required: false, options: COLOR_OPTIONS },
    { key: 'warranty', labelAr: 'الضمان', labelEn: 'Warranty', type: 'select', allowOther: true, required: false, options: WARRANTY_OPTIONS },
    { key: 'keySwitch', labelAr: 'نوع السويتش (للكيبورد)', labelEn: 'Key Switch Type', type: 'select', allowOther: true, required: false, options: KEY_SWITCH },
    { key: 'dpi', labelAr: 'دقة الماوس DPI', labelEn: 'Mouse DPI', type: 'number', required: false, placeholder: '16000', placeholderAr: '16000' },
    { key: 'sellerType', labelAr: 'نوع البائع', labelEn: 'Seller Type', type: 'select', allowOther: true, required: false, options: SELLER_TYPE },
    { key: 'negotiable', labelAr: 'قابل للتفاوض', labelEn: 'Negotiable', type: 'boolean', required: false },
  ],
};
