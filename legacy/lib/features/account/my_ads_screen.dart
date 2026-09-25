import "package:flutter/material.dart";
import "../../navigation.dart";
import "../../state/app_scope.dart";
import "../../state/listing_store.dart";
import "../../theme/tokens.dart";

class MyAdsScreen extends StatelessWidget {
  const MyAdsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final scope = AppScopeProvider.of(context);
    final ar = scope.isArabic;
    final mine = ListingStore.instance.mine(scope.phone);
    return Directionality(
      textDirection: ar ? TextDirection.rtl : TextDirection.ltr,
      child: Scaffold(
        backgroundColor: CatchTokens.bg,
        appBar: AppBar(backgroundColor: CatchTokens.bg, foregroundColor: CatchTokens.dark, elevation: 0, title: Text(ar ? "إعلاناتي" : "My Ads")),
        body: mine.isEmpty
            ? Center(
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Text(ar ? "لسا ما نشرت إعلان." : "You have not posted a listing yet.", style: const TextStyle(color: CatchTokens.muted)),
                    const SizedBox(height: 16),
                    FilledButton(
                      style: FilledButton.styleFrom(backgroundColor: CatchTokens.accent),
                      onPressed: () => openPostAdFlow(context),
                      child: Text(ar ? "أضف إعلان" : "Post Ad"),
                    ),
                  ],
                ),
              )
            : ListView.separated(
                padding: const EdgeInsets.all(16),
                itemCount: mine.length,
                separatorBuilder: (_, __) => const SizedBox(height: 10),
                itemBuilder: (_, i) {
                  final item = mine[i];
                  return ListTile(
                    onTap: () => openListing(context, item),
                    tileColor: CatchTokens.card,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16), side: const BorderSide(color: CatchTokens.border)),
                    leading: ClipRRect(
                      borderRadius: BorderRadius.circular(10),
                      child: Image.asset(item.imageUrl, width: 56, height: 56, fit: BoxFit.cover),
                    ),
                    title: Text(item.title),
                    subtitle: Text("${item.price} ${item.currency} · ${item.city}"),
                  );
                },
              ),
      ),
    );
  }
}
