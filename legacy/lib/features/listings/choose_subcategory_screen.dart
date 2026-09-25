import "package:flutter/material.dart";
import "../../data/categories.dart";
import "../../data/subcategories.dart";
import "../../state/app_scope.dart";
import "../../theme/tokens.dart";
import "photo_upload_screen.dart";

class ChooseSubcategoryScreen extends StatefulWidget {
  const ChooseSubcategoryScreen({super.key, required this.categorySlug});
  final String categorySlug;

  @override
  State<ChooseSubcategoryScreen> createState() => _ChooseSubcategoryScreenState();
}

class _ChooseSubcategoryScreenState extends State<ChooseSubcategoryScreen> {
  String query = "";

  @override
  Widget build(BuildContext context) {
    final ar = AppScopeProvider.of(context).isArabic;
    final parent = categories.firstWhere((c) => c.slug == widget.categorySlug, orElse: () => categories.first);
    final items = subsFor(widget.categorySlug).where((s) {
      if (query.trim().isEmpty) return true;
      final q = query.toLowerCase();
      return s.nameAr.contains(query) || s.nameEn.toLowerCase().contains(q);
    }).toList();

    return Directionality(
      textDirection: ar ? TextDirection.rtl : TextDirection.ltr,
      child: Scaffold(
        backgroundColor: CatchTokens.bg,
        appBar: AppBar(
          backgroundColor: CatchTokens.bg,
          foregroundColor: CatchTokens.dark,
          elevation: 0,
          title: Text(ar ? parent.nameAr : parent.nameEn, style: const TextStyle(fontSize: 16)),
        ),
        body: ListView(
          padding: const EdgeInsets.fromLTRB(18, 8, 18, 32),
          children: [
            Text(
              ar ? "ما الذي تود بيعه أو الإعلان عنه؟" : "What would you like to sell or list?",
              style: const TextStyle(fontFamily: "Georgia", fontSize: 26, color: CatchTokens.dark, height: 1.25),
            ),
            const SizedBox(height: 8),
            Text(ar ? "اختر القسم المناسب لإضافة الإعلان" : "Choose the right section for your listing", style: const TextStyle(color: CatchTokens.muted)),
            const SizedBox(height: 16),
            TextField(
              onChanged: (v) => setState(() => query = v),
              decoration: InputDecoration(
                hintText: ar ? "ابحث في القسم" : "Search in category",
                prefixIcon: const Icon(Icons.search, color: CatchTokens.accent),
                filled: true,
                fillColor: CatchTokens.card,
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(16), borderSide: const BorderSide(color: CatchTokens.border)),
              ),
            ),
            const SizedBox(height: 16),
            for (final item in items)
              Padding(
                padding: const EdgeInsets.only(bottom: 10),
                child: GestureDetector(
                  onTap: () => Navigator.of(context).push(MaterialPageRoute(
                    builder: (_) => PhotoUploadScreen(categorySlug: widget.categorySlug, subcategorySlug: item.slug),
                  )),
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 18),
                    decoration: BoxDecoration(
                      color: CatchTokens.card,
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: CatchTokens.border),
                    ),
                    child: Row(
                      children: [
                        Expanded(child: Text(ar ? item.nameAr : item.nameEn, style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 15))),
                        const Icon(Icons.chevron_left, color: CatchTokens.muted),
                      ],
                    ),
                  ),
                ),
              ),
          ],
        ),
      ),
    );
  }
}
