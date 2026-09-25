class Listing {
  const Listing({
    required this.id,
    required this.countryCode,
    required this.city,
    required this.neighborhood,
    required this.categorySlug,
    required this.title,
    required this.description,
    required this.price,
    required this.currency,
    required this.imageUrl,
    this.sellerPhone = "",
    this.sellerName = "",
    this.views = 12,
    this.attrs = const {},
    this.images = const [],
  });

  final String id;
  final String countryCode;
  final String city;
  final String neighborhood;
  final String categorySlug;
  final String title;
  final String description;
  final double price;
  final String currency;
  final String imageUrl;
  final String sellerPhone;
  final String sellerName;
  final int views;
  final Map<String, String> attrs;
  final List<String> images;
  List<String> get gallery => images.isEmpty ? [imageUrl] : images;
}

class ListingStore {
  ListingStore._();
  static final ListingStore instance = ListingStore._();

  final List<Listing> _all = [
    Listing(
      id: "jo-1",
      countryCode: "JO",
      city: "Amman",
      neighborhood: "Abdoun",
      categorySlug: "beauty",
      title: "Hair treatment & styling",
      description: "Salon service in Abdoun",
      price: 25,
      currency: "JOD",
      imageUrl: "assets/listings/watch.jpg",
      sellerPhone: "+962790000001",
      sellerName: "نور",
      views: 40,
      attrs: {"القسم": "جمال", "الموقع": "عبدون"},
    ),
    Listing(
      id: "jo-2",
      countryCode: "JO",
      city: "Amman",
      neighborhood: "Sweifieh",
      categorySlug: "mobiles",
      title: "iPhone 15 Pro Max 256GB",
      description: "Used, excellent condition",
      price: 650,
      currency: "JOD",
      imageUrl: "assets/listings/phone.jpg",
      sellerPhone: "+962790000002",
      sellerName: "أحمد",
      views: 128,
      attrs: {"الحالة": "مستعمل", "السعة": "256GB", "الموقع": "الصويفية"},
    ),
    Listing(
      id: "lb-1",
      countryCode: "LB",
      city: "Beirut",
      neighborhood: "Hamra",
      categorySlug: "furniture",
      title: "Green sofa",
      description: "Living room sofa",
      price: 200,
      currency: "LBP",
      imageUrl: "assets/listings/sofa.jpg",
      sellerPhone: "+96171000001",
      sellerName: "ليان",
      views: 22,
      attrs: {"الحالة": "مستعمل", "الموقع": "الحمرا"},
    ),
  ];

  List<Listing> inCountry(String countryCode) =>
      _all.where((l) => l.countryCode == countryCode).toList();

  List<Listing> search({required String countryCode, String query = "", String? categorySlug}) {
    final q = query.trim().toLowerCase();
    return inCountry(countryCode).where((l) {
      final catOk = categorySlug == null || l.categorySlug == categorySlug;
      final textOk = q.isEmpty ||
          l.title.toLowerCase().contains(q) ||
          l.description.toLowerCase().contains(q) ||
          l.city.toLowerCase().contains(q);
      return catOk && textOk;
    }).toList();
  }

  void add(Listing listing) => _all.insert(0, listing);

  List<Listing> bySeller(String phone) => mine(phone);

  List<Listing> mine(String phone) {
    final p = phone.trim();
    if (p.isEmpty) return const [];
    return _all.where((l) => l.sellerPhone == p).toList();
  }
}
