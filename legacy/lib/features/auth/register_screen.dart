import "dart:convert";
import "dart:io";
import "package:flutter/material.dart";
import "../../api/api_base.dart";
import "../../data/countries.dart";
import "../../state/app_scope.dart";
import "../../theme/tokens.dart";
import "../../util/phone.dart";
import "confirm_screen.dart";
import "terms_screen.dart";

class RegisterScreen extends StatefulWidget {
  const RegisterScreen({super.key});

  @override
  State<RegisterScreen> createState() => _RegisterScreenState();
}

class _RegisterScreenState extends State<RegisterScreen> {
  final firstName = TextEditingController();
  final lastName = TextEditingController();
  final email = TextEditingController();
  final phone = TextEditingController();
  String countryCode = "JO";
  bool countryOpen = false;
  bool acceptedTerms = false;
  String? error;

  String get prefix => switch (countryCode) {
        "JO" => "+962",
        "LB" => "+961",
        "PS" => "+970",
        "SY" => "+963",
        _ => "+",
      };

  @override
  void dispose() {
    firstName.dispose();
    lastName.dispose();
    email.dispose();
    phone.dispose();
    super.dispose();
  }

  bool sending = false;

  Future<void> submit(AppScope scope, bool ar) async {
    final given = cleanPersonName(firstName.text);
    final family = cleanPersonName(lastName.text);
    final mail = email.text.trim().toLowerCase();
    final fullPhone = normalizePhone(countryCode, phone.text);
    if (!isValidPersonName(given) || !isValidPersonName(family)) {
      setState(() => error = ar ? "أدخل اسم أول وعائلة صحيح بدون أرقام" : "Enter a valid first and last name");
      return;
    }
    if (!mail.contains("@") || !mail.contains(".")) {
      setState(() => error = ar ? "أدخل إيميل صحيح" : "Enter a valid email");
      return;
    }
    if (fullPhone.replaceAll(RegExp(r"[^0-9]"), "").length < 10) {
      setState(() => error = ar ? "أدخل رقم موبايل صحيح" : "Enter a valid phone number");
      return;
    }
    if (!acceptedTerms) {
      setState(() => error = ar ? "وافق على شروط الاستخدام أولاً" : "Accept the terms first");
      return;
    }
    setState(() { error = null; sending = true; });
    var mode = "register";
    var accountCountry = countryCode;
    try {
      final client = HttpClient();
      final req = await client.postUrl(Uri.parse("$apiBase/api/register"));
      req.headers.contentType = ContentType.json;
      req.add(utf8.encode(jsonEncode({
        "firstName": given,
        "lastName": family,
        "email": mail,
        "phone": fullPhone,
        "country": countryCode,
      })));
      final res = await req.close();
      final raw = await res.transform(utf8.decoder).join();
      client.close();
      final data = raw.isEmpty ? <String, dynamic>{} : jsonDecode(raw) as Map<String, dynamic>;
      if (res.statusCode == 409) {
        setState(() {
          sending = false;
          error = data["error"] == "duplicate_phone"
              ? (ar ? "هذا الرقم مربوط بحساب ثاني" : "This phone belongs to another account")
              : (ar ? "ما قدرنا نكمّل التسجيل" : "Could not continue registration");
        });
        return;
      }
      if (res.statusCode == 429) {
        setState(() { sending = false; error = ar ? "محاولات كثيرة. انتظر شوي." : "Too many attempts. Wait a bit."; });
        return;
      }
      if (res.statusCode >= 400) {
        setState(() { sending = false; error = ar ? "ما قدرنا ننشئ الحساب" : "Could not create the account"; });
        return;
      }
      mode = (data["mode"] as String?) ?? "register";
      accountCountry = (data["country"] as String?) ?? countryCode;
    } catch (_) {
      if (!mounted) return;
      setState(() { sending = false; error = ar ? "في مشكلة بالاتصال. جرّب مرة ثانية." : "Connection problem. Try again."; });
      return;
    }
    if (!mounted) return;
    scope.beginRegistration(
      countryCode: accountCountry,
      email: mail,
      phone: fullPhone,
    );
    setState(() => sending = false);
    Navigator.of(context).push(MaterialPageRoute(builder: (_) => ConfirmScreen(mode: mode)));
  }

