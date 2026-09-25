import "package:flutter/material.dart";
import "../../data/catalog.dart";
import "../../data/subcategories.dart";
import "photo_upload_screen.dart";
import "../../state/app_scope.dart";
import "../../theme/tokens.dart";
import "../search/search_results_screen.dart";
import "choose_subcategory_screen.dart";

const featuredSlugs = featuredCategorySlugs;

class ChooseCategoryScreen extends StatelessWidget {
  const ChooseCategoryScreen({super.key, this.browseOnly = false});
  final bool browseOnly;

  void open(BuildContext context, String slug) {
    if (browseOnly) {
      Navigator.of(context).push(MaterialPageRoute(builder: (_) => SearchResultsScreen(categorySlug: slug)));
      return;
    }
    if (subsFor(slug).isEmpty) {
      Navigator.of(context).push(MaterialPageRoute(
        builder: (_) => PhotoUploadScreen(categorySlug: slug, subcategorySlug: slug),
      ));
      return;
    }
    Navigator.of(context).push(MaterialPageRoute(builder: (_) => ChooseSubcategoryScreen(categorySlug: slug)));
  }

  @override
  Widget build(BuildContext context) {
    final ar = AppScopeProvider.of(context).isArabic;
    final featured = featuredSlugs.map((s) => categories.firstWhere((c) => c.slug == s)).toList();
    final others = categories.where((c) => !featuredSlugs.contains(c.slug)).toList();

    return Directionality(
      textDirection: ar ? TextDirection.rtl : TextDirection.ltr,
      child: Scaffold(
        backgroundColor: CatchTokens.bg,
        appBar: AppBar(backgroundColor: CatchTokens.bg, foregroundColor: CatchTokens.dark, elevation: 0),
        body: ListView(
          padding: const EdgeInsets.fromLTRB(18, 8, 18, 32),
          children: [
            Text(
              ar ? "ما الذي تود بيعه أو الإعلان عنه؟" : "What would you like to sell or list?",
              style: const TextStyle(fontFamily: "Georgia", fontSize: 26, color: CatchTokens.dark, height: 1.25),
            ),
            const SizedBox(height: 8),
            Text(
              ar ? "اختر القسم المناسب لإضافة الإعلان" : "Choose the right category for your listing",
              style: const TextStyle(color: CatchTokens.muted, fontSize: 14),
            ),
            const SizedBox(height: 22),
            GridView.count(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              crossAxisCount: 2,
              mainAxisSpacing: 12,
              crossAxisSpacing: 12,
              childAspectRatio: 1.05,
              children: featured.map((item) => _FeaturedCard(item: item, ar: ar, onTap: () => open(context, item.slug))).toList(),
            ),
            const SizedBox(height: 28),
            Text(ar ? "الأقسام الأخرى" : "Other categories", style: const TextStyle(fontFamily: "Georgia", fontSize: 22, color: CatchTokens.dark)),
            const SizedBox(height: 8),
            Text(
              ar
                  ? "إذا المطلوب مش من الأربعة فوق، اختر من باقي أقسام Catch the deals."
                  : "If it is not one of the four above, pick from the rest of Catch the deals.",
              style: const TextStyle(color: CatchTokens.muted, fontSize: 13, height: 1.4),
            ),
            const SizedBox(height: 16),
            ...others.map((item) => _OtherRow(item: item, ar: ar, onTap: () => open(context, item.slug))),
          ],
        ),
      ),
    );
  }
}

class _FeaturedCard extends StatelessWidget {
  const _FeaturedCard({required this.item, required this.ar, required this.onTap});
  final CategoryDef item;
  final bool ar;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.all(14),
        decoration: BoxDecoration(
          color: CatchTokens.card,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(color: CatchTokens.border),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Expanded(child: Center(child: Image.asset(item.asset, fit: BoxFit.contain))),
            const SizedBox(height: 8),
            Row(
              children: [
                Expanded(child: Text(ar ? item.nameAr : item.nameEn, style: const TextStyle(fontWeight: FontWeight.w700, color: CatchTokens.dark))),
                const Icon(Icons.chevron_left, color: CatchTokens.muted, size: 18),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

class _OtherRow extends StatelessWidget {
  const _OtherRow({required this.item, required this.ar, required this.onTap});
  final CategoryDef item;
  final bool ar;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 10),
      child: GestureDetector(
        onTap: onTap,
        child: Container(
          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
          decoration: BoxDecoration(
            color: CatchTokens.card,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: CatchTokens.border),
          ),
          child: Row(
            children: [
              ClipRRect(
                borderRadius: BorderRadius.circular(10),
                child: Image.asset(item.asset, width: 44, height: 44, fit: BoxFit.cover),
              ),
              const SizedBox(width: 12),
              Expanded(child: Text(ar ? item.nameAr : item.nameEn, style: const TextStyle(fontWeight: FontWeight.w600))),
              const Icon(Icons.chevron_left, color: CatchTokens.muted, size: 18),
            ],
          ),
        ),
      ),
    );
  }
}
