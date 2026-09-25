import "media.dart";

class CategoryDef {
  const CategoryDef({
    required this.slug,
    required this.nameEn,
    required this.nameAr,
    required this.asset,
  });

  final String slug;
  final String nameEn;
  final String nameAr;
  final String asset;
}

const categories = <CategoryDef>[
  CategoryDef(slug: "motors", nameEn: "Motors", nameAr: "سيارات", asset: "assets/icons/motors.jpg"),
  CategoryDef(slug: "real-estate", nameEn: "Real Estate", nameAr: "عقارات", asset: "assets/icons/real-estate.jpg"),
  CategoryDef(slug: "mobiles", nameEn: "Mobiles", nameAr: "موبايل", asset: "assets/icons/mobiles.jpg"),
  CategoryDef(slug: "watches", nameEn: "Watches", nameAr: "ساعات", asset: "assets/icons/watches.jpg"),
  CategoryDef(slug: "computers", nameEn: "Computers", nameAr: "كمبيوتر", asset: "assets/icons/computers.jpg"),
  CategoryDef(slug: "electronics", nameEn: "Electronics", nameAr: "أجهزة", asset: "assets/icons/electronics.jpg"),
  CategoryDef(slug: "furniture", nameEn: "Furniture", nameAr: "أثاث", asset: "assets/icons/furniture.jpg"),
  CategoryDef(slug: "fashion", nameEn: "Fashion", nameAr: "أزياء", asset: "assets/icons/fashion.jpg"),
  CategoryDef(slug: "services", nameEn: "Services", nameAr: "خدمات", asset: "assets/icons/services.jpg"),
  CategoryDef(slug: "jobs", nameEn: "Jobs", nameAr: "وظائف", asset: "assets/icons/jobs.jpg"),
  CategoryDef(slug: "kids", nameEn: "Baby & Kids", nameAr: "أطفال", asset: "assets/icons/kids.jpg"),
  CategoryDef(slug: "beauty", nameEn: "Beauty", nameAr: "جمال", asset: "assets/icons/beauty.jpg"),
  CategoryDef(slug: "pets", nameEn: "Pets", nameAr: "حيوانات", asset: "assets/icons/pets.jpg"),
  CategoryDef(slug: "sports", nameEn: "Sports", nameAr: "رياضة", asset: "assets/icons/sports.jpg"),
  CategoryDef(slug: "books", nameEn: "Books", nameAr: "كتب", asset: "assets/icons/books.jpg"),
  CategoryDef(slug: "home-garden", nameEn: "Home & Garden", nameAr: "المنزل", asset: "assets/icons/home-garden.jpg"),
  CategoryDef(slug: "krakeeb", nameEn: "Odds & Ends", nameAr: "كراكيب", asset: "assets/icons/krakeeb.jpg"),
];
