import "package:flutter/material.dart";
import "../data/countries.dart";
import "session_store.dart";

class AppScope extends ChangeNotifier {
  AppScope({this.locale = const Locale("en")});

  Locale locale;
  String? accountCountryCode;
  String browseCountryCode = "JO";
  String browseCityEn = "Amman";
  String browseCityAr = "عمّان";
  String selectedCurrency = "JOD";
  String email = "";
  String phone = "";
  bool registered = false;
  bool confirmationPending = false;
  String? confirmationToken;
  String? sessionToken;
  String? pendingCategory;
  String? pendingSub;
  String? pendingNote;

  CountryConfig get browseCountry => countryByCode(browseCountryCode);
  CountryConfig? get accountCountry =>
      accountCountryCode == null ? null : countryByCode(accountCountryCode!);
  CountryConfig get listingCountry => accountCountry ?? browseCountry;
  bool get isArabic => locale.languageCode == "ar";
  String get currency {
    final allowed = browseCountry.currencies.map((c) => c.code);
    return allowed.contains(selectedCurrency) ? selectedCurrency : browseCountry.currency;
  }
  String get browseCity => isArabic ? browseCityAr : browseCityEn;

  String get phonePrefix => switch (browseCountryCode) {
        "JO" => "+962",
        "LB" => "+961",
        "PS" => "+970",
        "SY" => "+963",
        _ => "+",
      };

  String get searchPlaceholder => isArabic
      ? "قلي لـ Catch شو بدك تلاقي…"
      : "Ask Catch what you're looking for…";

  void setLocale(Locale value) {
    locale = value;
    notifyListeners();
    persist();
  }

  void setBrowseLocation({
    required String countryCode,
    required String cityEn,
    required String cityAr,
  }) {
    browseCountryCode = countryCode;
    browseCityEn = cityEn;
    browseCityAr = cityAr;
    selectedCurrency = countryByCode(countryCode).currency;
    notifyListeners();
  }

  void setCurrency(String code) {
    selectedCurrency = code;
    notifyListeners();
  }

  void beginRegistration({
    required String countryCode,
    required String email,
    required String phone,
  }) {
    accountCountryCode = countryCode;
    this.email = email;
    this.phone = phone;
    confirmationPending = true;
    confirmationToken = "confirm-${DateTime.now().millisecondsSinceEpoch}";
    selectedCurrency = countryByCode(countryCode).currency;
    setBrowseLocation(
      countryCode: countryCode,
      cityEn: countryByCode(countryCode).governoratesEn.first,
      cityAr: countryByCode(countryCode).governoratesAr.first,
    );
    notifyListeners();
  }

  void rememberPost({String? category, String? sub, String? note}) {
    pendingCategory = category ?? pendingCategory;
    pendingSub = sub ?? pendingSub;
    pendingNote = note ?? pendingNote;
    notifyListeners();
  }

  void clearPendingPost() {
    pendingCategory = null;
    pendingSub = null;
    pendingNote = null;
  }

  void markConfirmed() {
    registered = true;
    confirmationPending = false;
    notifyListeners();
    persist();
  }

  Future<void> persist() async {
    await SessionStore.instance.write({
      "registered": registered,
      "email": email,
      "phone": phone,
      "accountCountryCode": accountCountryCode,
      "browseCountryCode": browseCountryCode,
      "browseCityEn": browseCityEn,
      "browseCityAr": browseCityAr,
      "selectedCurrency": selectedCurrency,
      "locale": locale.languageCode,
      "sessionToken": sessionToken,
    });
  }

  Future<void> restore() async {
    final data = await SessionStore.instance.read();
    if (data != null && data["locale"] is String) {
      locale = Locale(data["locale"] as String);
    }
    if (data == null || data["registered"] != true) {
      notifyListeners();
      return;
    }
    registered = true;
    email = data["email"] as String? ?? "";
    phone = data["phone"] as String? ?? "";
    accountCountryCode = data["accountCountryCode"] as String?;
    browseCountryCode = data["browseCountryCode"] as String? ?? browseCountryCode;
    browseCityEn = data["browseCityEn"] as String? ?? browseCityEn;
    browseCityAr = data["browseCityAr"] as String? ?? browseCityAr;
    selectedCurrency = data["selectedCurrency"] as String? ?? selectedCurrency;
    locale = Locale(data["locale"] as String? ?? "ar");
    sessionToken = data["sessionToken"] as String?;
    if (sessionToken == null || sessionToken!.isEmpty) {
      registered = false;
      notifyListeners();
      return;
    }
    final live = await SessionStore.instance.verifyRemote(sessionToken!);
    if (!live) {
      registered = false;
      sessionToken = null;
      await SessionStore.instance.clear();
    }
    notifyListeners();
  }
}
