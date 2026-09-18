/// All local pictures. Replace a file in assets/ to change it app-wide.
/// flags/{jo,lb,ps,sy}.png
/// icons/{category-slug}.jpg
/// listings/{watch,phone,sofa,car}.jpg
/// avatars/guest.jpg
class Media {
  static const flags = "assets/flags";
  static const icons = "assets/icons";
  static const listings = "assets/listings";
  static const avatars = "assets/avatars";

  static String flag(String countryCode) => "$flags/${countryCode.toLowerCase()}.png";
  static String category(String slug) => "$icons/$slug.jpg";
  static String listing(String name) => "$listings/$name.jpg";
  static const guestAvatar = "$avatars/guest.jpg";
}
