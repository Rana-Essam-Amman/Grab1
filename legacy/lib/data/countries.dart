class CurrencyOption {
  const CurrencyOption({required this.code, required this.symbol, required this.nameAr, required this.nameEn});
  final String code;
  final String symbol;
  final String nameAr;
  final String nameEn;
}

class CountryConfig {
  const CountryConfig({
    required this.code,
    required this.nameEn,
    required this.nameAr,
    required this.currencies,
    required this.governoratesEn,
    required this.governoratesAr,
  });

  final String code;
  final String nameEn;
  final String nameAr;
  final List<CurrencyOption> currencies;
  final List<String> governoratesEn;
  final List<String> governoratesAr;

  String get currency => currencies.first.code;
  String get currencySymbol => currencies.first.symbol;
  bool get hasCurrencyChoice => currencies.length > 1;

  String get flagUrl => "assets/flags/${code.toLowerCase()}.png";
  String get flagEmoji => switch (code) {
        "JO" => "🇯🇴",
        "LB" => "🇱🇧",
        "PS" => "🇵🇸",
        "SY" => "🇸🇾",
        _ => "🏳️",
      };
}

const countries = <CountryConfig>[
  CountryConfig(
    code: "JO",
    nameEn: "Jordan",
    nameAr: "الأردن",
    currencies: const [CurrencyOption(code: "JOD", symbol: "د.أ", nameAr: "دينار أردني", nameEn: "Jordanian Dinar")],
    governoratesEn: ["Amman", "Irbid", "Zarqa", "Balqa", "Madaba", "Karak", "Tafilah", "Ma'an", "Aqaba", "Mafraq", "Jerash", "Ajloun"],
    governoratesAr: ["عمّان", "إربد", "الزرقاء", "البلقاء", "مادبا", "الكرك", "الطفيلة", "معان", "العقبة", "المفرق", "جرش", "عجلون"],
  ),
  CountryConfig(
    code: "LB",
    nameEn: "Lebanon",
    nameAr: "لبنان",
    currencies: const [
      CurrencyOption(code: "LBP", symbol: "ل.ل", nameAr: "ليرة لبنانية", nameEn: "Lebanese Pound"),
      CurrencyOption(code: "USD", symbol: "\$", nameAr: "دولار", nameEn: "US Dollar"),
    ],
    governoratesEn: ["Beirut", "Mount Lebanon", "North", "Akkar", "South", "Nabatieh", "Bekaa", "Baalbek-Hermel"],
    governoratesAr: ["بيروت", "جبل لبنان", "الشمال", "عكار", "الجنوب", "النبطية", "البقاع", "بعلبك الهرمل"],
  ),
  CountryConfig(
    code: "PS",
    nameEn: "Palestine",
    nameAr: "فلسطين",
    currencies: const [
      CurrencyOption(code: "ILS", symbol: "₪", nameAr: "شيكل", nameEn: "Israeli Shekel"),
      CurrencyOption(code: "JOD", symbol: "د.أ", nameAr: "دينار أردني", nameEn: "Jordanian Dinar"),
    ],
    governoratesEn: ["Jerusalem", "Ramallah and Al-Bireh", "Nablus", "Hebron", "Bethlehem", "Jenin", "Tulkarm", "Qalqilya", "Salfit", "Jericho", "Tubas", "Gaza", "North Gaza", "Deir al-Balah", "Khan Younis", "Rafah"],
    governoratesAr: ["القدس", "رام الله والبيرة", "نابلس", "الخليل", "بيت لحم", "جنين", "طولكرم", "قلقيلية", "سلفيت", "أريحا", "طوباس", "غزة", "شمال غزة", "دير البلح", "خان يونس", "رفح"],
  ),
  CountryConfig(
    code: "SY",
    nameEn: "Syria",
    nameAr: "سوريا",
    currencies: const [
      CurrencyOption(code: "SYP", symbol: "ل.س", nameAr: "ليرة سورية", nameEn: "Syrian Pound"),
      CurrencyOption(code: "USD", symbol: "\$", nameAr: "دولار", nameEn: "US Dollar"),
    ],
    governoratesEn: ["Damascus", "Rural Damascus", "Aleppo", "Homs", "Hama", "Latakia", "Tartus", "Idlib", "Deir ez-Zor", "Raqqa", "Hasakah", "Daraa", "Sweida", "Quneitra"],
    governoratesAr: ["دمشق", "ريف دمشق", "حلب", "حمص", "حماة", "اللاذقية", "طرطوس", "إدلب", "دير الزور", "الرقة", "الحسكة", "درعا", "السويداء", "القنيطرة"],
  ),
];

CountryConfig countryByCode(String code) =>
    countries.firstWhere((c) => c.code == code, orElse: () => countries.first);
