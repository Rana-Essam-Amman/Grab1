import "dart:convert";
import "dart:io";
import "package:flutter/material.dart";
import "../../api/api_base.dart";
import "../../data/categories.dart";
import "../../data/listing_fields.dart";
import "../../data/locations.dart";
import "../../state/app_scope.dart";
import "../../state/listing_store.dart";
import "../../theme/tokens.dart";

class PostAdScreen extends StatefulWidget {
  const PostAdScreen({super.key, this.categorySlug, this.subcategorySlug});
  final String? categorySlug;
  final String? subcategorySlug;

  @override
  State<PostAdScreen> createState() => _PostAdScreenState();
}

class _PostAdScreenState extends State<PostAdScreen> {
  late String? categorySlug = widget.categorySlug;
  final title = TextEditingController();
  final description = TextEditingController();
  final price = TextEditingController();
  String? governorate;
  String? neighborhood;
  String? error;
  bool sending = false;
  final extra = <String, String>{};

  @override
  void dispose() {
    title.dispose();
    description.dispose();
    price.dispose();
    super.dispose();
  }

  Future<void> publish(AppScope scope, bool ar) async {
    final country = scope.listingCountry;
    if ((scope.sessionToken ?? "").isEmpty || !scope.registered) {
      setState(() => error = ar ? "سجّل حسابك أولاً" : "Register first");
      return;
    }
    if (title.text.trim().length < 3 || description.text.trim().length < 8) {
      setState(() => error = ar ? "أدخل عنوان ووصف كامل" : "Enter a full title and description");
      return;
    }
    final amount = double.tryParse(price.text.trim());
    if (amount == null || amount <= 0) {
      setState(() => error = ar ? "أدخل سعر صحيح" : "Enter a valid price");
      return;
    }
    if (categorySlug == null || governorate == null || neighborhood == null) {
      setState(() => error = ar ? "اختر القسم والمحافظة والحي" : "Choose category, city and neighborhood");
      return;
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
        "subcategorySlug": widget.subcategorySlug,
        "attrs": extra,
        "city": governorate,
        "neighborhood": neighborhood,
      })));
      final res = await req.close();
      final raw = await res.transform(utf8.decoder).join();
      client.close();
      final data = raw.isEmpty ? <String, dynamic>{} : jsonDecode(raw) as Map<String, dynamic>;
      if (res.statusCode == 403) {
        setState(() { sending = false; error = ar ? "وصلت للحد المجاني: 5 إعلانات" : "Free limit reached: 5 listings"; });
        return;
      }
      if (res.statusCode >= 400) {
        setState(() { sending = false; error = ar ? "ما قدرنا ننشر الإعلان" : "Could not publish the listing"; });
        return;
      }
      ListingStore.instance.add(Listing(
        id: (data["id"] ?? DateTime.now().millisecondsSinceEpoch).toString(),
        countryCode: country.code,
        city: governorate!,
        neighborhood: neighborhood!,
        categorySlug: categorySlug!,
        title: title.text.trim(),
        description: description.text.trim(),
        price: amount,
        currency: scope.currency,
        imageUrl: "assets/listings/sofa.jpg",
        sellerPhone: scope.phone,
      ));
      if (!mounted) return;
      Navigator.of(context).popUntil((route) => route.isFirst);
    } catch (_) {
      setState(() { sending = false; error = ar ? "في مشكلة بالاتصال" : "Connection problem"; });
    }
  }

  @override
  Widget build(BuildContext context) {
    final scope = AppScopeProvider.of(context);
    final ar = scope.isArabic;
    final country = scope.listingCountry;
    final govMap = ar ? locationsAr[country.code]! : locations[country.code]!;
    final areas = governorate == null ? const <String>[] : (govMap[governorate] ?? const <String>[]);

    return Directionality(
      textDirection: ar ? TextDirection.rtl : TextDirection.ltr,
      child: Scaffold(
        backgroundColor: CatchTokens.bg,
        appBar: AppBar(
          backgroundColor: CatchTokens.bg,
          foregroundColor: CatchTokens.dark,
          elevation: 0,
          title: Text(ar ? "أضف إعلان" : "Post Ad"),
        ),
        body: ListView(
          padding: const EdgeInsets.fromLTRB(18, 8, 18, 32),
          children: [
            Text(
              ar ? "${country.nameAr} · ${scope.currency}" : "${country.nameEn} · ${scope.currency}",
              style: const TextStyle(color: CatchTokens.accent, fontWeight: FontWeight.w700),
            ),
            const SizedBox(height: 6),
            Text(
              ar ? "الإعلان يننشر في دولة حسابك فقط." : "The listing is published in your account country only.",
              style: const TextStyle(color: CatchTokens.muted, fontSize: 12),
            ),
            Text(
              ar
                  ? "الصور: الحد الأدنى ${packFor(widget.subcategorySlug).minPhotos} والحد الأعلى ${packFor(widget.subcategorySlug).maxPhotos}."
                  : "Photos: at least ${packFor(widget.subcategorySlug).minPhotos}, up to ${packFor(widget.subcategorySlug).maxPhotos}.",
              style: const TextStyle(color: CatchTokens.muted, fontSize: 12),
            ),
            if (country.hasCurrencyChoice) ...[
              const SizedBox(height: 12),
              Wrap(
                spacing: 8,
                children: country.currencies.map((c) {
                  final on = scope.currency == c.code;
                  return ChoiceChip(
                    label: Text(c.code),
                    selected: on,
                    selectedColor: CatchTokens.accent,
                    onSelected: (_) => scope.setCurrency(c.code),
                  );
                }).toList(),
              ),
            ],
            const SizedBox(height: 16),
            ...fieldsFor(categorySlug: categorySlug, subcategorySlug: widget.subcategorySlug).map((field) {
              final options = ar ? field.optionsAr : field.optionsEn;
              if (options.isNotEmpty) {
                return Padding(
                  padding: const EdgeInsets.only(bottom: 12),
                  child: DropdownButtonFormField<String>(
                    value: extra[field.key],
                    decoration: _dec(ar ? field.labelAr : field.labelEn),
                    items: options.map((o) => DropdownMenuItem(value: o, child: Text(o))).toList(),
                    onChanged: (v) => setState(() => extra[field.key] = v ?? ""),
                  ),
                );
              }
              return Padding(
                padding: const EdgeInsets.only(bottom: 12),
                child: TextField(
                  keyboardType: field.keyboard == "number" ? TextInputType.number : TextInputType.text,
                  decoration: _dec(ar ? field.labelAr : field.labelEn),
                  onChanged: (v) => extra[field.key] = v,
                ),
              );
            }),
            TextField(controller: title, decoration: _dec(ar ? "عنوان الإعلان" : "Title")),
            const SizedBox(height: 12),
            TextField(controller: description, maxLines: 4, decoration: _dec(ar ? "الوصف الكامل" : "Full details")),
            const SizedBox(height: 12),
            TextField(
              controller: price,
              keyboardType: TextInputType.number,
              decoration: _dec(ar ? "السعر (${scope.currency})" : "Price (${scope.currency})"),
            ),
            const SizedBox(height: 12),
            DropdownButtonFormField<String>(
              value: categorySlug,
              decoration: _dec(ar ? "القسم" : "Category"),
              items: categories
                  .map((c) => DropdownMenuItem(value: c.slug, child: Text(ar ? c.nameAr : c.nameEn)))
                  .toList(),
              onChanged: (v) => setState(() => categorySlug = v),
            ),
            const SizedBox(height: 12),
            DropdownButtonFormField<String>(
              value: governorate,
              decoration: _dec(ar ? "المحافظة" : "Governorate"),
              items: govMap.keys.map((g) => DropdownMenuItem(value: g, child: Text(g))).toList(),
              onChanged: (v) => setState(() {
                governorate = v;
                neighborhood = null;
              }),
            ),
            const SizedBox(height: 12),
            DropdownButtonFormField<String>(
              value: neighborhood,
              decoration: _dec(ar ? "الحي" : "Neighborhood"),
              items: areas.map((a) => DropdownMenuItem(value: a, child: Text(a))).toList(),
              onChanged: (v) => setState(() => neighborhood = v),
            ),
            if (error != null) ...[
              const SizedBox(height: 12),
              Text(error!, style: const TextStyle(color: Color(0xFF8B3A2A))),
            ],
            const SizedBox(height: 24),
            FilledButton(
              style: FilledButton.styleFrom(backgroundColor: CatchTokens.accent, minimumSize: const Size.fromHeight(52), shape: const StadiumBorder()),
              onPressed: sending ? null : () => publish(scope, ar),
              child: Text(sending ? (ar ? "جارٍ النشر…" : "Publishing…") : (ar ? "نشر الإعلان" : "Publish listing")),
            ),
          ],
        ),
      ),
    );
  }

  InputDecoration _dec(String label) {
    return InputDecoration(
      labelText: label,
      filled: true,
      fillColor: CatchTokens.card,
      border: OutlineInputBorder(borderRadius: BorderRadius.circular(16), borderSide: const BorderSide(color: CatchTokens.border)),
    );
  }
}
