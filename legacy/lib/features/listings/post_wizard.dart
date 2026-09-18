import "dart:convert";
import "dart:io";
import "package:flutter/material.dart";
import "../../api/api_base.dart";
import "../../data/listing_fields.dart";
import "../../data/locations.dart";
import "../../state/app_scope.dart";
import "../../state/listing_store.dart";
import "../../theme/tokens.dart";

class PostDraft {
  PostDraft({required this.categorySlug, required this.subcategorySlug});
  final String categorySlug;
  final String subcategorySlug;
  String? city;
  String? neighborhood;
  String location = "";
  final attrs = <String, String>{};
  String title = "";
  String description = "";
  String price = "";
}

class PostWizard extends StatefulWidget {
  const PostWizard({super.key, required this.categorySlug, required this.subcategorySlug});
  final String categorySlug;
  final String subcategorySlug;

  @override
  State<PostWizard> createState() => _PostWizardState();
}

class _PostWizardState extends State<PostWizard> {
  late final draft = PostDraft(categorySlug: widget.categorySlug, subcategorySlug: widget.subcategorySlug);
  int step = 0;
  bool sending = false;
  String? error;

  List<String> get steps => const ["city", "area", "site", "specs", "copy", "review"];

  void next() => setState(() => step = (step + 1).clamp(0, steps.length - 1));
  void back() => setState(() => step = (step - 1).clamp(0, steps.length - 1));

  void writeCopy(bool ar) {
    final make = draft.attrs["make"] ?? "";
    final model = draft.attrs["model"] ?? "";
    final year = draft.attrs["year"] ?? "";
    final km = draft.attrs["km"] ?? "";
    final city = draft.city ?? "";
    draft.title = [year, make, model].where((e) => e.isNotEmpty).join(" ");
    if (draft.title.isEmpty) draft.title = ar ? "إعلان ${widget.subcategorySlug}" : "Listing";
    draft.description = ar
        ? "${draft.title}. ${km.isNotEmpty ? "ماشية $km كم. " : ""}الموقع: $city ${draft.neighborhood ?? ""} ${draft.location}. الحالة: ${draft.attrs["condition"] ?? ""}. الوقود: ${draft.attrs["fuel"] ?? ""}. الدفع: ${draft.attrs["payment"] ?? ""}."
        : "${draft.title}. ${km.isNotEmpty ? "$km km. " : ""}Location: $city ${draft.neighborhood ?? ""} ${draft.location}.";
  }

  Future<void> publish(AppScope scope, bool ar) async {
    if ((scope.sessionToken ?? "").isEmpty) {
      setState(() => error = ar ? "سجّل أولاً" : "Register first");
      return;
    }
    final amount = double.tryParse(draft.price);
    if (amount == null || amount <= 0 || draft.title.trim().length < 3) {
      setState(() => error = ar ? "راجع العنوان والسعر" : "Check title and price");
      return;
    }
    setState(() { sending = true; error = null; });
    try {
      final client = HttpClient();
      final req = await client.postUrl(Uri.parse("$apiBase/api/listings"));
      req.headers.contentType = ContentType.json;
      req.headers.set("Authorization", "Bearer ${scope.sessionToken}");
      req.add(utf8.encode(jsonEncode({
        "title": draft.title.trim(),
        "description": draft.description.trim(),
        "price": amount,
        "currency": scope.currency,
        "categorySlug": draft.categorySlug,
        "subcategorySlug": draft.subcategorySlug,
        "city": draft.city,
        "neighborhood": draft.neighborhood,
        "attrs": {...draft.attrs, "location": draft.location},
      })));
      final res = await req.close();
      final raw = await res.transform(utf8.decoder).join();
      client.close();
      final data = raw.isEmpty ? <String, dynamic>{} : jsonDecode(raw) as Map<String, dynamic>;
      if (res.statusCode >= 400) {
        setState(() { sending = false; error = ar ? "ما قدرنا ننشر" : "Could not publish"; });
        return;
      }
      ListingStore.instance.add(Listing(
        id: (data["id"] ?? DateTime.now().millisecondsSinceEpoch).toString(),
        countryCode: scope.listingCountry.code,
        city: draft.city ?? "",
        neighborhood: draft.neighborhood ?? "",
        categorySlug: draft.categorySlug,
        title: draft.title,
        description: draft.description,
        price: amount,
        currency: scope.currency,
        imageUrl: "assets/listings/car.jpg",
        sellerPhone: scope.phone,
      ));
      if (mounted) Navigator.of(context).popUntil((route) => route.isFirst);
    } catch (_) {
      setState(() { sending = false; error = ar ? "مشكلة اتصال" : "Connection problem"; });
    }
  }

