/// Map URLs for the approximate-location step.
/// Embed works now. Official Maps SDK / Places needs GOOGLE_MAPS_API_KEY later.
String googleSearchQuery({required String city, required String area, String site = ""}) {
  return [site, area, city].where((e) => e.trim().isNotEmpty).join(", ");
}

String googleMapsEmbedUrl(String query) {
  final q = Uri.encodeComponent(query.isEmpty ? "Amman" : query);
  return "https://maps.google.com/maps?q=$q&hl=ar&z=14&output=embed";
}

String googleMapsOpenUrl(String query) {
  final q = Uri.encodeComponent(query.isEmpty ? "Amman" : query);
  return "https://www.google.com/maps/search/?api=1&query=$q";
}
