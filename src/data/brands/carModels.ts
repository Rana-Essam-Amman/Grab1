// ⚠️ RULE-14-EXCEPTION: Static model taxonomy (config, capped at 500 lines)
// SINGLE SOURCE OF TRUTH for car models. Filters, wizard, search all read from here.
// Adding a model = 1 line. Adding a trim = 1 string. Automatic everywhere.

export interface CarModel {
  readonly slug: string;
  readonly nameAr: string;
  readonly nameEn: string;
  readonly trims: readonly string[];
}

export const CAR_MODELS: Record<string, readonly CarModel[]> = {
  toyota: [
    { slug: 'camry', nameAr: 'كامري', nameEn: 'Camry', trims: ['LE', 'SE', 'XLE', 'XSE', 'Hybrid LE', 'Hybrid XLE'] },
    { slug: 'corolla', nameAr: 'كورولا', nameEn: 'Corolla', trims: ['XLi', 'GLi', 'SE', 'LE', 'Hybrid'] },
    { slug: 'land_cruiser', nameAr: 'لاند كروزر', nameEn: 'Land Cruiser', trims: ['GXR', 'VXR', 'VX', 'GR Sport'] },
    { slug: 'prado', nameAr: 'برادو', nameEn: 'Prado', trims: ['TX-L', 'VX-L', 'VX-R'] },
    { slug: 'hilux', nameAr: 'هايلكس', nameEn: 'Hilux', trims: ['GL', 'GLX', 'SR5', 'Adventure', 'Rogue'] },
    { slug: 'rav4', nameAr: 'راف فور', nameEn: 'RAV4', trims: ['LE', 'XLE', 'XSE', 'Limited', 'Hybrid'] },
    { slug: 'fortuner', nameAr: 'فورتشنر', nameEn: 'Fortuner', trims: ['GX', 'VX', 'Legender'] },
    { slug: 'avalon', nameAr: 'أفالون', nameEn: 'Avalon', trims: ['XLE', 'XSE', 'Limited', 'Touring'] },
  ],
  honda: [
    { slug: 'civic', nameAr: 'سيفيك', nameEn: 'Civic', trims: ['DX', 'LX', 'EX', 'EX-L', 'Touring', 'Type R'] },
    { slug: 'accord', nameAr: 'أكورد', nameEn: 'Accord', trims: ['LX', 'Sport', 'EX', 'EX-L', 'Touring'] },
    { slug: 'cr_v', nameAr: 'سي آر في', nameEn: 'CR-V', trims: ['LX', 'EX', 'EX-L', 'Touring'] },
    { slug: 'pilot', nameAr: 'بايلوت', nameEn: 'Pilot', trims: ['LX', 'EX', 'EX-L', 'Touring', 'Elite'] },
    { slug: 'odyssey', nameAr: 'أوديسي', nameEn: 'Odyssey', trims: ['LX', 'EX', 'EX-L', 'Touring', 'Elite'] },
    { slug: 'hr_v', nameAr: 'إتش آر في', nameEn: 'HR-V', trims: ['LX', 'Sport', 'EX', 'EX-L'] },
  ],
  nissan: [
    { slug: 'sunny', nameAr: 'صني', nameEn: 'Sunny', trims: ['S', 'SV', 'SL', 'SR'] },
    { slug: 'altima', nameAr: 'ألتيما', nameEn: 'Altima', trims: ['S', 'SV', 'SR', 'SL', 'Platinum'] },
    { slug: 'patrol', nameAr: 'باترول', nameEn: 'Patrol', trims: ['XE', 'SE', 'LE', 'Platinum', 'Nismo'] },
    { slug: 'x_trail', nameAr: 'إكس تريل', nameEn: 'X-Trail', trims: ['S', 'SV', 'SL', 'Platinum'] },
    { slug: 'kicks', nameAr: 'كيكس', nameEn: 'Kicks', trims: ['S', 'SV', 'SR'] },
    { slug: 'pathfinder', nameAr: 'باثفايندر', nameEn: 'Pathfinder', trims: ['S', 'SV', 'SL', 'Platinum'] },
    { slug: 'navara', nameAr: 'نافارا', nameEn: 'Navara', trims: ['SE', 'LE', 'PRO-4X'] },
  ],
  mitsubishi: [
    { slug: 'lancer', nameAr: 'لانسر', nameEn: 'Lancer', trims: ['EX', 'GLX', 'GT', 'Evolution'] },
    { slug: 'pajero', nameAr: 'باجيرو', nameEn: 'Pajero', trims: ['GLS', 'GLX', 'GTi'] },
    { slug: 'outlander', nameAr: 'أوتلاندر', nameEn: 'Outlander', trims: ['ES', 'SE', 'SEL', 'GT'] },
    { slug: 'attrage', nameAr: 'أتراج', nameEn: 'Attrage', trims: ['GLX', 'GLS'] },
    { slug: 'montero_sport', nameAr: 'مونتيرو سبورت', nameEn: 'Montero Sport', trims: ['GLS', 'GTi'] },
    { slug: 'eclipse_cross', nameAr: 'إكليبس كروس', nameEn: 'Eclipse Cross', trims: ['ES', 'SE', 'SEL'] },
  ],
  mazda: [
    { slug: 'mazda3', nameAr: 'مازدا 3', nameEn: 'Mazda3', trims: ['Core', 'Comfort', 'Premium', 'Signature'] },
    { slug: 'mazda6', nameAr: 'مازدا 6', nameEn: 'Mazda6', trims: ['Core', 'Comfort', 'Premium', 'Signature'] },
    { slug: 'cx5', nameAr: 'CX-5', nameEn: 'CX-5', trims: ['Core', 'Comfort', 'Premium', 'Signature'] },
    { slug: 'cx30', nameAr: 'CX-30', nameEn: 'CX-30', trims: ['Core', 'Comfort', 'Premium'] },
    { slug: 'cx9', nameAr: 'CX-9', nameEn: 'CX-9', trims: ['Core', 'Comfort', 'Premium', 'Signature'] },
  ],
  suzuki: [
    { slug: 'swift', nameAr: 'سويفت', nameEn: 'Swift', trims: ['GL', 'GLX', 'Sport'] },
    { slug: 'vitara', nameAr: 'فيتارا', nameEn: 'Vitara', trims: ['GL', 'GLX', 'GLX AllGrip'] },
    { slug: 'jimny', nameAr: 'جيمني', nameEn: 'Jimny', trims: ['GL', 'GLX'] },
    { slug: 'dzire', nameAr: 'ديزاير', nameEn: 'Dzire', trims: ['GL', 'GLX'] },
    { slug: 'ertiga', nameAr: 'إرتيجا', nameEn: 'Ertiga', trims: ['GL', 'GLX'] },
  ],
  lexus: [
    { slug: 'es', nameAr: 'ES', nameEn: 'ES', trims: ['ES250', 'ES300h', 'ES350', 'ES F Sport'] },
    { slug: 'rx', nameAr: 'RX', nameEn: 'RX', trims: ['RX350', 'RX450h', 'RX F Sport'] },
    { slug: 'gx', nameAr: 'GX', nameEn: 'GX', trims: ['GX460', 'GX550'] },
    { slug: 'lx', nameAr: 'LX', nameEn: 'LX', trims: ['LX570', 'LX600'] },
    { slug: 'nx', nameAr: 'NX', nameEn: 'NX', trims: ['NX300', 'NX350', 'NX450h'] },
    { slug: 'ls', nameAr: 'LS', nameEn: 'LS', trims: ['LS500', 'LS500h'] },
  ],
  hyundai: [
    { slug: 'elantra', nameAr: 'إلنترا', nameEn: 'Elantra', trims: ['Smart', 'Comfort', 'Premium', 'N Line', 'Hybrid'] },
    { slug: 'avante', nameAr: 'أفانتي', nameEn: 'Avante', trims: ['Smart', 'Comfort', 'Premium', 'N Line'] },
    { slug: 'sonata', nameAr: 'سوناتا', nameEn: 'Sonata', trims: ['Smart', 'Comfort', 'Premium', 'Limited', 'N Line'] },
    { slug: 'tucson', nameAr: 'توسان', nameEn: 'Tucson', trims: ['Smart', 'Comfort', 'Premium', 'Limited', 'N Line'] },
    { slug: 'santa_fe', nameAr: 'سانتافي', nameEn: 'Santa Fe', trims: ['Smart', 'Comfort', 'Premium', 'Calligraphy'] },
    { slug: 'accent', nameAr: 'أكسنت', nameEn: 'Accent', trims: ['Base', 'Comfort', 'Smart', 'Premium'] },
    { slug: 'creta', nameAr: 'كريتا', nameEn: 'Creta', trims: ['Smart', 'Comfort', 'Premium'] },
    { slug: 'i10', nameAr: 'i10', nameEn: 'i10', trims: ['Base', 'Smart', 'Comfort', 'Premium'] },
  ],
  kia: [
    { slug: 'cerato', nameAr: 'سيراتو', nameEn: 'Cerato', trims: ['LX', 'EX', 'SX', 'GT Line'] },
    { slug: 'sportage', nameAr: 'سبورتاج', nameEn: 'Sportage', trims: ['LX', 'EX', 'SX', 'GT Line'] },
    { slug: 'sorento', nameAr: 'سورينتو', nameEn: 'Sorento', trims: ['LX', 'EX', 'SX', 'GT Line'] },
    { slug: 'rio', nameAr: 'ريو', nameEn: 'Rio', trims: ['LX', 'EX', 'SX', 'GT Line'] },
    { slug: 'seltos', nameAr: 'سيلتوس', nameEn: 'Seltos', trims: ['LX', 'EX', 'SX', 'GT Line'] },
    { slug: 'carnival', nameAr: 'كرنفال', nameEn: 'Carnival', trims: ['LX', 'EX', 'SX', 'Prestige'] },
    { slug: 'k5', nameAr: 'K5', nameEn: 'K5', trims: ['LX', 'EX', 'SX', 'GT Line'] },
    { slug: 'pegas', nameAr: 'بيجاس', nameEn: 'Pegas', trims: ['Base', 'EX', 'SX'] },
  ],
  genesis: [
    { slug: 'g70', nameAr: 'G70', nameEn: 'G70', trims: ['Standard', 'Prestige', 'Sport'] },
    { slug: 'g80', nameAr: 'G80', nameEn: 'G80', trims: ['Standard', 'Advanced', 'Prestige'] },
    { slug: 'gv70', nameAr: 'GV70', nameEn: 'GV70', trims: ['Standard', 'Advanced', 'Sport'] },
    { slug: 'gv80', nameAr: 'GV80', nameEn: 'GV80', trims: ['Standard', 'Advanced', 'Prestige'] },
  ],
  bmw: [
    { slug: '3_series', nameAr: 'الفئة الثالثة', nameEn: '3 Series', trims: ['318i', '320i', '325i', '330i', 'M340i', 'M3'] },
    { slug: '5_series', nameAr: 'الفئة الخامسة', nameEn: '5 Series', trims: ['520i', '523i', '528i', '530i', '540i', 'M5'] },
    { slug: '7_series', nameAr: 'الفئة السابعة', nameEn: '7 Series', trims: ['730i', '740i', '750i', 'M760i'] },
    { slug: 'x3', nameAr: 'X3', nameEn: 'X3', trims: ['sDrive20i', 'xDrive30i', 'M40i', 'X3 M'] },
    { slug: 'x5', nameAr: 'X5', nameEn: 'X5', trims: ['xDrive40i', 'xDrive45e', 'M50i', 'X5 M'] },
    { slug: 'x7', nameAr: 'X7', nameEn: 'X7', trims: ['xDrive40i', 'M60i'] },
    { slug: 'x1', nameAr: 'X1', nameEn: 'X1', trims: ['sDrive18i', 'sDrive20i', 'xDrive28i'] },
  ],
  mercedes: [
    { slug: 'c_class', nameAr: 'الفئة C', nameEn: 'C-Class', trims: ['C180', 'C200', 'C250', 'C300', 'AMG C43', 'AMG C63'] },
    { slug: 'e_class', nameAr: 'الفئة E', nameEn: 'E-Class', trims: ['E200', 'E250', 'E300', 'E350', 'AMG E53', 'AMG E63'] },
    { slug: 's_class', nameAr: 'الفئة S', nameEn: 'S-Class', trims: ['S400', 'S450', 'S500', 'S560', 'AMG S63'] },
    { slug: 'glc', nameAr: 'GLC', nameEn: 'GLC', trims: ['GLC200', 'GLC250', 'GLC300', 'AMG GLC43', 'AMG GLC63'] },
    { slug: 'gle', nameAr: 'GLE', nameEn: 'GLE', trims: ['GLE350', 'GLE400', 'GLE450', 'AMG GLE53', 'AMG GLE63'] },
    { slug: 'gla', nameAr: 'GLA', nameEn: 'GLA', trims: ['GLA200', 'GLA250', 'AMG GLA35', 'AMG GLA45'] },
    { slug: 'a_class', nameAr: 'الفئة A', nameEn: 'A-Class', trims: ['A180', 'A200', 'A250', 'AMG A35', 'AMG A45'] },
  ],
  audi: [
    { slug: 'a3', nameAr: 'A3', nameEn: 'A3', trims: ['35 TFSI', '40 TFSI', 'S3'] },
    { slug: 'a4', nameAr: 'A4', nameEn: 'A4', trims: ['35 TFSI', '40 TFSI', '45 TFSI', 'S4'] },
    { slug: 'a6', nameAr: 'A6', nameEn: 'A6', trims: ['40 TFSI', '45 TFSI', '55 TFSI', 'S6'] },
    { slug: 'q3', nameAr: 'Q3', nameEn: 'Q3', trims: ['35 TFSI', '40 TFSI', '45 TFSI'] },
    { slug: 'q5', nameAr: 'Q5', nameEn: 'Q5', trims: ['40 TFSI', '45 TFSI', '55 TFSI', 'SQ5'] },
    { slug: 'q7', nameAr: 'Q7', nameEn: 'Q7', trims: ['45 TFSI', '55 TFSI', 'SQ7'] },
  ],
  volkswagen: [
    { slug: 'golf', nameAr: 'جولف', nameEn: 'Golf', trims: ['TSI', 'GTI', 'GTD', 'R'] },
    { slug: 'passat', nameAr: 'باسات', nameEn: 'Passat', trims: ['TSI', 'Comfortline', 'Highline', 'R-Line'] },
    { slug: 'tiguan', nameAr: 'تيجوان', nameEn: 'Tiguan', trims: ['TSI', 'Comfortline', 'Highline', 'R-Line'] },
    { slug: 'touareg', nameAr: 'طوارق', nameEn: 'Touareg', trims: ['V6', 'R-Line'] },
    { slug: 'jetta', nameAr: 'جيتا', nameEn: 'Jetta', trims: ['TSI', 'GLX', 'R-Line'] },
    { slug: 'polo', nameAr: 'بولو', nameEn: 'Polo', trims: ['TSI', 'GTI'] },
  ],
  porsche: [
    { slug: 'cayenne', nameAr: 'كايين', nameEn: 'Cayenne', trims: ['Base', 'S', 'GTS', 'Turbo'] },
    { slug: 'macan', nameAr: 'ماكان', nameEn: 'Macan', trims: ['Base', 'S', 'GTS', 'Turbo'] },
    { slug: '911', nameAr: '911', nameEn: '911', trims: ['Carrera', 'Carrera S', 'Turbo', 'GT3'] },
    { slug: 'panamera', nameAr: 'باناميرا', nameEn: 'Panamera', trims: ['Base', '4S', 'Turbo', 'Turbo S'] },
    { slug: 'taycan', nameAr: 'تايكان', nameEn: 'Taycan', trims: ['Base', '4S', 'Turbo', 'Turbo S'] },
  ],
  ford: [
    { slug: 'f150', nameAr: 'F-150', nameEn: 'F-150', trims: ['XL', 'XLT', 'Lariat', 'King Ranch', 'Platinum', 'Raptor'] },
    { slug: 'mustang', nameAr: 'موستنج', nameEn: 'Mustang', trims: ['EcoBoost', 'GT', 'Mach 1', 'Shelby GT500'] },
    { slug: 'explorer', nameAr: 'إكسبلورر', nameEn: 'Explorer', trims: ['Base', 'XLT', 'Limited', 'Platinum', 'ST'] },
    { slug: 'escape', nameAr: 'إسكيب', nameEn: 'Escape', trims: ['S', 'SE', 'SEL', 'Titanium'] },
    { slug: 'focus', nameAr: 'فوكس', nameEn: 'Focus', trims: ['S', 'SE', 'SEL', 'Titanium', 'ST', 'RS'] },
  ],
  chevrolet: [
    { slug: 'cruze', nameAr: 'كروز', nameEn: 'Cruze', trims: ['LS', 'LT', 'Premier'] },
    { slug: 'malibu', nameAr: 'ماليبو', nameEn: 'Malibu', trims: ['LS', 'LT', 'Premier'] },
    { slug: 'tahoe', nameAr: 'تاهو', nameEn: 'Tahoe', trims: ['LS', 'LT', 'Premier', 'High Country'] },
    { slug: 'captiva', nameAr: 'كابتيفا', nameEn: 'Captiva', trims: ['LS', 'LT', 'Premier'] },
    { slug: 'traverse', nameAr: 'ترافيرس', nameEn: 'Traverse', trims: ['LS', 'LT', 'Premier', 'High Country'] },
  ],
  jeep: [
    { slug: 'wrangler', nameAr: 'رانجلر', nameEn: 'Wrangler', trims: ['Sport', 'Sahara', 'Rubicon'] },
    { slug: 'grand_cherokee', nameAr: 'جراند شيروكي', nameEn: 'Grand Cherokee', trims: ['Laredo', 'Limited', 'Overland', 'Summit', 'Trackhawk'] },
    { slug: 'cherokee', nameAr: 'شيروكي', nameEn: 'Cherokee', trims: ['Latitude', 'Altitude', 'Limited', 'Trailhawk'] },
    { slug: 'compass', nameAr: 'كومباس', nameEn: 'Compass', trims: ['Sport', 'Latitude', 'Limited', 'Trailhawk'] },
  ],
  tesla: [
    { slug: 'model3', nameAr: 'Model 3', nameEn: 'Model 3', trims: ['Standard', 'Long Range', 'Performance'] },
    { slug: 'model_y', nameAr: 'Model Y', nameEn: 'Model Y', trims: ['Standard', 'Long Range', 'Performance'] },
    { slug: 'model_s', nameAr: 'Model S', nameEn: 'Model S', trims: ['Standard', 'Plaid'] },
    { slug: 'model_x', nameAr: 'Model X', nameEn: 'Model X', trims: ['Standard', 'Plaid'] },
  ],
  gmc: [
    { slug: 'sierra', nameAr: 'سييرا', nameEn: 'Sierra', trims: ['Base', 'SLE', 'SLT', 'Denali', 'AT4'] },
    { slug: 'yukon', nameAr: 'يوكن', nameEn: 'Yukon', trims: ['SLE', 'SLT', 'Denali', 'AT4'] },
    { slug: 'acadia', nameAr: 'أكاديا', nameEn: 'Acadia', trims: ['SLE', 'SLT', 'Denali', 'AT4'] },
    { slug: 'canyon', nameAr: 'كانيون', nameEn: 'Canyon', trims: ['Base', 'Elevation', 'Denali', 'AT4'] },
  ],
  'land-rover': [
    { slug: 'defender', nameAr: 'ديفندر', nameEn: 'Defender', trims: ['90', '110', '130'] },
    { slug: 'discovery', nameAr: 'ديسكفري', nameEn: 'Discovery', trims: ['S', 'SE', 'HSE', 'R-Dynamic'] },
    { slug: 'range_rover_sport', nameAr: 'رينج روفر سبورت', nameEn: 'Range Rover Sport', trims: ['SE', 'HSE', 'Autobiography', 'SVR'] },
    { slug: 'range_rover', nameAr: 'رينج روفر', nameEn: 'Range Rover', trims: ['HSE', 'Vogue', 'Autobiography', 'SV'] },
  ],
  volvo: [
    { slug: 'xc40', nameAr: 'XC40', nameEn: 'XC40', trims: ['Momentum', 'Inscription', 'R-Design'] },
    { slug: 'xc60', nameAr: 'XC60', nameEn: 'XC60', trims: ['Momentum', 'Inscription', 'R-Design'] },
    { slug: 'xc90', nameAr: 'XC90', nameEn: 'XC90', trims: ['Momentum', 'Inscription', 'R-Design'] },
    { slug: 's60', nameAr: 'S60', nameEn: 'S60', trims: ['Momentum', 'Inscription', 'R-Design'] },
  ],
  peugeot: [
    { slug: '208', nameAr: '208', nameEn: '208', trims: ['Active', 'Allure', 'GT'] },
    { slug: '2008', nameAr: '2008', nameEn: '2008', trims: ['Active', 'Allure', 'GT'] },
    { slug: '3008', nameAr: '3008', nameEn: '3008', trims: ['Active', 'Allure', 'GT'] },
    { slug: '5008', nameAr: '5008', nameEn: '5008', trims: ['Active', 'Allure', 'GT'] },
  ],
  renault: [
    { slug: 'duster', nameAr: 'داستر', nameEn: 'Duster', trims: ['PE', 'SE', 'Techno'] },
    { slug: 'megane', nameAr: 'ميجان', nameEn: 'Megane', trims: ['PE', 'SE', 'GT Line'] },
    { slug: 'captur', nameAr: 'كابتشر', nameEn: 'Captur', trims: ['PE', 'SE', 'Techno'] },
    { slug: 'koleos', nameAr: 'كوليوس', nameEn: 'Koleos', trims: ['PE', 'SE', 'Initiale Paris'] },
  ],
  skoda: [
    { slug: 'octavia', nameAr: 'أوكتافيا', nameEn: 'Octavia', trims: ['Ambition', 'Style', 'RS'] },
    { slug: 'superb', nameAr: 'سوبيرب', nameEn: 'Superb', trims: ['Ambition', 'Style', 'Laurin & Klement'] },
    { slug: 'kodiaq', nameAr: 'كودياك', nameEn: 'Kodiaq', trims: ['Ambition', 'Style', 'RS'] },
    { slug: 'karoq', nameAr: 'كاروك', nameEn: 'Karoq', trims: ['Ambition', 'Style', 'Sportline'] },
  ],
  chery: [
    { slug: 'tiggo_4', nameAr: 'تيجو 4', nameEn: 'Tiggo 4', trims: ['Comfort', 'Luxury'] },
    { slug: 'tiggo_7', nameAr: 'تيجو 7', nameEn: 'Tiggo 7', trims: ['Comfort', 'Luxury', 'Flagship'] },
    { slug: 'tiggo_8', nameAr: 'تيجو 8', nameEn: 'Tiggo 8', trims: ['Comfort', 'Luxury', 'Flagship'] },
    { slug: 'tiggo_8_pro', nameAr: 'تيجو 8 برو', nameEn: 'Tiggo 8 Pro', trims: ['Comfort', 'Luxury', 'Flagship'] },
    { slug: 'arrizo_5', nameAr: 'أريزو 5', nameEn: 'Arrizo 5', trims: ['Comfort', 'Luxury'] },
    { slug: 'arrizo_6', nameAr: 'أريزو 6', nameEn: 'Arrizo 6', trims: ['Comfort', 'Luxury', 'Flagship'] },
  ],
  mg: [
    { slug: 'zs', nameAr: 'ZS', nameEn: 'ZS', trims: ['Standard', 'Comfort', 'Luxury'] },
    { slug: 'hs', nameAr: 'HS', nameEn: 'HS', trims: ['Comfort', 'Luxury', 'Trophy'] },
    { slug: 'rx5', nameAr: 'RX5', nameEn: 'RX5', trims: ['Comfort', 'Luxury', 'Trophy'] },
    { slug: 'mg5', nameAr: 'MG5', nameEn: 'MG5', trims: ['Standard', 'Comfort', 'Luxury'] },
    { slug: 'mg6', nameAr: 'MG6', nameEn: 'MG6', trims: ['Comfort', 'Luxury', 'Trophy'] },
    { slug: 'zs_ev', nameAr: 'ZS EV', nameEn: 'ZS EV', trims: ['Standard', 'Comfort', 'Luxury'] },
  ],
  geely: [
    { slug: 'coolray', nameAr: 'كولراي', nameEn: 'Coolray', trims: ['Standard', 'Comfort', 'Luxury', 'Sports'] },
    { slug: 'emgrand', nameAr: 'إمجراند', nameEn: 'Emgrand', trims: ['Standard', 'Comfort', 'Luxury'] },
    { slug: 'tugella', nameAr: 'توجيلا', nameEn: 'Tugella', trims: ['Comfort', 'Luxury', 'Flagship'] },
    { slug: 'okavango', nameAr: 'أوكافانغو', nameEn: 'Okavango', trims: ['Standard', 'Comfort', 'Luxury'] },
    { slug: 'xingyue', nameAr: 'Xingyue', nameEn: 'Xingyue', trims: ['Comfort', 'Luxury'] },
  ],
  byd: [
    { slug: 'atto3', nameAr: 'Atto 3', nameEn: 'Atto 3', trims: ['Standard', 'Extended Range'] },
    { slug: 'dolphin', nameAr: 'Dolphin', nameEn: 'Dolphin', trims: ['Standard', 'Extended Range'] },
    { slug: 'seal', nameAr: 'Seal', nameEn: 'Seal', trims: ['Standard', 'Performance'] },
    { slug: 'song_plus', nameAr: 'Song Plus', nameEn: 'Song Plus', trims: ['Standard', 'Extended Range'] },
    { slug: 'han', nameAr: 'Han', nameEn: 'Han', trims: ['Standard', 'Extended Range'] },
  ],
  changan: [
    { slug: 'cs35', nameAr: 'CS35', nameEn: 'CS35', trims: ['Standard', 'Comfort', 'Luxury'] },
    { slug: 'cs55', nameAr: 'CS55', nameEn: 'CS55', trims: ['Comfort', 'Luxury', 'Flagship'] },
    { slug: 'cs75', nameAr: 'CS75', nameEn: 'CS75', trims: ['Comfort', 'Luxury', 'Flagship'] },
    { slug: 'cs95', nameAr: 'CS95', nameEn: 'CS95', trims: ['Comfort', 'Luxury', 'Flagship'] },
    { slug: 'eado', nameAr: 'إيدو', nameEn: 'Eado', trims: ['Standard', 'Comfort', 'Luxury'] },
  ],
  haval: [
    { slug: 'h6', nameAr: 'H6', nameEn: 'H6', trims: ['Standard', 'Comfort', 'Luxury', 'GT'] },
    { slug: 'h9', nameAr: 'H9', nameEn: 'H9', trims: ['Comfort', 'Luxury', 'Flagship'] },
    { slug: 'jolion', nameAr: 'جوليون', nameEn: 'Jolion', trims: ['Standard', 'Comfort', 'Luxury'] },
    { slug: 'dargo', nameAr: 'دارجو', nameEn: 'Dargo', trims: ['Standard', 'Comfort', 'GT'] },
  ],
  gac: [
    { slug: 'gs3', nameAr: 'GS3', nameEn: 'GS3', trims: ['Standard', 'Comfort', 'Luxury'] },
    { slug: 'gs4', nameAr: 'GS4', nameEn: 'GS4', trims: ['Comfort', 'Luxury', 'Flagship'] },
    { slug: 'gs8', nameAr: 'GS8', nameEn: 'GS8', trims: ['Comfort', 'Luxury', 'Flagship'] },
    { slug: 'emkoo', nameAr: 'إمكو', nameEn: 'Emkoo', trims: ['Comfort', 'Luxury'] },
    { slug: 'empow', nameAr: 'إمبو', nameEn: 'Empow', trims: ['Comfort', 'Luxury', 'Sport'] },
  ],
  jetour: [
    { slug: 'x70', nameAr: 'X70', nameEn: 'X70', trims: ['Comfort', 'Luxury', 'Flagship'] },
    { slug: 'x90', nameAr: 'X90', nameEn: 'X90', trims: ['Comfort', 'Luxury', 'Flagship'] },
    { slug: 'dashing', nameAr: 'داشينغ', nameEn: 'Dashing', trims: ['Comfort', 'Luxury'] },
    { slug: 't2', nameAr: 'T2', nameEn: 'T2', trims: ['Comfort', 'Luxury', 'Flagship'] },
  ],
  jaecoo: [
    { slug: 'j7', nameAr: 'J7', nameEn: 'J7', trims: ['Comfort', 'Luxury', 'Flagship'] },
    { slug: 'j8', nameAr: 'J8', nameEn: 'J8', trims: ['Comfort', 'Luxury', 'Flagship'] },
  ],
  omoda: [
    { slug: 'c5', nameAr: 'C5', nameEn: 'C5', trims: ['Comfort', 'Luxury', 'GT'] },
    { slug: 'e5', nameAr: 'E5', nameEn: 'E5', trims: ['Comfort', 'Luxury'] },
  ],
  exeed: [
    { slug: 'txl', nameAr: 'TXL', nameEn: 'TXL', trims: ['Comfort', 'Luxury', 'Flagship'] },
    { slug: 'vx', nameAr: 'VX', nameEn: 'VX', trims: ['Comfort', 'Luxury', 'Flagship'] },
    { slug: 'lx', nameAr: 'LX', nameEn: 'LX', trims: ['Comfort', 'Luxury'] },
  ],
  hongqi: [
    { slug: 'hs5', nameAr: 'HS5', nameEn: 'HS5', trims: ['Comfort', 'Luxury', 'Flagship'] },
    { slug: 'h5', nameAr: 'H5', nameEn: 'H5', trims: ['Comfort', 'Luxury', 'Flagship'] },
    { slug: 'h9', nameAr: 'H9', nameEn: 'H9', trims: ['Comfort', 'Luxury', 'Flagship'] },
  ],
  infiniti: [
    { slug: 'q50', nameAr: 'Q50', nameEn: 'Q50', trims: ['Pure', 'Luxe', 'Sport', 'Red Sport'] },
    { slug: 'qx50', nameAr: 'QX50', nameEn: 'QX50', trims: ['Pure', 'Luxe', 'Essential', 'Sensory'] },
    { slug: 'qx60', nameAr: 'QX60', nameEn: 'QX60', trims: ['Pure', 'Luxe', 'Essential', 'Sensory'] },
    { slug: 'qx80', nameAr: 'QX80', nameEn: 'QX80', trims: ['Luxe', 'Premium Select', 'Sensory'] },
  ],
  cadillac: [
    { slug: 'ct4', nameAr: 'CT4', nameEn: 'CT4', trims: ['Luxury', 'Premium Luxury', 'Sport', 'V'] },
    { slug: 'ct5', nameAr: 'CT5', nameEn: 'CT5', trims: ['Luxury', 'Premium Luxury', 'Sport', 'V'] },
    { slug: 'escalade', nameAr: 'إسكاليد', nameEn: 'Escalade', trims: ['Luxury', 'Premium Luxury', 'Sport', 'Platinum'] },
    { slug: 'xt5', nameAr: 'XT5', nameEn: 'XT5', trims: ['Luxury', 'Premium Luxury', 'Sport'] },
  ],
  jaguar: [
    { slug: 'xe', nameAr: 'XE', nameEn: 'XE', trims: ['Base', 'Premium', 'R-Sport', 'S'] },
    { slug: 'xf', nameAr: 'XF', nameEn: 'XF', trims: ['Base', 'Premium', 'R-Sport', 'S'] },
    { slug: 'f_pace', nameAr: 'F-Pace', nameEn: 'F-Pace', trims: ['Base', 'Premium', 'R-Sport', 'SVR'] },
    { slug: 'e_pace', nameAr: 'E-Pace', nameEn: 'E-Pace', trims: ['Base', 'S', 'SE', 'R-Dynamic'] },
  ],
  'alfa-romeo': [
    { slug: 'giulia', nameAr: 'Giulia', nameEn: 'Giulia', trims: ['Base', 'Ti', 'Veloce', 'Quadrifoglio'] },
    { slug: 'stelvio', nameAr: 'Stelvio', nameEn: 'Stelvio', trims: ['Base', 'Ti', 'Veloce', 'Quadrifoglio'] },
    { slug: 'giulietta', nameAr: 'Giulietta', nameEn: 'Giulietta', trims: ['Base', 'Super', 'Veloce'] },
  ],
  // ─── P2: 20 popular brands ──────────────────────────────────────
  baic: [
    { slug: 'bj40', nameAr: 'BJ40', nameEn: 'BJ40', trims: ['Standard', 'Plus', 'Diamond'] },
    { slug: 'bj60', nameAr: 'BJ60', nameEn: 'BJ60', trims: ['Comfort', 'Luxury', 'Flagship'] },
    { slug: 'bj80', nameAr: 'BJ80', nameEn: 'BJ80', trims: ['Standard', 'Premium'] },
    { slug: 'x35', nameAr: 'X35', nameEn: 'X35', trims: ['Comfort', 'Luxury', 'Flagship'] },
    { slug: 'x55', nameAr: 'X55', nameEn: 'X55', trims: ['Comfort', 'Luxury', 'Flagship'] },
    { slug: 'x7', nameAr: 'X7', nameEn: 'X7', trims: ['Comfort', 'Luxury', 'Flagship'] },
  ],
  'great-wall': [
    { slug: 'poer', nameAr: 'Poer', nameEn: 'Poer', trims: ['Comfort', 'Elite', 'Premium'] },
    { slug: 'cannon', nameAr: 'Cannon', nameEn: 'Cannon', trims: ['Comfort', 'Premium'] },
    { slug: 'wingle', nameAr: 'Wingle', nameEn: 'Wingle', trims: ['Standard', 'Comfort'] },
    { slug: 'steed', nameAr: 'Steed', nameEn: 'Steed', trims: ['Standard', 'Elite'] },
    { slug: 'king-kong', nameAr: 'King Kong', nameEn: 'King Kong', trims: ['Standard', 'Elite'] },
  ],
  tank: [
    { slug: 'tank-300', nameAr: 'Tank 300', nameEn: 'Tank 300', trims: ['Comfort', 'City', 'Off-Road'] },
    { slug: 'tank-500', nameAr: 'Tank 500', nameEn: 'Tank 500', trims: ['Comfort', 'Luxury', 'Flagship'] },
    { slug: 'tank-800', nameAr: 'Tank 800', nameEn: 'Tank 800', trims: ['Luxury', 'Flagship'] },
  ],
  forthing: [
    { slug: 't5-evo', nameAr: 'T5 Evo', nameEn: 'T5 Evo', trims: ['Comfort', 'Luxury'] },
    { slug: 't5', nameAr: 'T5', nameEn: 'T5', trims: ['Comfort', 'Luxury'] },
    { slug: 's50', nameAr: 'S50', nameEn: 'S50', trims: ['Comfort', 'Luxury'] },
    { slug: 'm7', nameAr: 'M7', nameEn: 'M7', trims: ['Comfort', 'Luxury', 'Flagship'] },
  ],
  wuling: [
    { slug: 'hongguang', nameAr: 'Hongguang', nameEn: 'Hongguang', trims: ['Standard', 'Comfort'] },
    { slug: 'hongguang-s3', nameAr: 'Hongguang S3', nameEn: 'Hongguang S3', trims: ['Comfort', 'Luxury'] },
    { slug: 'air-ev', nameAr: 'Air EV', nameEn: 'Air EV', trims: ['Standard', 'Long Range'] },
    { slug: 'bingo', nameAr: 'Bingo', nameEn: 'Bingo', trims: ['Standard', 'Long Range'] },
    { slug: 'mini-ev', nameAr: 'Mini EV', nameEn: 'Mini EV', trims: ['Standard', 'Comfort'] },
  ],
  jac: [
    { slug: 'js3', nameAr: 'JS3', nameEn: 'JS3', trims: ['Comfort', 'Luxury'] },
    { slug: 'js4', nameAr: 'JS4', nameEn: 'JS4', trims: ['Comfort', 'Luxury'] },
    { slug: 'js6', nameAr: 'JS6', nameEn: 'JS6', trims: ['Comfort', 'Luxury', 'Flagship'] },
    { slug: 't6', nameAr: 'T6', nameEn: 'T6', trims: ['Standard', 'Comfort'] },
    { slug: 't8', nameAr: 'T8', nameEn: 'T8', trims: ['Comfort', 'Luxury'] },
  ],
  dongfeng: [
    { slug: 'ax7', nameAr: 'AX7', nameEn: 'AX7', trims: ['Comfort', 'Luxury', 'Flagship'] },
    { slug: 'h30', nameAr: 'H30', nameEn: 'H30', trims: ['Comfort', 'Luxury'] },
    { slug: 'e70', nameAr: 'E70', nameEn: 'E70', trims: ['Standard', 'Long Range'] },
    { slug: 'rich', nameAr: 'Rich', nameEn: 'Rich', trims: ['Standard', 'Comfort', 'Elite'] },
    { slug: 'glory-580', nameAr: 'Glory 580', nameEn: 'Glory 580', trims: ['Comfort', 'Luxury'] },
  ],
  foton: [
    { slug: 'tunland', nameAr: 'Tunland', nameEn: 'Tunland', trims: ['Standard', 'Comfort', 'Elite'] },
    { slug: 'view', nameAr: 'View', nameEn: 'View', trims: ['Standard', 'Comfort'] },
    { slug: 'gratour', nameAr: 'Gratour', nameEn: 'Gratour', trims: ['Standard', 'Comfort'] },
    { slug: 'sauvana', nameAr: 'Sauvana', nameEn: 'Sauvana', trims: ['Comfort', 'Luxury'] },
  ],
  maxus: [
    { slug: 't60', nameAr: 'T60', nameEn: 'T60', trims: ['Comfort', 'Elite', 'Premium'] },
    { slug: 't90', nameAr: 'T90', nameEn: 'T90', trims: ['Comfort', 'Elite', 'Premium'] },
    { slug: 'd60', nameAr: 'D60', nameEn: 'D60', trims: ['Comfort', 'Luxury'] },
    { slug: 'g50', nameAr: 'G50', nameEn: 'G50', trims: ['Comfort', 'Luxury'] },
    { slug: 'v80', nameAr: 'V80', nameEn: 'V80', trims: ['Standard', 'Comfort', 'Luxury'] },
  ],
  jmc: [
    { slug: 'vigus', nameAr: 'Vigus', nameEn: 'Vigus', trims: ['Standard', 'Comfort', 'Elite'] },
    { slug: 'boarding', nameAr: 'Boarding', nameEn: 'Boarding', trims: ['Standard', 'Comfort'] },
    { slug: 'carrying', nameAr: 'Carrying', nameEn: 'Carrying', trims: ['Standard', 'Comfort'] },
    { slug: 'baodian', nameAr: 'Baodian', nameEn: 'Baodian', trims: ['Standard', 'Comfort'] },
  ],
  mini: [
    { slug: 'cooper', nameAr: 'Cooper', nameEn: 'Cooper', trims: ['One', 'Cooper', 'Cooper S', 'JCW'] },
    { slug: 'countryman', nameAr: 'Countryman', nameEn: 'Countryman', trims: ['Cooper', 'Cooper S', 'JCW'] },
    { slug: 'clubman', nameAr: 'Clubman', nameEn: 'Clubman', trims: ['Cooper', 'Cooper S', 'JCW'] },
    { slug: 'convertible', nameAr: 'Convertible', nameEn: 'Convertible', trims: ['Cooper', 'Cooper S'] },
    { slug: 'john-cooper-works', nameAr: 'John Cooper Works', nameEn: 'John Cooper Works', trims: ['Standard', 'GP'] },
  ],
  fiat: [
    { slug: '500', nameAr: '500', nameEn: '500', trims: ['Pop', 'Lounge', 'Sport'] },
    { slug: '500x', nameAr: '500X', nameEn: '500X', trims: ['Pop', 'Lounge', 'Sport'] },
    { slug: '500l', nameAr: '500L', nameEn: '500L', trims: ['Pop', 'Lounge'] },
    { slug: 'panda', nameAr: 'Panda', nameEn: 'Panda', trims: ['Standard', 'City', 'Cross'] },
    { slug: 'tipo', nameAr: 'Tipo', nameEn: 'Tipo', trims: ['Standard', 'Comfort', 'Lounge'] },
  ],
  subaru: [
    { slug: 'impreza', nameAr: 'Impreza', nameEn: 'Impreza', trims: ['Base', 'Premium', 'Sport', 'Limited'] },
    { slug: 'legacy', nameAr: 'Legacy', nameEn: 'Legacy', trims: ['Base', 'Premium', 'Limited', 'Touring'] },
    { slug: 'outback', nameAr: 'Outback', nameEn: 'Outback', trims: ['Base', 'Premium', 'Limited', 'Touring', 'Wilderness'] },
    { slug: 'forester', nameAr: 'Forester', nameEn: 'Forester', trims: ['Base', 'Premium', 'Sport', 'Limited', 'Touring'] },
    { slug: 'crosstrek', nameAr: 'Crosstrek', nameEn: 'Crosstrek', trims: ['Base', 'Premium', 'Sport', 'Limited'] },
    { slug: 'wrx', nameAr: 'WRX', nameEn: 'WRX', trims: ['Base', 'Premium', 'Limited', 'GT'] },
  ],
  dodge: [
    { slug: 'charger', nameAr: 'Charger', nameEn: 'Charger', trims: ['SXT', 'GT', 'R/T', 'Scat Pack', 'Hellcat'] },
    { slug: 'challenger', nameAr: 'Challenger', nameEn: 'Challenger', trims: ['SXT', 'GT', 'R/T', 'Scat Pack', 'Hellcat'] },
    { slug: 'durango', nameAr: 'Durango', nameEn: 'Durango', trims: ['SXT', 'GT', 'R/T', 'Citadel', 'SRT'] },
    { slug: 'journey', nameAr: 'Journey', nameEn: 'Journey', trims: ['SE', 'SXT', 'Crossroad', 'GT'] },
  ],
  chrysler: [
    { slug: '300', nameAr: '300', nameEn: '300', trims: ['Touring', 'Limited', 'S', 'C'] },
    { slug: 'pacifica', nameAr: 'Pacifica', nameEn: 'Pacifica', trims: ['Touring', 'Touring L', 'Limited', 'Pinnacle'] },
    { slug: 'voyager', nameAr: 'Voyager', nameEn: 'Voyager', trims: ['L', 'LX'] },
  ],
  acura: [
    { slug: 'tlx', nameAr: 'TLX', nameEn: 'TLX', trims: ['Base', 'Tech', 'A-Spec', 'Advance', 'Type S'] },
    { slug: 'rdx', nameAr: 'RDX', nameEn: 'RDX', trims: ['Base', 'Tech', 'A-Spec', 'Advance'] },
    { slug: 'mdx', nameAr: 'MDX', nameEn: 'MDX', trims: ['Base', 'Tech', 'A-Spec', 'Advance', 'Type S'] },
    { slug: 'integra', nameAr: 'Integra', nameEn: 'Integra', trims: ['Base', 'A-Spec', 'Type S'] },
  ],
  buick: [
    { slug: 'lacrosse', nameAr: 'LaCrosse', nameEn: 'LaCrosse', trims: ['Base', 'Preferred', 'Essence', 'Avenir'] },
    { slug: 'regal', nameAr: 'Regal', nameEn: 'Regal', trims: ['Base', 'Preferred', 'Essence', 'Avenir'] },
    { slug: 'enclave', nameAr: 'Enclave', nameEn: 'Enclave', trims: ['Base', 'Preferred', 'Essence', 'Avenir'] },
    { slug: 'encore', nameAr: 'Encore', nameEn: 'Encore', trims: ['Base', 'Preferred', 'Sport Touring', 'Essence'] },
    { slug: 'envision', nameAr: 'Envision', nameEn: 'Envision', trims: ['Base', 'Preferred', 'Essence', 'Avenir'] },
  ],
  ram: [
    { slug: '1500', nameAr: '1500', nameEn: '1500', trims: ['Tradesman', 'Big Horn', 'Laramie', 'Rebel', 'Limited', 'TRX'] },
    { slug: '2500', nameAr: '2500', nameEn: '2500', trims: ['Tradesman', 'Big Horn', 'Laramie', 'Power Wagon', 'Limited'] },
    { slug: '3500', nameAr: '3500', nameEn: '3500', trims: ['Tradesman', 'Big Horn', 'Laramie', 'Limited'] },
    { slug: 'promaster', nameAr: 'ProMaster', nameEn: 'ProMaster', trims: ['1500', '2500', '3500'] },
  ],
  isuzu: [
    { slug: 'd-max', nameAr: 'D-Max', nameEn: 'D-Max', trims: ['LS', 'LS-A', 'LS-M', 'X-Rider'] },
    { slug: 'mu-x', nameAr: 'MU-X', nameEn: 'MU-X', trims: ['LS-M', 'LS-T', 'LS-U'] },
    { slug: 'npr', nameAr: 'NPR', nameEn: 'NPR', trims: ['Standard', 'Crew', 'Tipper'] },
    { slug: 'nqr', nameAr: 'NQR', nameEn: 'NQR', trims: ['Standard', 'Crew'] },
  ],
  daihatsu: [
    { slug: 'terios', nameAr: 'Terios', nameEn: 'Terios', trims: ['Standard', 'Comfort', 'Rugged'] },
    { slug: 'gran-max', nameAr: 'Gran Max', nameEn: 'Gran Max', trims: ['Standard', 'Comfort', 'Luxury'] },
    { slug: 'sirion', nameAr: 'Sirion', nameEn: 'Sirion', trims: ['Standard', 'Comfort'] },
    { slug: 'xenia', nameAr: 'Xenia', nameEn: 'Xenia', trims: ['Standard', 'Comfort', 'Luxury'] },
  ],
};

export function getModelsForMake(makeSlug: string): readonly CarModel[] {
  return CAR_MODELS[makeSlug] ?? [];
}

/**
 * Look up a model by slug OR by its Arabic/English name.
 * Accepts "camry", "Camry", or "كامري" so callers don't break when
 * the wizard emits nameEn and the data stores slug.
 */
export function getModelBySlug(makeSlug: string, modelSlug: string): CarModel | undefined {
  const models = CAR_MODELS[makeSlug];
  if (!models || !modelSlug) return undefined;
  const lower = modelSlug.toLowerCase().trim();
  return models.find(
    (m) =>
      m.slug === modelSlug ||
      m.nameEn.toLowerCase() === lower ||
      m.nameAr === modelSlug
  );
}

export function hasCuratedModels(makeSlug: string): boolean {
  return (CAR_MODELS[makeSlug]?.length ?? 0) > 0;
      }
