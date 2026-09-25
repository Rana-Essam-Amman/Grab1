import "package:flutter/material.dart";
import "../../data/locations.dart";
import "../../data/map_urls.dart";
import "../../state/app_scope.dart";
import "../../theme/tokens.dart";
import "ai_draft_screen.dart";

class LocationPickScreen extends StatefulWidget {
  const LocationPickScreen({super.key, required this.categorySlug, required this.subcategorySlug});
  final String categorySlug;
  final String subcategorySlug;

  @override
  State<LocationPickScreen> createState() => _LocationPickScreenState();
}

class _LocationPickScreenState extends State<LocationPickScreen> {
  int step = 0;
  String? city;
  String? area;
  final site = TextEditingController();

  @override
  void dispose() {
    site.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final scope = AppScopeProvider.of(context);
    final ar = scope.isArabic;
    final book = ar ? locationsAr[scope.listingCountry.code]! : locations[scope.listingCountry.code]!;
    final cities = book.keys.toList();
    final areas = city == null ? const <String>[] : (book[city] ?? const <String>[]);

    return Directionality(
      textDirection: ar ? TextDirection.rtl : TextDirection.ltr,
      child: Scaffold(
        backgroundColor: CatchTokens.bg,
        appBar: AppBar(
          backgroundColor: CatchTokens.bg,
          foregroundColor: CatchTokens.dark,
          elevation: 0,
          leading: IconButton(
            icon: const Icon(Icons.arrow_back),
            onPressed: () {
              if (step == 0) Navigator.pop(context);
              else setState(() => step -= 1);
            },
          ),
        ),
        body: ListView(
          padding: const EdgeInsets.fromLTRB(18, 8, 18, 32),
          children: [
            if (step == 0) ...[
              Text(ar ? "في أي مدينة؟" : "Which city?", style: const TextStyle(fontFamily: "Georgia", fontSize: 26, color: CatchTokens.dark)),
              const SizedBox(height: 14),
              for (final name in cities)
                _row(name, onTap: () => setState(() { city = name; area = null; step = 1; })),
            ],
            if (step == 1) ...[
              Text(ar ? "في أي حي؟" : "Which neighborhood?", style: const TextStyle(fontFamily: "Georgia", fontSize: 26, color: CatchTokens.dark)),
              const SizedBox(height: 14),
              for (final name in areas)
                _row(name, onTap: () => setState(() { area = name; step = 2; })),
            ],
            if (step == 2) ...[
              Text(ar ? "الموقع التقريبي" : "Approximate location", style: const TextStyle(fontFamily: "Georgia", fontSize: 26, color: CatchTokens.dark)),
              const SizedBox(height: 8),
              Text(ar ? "مثال: قرب دائرة الترخيص، أو اسم الشارع." : "Example: near the licensing office, or a street name.", style: const TextStyle(color: CatchTokens.muted)),
              const SizedBox(height: 14),
              TextField(
                controller: site,
                onChanged: (_) => setState(() {}),
                decoration: InputDecoration(
                  hintText: ar ? "الموقع التقريبي" : "Approximate location",
                  filled: true,
                  fillColor: CatchTokens.card,
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(16), borderSide: const BorderSide(color: CatchTokens.border)),
                ),
              ),
              const SizedBox(height: 14),
              Container(
                height: 180,
                decoration: BoxDecoration(
                  color: const Color(0xFFE7E1D4),
                  borderRadius: BorderRadius.circular(18),
                  border: Border.all(color: CatchTokens.border),
                ),
                child: Stack(
                  fit: StackFit.expand,
                  children: [
                    const Center(child: Icon(Icons.map_outlined, size: 64, color: CatchTokens.accent)),
                    Positioned(
                      left: 14,
                      right: 14,
                      bottom: 12,
                      child: Text(
                        googleSearchQuery(city: city ?? "", area: area ?? "", site: site.text),
                        textAlign: TextAlign.center,
                        style: const TextStyle(fontWeight: FontWeight.w700, color: CatchTokens.dark),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 8),
              Text(ar ? "الخريطة تتبع المدينة والحي والموقع التقريبي." : "The map follows city, area, and the approximate site.", style: const TextStyle(color: CatchTokens.muted, fontSize: 12)),
              const SizedBox(height: 22),
              FilledButton(
                style: FilledButton.styleFrom(backgroundColor: CatchTokens.accent, minimumSize: const Size.fromHeight(52), shape: const StadiumBorder()),
                onPressed: () {
                  Navigator.of(context).push(MaterialPageRoute(
                    builder: (_) => AiDraftScreen(
                      categorySlug: widget.categorySlug,
                      subcategorySlug: widget.subcategorySlug,
                      city: city ?? "",
                      neighborhood: area ?? "",
                      site: site.text.trim(),
                    ),
                  ));
                },
                child: Text(ar ? "التالي" : "Next"),
              ),
            ],
          ],
        ),
      ),
    );
  }

  Widget _row(String label, {required VoidCallback onTap}) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 10),
      child: GestureDetector(
        onTap: onTap,
        child: Container(
          width: double.infinity,
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
          decoration: BoxDecoration(
            color: CatchTokens.card,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: CatchTokens.border),
          ),
          child: Row(children: [Expanded(child: Text(label, style: const TextStyle(fontWeight: FontWeight.w600))), const Icon(Icons.chevron_left, color: CatchTokens.muted)]),
        ),
      ),
    );
  }
}
