import "package:flutter/material.dart";
import "../../navigation.dart";
import "../../state/app_scope.dart";
import "../../state/listing_store.dart";
import "../../theme/tokens.dart";

class SearchResultsScreen extends StatelessWidget {
  const SearchResultsScreen({super.key, this.query = "", this.categorySlug});
  final String query;
  final String? categorySlug;

  @override
  Widget build(BuildContext context) {
    final scope = AppScopeProvider.of(context);
    final results = ListingStore.instance.search(
      countryCode: scope.browseCountryCode,
      query: query,
      categorySlug: categorySlug,
    );
    final ar = scope.isArabic;
    return Scaffold(
      backgroundColor: CatchTokens.bg,
      appBar: AppBar(
        backgroundColor: CatchTokens.bg,
        foregroundColor: CatchTokens.dark,
        elevation: 0,
        title: Text(ar ? "نتائج ${scope.browseCountry.nameAr}" : "Results in ${scope.browseCountry.nameEn}"),
      ),
      body: results.isEmpty
          ? Center(child: Text(ar ? "ما في إعلانات بهالبحث داخل هالدولة" : "No listings in this country for that search"))
          : ListView.separated(
              padding: const EdgeInsets.all(18),
              itemCount: results.length,
              separatorBuilder: (_, __) => const SizedBox(height: 12),
              itemBuilder: (context, i) {
                final item = results[i];
                return GestureDetector(
                  onTap: () => openListing(context, item),
                  child: Container(
                  decoration: BoxDecoration(color: CatchTokens.card, borderRadius: BorderRadius.circular(16), border: Border.all(color: CatchTokens.border)),
                  child: ListTile(
                    leading: Image.asset(item.imageUrl, width: 64, height: 64, fit: BoxFit.cover),
                    title: Text(item.title),
                    subtitle: Text("${item.city} · ${item.neighborhood}"),
                    trailing: Text("${item.price} ${item.currency}"),
                  ),
                ),
                );
              },
            ),
    );
  }
}
