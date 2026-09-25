class ListingField {
  const ListingField({
    required this.key,
    required this.labelAr,
    required this.labelEn,
    this.optionsAr = const [],
    this.optionsEn = const [],
    this.keyboard = "text",
  });
  final String key;
  final String labelAr;
  final String labelEn;
  final List<String> optionsAr;
  final List<String> optionsEn;
  final String keyboard;
}

class ListingPack {
  const ListingPack({
    required this.fields,
    this.minPhotos = 1,
    this.maxPhotos = 8,
  });
  final List<ListingField> fields;
  final int minPhotos;
  final int maxPhotos;
}

const years = [
  "2026", "2025", "2024", "2023", "2022", "2021", "2020", "2019", "2018", "2017",
  "2016", "2015", "2014", "2013", "2012", "2011", "2010", "2008", "2005", "2000",
];

const condition = ListingField(key: "condition", labelAr: "الحالة", labelEn: "Condition", optionsAr: ["جديد", "مستعمل"], optionsEn: ["New", "Used"]);
const make = ListingField(key: "make", labelAr: "الشركة", labelEn: "Make");
const model = ListingField(key: "model", labelAr: "الموديل", labelEn: "Model");
const year = ListingField(key: "year", labelAr: "سنة الصنع", labelEn: "Year", optionsAr: years, optionsEn: years);
const km = ListingField(key: "km", labelAr: "الكيلومترات", labelEn: "Mileage (km)", keyboard: "number");
const gear = ListingField(key: "gear", labelAr: "ناقل الحركة", labelEn: "Transmission", optionsAr: ["أوتوماتيك", "عادي"], optionsEn: ["Automatic", "Manual"]);
const fuel = ListingField(key: "fuel", labelAr: "الوقود", labelEn: "Fuel", optionsAr: ["بنزين", "ديزل", "هايبرد", "كهرباء", "غاز"], optionsEn: ["Petrol", "Diesel", "Hybrid", "Electric", "Gas"]);
const body = ListingField(key: "body", labelAr: "نوع الهيكل", labelEn: "Body type", optionsAr: ["سيدان", "دفع رباعي", "هاتشباك", "كوبيه", "بيك أب", "فان", "أخرى"], optionsEn: ["Sedan", "SUV", "Hatchback", "Coupe", "Pickup", "Van", "Other"]);
const seats = ListingField(key: "seats", labelAr: "عدد المقاعد", labelEn: "Seats", optionsAr: ["2", "4", "5", "7", "8+"], optionsEn: ["2", "4", "5", "7", "8+"]);
const specs = ListingField(key: "specs", labelAr: "المواصفات", labelEn: "Specs", optionsAr: ["خليجي", "وارد أمريكا", "وارد أوروبا", "محلي", "أخرى"], optionsEn: ["GCC", "US spec", "European spec", "Local", "Other"]);
const color = ListingField(key: "color", labelAr: "اللون", labelEn: "Color");
const owners = ListingField(key: "owners", labelAr: "عدد المالكين", labelEn: "Owners", optionsAr: ["مالك واحد", "مالكين", "أكثر"], optionsEn: ["One owner", "Two owners", "More"]);
const payment = ListingField(key: "payment", labelAr: "طريقة الدفع", labelEn: "Payment", optionsAr: ["كاش", "أقساط", "قابل للتفاوض"], optionsEn: ["Cash", "Installments", "Negotiable"]);

const inspect = ListingField(key: "inspect", labelAr: "الفحص", labelEn: "Inspection", optionsAr: ["مفحوص", "غير مفحوص", "بحاجة فحص"], optionsEn: ["Inspected", "Not inspected", "Needs inspection"]);

const vehicleCore = [condition, make, model, year, km, inspect, gear, fuel, body, seats, specs, color, owners, payment];

const listingPacks = <String, ListingPack>{
  "cars-sale": ListingPack(fields: vehicleCore, minPhotos: 3, maxPhotos: 12),
  "cars-rent": ListingPack(fields: [make, model, year, fuel, gear, ListingField(key: "period", labelAr: "مدة الإيجار", labelEn: "Rental period", optionsAr: ["يومي", "أسبوعي", "شهري"], optionsEn: ["Daily", "Weekly", "Monthly"]), payment], minPhotos: 3, maxPhotos: 10),
  "motorcycles": ListingPack(fields: [condition, make, model, year, km, fuel, color, payment], minPhotos: 3, maxPhotos: 10),
  "heavy": ListingPack(fields: [condition, make, model, year, km, payment], minPhotos: 3, maxPhotos: 10),
  "trucks-buses": ListingPack(fields: [condition, make, model, year, km, fuel, gear, payment], minPhotos: 3, maxPhotos: 10),
  "boats": ListingPack(fields: [condition, make, model, year, payment], minPhotos: 3, maxPhotos: 10),
  "plate-numbers": ListingPack(fields: [ListingField(key: "plate", labelAr: "رقم اللوحة", labelEn: "Plate number"), ListingField(key: "code", labelAr: "رمز/محافظة اللوحة", labelEn: "Plate code"), payment], minPhotos: 1, maxPhotos: 4),
  "tires-rims": ListingPack(fields: [condition, ListingField(key: "size", labelAr: "المقاس", labelEn: "Size"), payment], minPhotos: 2, maxPhotos: 8),
  "spare-parts": ListingPack(fields: [condition, make, model, year, ListingField(key: "part", labelAr: "نوع القطعة", labelEn: "Part type"), payment], minPhotos: 2, maxPhotos: 8),
  "accessories": ListingPack(fields: [condition, ListingField(key: "part", labelAr: "نوع الإكسسوار", labelEn: "Accessory type"), payment], minPhotos: 2, maxPhotos: 8),
  "scrap": ListingPack(fields: [make, model, year, ListingField(key: "part", labelAr: "الوصف المختصر", labelEn: "Short type"), payment], minPhotos: 2, maxPhotos: 8),
};

ListingPack packFor(String? subcategorySlug) =>
    listingPacks[subcategorySlug] ?? const ListingPack(fields: []);

List<ListingField> fieldsFor({String? categorySlug, String? subcategorySlug}) =>
    packFor(subcategorySlug).fields;