  @override
  Widget build(BuildContext context) {
    final scope = AppScopeProvider.of(context);
    final ar = scope.isArabic;
    final selected = countryByCode(countryCode);
    return Directionality(
      textDirection: ar ? TextDirection.rtl : TextDirection.ltr,
      child: Scaffold(
        backgroundColor: CatchTokens.bg,
        appBar: AppBar(
          backgroundColor: CatchTokens.bg,
          elevation: 0,
          foregroundColor: CatchTokens.dark,
          actions: [
            TextButton(
              onPressed: () => scope.setLocale(const Locale("en")),
              child: Text("EN", style: TextStyle(color: ar ? CatchTokens.muted : CatchTokens.dark, fontWeight: FontWeight.w700)),
            ),
            TextButton(
              onPressed: () => scope.setLocale(const Locale("ar")),
              child: Text("AR", style: TextStyle(color: ar ? CatchTokens.dark : CatchTokens.muted, fontWeight: FontWeight.w700)),
            ),
          ],
        ),
        body: SafeArea(
          child: ListView(
            padding: const EdgeInsets.fromLTRB(18, 8, 18, 32),
            children: [
              const Text("Catch", style: TextStyle(fontFamily: "Georgia", fontSize: 35, color: CatchTokens.dark, letterSpacing: -1.2)),
              Text("THE DEALS", style: TextStyle(color: CatchTokens.accent, fontSize: 10, letterSpacing: 2, fontWeight: FontWeight.w700)),
              const SizedBox(height: 8),
              Text(ar ? "حساب واحد. دولة واحدة للإعلانات. التصفح تقدر تغيّره بعدين." : "One account. Ads stay in this country. Browse country can change later.", style: const TextStyle(color: CatchTokens.muted, height: 1.4)),
              const SizedBox(height: 22),
              Text(ar ? "اختر الدولة" : "Choose country", style: const TextStyle(fontWeight: FontWeight.w700, color: CatchTokens.dark)),
              const SizedBox(height: 8),
              Container(
                decoration: BoxDecoration(
                  color: CatchTokens.card,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: countryOpen ? CatchTokens.accent : CatchTokens.border),
                ),
                child: Column(
                  children: [
                    InkWell(
                      onTap: () => setState(() => countryOpen = !countryOpen),
                      child: Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                        child: Row(
                          children: [
                            ClipRRect(
                              borderRadius: BorderRadius.circular(4),
                              child: Image.asset(selected.flagUrl, width: 28, height: 20, fit: BoxFit.cover),
                            ),
                            const SizedBox(width: 12),
                            Expanded(child: Text("${ar ? selected.nameAr : selected.nameEn}  ·  ${selected.currencies.map((c) => c.code).join(" / ")}")),
                            Icon(countryOpen ? Icons.keyboard_arrow_up : Icons.keyboard_arrow_down, color: CatchTokens.muted),
                          ],
                        ),
                      ),
                    ),
                    if (countryOpen)
                      ...countries.map((c) {
                        final on = c.code == countryCode;
                        return InkWell(
                          onTap: () => setState(() {
                            countryCode = c.code;
                            countryOpen = false;
                          }),
                          child: Container(
                            width: double.infinity,
                            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                            decoration: const BoxDecoration(border: Border(top: BorderSide(color: CatchTokens.border))),
                            child: Row(
                              children: [
                                ClipRRect(
                                  borderRadius: BorderRadius.circular(4),
                                  child: Image.asset(c.flagUrl, width: 28, height: 20, fit: BoxFit.cover),
                                ),
                                const SizedBox(width: 12),
                                Expanded(child: Text("${ar ? c.nameAr : c.nameEn}  ·  ${c.currencies.map((x) => x.code).join(" / ")}")),
                                if (on) const Icon(Icons.check, size: 18, color: CatchTokens.accent),
                              ],
                            ),
                          ),
                        );
                      }),
                  ],
                ),
              ),
              const SizedBox(height: 8),
              Center(
                child: Column(
                  children: [
                    Container(
                      width: 88,
                      height: 88,
                      decoration: BoxDecoration(
                        color: CatchTokens.card,
                        shape: BoxShape.circle,
                        border: Border.all(color: CatchTokens.border),
                      ),
                      child: const Icon(Icons.person_outline, color: CatchTokens.muted),
                    ),
                    const SizedBox(height: 8),
                    Text(ar ? "صورة البروفايل (اختياري)" : "Profile photo (optional)", style: const TextStyle(color: CatchTokens.muted, fontSize: 12)),
                  ],
                ),
              ),
              const SizedBox(height: 16),
              Text(ar ? "الاسم الأول" : "First name", style: const TextStyle(fontWeight: FontWeight.w700)),
              const SizedBox(height: 8),
              TextField(controller: firstName, textCapitalization: TextCapitalization.words, decoration: _box(ar ? "أحمد" : "Ahmad")),
              const SizedBox(height: 14),
              Text(ar ? "اسم العائلة" : "Last name", style: const TextStyle(fontWeight: FontWeight.w700)),
              const SizedBox(height: 8),
              TextField(controller: lastName, textCapitalization: TextCapitalization.words, decoration: _box(ar ? "خليل" : "Khalil")),
              const SizedBox(height: 14),
              Text(ar ? "الإيميل" : "Email", style: const TextStyle(fontWeight: FontWeight.w700)),
              const SizedBox(height: 8),
              TextField(
                controller: email,
                keyboardType: TextInputType.emailAddress,
                decoration: _box(ar ? "you@email.com" : "you@email.com"),
              ),
              const SizedBox(height: 14),
              Text(ar ? "الموبايل" : "Phone", style: const TextStyle(fontWeight: FontWeight.w700)),
              const SizedBox(height: 8),
              Row(
                children: [
                  Container(
                    height: 50,
                    padding: const EdgeInsets.symmetric(horizontal: 12),
                    alignment: Alignment.center,
                    decoration: BoxDecoration(color: CatchTokens.soft, borderRadius: BorderRadius.circular(16), border: Border.all(color: CatchTokens.border)),
                    child: Row(
                      children: [
                        Image.asset(countryByCode(countryCode).flagUrl, width: 18, height: 13, fit: BoxFit.cover),
                        const SizedBox(width: 6),
                        Text(prefix, style: const TextStyle(fontWeight: FontWeight.w700)),
                      ],
                    ),
                  ),
                  const SizedBox(width: 8),
                  Expanded(
                    child: TextField(
                      controller: phone,
                      keyboardType: TextInputType.phone,
                      decoration: _box(ar ? "7XXXXXXXX" : "7XXXXXXXX"),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 10),
              Text(
                ar
                    ? "عملات ${selected.nameAr}: ${selected.currencies.map((c) => c.code).join(" / ")}. التأكيد إيميل."
                    : "Currencies in ${selected.nameEn}: ${selected.currencies.map((c) => c.code).join(" / ")}. Confirmation is email.",
                style: const TextStyle(color: CatchTokens.muted, fontSize: 12),
              ),
              if (error != null) ...[
                const SizedBox(height: 10),
                Text(error!, style: const TextStyle(color: Color(0xFF8B3A2A))),
              ],
              const SizedBox(height: 14),
              Row(
                children: [
                  SizedBox(
                    width: 22,
                    height: 22,
                    child: Checkbox(
                      value: acceptedTerms,
                      onChanged: (v) => setState(() => acceptedTerms = v ?? false),
                      activeColor: CatchTokens.dark,
                      checkColor: Colors.white,
                      materialTapTargetSize: MaterialTapTargetSize.shrinkWrap,
                      visualDensity: VisualDensity.compact,
                      side: const BorderSide(color: CatchTokens.dark, width: 1.4),
                    ),
                  ),
                  const SizedBox(width: 8),
                  Expanded(
                    child: GestureDetector(
                      onTap: () => Navigator.of(context).push(MaterialPageRoute(builder: (_) => const TermsScreen())),
                      child: const Text(
                        "I agree to Catch the deals terms",
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: TextStyle(fontSize: 12, color: CatchTokens.dark, decoration: TextDecoration.underline),
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 8),
              SizedBox(
                height: 52,
                child: FilledButton(
                  style: FilledButton.styleFrom(backgroundColor: CatchTokens.accent, shape: const StadiumBorder()),
                  onPressed: sending ? null : () => submit(scope, ar),
                  child: Text(sending
                      ? (ar ? "جارٍ الإرسال…" : "Sending…")
                      : (ar ? "إرسال رابط التأكيد أو الدخول" : "Send confirmation or sign-in link")),
                ),
              ),
              const SizedBox(height: 12),
              Text(
                ar ? "إذا عندك حساب، حط نفس الإيميل والرقم وبوصلك رابط دخول." : "If you already have an account, use the same email and phone to get a sign-in link.",
                style: const TextStyle(color: CatchTokens.muted, fontSize: 12, height: 1.4),
              ),
            ],
          ),
        ),
      ),
    );
  }

  InputDecoration _box(String hint) {
    return InputDecoration(
      hintText: hint,
      filled: true,
      fillColor: CatchTokens.card,
      contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
      border: OutlineInputBorder(borderRadius: BorderRadius.circular(16), borderSide: const BorderSide(color: CatchTokens.border)),
      enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(16), borderSide: const BorderSide(color: CatchTokens.border)),
    );
  }
}
