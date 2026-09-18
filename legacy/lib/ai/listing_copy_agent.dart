class VisionHints {
  const VisionHints({this.color, this.body, this.conditionLook});
  final String? color;
  final String? body;
  final String? conditionLook;
}

class ListingFacts {
  const ListingFacts({this.make, this.year, this.price, this.city, this.km, this.inspect, this.negotiable, this.color, this.body});
  final String? make;
  final String? year;
  final String? price;
  final String? city;
  final String? km;
  final bool? inspect;
  final bool? negotiable;
  final String? color;
  final String? body;
}

class ListingCopyResult {
  const ListingCopyResult({
    required this.title,
    required this.body,
    required this.facts,
    this.missing = const [],
  });
  final String title;
  final String body;
  final ListingFacts facts;
  final List<String> missing;
}

ListingFacts extractFacts(String raw) {
  final text = raw.trim();
  final year = RegExp(r"(20\d{2}|19\d{2})").firstMatch(text)?.group(1);
  final price = (RegExp(r"(\d[\d,]{2,})").firstMatch(text.replaceAll("٬", ","))?.group(1) ?? "").replaceAll(",", "");
  String? make;
  for (final brand in ["كامري", "Camry", "تويوتا", "Toyota", "هوندا", "Honda", "كيا", "Kia", "هيونداي", "Hyundai", "مرسيدس", "BMW"]) {
    if (text.toLowerCase().contains(brand.toLowerCase())) {
      make = brand;
      break;
    }
  }
  String? city;
  for (final name in ["عمّان", "عمان", "خلدا", "إربد", "الزرقاء", "بيروت", "دمشق", "رام الله", "Amman", "Khalda"]) {
    if (text.contains(name)) {
      city = name;
      break;
    }
  }
  final km = RegExp(r"(\d[\d,]*)\s*(ألف|الف|كم|km)", caseSensitive: false).firstMatch(text)?.group(1);
  return ListingFacts(
    make: make,
    year: year,
    price: price.isEmpty ? null : price,
    city: city,
    km: km,
    inspect: text.contains("فحص") || text.toLowerCase().contains("inspect"),
    negotiable: text.contains("تفاوض") || text.toLowerCase().contains("negoti"),
  );
}

/// Local stand-in until an AI subscription is attached to Agents.listingCopy.
ListingCopyResult writeListingCopy({
  required String raw,
  required bool arabic,
  String categorySlug = "",
  VisionHints vision = const VisionHints(),
}) {
  var facts = extractFacts(raw);
  facts = ListingFacts(
    make: facts.make,
    year: facts.year,
    price: facts.price,
    city: facts.city,
    km: facts.km,
    inspect: facts.inspect,
    negotiable: facts.negotiable,
    color: vision.color,
    body: vision.body,
  );
  final subject = [facts.make, facts.year].whereType<String>().join(" ");
  final missing = <String>[
    if (facts.km == null) (arabic ? "العداد" : "mileage"),
    if (facts.city == null) (arabic ? "الموقع" : "location"),
    if (arabic) "أي تفصيل يزيد قوة الإعلان" else "any extra detail that strengthens the ad",
  ];

  if (!arabic) {
    final title = [
      if (subject.isNotEmpty) "$subject for sale",
      if (facts.price != null) facts.price,
    ].where((e) => e.isNotEmpty).join(" — ");
    final look = [facts.color, facts.body].whereType<String>().join(" ");
    final body = [
      subject.isEmpty ? "Listed and ready to view." : "$subject for sale${look.isNotEmpty ? ", $look" : ""}. Comfortable daily car, easy to live with.",
      if (facts.inspect == true) "Inspection is good, as the seller said.",
      if (facts.km != null) "About ${facts.km} on the clock.",
      if (facts.price != null) "Price ${facts.price}${facts.negotiable == true ? ", fair offer after viewing" : ""}.",
      if (facts.city != null) "Viewing in ${facts.city}.",
      "Message the listing if you are serious.",
    ].join("\n");
    return ListingCopyResult(title: title.isEmpty ? "For sale" : title, body: body, facts: facts, missing: missing);
  }

  final titleBits = <String>[
    if (subject.isNotEmpty) "$subject للبيع",
    if (facts.price != null) "${_pretty(facts.price!)} دينار",
  ];
  final look = [if (facts.color != null) facts.color, if (facts.body != null) facts.body].join(" ");
  final pitch = _pitch(arabic: true, subject: subject, look: look, categorySlug: categorySlug);
  final lines = <String>[
    if (subject.isNotEmpty) "$subject للبيع",
    if (subject.isNotEmpty) "الموديل: $subject",
    if (facts.price != null) "السعر المطلوب: ${_pretty(facts.price!)} دينار",
    if (facts.inspect == true) "الفحص: فحص 4 جيد",
    if (facts.km != null) "العداد: ${facts.km}",
    if (look.isNotEmpty) "الشكل من الصور: $look",
    "الحالة: جاهزة للفحص والمعاينة",
    "",
    pitch,
    if (facts.year != null) "موديل ${facts.year}",
    if (facts.inspect == true) "فحص 4 جيد",
    "جاهزة للفحص لدى مركز يختاره المشتري",
    if (facts.price != null) "السعر: ${_pretty(facts.price!)} دينار",
    if (facts.city != null) "الموقع: ${facts.city}",
    "",
    "للمهتمين الجادين: التواصل عبر رسائل الإعلان لتنسيق المعاينة.",
    if (facts.negotiable == true) "السعر قابل للتفاوض بالمعقول بعد المعاينة.",
  ];

  return ListingCopyResult(
    title: titleBits.isEmpty ? "إعلان للبيع" : titleBits.join(" — "),
    body: lines.where((e) => e != null).join("\n"),
    facts: facts,
    missing: missing,
  );
}

String _pitch({required bool arabic, required String subject, required String look, required String categorySlug}) {
  if (!arabic) {
    if (subject.isEmpty) return "Clear photos. Ready to view.";
    return look.isEmpty ? "$subject. Ready for a serious buyer." : "$subject, $look. Ready for a serious buyer.";
  }
  if (subject.isEmpty) return "واضحة بالصور وجاهزة للمعاينة.";
  if (categorySlug == "motors") {
    return look.isEmpty
        ? "$subject عملية ومريحة واقتصادية، مناسبة لليومي والسفر."
        : "$subject، $look. عملية ومريحة واقتصادية، مناسبة لليومي والسفر.";
  }
  if (categorySlug == "real-estate") {
    return "$subject جاهزة للمعاينة، والموقع يوضح بالاتفاق.";
  }
  return look.isEmpty ? "$subject بحالة جيدة وجاهزة للمعاينة." : "$subject، $look. بحالة جيدة وجاهزة للمعاينة.";
}

String _pretty(String n) {
  final v = int.tryParse(n);
  if (v == null) return n;
  return v.toString().replaceAllMapped(RegExp(r"(\d)(?=(\d{3})+(?!\d))"), (m) => "${m[1]},");
}
