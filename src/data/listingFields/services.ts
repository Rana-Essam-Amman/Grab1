import type { CategoryFieldMap } from './types';

export const SERVICES_FIELDS: CategoryFieldMap = {
  delivery: [
    { key: 'deliveryType', labelAr: 'نوع خدمة التوصيل والنقل', labelEn: 'Service Type', type: 'select', allowOther: true, required: true, options: [
      { value: 'furniture_moving', labelAr: 'نقل عفش وأثاث مع فك وتركيب وتغليف', labelEn: 'Furniture Moving & Packing' },
      { value: 'packages_cargo', labelAr: 'شحن طرود وبضائع وتجارة إلكترونية', labelEn: 'Parcel & Cargo Delivery' },
      { value: 'recovery_winch', labelAr: 'ونش سحب وإنقاذ سيارات (سطحة)', labelEn: 'Towing & Recovery Winch' },
      { value: 'food_grocery', labelAr: 'توصيل طلبات مطاعم وسوبرماركت', labelEn: 'Food & Grocery Delivery' },
      { value: 'airport_transfer', labelAr: 'توصيل مشاوير ومطارات وسياحة', labelEn: 'Airport & Passenger Transfer' },
    ]},
    { key: 'vehicle', labelAr: 'نوع وسيلة النقل المستخدمة', labelEn: 'Vehicle Type', type: 'select', allowOther: true, required: true, options: [
      { value: 'large_truck', labelAr: 'شاحنة دينا / لوري مغلقة كبيرة', labelEn: 'Large Box Truck' },
      { value: 'pickup', labelAr: 'بيك أب / ونيت (Pickup)', labelEn: 'Pickup' },
      { value: 'van', labelAr: 'فان بضائع مقفل (Cargo Van)', labelEn: 'Cargo Van' },
      { value: 'sedan_car', labelAr: 'سيارة ركاب سياحية', labelEn: 'Sedan Passenger Car' },
      { value: 'motorcycle', labelAr: 'دراجة نارية وسكوتر توصيل سريع', labelEn: 'Motorcycle' },
    ]},
    { key: 'coverage', labelAr: 'مناطق التغطية والخدمة', labelEn: 'Service Areas', type: 'text', required: true, placeholder: 'All Amman, Across Jordan, Between Cities...', placeholderAr: 'مثال: جميع مناطق عمان، شحن بين المحافظات...' },
    { key: 'availability', labelAr: 'أوقات وجاهزية العمل', labelEn: 'Availability', type: 'select', allowOther: true, required: true, options: [
      { value: '24_7', labelAr: 'خدمة 24 ساعة طوال أيام الأسبوع', labelEn: '24/7 Available' },
      { value: 'daytime', labelAr: 'ساعات العمل اليومية (صباحي ومسائي)', labelEn: 'Daytime Business Hours' },
      { value: 'by_appointment', labelAr: 'حسب الحجز والموعد المسبق', labelEn: 'By Appointment' },
    ]},
    { key: 'rate', labelAr: 'السعر أو الأجرة الأساسية', labelEn: 'Base Rate', type: 'number', required: false, placeholder: '25', placeholderAr: '25' },
    { key: 'rateUnit', labelAr: 'طريقة احتساب السعر', labelEn: 'Rate Unit', type: 'select', allowOther: true, required: false, options: [
      { value: 'per_trip', labelAr: 'لكل نقلة / مشوار', labelEn: 'Per Trip' },
      { value: 'per_km', labelAr: 'لكل كيلومتر', labelEn: 'Per KM' },
      { value: 'per_hour', labelAr: 'بالساعة', labelEn: 'Per Hour' },
      { value: 'full_day', labelAr: 'يومية كاملة', labelEn: 'Daily Rate' },
    ]},
    { key: 'experienceYears', labelAr: 'سنوات الخبرة والعمل', labelEn: 'Experience (Years)', type: 'number', required: false, placeholder: '5', placeholderAr: '5' },
    { key: 'licensed', labelAr: 'سائق مرخص ومؤسسة رسمية', labelEn: 'Licensed & Registered', type: 'boolean', required: false },
  ],
  events: [
    { key: 'eventType', labelAr: 'نوع خدمة الحفلات والمناسبات', labelEn: 'Event Service Type', type: 'select', allowOther: true, required: true, options: [
      { value: 'wedding_engagement', labelAr: 'تنظيم أعراس وخطوبة وكوشات كاملة', labelEn: 'Weddings & Engagements' },
      { value: 'catering_buffet', labelAr: 'بوفيه طعام وضيافة وقهوة عربية', labelEn: 'Catering & Hospitality' },
      { value: 'photography_video', labelAr: 'تصوير فوتوغرافي وفيديو ومونتاج', labelEn: 'Photography & Video' },
      { value: 'dj_sound_lights', labelAr: 'دي جي وهندسة صوت وإضاءة حفلات', labelEn: 'DJ, Sound & Lights' },
      { value: 'tents_chairs_rental', labelAr: 'تأجير خيام ومجالس وكراسي وطاولات', labelEn: 'Tents & Chairs Rental' },
      { value: 'birthday_parties', labelAr: 'أعياد ميلاد وحفلات تخرج وأطفال', labelEn: 'Birthdays & Kids Parties' },
    ]},
    { key: 'capacity', labelAr: 'القدرة الاستيعابية (عدد الضيوف)', labelEn: 'Guest Capacity', type: 'number', required: false, placeholder: '100', placeholderAr: '100' },
    { key: 'setupIncluded', labelAr: 'تشمل النقل والتركيب والتجهيز في الموقع', labelEn: 'Setup & Delivery Included', type: 'boolean', required: false },
    { key: 'coverageArea', labelAr: 'المدينة ونطاق تقديم الخدمة', labelEn: 'City & Coverage', type: 'text', required: false, placeholder: 'City / Regions...', placeholderAr: 'مثال: عمان، إربد، كافة المناطق...' },
    { key: 'rate', labelAr: 'السعر التقديري للخدمة / الباقة', labelEn: 'Estimated Package Price', type: 'number', required: false, placeholder: '150', placeholderAr: '150' },
    { key: 'bookingNotice', labelAr: 'المهلة المطلوبة قبل الحجز', labelEn: 'Advance Notice Required', type: 'select', allowOther: true, required: false, options: [
      { value: 'same_day', labelAr: 'حجز فوري في نفس اليوم', labelEn: 'Same Day' },
      { value: '2_3_days', labelAr: 'قبل 2 - 3 أيام', labelEn: '2-3 Days Ahead' },
      { value: 'one_week_plus', labelAr: 'قبل أسبوع فأكثر', labelEn: '1+ Week Ahead' },
    ]},
  ],
  design: [
    { key: 'specialty', labelAr: 'مجال التصميم والإبداع', labelEn: 'Design Specialty', type: 'select', allowOther: true, required: true, options: [
      { value: 'logo_branding', labelAr: 'تصميم شعارات وهوية بصرية كاملة', labelEn: 'Logo & Brand Identity' },
      { value: 'social_media_posts', labelAr: 'تصاميم سوشيال ميديا وإعلانات ممولة', labelEn: 'Social Media Designs' },
      { value: 'ui_ux_web', labelAr: 'تصميم مواقع وتطبيقات (UI/UX)', labelEn: 'UI/UX & Web Design' },
      { value: 'motion_video_edit', labelAr: 'موشن جرافيك ومونتاج فيديو وريلز', labelEn: 'Motion Graphics & Video Edit' },
      { value: 'interior_3d', labelAr: 'تصميم داخلي ومعماري وثري دي (3D)', labelEn: '3D & Interior Design' },
      { value: 'print_packaging', labelAr: 'مطبوعات وتغليف منتجات وعلب', labelEn: 'Packaging & Print Design' },
    ]},
    { key: 'toolsUsed', labelAr: 'البرامج والأدوات المستخدمة', labelEn: 'Tools & Software', type: 'select', allowOther: true, multiSelect: true, required: false, options: [
      { value: 'photoshop_illustrator', labelAr: 'Adobe Photoshop & Illustrator', labelEn: 'Photoshop / Illustrator' },
      { value: 'figma', labelAr: 'Figma', labelEn: 'Figma' },
      { value: 'after_effects_premiere', labelAr: 'After Effects & Premiere Pro', labelEn: 'After Effects / Premiere' },
      { value: 'blender_3dsmax', labelAr: 'Blender / 3ds Max / AutoCAD', labelEn: 'Blender / AutoCAD' },
      { value: 'canva', labelAr: 'Canva Pro', labelEn: 'Canva' },
    ]},
    { key: 'portfolioLink', labelAr: 'رابط معرض الأعمال (Behance / Drive)', labelEn: 'Portfolio URL', type: 'text', required: false, placeholder: 'https://behance.net/...', placeholderAr: 'https://behance.net/...' },
    { key: 'deliveryTime', labelAr: 'مدة تسليم العمل المعتادة', labelEn: 'Delivery Time', type: 'select', allowOther: true, required: false, options: [
      { value: '24_hours', labelAr: 'خلال 24 ساعة (تسليم سريع)', labelEn: 'Within 24 Hours' },
      { value: '2_4_days', labelAr: '2 - 4 أيام عمل', labelEn: '2 - 4 Days' },
      { value: 'one_week', labelAr: 'أسبوع عمل', labelEn: '1 Week' },
    ]},
    { key: 'revisionsIncluded', labelAr: 'عدد التعديلات المجانية المتاحة', labelEn: 'Free Revisions Count', type: 'number', required: false, placeholder: '3', placeholderAr: '3' },
    { key: 'rateType', labelAr: 'نظام الدفع والتعاقد', labelEn: 'Pricing Model', type: 'select', allowOther: true, required: false, options: [
      { value: 'fixed_project', labelAr: 'سعر ثابت لكل مشروع', labelEn: 'Fixed per Project' },
      { value: 'monthly_retainer', labelAr: 'اشتراك وراتب شهري لإدارة الحسابات', labelEn: 'Monthly Retainer' },
      { value: 'hourly', labelAr: 'بالساعة', labelEn: 'Hourly Rate' },
    ]},
  ],
  tutor: [
    { key: 'subject', labelAr: 'المادة الدراسية أو التخصص', labelEn: 'Subject', type: 'select', allowOther: true, required: true, options: [
      { value: 'mathematics', labelAr: 'رياضيات وتفاضل وتكامل', labelEn: 'Mathematics' },
      { value: 'english_language', labelAr: 'لغة إنجليزية ومحادثة وتوفل / آيلتس', labelEn: 'English (IELTS / TOEFL)' },
      { value: 'physics_chemistry', labelAr: 'فيزياء وكيمياء وعلوم', labelEn: 'Physics & Chemistry' },
      { value: 'arabic_quran', labelAr: 'لغة عربية وقرآن كريم وتجويد', labelEn: 'Arabic & Quran' },
      { value: 'programming_coding', labelAr: 'برمجة وحاسوب وذكاء اصطناعي', labelEn: 'Coding & Computer Science' },
      { value: 'french_german', labelAr: 'لغات أجنبية (فرنسي / ألماني)', labelEn: 'French / German' },
      { value: 'music_arts', labelAr: 'عزف موسيقى ورسم وفنون', labelEn: 'Music & Arts' },
    ]},
    { key: 'level', labelAr: 'المرحلة التعليمية المستهدفة', labelEn: 'Student Academic Level', type: 'select', allowOther: true, required: true, options: [
      { value: 'tawjihi_highschool', labelAr: 'ثانوية عامة / توجيهي / IGCSE / SAT', labelEn: 'Tawjihi / IGCSE / High School' },
      { value: 'middle_school', labelAr: 'المرحلة الإعدادية والأساسية', labelEn: 'Middle School' },
      { value: 'primary_school', labelAr: 'المرحلة الابتدائية وتأسيس قراءة وكتابة', labelEn: 'Primary School / Foundation' },
      { value: 'university', labelAr: 'مرحلة جامعية ودراسات عليا', labelEn: 'University' },
      { value: 'adults_general', labelAr: 'دورات للكبار وتطوير مهارات', labelEn: 'Adults / General' },
    ]},
    { key: 'sessionType', labelAr: 'مكان وطريقة إعطاء الدروس', labelEn: 'Session Format', type: 'select', allowOther: true, required: true, options: [
      { value: 'in_person_home', labelAr: 'وجاهي بزيارة منزلية للطالب', labelEn: 'In-Person at Student Home' },
      { value: 'online_zoom', labelAr: 'أونلاين عن بعد (Zoom / Meet)', labelEn: 'Online via Zoom/Meet' },
      { value: 'tutor_center', labelAr: 'في مركز تعليمي / منزل المعلم', labelEn: 'At Tutor Center' },
      { value: 'flexible_both', labelAr: 'متاح الخيارين (وجاهي وأونلاين)', labelEn: 'Both In-Person & Online' },
    ]},
    { key: 'hourlyRate', labelAr: 'سعر الحصة / الساعة', labelEn: 'Hourly Rate', type: 'number', required: false, placeholder: '15', placeholderAr: '15' },
    { key: 'experienceYears', labelAr: 'سنوات خبرة المعلم في التدريس', labelEn: 'Teaching Experience (Years)', type: 'number', required: false, placeholder: '7', placeholderAr: '7' },
    { key: 'genderPreference', labelAr: 'جنس المعلم / المعلمة', labelEn: 'Tutor Gender', type: 'select', allowOther: true, required: false, options: [
      { value: 'male_teacher', labelAr: 'أستاذ / معلم', labelEn: 'Male Tutor' },
      { value: 'female_teacher', labelAr: 'معلمة / أستاذة', labelEn: 'Female Tutor' },
    ]},
  ],
};
