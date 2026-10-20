// RULE-14-EXCEPTION: Static brand taxonomy
export interface CarBrand {
  readonly slug: string;
  readonly nameAr: string;
  readonly nameEn: string;
  readonly popular: boolean;
  /** true = models defined in carModels.ts (dropdown). false/undefined = text fallback. */
  readonly hasModels?: boolean;
}

export const CAR_BRANDS: readonly CarBrand[] = [
  // ── Popular Brands with Curated Models ──
  { slug: 'toyota', nameAr: 'تويوتا', nameEn: 'Toyota', popular: true, hasModels: true },
  { slug: 'hyundai', nameAr: 'هيونداي', nameEn: 'Hyundai', popular: true, hasModels: true },
  { slug: 'nissan', nameAr: 'نيسان', nameEn: 'Nissan', popular: true, hasModels: true },
  { slug: 'kia', nameAr: 'كيا', nameEn: 'Kia', popular: true, hasModels: true },
  { slug: 'mitsubishi', nameAr: 'ميتسوبيشي', nameEn: 'Mitsubishi', popular: true, hasModels: true },
  { slug: 'honda', nameAr: 'هوندا', nameEn: 'Honda', popular: true, hasModels: true },
  { slug: 'mazda', nameAr: 'مازدا', nameEn: 'Mazda', popular: true, hasModels: true },
  { slug: 'suzuki', nameAr: 'سوزوكي', nameEn: 'Suzuki', popular: true, hasModels: true },
  { slug: 'chery', nameAr: 'شيري', nameEn: 'Chery', popular: true, hasModels: true },
  { slug: 'mg', nameAr: 'إم جي', nameEn: 'MG', popular: true, hasModels: true },
  { slug: 'geely', nameAr: 'جيلي', nameEn: 'Geely', popular: true, hasModels: true },
  { slug: 'byd', nameAr: 'بي واي دي', nameEn: 'BYD', popular: true, hasModels: true },
  { slug: 'bmw', nameAr: 'بي إم دبليو', nameEn: 'BMW', popular: true, hasModels: true },
  { slug: 'mercedes', nameAr: 'مرسيدس', nameEn: 'Mercedes-Benz', popular: true, hasModels: true },
  { slug: 'audi', nameAr: 'أودي', nameEn: 'Audi', popular: true, hasModels: true },
  { slug: 'volkswagen', nameAr: 'فولكس فاجن', nameEn: 'Volkswagen', popular: true, hasModels: true },
  { slug: 'ford', nameAr: 'فورد', nameEn: 'Ford', popular: true, hasModels: true },
  { slug: 'chevrolet', nameAr: 'شيفروليه', nameEn: 'Chevrolet', popular: true, hasModels: true },
  { slug: 'jeep', nameAr: 'جيب', nameEn: 'Jeep', popular: true, hasModels: true },
  
  // ── Chinese Brands (Expanded) ──
  { slug: 'jaecoo', nameAr: 'جايكو', nameEn: 'Jaecoo', popular: false, hasModels: true },
  { slug: 'nio', nameAr: 'نيو', nameEn: 'NIO', popular: false, hasModels: true },
  { slug: 'xpeng', nameAr: 'إكس بنغ', nameEn: 'XPeng', popular: false, hasModels: true },
  { slug: 'zeekr', nameAr: 'زيكر', nameEn: 'Zeekr', popular: false, hasModels: true },
  { slug: 'li-auto', nameAr: 'لي أوتو', nameEn: 'Li Auto', popular: false, hasModels: true },
  { slug: 'rox-motor', nameAr: 'روكس', nameEn: 'Rox Motor', popular: false, hasModels: true },
  { slug: 'skyworth', nameAr: 'سكاي وورث', nameEn: 'Skyworth', popular: false, hasModels: true },
  { slug: 'aion', nameAr: 'أيون', nameEn: 'Aion', popular: false, hasModels: true },
  { slug: 'hyptec', nameAr: 'هيبتك', nameEn: 'Hyptec', popular: false, hasModels: true },
  { slug: 'faw-bestune', nameAr: 'فاو بستون', nameEn: 'FAW Bestune', popular: false, hasModels: true },
  { slug: 'wuling', nameAr: 'وولينغ', nameEn: 'Wuling', popular: false, hasModels: true },
  { slug: 'soueast', nameAr: 'سوإيست', nameEn: 'Soueast', popular: false, hasModels: true },
  { slug: 'kaiyi', nameAr: 'كايي', nameEn: 'Kaiyi', popular: false, hasModels: true },
  { slug: 'cowin', nameAr: 'كوين', nameEn: 'Cowin', popular: false, hasModels: true },
  { slug: 'venucia', nameAr: 'فينوشيا', nameEn: 'Venucia', popular: false, hasModels: true },
  { slug: 'baojun', nameAr: 'باوجون', nameEn: 'Baojun', popular: false, hasModels: true },
  { slug: 'roewe', nameAr: 'رووي', nameEn: 'Roewe', popular: false, hasModels: true },
  { slug: 'rising-auto', nameAr: 'رايزينغ أوتو', nameEn: 'Rising Auto', popular: false, hasModels: true },
  { slug: 'im-motors', nameAr: 'آي إم موتورز', nameEn: 'IM Motors', popular: false, hasModels: true },
  { slug: 'aito', nameAr: 'آيتو', nameEn: 'AITO', popular: false, hasModels: true },
  { slug: 'luxeed', nameAr: 'لوكسيد', nameEn: 'Luxeed', popular: false, hasModels: true },
  { slug: 'icar', nameAr: 'آي كار', nameEn: 'iCar', popular: false, hasModels: true },
  { slug: 'leapmotor', nameAr: 'ليب موتور', nameEn: 'Leapmotor', popular: false, hasModels: true },
  { slug: 'neta', nameAr: 'نيتا', nameEn: 'Neta', popular: false, hasModels: true },
  { slug: 'lynk-co', nameAr: 'لينك آند كو', nameEn: 'Lynk & Co', popular: false, hasModels: true },
  { slug: 'haval', nameAr: 'هافال', nameEn: 'Haval', popular: false, hasModels: true },
  { slug: 'great-wall', nameAr: 'جريت وول', nameEn: 'Great Wall', popular: false, hasModels: true },
  { slug: 'changan', nameAr: 'شانجان', nameEn: 'Changan', popular: false, hasModels: true },
  { slug: 'dongfeng', nameAr: 'دونغ فينغ', nameEn: 'Dongfeng', popular: false, hasModels: true },
  { slug: 'jac', nameAr: 'جاك', nameEn: 'JAC', popular: false, hasModels: true },
  { slug: 'gac', nameAr: 'جي أيه سي', nameEn: 'GAC', popular: false, hasModels: true },
  { slug: 'hongqi', nameAr: 'هونغ تشي', nameEn: 'Hongqi', popular: false, hasModels: true },
  { slug: 'exeed', nameAr: 'إكسيد', nameEn: 'EXEED', popular: false, hasModels: true },
  { slug: 'jetour', nameAr: 'جيتور', nameEn: 'Jetour', popular: false, hasModels: true },
  { slug: 'omoda', nameAr: 'أومودا', nameEn: 'Omoda', popular: false, hasModels: true },
  { slug: 'forthing', nameAr: 'فورثينغ', nameEn: 'Forthing', popular: false, hasModels: true },
  { slug: 'baic', nameAr: 'بايك', nameEn: 'Baic', popular: false, hasModels: true },
  { slug: 'tank', nameAr: 'تانك', nameEn: 'Tank', popular: false, hasModels: true },
  { slug: 'foton', nameAr: 'فوتون', nameEn: 'Foton', popular: false, hasModels: true },
  { slug: 'jmc', nameAr: 'جي إم سي', nameEn: 'JMC', popular: false, hasModels: true },
  { slug: 'maxus', nameAr: 'ماكسوس', nameEn: 'Maxus', popular: false, hasModels: true },

  // ── Other International Brands ──
  { slug: 'land-rover', nameAr: 'لاند روفر', nameEn: 'Land Rover', popular: false, hasModels: true },
  { slug: 'porsche', nameAr: 'بورش', nameEn: 'Porsche', popular: false, hasModels: true },
  { slug: 'lexus', nameAr: 'لكزس', nameEn: 'Lexus', popular: false, hasModels: true },
  { slug: 'infiniti', nameAr: 'إنفينيتي', nameEn: 'Infiniti', popular: false, hasModels: true },
  { slug: 'tesla', nameAr: 'تسلا', nameEn: 'Tesla', popular: false, hasModels: true },
  { slug: 'volvo', nameAr: 'فولفو', nameEn: 'Volvo', popular: false, hasModels: true },
  { slug: 'opel', nameAr: 'أوبل', nameEn: 'Opel', popular: false, hasModels: true },
  { slug: 'peugeot', nameAr: 'بيجو', nameEn: 'Peugeot', popular: false, hasModels: true },
  { slug: 'renault', nameAr: 'رينو', nameEn: 'Renault', popular: false, hasModels: true },
  { slug: 'skoda', nameAr: 'سكودا', nameEn: 'Škoda', popular: false, hasModels: true },
  { slug: 'seat', nameAr: 'سيات', nameEn: 'SEAT', popular: false, hasModels: true },
  { slug: 'daihatsu', nameAr: 'دايهاتسو', nameEn: 'Daihatsu', popular: false, hasModels: true },
  { slug: 'isuzu', nameAr: 'إيسوزو', nameEn: 'Isuzu', popular: false, hasModels: true },
  { slug: 'gmc', nameAr: 'جي إم سي', nameEn: 'GMC', popular: false, hasModels: true },
  { slug: 'dodge', nameAr: 'دودج', nameEn: 'Dodge', popular: false, hasModels: true },
  { slug: 'chrysler', nameAr: 'كرايسلر', nameEn: 'Chrysler', popular: false, hasModels: true },
  { slug: 'cadillac', nameAr: 'كاديلاك', nameEn: 'Cadillac', popular: false, hasModels: true },
  { slug: 'jaguar', nameAr: 'جاكوار', nameEn: 'Jaguar', popular: false, hasModels: true },
  { slug: 'mini', nameAr: 'ميني', nameEn: 'MINI', popular: false, hasModels: true },
  { slug: 'fiat', nameAr: 'فيات', nameEn: 'Fiat', popular: false, hasModels: true },
  { slug: 'acura', nameAr: 'أكيورا', nameEn: 'Acura', popular: false, hasModels: true },
  { slug: 'subaru', nameAr: 'سوبارو', nameEn: 'Subaru', popular: false, hasModels: true },
  { slug: 'genesis', nameAr: 'جينيسيس', nameEn: 'Genesis', popular: false, hasModels: true },
  { slug: 'ssangyong', nameAr: 'سانغ يونغ', nameEn: 'SsangYong', popular: false, hasModels: true },
  { slug: 'saab', nameAr: 'ساب', nameEn: 'Saab', popular: false, hasModels: true },
  { slug: 'ds', nameAr: 'دي إس', nameEn: 'DS', popular: false, hasModels: true },
  { slug: 'alfa-romeo', nameAr: 'ألفا روميو', nameEn: 'Alfa Romeo', popular: false, hasModels: true },
  { slug: 'ferrari', nameAr: 'فيراري', nameEn: 'Ferrari', popular: false, hasModels: true },
  { slug: 'lamborghini', nameAr: 'لامبورغيني', nameEn: 'Lamborghini', popular: false, hasModels: true },
  { slug: 'maserati', nameAr: 'مازيراتي', nameEn: 'Maserati', popular: false, hasModels: true },
  { slug: 'bentley', nameAr: 'بنتلي', nameEn: 'Bentley', popular: false, hasModels: true },
  { slug: 'rolls-royce', nameAr: 'رولز رويس', nameEn: 'Rolls-Royce', popular: false, hasModels: true },
  { slug: 'aston-martin', nameAr: 'أستون مارتن', nameEn: 'Aston Martin', popular: false, hasModels: true },
  { slug: 'lotus', nameAr: 'لوتس', nameEn: 'Lotus', popular: false, hasModels: true },
  { slug: 'mclaren', nameAr: 'ماكلارين', nameEn: 'McLaren', popular: false, hasModels: true },
  { slug: 'buick', nameAr: 'بيوك', nameEn: 'Buick', popular: false, hasModels: true },
  { slug: 'lincoln', nameAr: 'لينكولن', nameEn: 'Lincoln', popular: false, hasModels: true },
  { slug: 'ram', nameAr: 'رام', nameEn: 'RAM', popular: false, hasModels: true },
  { slug: 'hummer', nameAr: 'هامر', nameEn: 'Hummer', popular: false, hasModels: true },
  { slug: 'man', nameAr: 'مان', nameEn: 'MAN', popular: false, hasModels: true },
  { slug: 'scania', nameAr: 'سكانيا', nameEn: 'Scania', popular: false, hasModels: true },
  { slug: 'iveco', nameAr: 'إيفيكو', nameEn: 'Iveco', popular: false, hasModels: true },
  { slug: 'hino', nameAr: 'هينو', nameEn: 'Hino', popular: false, hasModels: true },
  { slug: 'fuso', nameAr: 'فوسو', nameEn: 'Fuso', popular: false, hasModels: true },
  { slug: 'kamaz', nameAr: 'كاماز', nameEn: 'Kamaz', popular: false, hasModels: true },
  { slug: 'smart', nameAr: 'سمارت', nameEn: 'Smart', popular: false, hasModels: true },
  { slug: 'polestar', nameAr: 'بولستار', nameEn: 'Polestar', popular: false, hasModels: true },
  { slug: 'rivian', nameAr: 'ريفيان', nameEn: 'Rivian', popular: false, hasModels: true },
  { slug: 'tata', nameAr: 'تاتا', nameEn: 'Tata', popular: false, hasModels: true },
  { slug: 'plymouth', nameAr: 'بلايموث', nameEn: 'Plymouth', popular: false, hasModels: true },
  { slug: 'imperial', nameAr: 'إمبريال', nameEn: 'Imperial', popular: false, hasModels: true },
  { slug: 'ineos', nameAr: 'إينيوس', nameEn: 'Ineos', popular: false, hasModels: true },
  
  // ── Fallback (no curated models by design) ──
  { slug: 'other', nameAr: 'أخرى', nameEn: 'Other', popular: false },
];

export function getBrandOptions() {
  return CAR_BRANDS.map((b) => ({
    value: b.slug,
    labelAr: b.nameAr,
    labelEn: b.nameEn,
  }));
}

/**
 * Get a brand by slug. Returns undefined if not found.
 */
export function getBrandBySlug(slug: string): CarBrand | undefined {
  return CAR_BRANDS.find((b) => b.slug === slug);
    }
