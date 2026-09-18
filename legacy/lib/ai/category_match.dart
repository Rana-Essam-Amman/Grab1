/// How to handle section vs photo/text mismatch.
/// Change this one value. Screens already support both.
enum MismatchPolicy { silent, confirm }

const mismatchPolicy = MismatchPolicy.confirm;

class CategoryHint {
  const CategoryHint({required this.categorySlug, required this.subcategorySlug, required this.labelAr, required this.labelEn});
  final String categorySlug;
  final String subcategorySlug;
  final String labelAr;
  final String labelEn;
}

const textSignals = <String, CategoryHint>{
  "كامري": CategoryHint(categorySlug: "motors", subcategorySlug: "cars-sale", labelAr: "سيارات للبيع", labelEn: "Cars for sale"),
  "camry": CategoryHint(categorySlug: "motors", subcategorySlug: "cars-sale", labelAr: "سيارات للبيع", labelEn: "Cars for sale"),
  "تويوتا": CategoryHint(categorySlug: "motors", subcategorySlug: "cars-sale", labelAr: "سيارات للبيع", labelEn: "Cars for sale"),
  "toyota": CategoryHint(categorySlug: "motors", subcategorySlug: "cars-sale", labelAr: "سيارات للبيع", labelEn: "Cars for sale"),
  "سيارة": CategoryHint(categorySlug: "motors", subcategorySlug: "cars-sale", labelAr: "سيارات للبيع", labelEn: "Cars for sale"),
  "للبيع سيارة": CategoryHint(categorySlug: "motors", subcategorySlug: "cars-sale", labelAr: "سيارات للبيع", labelEn: "Cars for sale"),
  "شقة": CategoryHint(categorySlug: "real-estate", subcategorySlug: "sale", labelAr: "عقارات للبيع", labelEn: "Property for sale"),
  "فيلا": CategoryHint(categorySlug: "real-estate", subcategorySlug: "sale", labelAr: "عقارات للبيع", labelEn: "Property for sale"),
  "كنب": CategoryHint(categorySlug: "furniture", subcategorySlug: "home", labelAr: "أثاث منزلي", labelEn: "Home furniture"),
  "كنبة": CategoryHint(categorySlug: "furniture", subcategorySlug: "home", labelAr: "أثاث منزلي", labelEn: "Home furniture"),
  "آيفون": CategoryHint(categorySlug: "mobiles", subcategorySlug: "phones", labelAr: "هواتف", labelEn: "Phones"),
  "iphone": CategoryHint(categorySlug: "mobiles", subcategorySlug: "phones", labelAr: "هواتف", labelEn: "Phones"),
};

class CategoryMatch {
  const CategoryMatch({
    required this.chosenCategory,
    required this.chosenSub,
    required this.effectiveCategory,
    required this.effectiveSub,
    required this.mismatch,
    this.suggested,
  });
  final String chosenCategory;
  final String chosenSub;
  final String effectiveCategory;
  final String effectiveSub;
  final bool mismatch;
  final CategoryHint? suggested;
}

CategoryHint? hintFromNote(String raw) {
  final t = raw.toLowerCase();
  for (final entry in textSignals.entries) {
    if (t.contains(entry.key.toLowerCase())) return entry.value;
  }
  return null;
}

/// Photos later call the same function with a vision hint.
/// Today the hint comes from text only. The contract does not change.
CategoryMatch matchCategory({
  required String chosenCategory,
  required String chosenSub,
  required String note,
  CategoryHint? visionHint,
}) {
  final hinted = visionHint ?? hintFromNote(note);
  if (hinted == null || hinted.categorySlug == chosenCategory) {
    return CategoryMatch(
      chosenCategory: chosenCategory,
      chosenSub: chosenSub,
      effectiveCategory: chosenCategory,
      effectiveSub: chosenSub,
      mismatch: false,
    );
  }
  final silent = mismatchPolicy == MismatchPolicy.silent;
  return CategoryMatch(
    chosenCategory: chosenCategory,
    chosenSub: chosenSub,
    effectiveCategory: silent ? hinted.categorySlug : chosenCategory,
    effectiveSub: silent ? hinted.subcategorySlug : chosenSub,
    mismatch: true,
    suggested: hinted,
  );
}
