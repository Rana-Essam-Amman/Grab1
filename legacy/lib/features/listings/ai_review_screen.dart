import "dart:convert";
import "dart:io";
import "package:flutter/material.dart";
import "../../api/api_base.dart";
import "../../ai/category_match.dart";
import "../../data/listing_draft.dart";
import "../../state/app_scope.dart";
import "../../state/listing_store.dart";
import "../../theme/tokens.dart";
import "../auth/register_screen.dart";

class AiReviewScreen extends StatefulWidget {
  const AiReviewScreen({
    super.key,
    required this.categorySlug,
    required this.subcategorySlug,
    required this.raw,
    this.city = "",
    this.neighborhood = "",
    this.site = "",
  });
  final String categorySlug;
  final String subcategorySlug;
  final String raw;
  final String city;
  final String neighborhood;
  final String site;

  @override
  State<AiReviewScreen> createState() => _AiReviewScreenState();
}

class _AiReviewScreenState extends State<AiReviewScreen> {
  late GeneratedListing draft;
  late CategoryMatch match;
  late String categorySlug;
  late String subcategorySlug;
  late final TextEditingController title;
  late final TextEditingController description;
  late final TextEditingController price;
  bool sending = false;
  bool moved = false;
  String? error;

  @override
  void initState() {
    super.initState();
    match = matchCategory(
      chosenCategory: widget.categorySlug,
      chosenSub: widget.subcategorySlug,
      note: widget.raw,
    );
    categorySlug = match.effectiveCategory;
    subcategorySlug = match.effectiveSub;
    draft = generateListing(
      raw: widget.raw,
      categorySlug: categorySlug,
      subcategorySlug: subcategorySlug,
      arabic: true,
    );
    title = TextEditingController(text: draft.title);
    description = TextEditingController(text: draft.description);
    price = TextEditingController(text: draft.price);
  }

  @override
  void dispose() {
    title.dispose();
    description.dispose();
    price.dispose();
    super.dispose();
  }

  Future<void> publish() async {
    final scope = AppScopeProvider.of(context);
    final ar = scope.isArabic;
    final amount = double.tryParse(price.text.trim());
    if (title.text.trim().length < 3 || amount == null || amount <= 0) {
      setState(() => error = ar ? "راجع العنوان والسعر" : "Check title and price");
      return;
    }
    if (!scope.registered) {
      scope.rememberPost(category: categorySlug, sub: subcategorySlug, note: widget.raw);
      await Navigator.of(context).push(MaterialPageRoute(builder: (_) => const RegisterScreen()));
      if (!scope.registered || !mounted) return;
    }
    setState(() { sending = true; error = null; });
    try {
      final client = HttpClient();
      final req = await client.postUrl(Uri.parse("$apiBase/api/listings"));
      req.headers.contentType = ContentType.json;
      req.headers.set("Authorization", "Bearer ${scope.sessionToken}");
      req.add(utf8.encode(jsonEncode({
        "title": title.text.trim(),
        "description": description.text.trim(),
        "price": amount,
        "currency": scope.currency,
        "categorySlug": categorySlug,
        "subcategorySlug": subcategorySlug,
        "city": widget.city.isNotEmpty ? widget.city : (draft.city ?? scope.browseCityEn),
        "neighborhood": widget.neighborhood,
        "attrs": {"site": widget.site},
      })));
      final res = await req.close();
      await res.drain();
      client.close();
      if (res.statusCode >= 400) {
        setState(() { sending = false; error = ar ? "ما قدرنا ننشر" : "Could not publish"; });
        return;
      }
      ListingStore.instance.add(Listing(
        id: DateTime.now().millisecondsSinceEpoch.toString(),
        countryCode: scope.listingCountry.code,
        city: widget.city.isNotEmpty ? widget.city : (draft.city ?? scope.browseCityEn),
        neighborhood: widget.neighborhood,
        categorySlug: categorySlug,
        title: title.text.trim(),
        description: description.text.trim(),
        price: amount,
        currency: scope.currency,
        imageUrl: "assets/listings/car.jpg",
        sellerPhone: scope.phone,
      ));
      scope.clearPendingPost();
      if (mounted) Navigator.of(context).popUntil((route) => route.isFirst);
    } catch (_) {
      setState(() { sending = false; error = ar ? "مشكلة اتصال" : "Connection problem"; });
    }
  }

  @override
  Widget build(BuildContext context) {
    final ar = AppScopeProvider.of(context).isArabic;
    return Directionality(
      textDirection: ar ? TextDirection.rtl : TextDirection.ltr,
      child: Scaffold(
        backgroundColor: CatchTokens.bg,
        appBar: AppBar(backgroundColor: CatchTokens.bg, foregroundColor: CatchTokens.dark, elevation: 0),
        body: ListView(
          padding: const EdgeInsets.fromLTRB(18, 8, 18, 32),
          children: [
            Text(ar ? "راجع الإعلان قبل النشر" : "Review before publishing",
                style: const TextStyle(fontFamily: "Georgia", fontSize: 26, color: CatchTokens.dark)),
            const SizedBox(height: 8),
            Text(ar ? "عدّل أي سطر. النشر بعد موافقتك فقط." : "Edit any line. It publishes only after you approve.",
                style: const TextStyle(color: CatchTokens.muted)),
            if (!moved && match.mismatch && match.suggested != null && mismatchPolicy == MismatchPolicy.confirm) ...[
              Container(
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(
                  color: CatchTokens.card,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: CatchTokens.accent),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      ar
                          ? "لاحظنا إن الوصف أقرب لـ ${match.suggested!.labelAr}، وأنت اخترت قسم ثاني. ننقله؟"
                          : "The note looks like ${match.suggested!.labelEn}. Move it?",
                    ),
                    const SizedBox(height: 10),
                    FilledButton(
                      style: FilledButton.styleFrom(backgroundColor: CatchTokens.accent),
                      onPressed: () => setState(() {
                        categorySlug = match.suggested!.categorySlug;
                        subcategorySlug = match.suggested!.subcategorySlug;
                        moved = true;
                      }),
                      child: Text(ar ? "نعم، انقل" : "Yes, move"),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 16),
            ],
            TextField(controller: title, decoration: _box(ar ? "العنوان" : "Title")),
            const SizedBox(height: 12),
            TextField(controller: description, maxLines: 8, decoration: _box(ar ? "الوصف" : "Description")),
            const SizedBox(height: 12),
            TextField(controller: price, keyboardType: TextInputType.number, decoration: _box(ar ? "السعر" : "Price")),
            if (draft.missing.isNotEmpty)
              Padding(
                padding: const EdgeInsets.only(top: 8),
                child: Text((ar ? "لنسخة أقوى اختياريًا: " : "Optional stronger copy: ") + draft.missing.join("، "),
                    style: const TextStyle(color: CatchTokens.muted, fontSize: 12)),
              ),
            if (error != null) ...[const SizedBox(height: 10), Text(error!, style: const TextStyle(color: Color(0xFF8B3A2A)))],
            const SizedBox(height: 22),
            FilledButton(
              style: FilledButton.styleFrom(backgroundColor: CatchTokens.accent, minimumSize: const Size.fromHeight(52), shape: const StadiumBorder()),
              onPressed: sending ? null : publish,
              child: Text(sending ? (ar ? "جارٍ النشر…" : "Publishing…") : (ar ? "موافق — نشر الإعلان" : "Approve and publish")),
            ),
          ],
        ),
      ),
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
