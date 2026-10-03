import type { CategoryFieldMap, ListingFieldOption } from './types';

const GARDEN_CONDITION_OPTIONS: ListingFieldOption[] = [
  { value: 'new', labelAr: 'جديد بالكرتونة', labelEn: 'Brand New' },
  { value: 'excellent', labelAr: 'ممتاز وبحالة الوكالة', labelEn: 'Excellent / Like New' },
  { value: 'good', labelAr: 'مستعمل جيد وجاهز للاستخدام', labelEn: 'Good' },
];

export const HOME_GARDEN_FIELDS: CategoryFieldMap = {
  'garden-furniture': [
    { key: 'itemType', labelAr: 'نوع أثاث الحديقة', labelEn: 'Garden Furniture Type', type: 'select', allowOther: true, required: true, options: [
      { value: 'outdoor_lounge_set', labelAr: 'طقم قعدة خارجية للحدائق والروف', labelEn: 'Full Outdoor Lounge Set' },
      { value: 'dining_set_outdoor', labelAr: 'طاولة طعام خارجية مع كراسي مقاومة', labelEn: 'Outdoor Dining Set' },
      { value: 'garden_swing', labelAr: 'مرجوحة حدائق 3 مقاعد أو معلقة', labelEn: 'Garden Swing / Egg Chair' },
      { value: 'umbrella_pergola', labelAr: 'مظلة شمسية كبيرة أو برجولة متحركة', labelEn: 'Patio Umbrella / Pergola' },
      { value: 'sunbed_lounger', labelAr: 'سرير تشميس ومسبح', labelEn: 'Sun Lounger' },
    ]},
    { key: 'material', labelAr: 'المادة المقاومة', labelEn: 'Material', type: 'select', allowOther: true, required: true, options: [
      { value: 'rattan_synthetic', labelAr: 'راتان صناعي معالج للحرارة', labelEn: 'Synthetic Rattan' },
      { value: 'cast_aluminum', labelAr: 'ألمنيوم مصبوب ضد الصدأ', labelEn: 'Cast Aluminum' },
      { value: 'teak_wood', labelAr: 'خشب سويد / تيك مدهون عازل', labelEn: 'Treated Teak / Wood' },
      { value: 'wrought_iron', labelAr: 'حديد مشغول وفيرفورجيه', labelEn: 'Wrought Iron' },
    ]},
    { key: 'seats', labelAr: 'عدد المقاعد', labelEn: 'Seats Count', type: 'select', allowOther: true, required: false, options: [
      { value: '2', labelAr: 'شخصين', labelEn: '2 Seats' },
      { value: '4', labelAr: '4 أشخاص', labelEn: '4 Seats' },
      { value: '6_plus', labelAr: '6 أشخاص أو أكثر', labelEn: '6+ Seats' },
    ]},
    { key: 'weatherResistant', labelAr: 'مقاوم للشمس والمطر والرطوبة', labelEn: 'All-Weather Proof', type: 'boolean', required: false },
    { key: 'condition', labelAr: 'الحالة', labelEn: 'Condition', type: 'select', allowOther: true, required: true, options: GARDEN_CONDITION_OPTIONS },
    { key: 'brand', labelAr: 'الماركة أو المعرض', labelEn: 'Brand / Store', type: 'text', required: false, placeholder: 'IKEA, Custom...', placeholderAr: 'مثال: ايكيا، تفصيل...' },
    { key: 'dimensions', labelAr: 'المقاسات والأبعاد (سم)', labelEn: 'Dimensions', type: 'text', required: false, placeholder: '200x150 cm', placeholderAr: 'مثال: 200 × 150 سم' },
  ],
  plants: [
    { key: 'plantType', labelAr: 'نوع النبات أو الشجرة', labelEn: 'Plant Type', type: 'select', allowOther: true, required: true, options: [
      { value: 'indoor_houseplant', labelAr: 'نباتات ظل داخلية (مونستيرا، زاميا، سانسيفيريا)', labelEn: 'Indoor Houseplant' },
      { value: 'outdoor_trees', labelAr: 'أشجار خارجية ومثمرة (زيتون، نخيل، حمضيات)', labelEn: 'Outdoor & Fruit Trees' },
      { value: 'flowering_plants', labelAr: 'نباتات وشجيرات زهور وزينة (جوري، ياسمين)', labelEn: 'Flowering & Rose Bushes' },
      { value: 'succulents_cacti', labelAr: 'صبارات وعصاريات متنوعة', labelEn: 'Cacti & Succulents' },
      { value: 'natural_grass_sod', labelAr: 'ثيل وعشب طبيعي أو صناعي بالمتر', labelEn: 'Turf / Grass Roll' },
      { value: 'pots_soil_fertilizer', labelAr: 'أحواض زرع فخار وتربة بتموس وأسمدة', labelEn: 'Pots, Soil & Fertilizers' },
    ]},
    { key: 'height', labelAr: 'الارتفاع التقريبي (سم)', labelEn: 'Height (cm)', type: 'number', required: false, placeholder: '150', placeholderAr: '150' },
    { key: 'sunRequirement', labelAr: 'احتياج الإضاءة والشمس', labelEn: 'Sun Requirement', type: 'select', allowOther: true, required: false, options: [
      { value: 'full_sun', labelAr: 'شمس مباشرة وكاملة', labelEn: 'Full Direct Sun' },
      { value: 'partial_shade', labelAr: 'شمس غير مباشرة / نصف ظل', labelEn: 'Partial Shade' },
      { value: 'low_light_indoor', labelAr: 'ظل وإضاءة غرف داخلية', labelEn: 'Low Light / Indoor' },
    ]},
    { key: 'potIncluded', labelAr: 'مزروعة في حوض زينة وجاهزة', labelEn: 'Planter / Pot Included', type: 'boolean', required: false },
    { key: 'condition', labelAr: 'حيوية ونضارة النبات', labelEn: 'Plant Vitality', type: 'select', allowOther: true, required: true, options: [
      { value: 'healthy_vibrant', labelAr: 'نضرة ومزهرة وجذور قوية ومطعمة', labelEn: 'Healthy & Rooted' },
      { value: 'rooted_cutting', labelAr: 'عقلة مجذرة حديثاً', labelEn: 'Rooted Cutting' },
    ]},
  ],
  bbq: [
    { key: 'bbqType', labelAr: 'نوع الشواية أو الفرن', labelEn: 'BBQ Type', type: 'select', allowOther: true, required: true, options: [
      { value: 'charcoal_grill', labelAr: 'شواية فحم متنقلة أو مع أرجل وعجلات', labelEn: 'Charcoal BBQ Grill' },
      { value: 'gas_grill', labelAr: 'شواية غاز منزلية متعددة الشعلات', labelEn: 'Gas BBQ Grill' },
      { value: 'smoker_wood', labelAr: 'سموكر تدخين لحوم بالحطب (Offset Smoker)', labelEn: 'Wood Smoker' },
      { value: 'pizza_oven', labelAr: 'فرن بيتزا وفطائر حجري / غاز خارجي', labelEn: 'Outdoor Pizza Oven' },
      { value: 'fire_pit', labelAr: 'منقل نار وشبة نار للحدائق والمخيمات', labelEn: 'Fire Pit / Brazier' },
      { value: 'bbq_accessories', labelAr: 'أسياخ وشبك ستانلس ومعدات شواء', labelEn: 'BBQ Grates & Tools' },
    ]},
    { key: 'brand', labelAr: 'الماركة المصنعة', labelEn: 'Brand', type: 'text', required: false, placeholder: 'Weber, Char-Broil, Ooni, Local Steel...', placeholderAr: 'مثال: ويبر، أوني، تفصيل حديد ثقيل...' },
    { key: 'material', labelAr: 'مادة التصنيع', labelEn: 'Material', type: 'select', allowOther: true, required: false, options: [
      { value: 'stainless_steel', labelAr: 'ستانلس ستيل 304 غير قابل للصدأ', labelEn: '304 Stainless Steel' },
      { value: 'heavy_cast_iron', labelAr: 'حديد زهر ثقيل (Cast Iron)', labelEn: 'Cast Iron' },
      { value: 'powder_coated_steel', labelAr: 'صاج حديد مدهون حراري', labelEn: 'Powder Coated Steel' },
    ]},
    { key: 'portable', labelAr: 'قابلة للطي والتنقل بالسيارة', labelEn: 'Portable / Foldable', type: 'boolean', required: false },
    { key: 'accessoriesIncluded', labelAr: 'تشمل غطاء حماية وأسياخ وشبك وملاقط', labelEn: 'Includes Cover & Tongs', type: 'boolean', required: false },
    { key: 'condition', labelAr: 'الحالة', labelEn: 'Condition', type: 'select', allowOther: true, required: true, options: GARDEN_CONDITION_OPTIONS },
  ],
  tools: [
    { key: 'toolType', labelAr: 'نوع المعدة أو الأداة', labelEn: 'Garden Tool Type', type: 'select', allowOther: true, required: true, options: [
      { value: 'lawn_mower', labelAr: 'جزازة وماكينة قص العشب والنجيل', labelEn: 'Lawn Mower' },
      { value: 'hedge_trimmer', labelAr: 'مقص شجر وأسيجة كهربائي / بنزين', labelEn: 'Hedge Trimmer' },
      { value: 'chainsaw', labelAr: 'منشار حطب وجذوع شجر', labelEn: 'Chainsaw' },
      { value: 'pressure_washer', labelAr: 'ماكينة غسيل ضغط عالي (كارشر)', labelEn: 'Pressure Washer' },
      { value: 'leaf_blower', labelAr: 'منفاخ وشفاط أوراق شجر', labelEn: 'Leaf Blower' },
      { value: 'irrigation_timer', labelAr: 'شبكات وتايمر ري بالتنقيط ورشاشات', labelEn: 'Drip Irrigation & Timers' },
      { value: 'hand_tools_set', labelAr: 'طقم أدوات زراعة يدوية ومجارف وخراطيم', labelEn: 'Hand Tools Set' },
    ]},
    { key: 'powerSource', labelAr: 'مصدر الطاقة والتشغيل', labelEn: 'Power Source', type: 'select', allowOther: true, required: true, options: [
      { value: 'petrol_gas', labelAr: 'محرك بنزين (2/4 Stroke)', labelEn: 'Gasoline Engine' },
      { value: 'cordless_battery', labelAr: 'بطارية ليثيوم قابلة للشحن (Cordless)', labelEn: 'Cordless Battery' },
      { value: 'electric_cord', labelAr: 'سلك كهربائي 220V', labelEn: 'Corded Electric' },
      { value: 'manual', labelAr: 'يدوي بدون محرك', labelEn: 'Manual' },
    ]},
    { key: 'brand', labelAr: 'الماركة', labelEn: 'Brand', type: 'text', required: false, placeholder: 'Stihl, Bosch, Makita, Kärcher, Gardena...', placeholderAr: 'مثال: بوش، ماكيتا، كارشر، شتيل...' },
    { key: 'condition', labelAr: 'الحالة', labelEn: 'Condition', type: 'select', allowOther: true, required: true, options: GARDEN_CONDITION_OPTIONS },
    { key: 'warranty', labelAr: 'الضمان', labelEn: 'Warranty', type: 'select', allowOther: true, required: false, options: [
      { value: 'with_warranty', labelAr: 'ساري الضمان', labelEn: 'With Warranty' },
      { value: 'no_warranty', labelAr: 'بدون ضمان', labelEn: 'No Warranty' },
    ]},
  ],
};
