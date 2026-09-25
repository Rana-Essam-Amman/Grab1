import "../ai/listing_copy_agent.dart";

class GeneratedListing {
  const GeneratedListing({
    required this.title,
    required this.description,
    required this.price,
    required this.categorySlug,
    required this.subcategorySlug,
    this.city,
    this.year,
    this.make,
    this.missing = const [],
  });
  final String title;
  final String description;
  final String price;
  final String categorySlug;
  final String subcategorySlug;
  final String? city;
  final String? year;
  final String? make;
  final List<String> missing;
}

GeneratedListing generateListing({
  required String raw,
  required String categorySlug,
  required String subcategorySlug,
  required bool arabic,
}) {
  final copy = writeListingCopy(raw: raw, arabic: arabic, categorySlug: categorySlug);
  return GeneratedListing(
    title: copy.title,
    description: copy.body,
    price: copy.facts.price ?? "",
    categorySlug: categorySlug,
    subcategorySlug: subcategorySlug,
    city: copy.facts.city,
    year: copy.facts.year,
    make: copy.facts.make,
    missing: copy.missing,
  );
}
