/// Owner-approved copy only. Add a key here when a screen is ready.
/// Do not auto-translate leftover English on a page.
class AppCopy {
  AppCopy(this.arabic);
  final bool arabic;

  String get explore => arabic ? "استكشف" : "Explore";
  String get categories => arabic ? "الأقسام" : "Categories";
  String get postAd => arabic ? "أضف إعلان" : "Post Ad";
  String get messages => arabic ? "الرسائل" : "Messages";
  String get myAds => arabic ? "إعلاناتي" : "My Ads";
  String get settings => arabic ? "الإعدادات" : "Settings";
  String get language => arabic ? "اللغة" : "Language";
  String get english => "English";
  String get arabicLabel => "العربية";
  String get languageHint => arabic
      ? "الإنجليزية واجهة العمل. العربية اختيار من هون."
      : "English is the working interface. Arabic is a choice here.";
}
