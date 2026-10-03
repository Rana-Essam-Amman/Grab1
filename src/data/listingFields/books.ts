import type { CategoryFieldMap, ListingFieldOption } from './types';

const BOOK_CONDITIONS: ListingFieldOption[] = [
  { value: 'new', labelAr: 'جديد تماماً غير مستعمل', labelEn: 'Brand New' },
  { value: 'like_new', labelAr: 'مستعمل بحالة ممتازة وبدون كتابة وتحديد', labelEn: 'Like New' },
  { value: 'good', labelAr: 'مستعمل نظيف وبحالة جيدة', labelEn: 'Good' },
  { value: 'fair', labelAr: 'مستعمل به علامات قراءة أو ملاحظات', labelEn: 'Fair / Readable' },
];

const LANGUAGE_OPTIONS: ListingFieldOption[] = [
  { value: 'arabic', labelAr: 'اللغة العربية', labelEn: 'Arabic' },
  { value: 'english', labelAr: 'اللغة الإنجليزية', labelEn: 'English' },
  { value: 'french', labelAr: 'اللغة الفرنسية', labelEn: 'French' },
  { value: 'other', labelAr: 'لغات أخرى', labelEn: 'Other Languages' },
];

export const BOOKS_FIELDS: CategoryFieldMap = {
  'books-magazines': [
    { key: 'bookType', labelAr: 'نوع المطبوعة', labelEn: 'Publication Type', type: 'select', allowOther: true, required: true, options: [
      { value: 'novel_story', labelAr: 'رواية أو قصة أدبية', labelEn: 'Novel / Fiction' },
      { value: 'academic_textbook', labelAr: 'كتاب جامعي أو مرجع دراسي', labelEn: 'Textbook / Academic' },
      { value: 'religious_islamic', labelAr: 'كتب دينية وإسلامية ومصاحف', labelEn: 'Religious / Islamic' },
      { value: 'self_help_business', labelAr: 'تطوير ذات وإدارة أعمال ومال', labelEn: 'Self-Help & Business' },
      { value: 'history_politics', labelAr: 'تاريخ وسياسة وسير ذاتية', labelEn: 'History & Politics' },
      { value: 'encyclopedia_set', labelAr: 'موسوعة أو مجلدات كاملة', labelEn: 'Encyclopedia / Multi-Volume' },
      { value: 'magazine_comics', labelAr: 'مجلة أو قصص مصورة (كوميكس / مانجا)', labelEn: 'Magazine / Manga / Comics' },
      { value: 'kids_books', labelAr: 'كتب وقصص أطفال وتعليم مبكر', labelEn: 'Kids Books' },
    ]},
    { key: 'title', labelAr: 'عنوان الكتاب / المرجع', labelEn: 'Book Title', type: 'text', required: true, placeholder: 'Book Title...', placeholderAr: 'اسم الكتاب بدقة...' },
    { key: 'author', labelAr: 'اسم الكاتب أو المؤلف', labelEn: 'Author / Writer', type: 'text', required: false, placeholder: 'Author Name', placeholderAr: 'اسم المؤلف أو دار النشر...' },
    { key: 'language', labelAr: 'لغة الكتاب', labelEn: 'Language', type: 'select', allowOther: true, required: true, options: LANGUAGE_OPTIONS },
    { key: 'condition', labelAr: 'الحالة', labelEn: 'Condition', type: 'select', allowOther: true, required: true, options: BOOK_CONDITIONS },
    { key: 'pages', labelAr: 'عدد الصفحات التقريبي', labelEn: 'Pages Count', type: 'number', required: false, placeholder: '350', placeholderAr: '350' },
    { key: 'yearPublished', labelAr: 'سنة الطباعة / دار النشر', labelEn: 'Year / Publisher', type: 'text', required: false, placeholder: '2023, Dar Al Shorouk...', placeholderAr: 'مثال: 2023، دار الشروق...' },
  ],
  instruments: [
    { key: 'instrumentType', labelAr: 'نوع الآلة الموسيقية', labelEn: 'Instrument Type', type: 'select', allowOther: true, required: true, options: [
      { value: 'oud', labelAr: 'عود شرقي (احترافي / تعليمي)', labelEn: 'Arabic Oud' },
      { value: 'piano_keyboard', labelAr: 'بيانو / أورج كهربائي (Keyboard / Synthesizer)', labelEn: 'Piano / Keyboard' },
      { value: 'guitar_acoustic', labelAr: 'جيتار كلاسيك أو أكوستيك (Acoustic Guitar)', labelEn: 'Acoustic / Classical Guitar' },
      { value: 'guitar_electric', labelAr: 'جيتار كهربائي أو بيس (Electric / Bass Guitar)', labelEn: 'Electric / Bass Guitar' },
      { value: 'violin', labelAr: 'كمان / تشيللو (Violin / Cello)', labelEn: 'Violin / Cello' },
      { value: 'drums_percussion', labelAr: 'درمز / طبلة / دربوكة وإيقاعات', labelEn: 'Drums & Percussion' },
      { value: 'wind_flute_nay', labelAr: 'ناي / ساكسفون / فلوت / بوق', labelEn: 'Saxophone / Flute / Nay' },
      { value: 'qanun', labelAr: 'قانون شرقي', labelEn: 'Qanun' },
    ]},
    { key: 'brand', labelAr: 'الماركة أو الصانع', labelEn: 'Brand / Luthier', type: 'text', required: false, placeholder: 'Yamaha, Roland, Fender, Gibson, Zeryab...', placeholderAr: 'مثال: ياماها، رولاند، زرياب...' },
    { key: 'level', labelAr: 'المستوى المناسب', labelEn: 'Target Level', type: 'select', allowOther: true, required: false, options: [
      { value: 'beginner', labelAr: 'للمبتدئين والتعلم', labelEn: 'Beginner' },
      { value: 'intermediate', labelAr: 'متوسط', labelEn: 'Intermediate' },
      { value: 'professional', labelAr: 'احترافي واستوديوهات وحفلات', labelEn: 'Professional / Studio' },
    ]},
    { key: 'condition', labelAr: 'الحالة وتناغم الأوتار والصوت', labelEn: 'Condition & Tuning', type: 'select', allowOther: true, required: true, options: [
      { value: 'new', labelAr: 'جديدة بالكرتونة', labelEn: 'Brand New' },
      { value: 'excellent', labelAr: 'ممتازة ومعايرة بالكامل', labelEn: 'Excellent & Tuned' },
      { value: 'good', labelAr: 'جيدة جداً وجاهزة للعزف', labelEn: 'Good' },
      { value: 'needs_strings', labelAr: 'تحتاج تغيير أوتار فقط', labelEn: 'Needs New Strings' },
    ]},
    { key: 'accessories', labelAr: 'الملحقات المرفقة (شنطة، حامل، أمبليفاير...)', labelEn: 'Accessories (Bag, Stand, Amp...)', type: 'text', required: false, placeholder: 'Hard case, Stand, Amp...', placeholderAr: 'مثال: شنطة مبطنة، ستاند، كابلات...' },
    { key: 'age', labelAr: 'عمر الآلة (بالسنوات)', labelEn: 'Age (Years)', type: 'number', required: false, placeholder: '2', placeholderAr: '2' },
  ],
  antiques: [
    { key: 'antiqueType', labelAr: 'نوع التحفة أو الأنتيك', labelEn: 'Collectible Type', type: 'select', allowOther: true, required: true, options: [
      { value: 'coins_banknotes', labelAr: 'عملات ورقية ومعدنية قديمة ونادرة', labelEn: 'Coins & Banknotes' },
      { value: 'stamps', labelAr: 'طوابع بريد تاريخية وتذكارية', labelEn: 'Postage Stamps' },
      { value: 'copper_brass', labelAr: 'نحاسيات وفضيات ودلال قهوة قديمة', labelEn: 'Copper, Brass & Dallah' },
      { value: 'vintage_clock', labelAr: 'ساعات حائط أو جيب أنتيك', labelEn: 'Vintage Clock / Pocket Watch' },
      { value: 'swords_daggers', labelAr: 'سيوف وخناجر وجنابي تراثية', labelEn: 'Traditional Daggers & Swords' },
      { value: 'gramophone_radio', labelAr: 'جرامافون وراديو وأسطوانات بيك آب', labelEn: 'Gramophone & Vinyl' },
      { value: 'antique_furniture', labelAr: 'قطع أثاث عثماني أو أوروبي أثري', labelEn: 'Antique Furniture' },
    ]},
    { key: 'eraAge', labelAr: 'العمر التقريبي أو العصر التاريخي', labelEn: 'Estimated Era / Age', type: 'text', required: false, placeholder: 'Ottoman era, 1940s, 70 years old...', placeholderAr: 'مثال: العصر العثماني، السبعينات، 80 سنة...' },
    { key: 'material', labelAr: 'المادة المصنعة', labelEn: 'Material', type: 'select', allowOther: true, required: false, options: [
      { value: 'solid_brass_copper', labelAr: 'نحاس أحمر / أصفر خالص', labelEn: 'Brass / Copper' },
      { value: 'silver', labelAr: 'فضة قديمة معتمدة', labelEn: 'Silver' },
      { value: 'natural_wood', labelAr: 'خشب طبيعي معتق ومحفور', labelEn: 'Carved Wood' },
      { value: 'ceramic_porcelain', labelAr: 'خزف وسيراميك وبورسلان', labelEn: 'Porcelain / Ceramic' },
    ]},
    { key: 'condition', labelAr: 'الحالة والأصالة', labelEn: 'Condition & Authenticity', type: 'select', allowOther: true, required: true, options: [
      { value: 'museum_quality', labelAr: 'ممتازة ومحفوظة بعناية أصلية', labelEn: 'Excellent / Museum Grade' },
      { value: 'restored', labelAr: 'مرممة ومجددة بحرفية', labelEn: 'Professionally Restored' },
      { value: 'raw_vintage', labelAr: 'بحالتها الأصلية مع آثار الزمن والعتامة', labelEn: 'Original Vintage Patina' },
    ]},
    { key: 'certified', labelAr: 'مرفق شهادة فحص أو توثيق أثري', labelEn: 'Certificate of Authenticity', type: 'boolean', required: false },
  ],
  crafts: [
    { key: 'craftType', labelAr: 'نوع العمل الفني واليدوي', labelEn: 'Craft Type', type: 'select', allowOther: true, required: true, options: [
      { value: 'painting_canvas', labelAr: 'رسم يدوي على كانفس (زيتي / أكريليك)', labelEn: 'Handmade Canvas Painting' },
      { value: 'calligraphy_arabic', labelAr: 'لوحات خط عربي وزخرفة إسلامية', labelEn: 'Arabic Calligraphy Art' },
      { value: 'resin_art', labelAr: 'أعمال الريزن والإيبوكسي (Resin Art)', labelEn: 'Resin & Epoxy Art' },
      { value: 'embroidery_tatreez', labelAr: 'تطريز فلاحي وأثواب يدوية تراثية', labelEn: 'Handmade Embroidery / Tatreez' },
      { value: 'pottery_ceramics', labelAr: 'فخار وسيراميك يدوي ملون', labelEn: 'Handmade Pottery & Ceramics' },
      { value: 'wood_carving', labelAr: 'حفر ونحت على الخشب', labelEn: 'Wood Carving' },
      { value: 'handmade_jewelry', labelAr: 'إكسسوارات وهدايا هاندميد مخصصة', labelEn: 'Handmade Jewelry / Crafts' },
    ]},
    { key: 'artistName', labelAr: 'اسم الفنان أو المشغل الحرفي', labelEn: 'Artist / Workshop Name', type: 'text', required: false, placeholder: 'Artist name...', placeholderAr: 'اسم الفنان أو المشغل...' },
    { key: 'handmade', labelAr: 'صناعة يدوية 100% (Handmade)', labelEn: '100% Handmade', type: 'boolean', required: false },
    { key: 'dimensions', labelAr: 'المقاسات والأبعاد (سم)', labelEn: 'Dimensions (cm)', type: 'text', required: false, placeholder: '100x70 cm', placeholderAr: 'مثال: 100 × 70 سم' },
    { key: 'condition', labelAr: 'الحالة', labelEn: 'Condition', type: 'select', allowOther: true, required: true, options: [
      { value: 'new_piece', labelAr: 'عمل فني جديد وجاهز للإهداء', labelEn: 'New Artwork' },
      { value: 'excellent', labelAr: 'ممتاز ومبروز بإطار فاخر', labelEn: 'Framed & Excellent' },
    ]},
  ],
};