  @override
  Widget build(BuildContext context) {
    final scope = AppScopeProvider.of(context);
    final ar = scope.isArabic;
    final country = scope.listingCountry;
    final gov = ar ? locationsAr[country.code]! : locations[country.code]!;
    return Directionality(
      textDirection: ar ? TextDirection.rtl : TextDirection.ltr,
      child: Scaffold(
        backgroundColor: CatchTokens.bg,
        appBar: AppBar(
          backgroundColor: CatchTokens.bg,
          foregroundColor: CatchTokens.dark,
          elevation: 0,
          leading: IconButton(icon: const Icon(Icons.arrow_back), onPressed: step == 0 ? () => Navigator.pop(context) : back),
        ),
        body: ListView(
          padding: const EdgeInsets.fromLTRB(18, 8, 18, 32),
          children: [
            if (steps[step] == "city") ...[
              Text(ar ? "في أي مدينة؟" : "In which city?", style: const TextStyle(fontFamily: "Georgia", fontSize: 26, color: CatchTokens.dark)),
              const SizedBox(height: 16),
              for (final name in gov.keys)
                _row(name, on: draft.city == name, onTap: () { draft.city = name; draft.neighborhood = null; next(); }),
            ],
            if (steps[step] == "area") ...[
              Text(ar ? "في أي منطقة (الحي)؟" : "Which neighborhood?", style: const TextStyle(fontFamily: "Georgia", fontSize: 26, color: CatchTokens.dark)),
              const SizedBox(height: 16),
              for (final name in (gov[draft.city] ?? const <String>[]))
                _row(name, on: draft.neighborhood == name, onTap: () { draft.neighborhood = name; next(); }),
            ],
            if (steps[step] == "site") ...[
              Text(ar ? "في أي موقع؟" : "Exact location?", style: const TextStyle(fontFamily: "Georgia", fontSize: 26, color: CatchTokens.dark)),
              const SizedBox(height: 12),
              TextField(
                onChanged: (v) => draft.location = v,
                decoration: _box(ar ? "مثال: قرب دائرة الترخيص" : "e.g. near the licensing department"),
              ),
              const SizedBox(height: 20),
              _next(ar, onTap: next),
            ],
            if (steps[step] == "specs") ...[
              Text(ar ? "مواصفات الإعلان" : "Listing specs", style: const TextStyle(fontFamily: "Georgia", fontSize: 26, color: CatchTokens.dark)),
              const SizedBox(height: 14),
              ...fieldsFor(categorySlug: draft.categorySlug, subcategorySlug: draft.subcategorySlug).map((f) {
                final opts = ar ? f.optionsAr : f.optionsEn;
                if (opts.isNotEmpty) {
                  return Padding(
                    padding: const EdgeInsets.only(bottom: 12),
                    child: DropdownButtonFormField<String>(
                      value: draft.attrs[f.key],
                      decoration: _box(ar ? f.labelAr : f.labelEn),
                      items: opts.map((o) => DropdownMenuItem(value: o, child: Text(o))).toList(),
                      onChanged: (v) => setState(() => draft.attrs[f.key] = v ?? ""),
                    ),
                  );
                }
                return Padding(
                  padding: const EdgeInsets.only(bottom: 12),
                  child: TextField(
                    keyboardType: f.keyboard == "number" ? TextInputType.number : TextInputType.text,
                    decoration: _box(ar ? f.labelAr : f.labelEn),
                    onChanged: (v) => draft.attrs[f.key] = v,
                  ),
                );
              }),
              TextField(
                keyboardType: TextInputType.number,
                decoration: _box(ar ? "السعر (${scope.currency})" : "Price (${scope.currency})"),
                onChanged: (v) => draft.price = v,
              ),
              const SizedBox(height: 20),
              _next(ar, onTap: () { writeCopy(ar); next(); }),
            ],
            if (steps[step] == "copy") ...[
              Text(ar ? "العنوان والوصف" : "Title and description", style: const TextStyle(fontFamily: "Georgia", fontSize: 26, color: CatchTokens.dark)),
              const SizedBox(height: 8),
              Text(ar ? "اتكتبوا من إجاباتك. عدّل إذا بدك." : "Written from your answers. Edit if you want.", style: const TextStyle(color: CatchTokens.muted)),
              const SizedBox(height: 14),
              TextField(controller: TextEditingController(text: draft.title), onChanged: (v) => draft.title = v, decoration: _box(ar ? "عنوان الإعلان" : "Title")),
              const SizedBox(height: 12),
              TextField(controller: TextEditingController(text: draft.description), onChanged: (v) => draft.description = v, maxLines: 6, decoration: _box(ar ? "الوصف" : "Description")),
              const SizedBox(height: 20),
              _next(ar, onTap: next),
            ],
            if (steps[step] == "review") ...[
              Text(ar ? "مراجعة قبل النشر" : "Review before publishing", style: const TextStyle(fontFamily: "Georgia", fontSize: 26, color: CatchTokens.dark)),
              const SizedBox(height: 12),
              Text(draft.title, style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 18)),
              const SizedBox(height: 8),
              Text("${draft.price} ${scope.currency}", style: const TextStyle(color: CatchTokens.accent, fontWeight: FontWeight.w700, fontSize: 18)),
              const SizedBox(height: 8),
              Text("${draft.city ?? ""} · ${draft.neighborhood ?? ""} · ${draft.location}"),
              const SizedBox(height: 8),
              Text(draft.description),
              if (error != null) ...[const SizedBox(height: 10), Text(error!, style: const TextStyle(color: Color(0xFF8B3A2A)))],
              const SizedBox(height: 22),
              FilledButton(
                style: FilledButton.styleFrom(backgroundColor: CatchTokens.accent, minimumSize: const Size.fromHeight(52), shape: const StadiumBorder()),
                onPressed: sending ? null : () => publish(scope, ar),
                child: Text(sending ? (ar ? "جارٍ النشر…" : "Publishing…") : (ar ? "حفظ ونشر الإعلان" : "Save and publish")),
              ),
            ],
          ],
        ),
      ),
    );
  }

  Widget _row(String label, {required bool on, required VoidCallback onTap}) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 10),
      child: GestureDetector(
        onTap: onTap,
        child: Container(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
          decoration: BoxDecoration(
            color: CatchTokens.card,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: on ? CatchTokens.accent : CatchTokens.border),
          ),
          child: Row(children: [Expanded(child: Text(label, style: const TextStyle(fontWeight: FontWeight.w600))), const Icon(Icons.chevron_left, color: CatchTokens.muted)]),
        ),
      ),
    );
  }

  Widget _next(bool ar, {required VoidCallback onTap}) {
    return FilledButton(
      style: FilledButton.styleFrom(backgroundColor: CatchTokens.accent, minimumSize: const Size.fromHeight(52), shape: const StadiumBorder()),
      onPressed: onTap,
      child: Text(ar ? "التالي" : "Next"),
    );
  }

  InputDecoration _box(String label) {
    return InputDecoration(
      labelText: label,
      filled: true,
      fillColor: CatchTokens.card,
      border: OutlineInputBorder(borderRadius: BorderRadius.circular(16), borderSide: const BorderSide(color: CatchTokens.border)),
    );
  }
}
