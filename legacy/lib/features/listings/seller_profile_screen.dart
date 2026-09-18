import "package:flutter/material.dart";
import "../../navigation.dart";
import "../../state/app_scope.dart";
import "../../state/listing_store.dart";
import "../../theme/tokens.dart";

class SellerProfileScreen extends StatelessWidget {
  const SellerProfileScreen({super.key, required this.listing});
  final Listing listing;

  @override
  Widget build(BuildContext context) {
    final ar = AppScopeProvider.of(context).isArabic;
    final ads = ListingStore.instance.bySeller(listing.sellerPhone);
    final name = listing.sellerName.isEmpty ? (ar ? "بائع" : "Seller") : listing.sellerName;
    return Directionality(
      textDirection: ar ? TextDirection.rtl : TextDirection.ltr,
      child: Scaffold(
        backgroundColor: CatchTokens.bg,
        appBar: AppBar(backgroundColor: CatchTokens.bg, foregroundColor: CatchTokens.dark, elevation: 0, title: Text(name)),
        body: ListView(
          padding: const EdgeInsets.all(16),
          children: [
            Text(ar ? "إعلانات البائع" : "Seller listings", style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 18)),
            const SizedBox(height: 12),
            for (final item in ads)
              ListTile(
                onTap: () => openListing(context, item),
                tileColor: CatchTokens.card,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16), side: const BorderSide(color: CatchTokens.border)),
                leading: Image.asset(item.imageUrl, width: 52, height: 52, fit: BoxFit.cover),
                title: Text(item.title),
                subtitle: Text("${item.price} ${item.currency}"),
              ),
            if (ads.isEmpty) Text(ar ? "ما في إعلانات ظاهرة." : "No listings to show.", style: const TextStyle(color: CatchTokens.muted)),
          ],
        ),
      ),
    );
  }
}
