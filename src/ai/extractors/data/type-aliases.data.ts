// RULE-14-EXCEPTION: Static taxonomy
export const TYPE_ALIASES_EXPANDED: ReadonlyArray<{
  readonly canonical: string;
  readonly aliases: readonly string[];
  readonly categorySlug: string;
}> = [
  { canonical: 'رواية', aliases: ['روايه', 'روايات', 'novel'], categorySlug: 'books' },
  { canonical: 'كتاب', aliases: ['كتابة', 'كتب', 'book'], categorySlug: 'books' },
  { canonical: 'مجلات', aliases: ['مجلة', 'مجله', 'magazine'], categorySlug: 'books' },
  { canonical: 'شامبو', aliases: ['شنبو', 'shampoo'], categorySlug: 'beauty' },
  { canonical: 'خيمة', aliases: ['خيمه', 'خيام', 'tent'], categorySlug: 'sports' },
  { canonical: 'غسالة', aliases: ['غساله', 'غسالات', 'washing machine'], categorySlug: 'electronics' },
  { canonical: 'سماعة', aliases: ['سماعه', 'سماعات', 'headphones', 'headset'], categorySlug: 'electronics' },
  { canonical: 'عطر', aliases: ['عطور', 'عطره', 'perfume'], categorySlug: 'beauty' },
  { canonical: 'مكياج', aliases: ['مكياجات', 'cosmetics', 'ميكب'], categorySlug: 'beauty' },
  { canonical: 'عناية', aliases: ['عنايه', 'care', 'skincare'], categorySlug: 'beauty' },
  { canonical: 'عربة', aliases: ['عربيه', 'عربية اطفال', 'stroller'], categorySlug: 'kids' },
  { canonical: 'ملابس', aliases: ['ملابس أطفال', 'ملابس اطفال', 'kids clothes'], categorySlug: 'kids' },
  { canonical: 'ألعاب', aliases: ['ألعاب أطفال', 'العاب اطفال', 'toys'], categorySlug: 'kids' },
  { canonical: 'أثقال', aliases: ['dumbbells', 'دمبلز', 'دمبل'], categorySlug: 'sports' },
  { canonical: 'دراجة هوائية', aliases: ['دراجه هوائيه', 'bike', 'bicycle', 'بسكليت'], categorySlug: 'sports' },
  { canonical: 'كراكيب', aliases: ['كراكيب', 'used stuff', 'misc'], categorySlug: 'krakeeb' },
  { canonical: 'كنبة', aliases: ['كنبه', 'كنب', 'sofa'], categorySlug: 'furniture' },
  { canonical: 'عباية', aliases: ['عبايه', 'عباءة', 'abaya'], categorySlug: 'fashion' },
  { canonical: 'فستان', aliases: ['فساتين', 'dress'], categorySlug: 'fashion' },
  { canonical: 'سبليت', aliases: ['سبلت', 'مكيف سبليت', 'split'], categorySlug: 'handymen' },
  { canonical: 'نبتة', aliases: ['نبته', 'نباتات', 'plant'], categorySlug: 'home-garden' },
  { canonical: 'شواية', aliases: ['شوايه', 'منقل', 'bbq'], categorySlug: 'home-garden' },
  { canonical: 'قطة', aliases: ['قطوة', 'بسة', 'cat'], categorySlug: 'pets' },
  { canonical: 'خزانات', aliases: ['خزان', 'خزان ماء', 'water tank'], categorySlug: 'cleaning' },
];
