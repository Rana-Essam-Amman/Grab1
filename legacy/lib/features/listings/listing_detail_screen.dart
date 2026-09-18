
import "package:flutter/material.dart";
import "../../data/categories.dart";
import "../../data/map_urls.dart";
import "../../navigation.dart";
import "../../state/app_scope.dart";
import "../../state/conversation_store.dart";
import "../../state/listing_store.dart";
import "../../theme/tokens.dart";
import "../account/thread_screen.dart";
import "report_listing_screen.dart";
import "seller_profile_screen.dart";
import "share_row.dart";

class ListingDetailScreen extends StatefulWidget {
  const ListingDetailScreen({super.key, required this.listing});
  final Listing listing;

  @override
  State<ListingDetailScreen> createState() => _ListingDetailScreenState();
}

class _ListingDetailScreenState extends State<ListingDetailScreen> {
  bool saved = false;
  int photo = 0;

  Future<bool> gate() async {
    if (AppScopeProvider.of(context).registered) return true;
    await requireAccountThen(context, () {});
    return AppScopeProvider.of(context).registered && mounted;
  }

  Future<void> openChat() async {
    if (!await gate()) return;
    final thread = ConversationStore.instance.openFor(widget.listing);
    if (!mounted) return;
    Navigator.of(context).push(MaterialPageRoute(builder: (_) => ThreadScreen(thread: thread)));
  }

  @override
  Widget build(BuildContext context) {
    final scope = AppScopeProvider.of(context);
    final ar = scope.isArabic;
    final listing = widget.listing;
    final loggedIn = scope.registered;
    final own = loggedIn && listing.sellerPhone.isNotEmpty && listing.sellerPhone == scope.phone;
    final cat = categories.where((c) => c.slug == listing.categorySlug);
    final catName = cat.isEmpty ? listing.categorySlug : (ar ? cat.first.nameAr : cat.first.nameEn);
    final gallery = listing.gallery;
    final similar = ListingStore.instance.inCountry(scope.browseCountryCode).where((l) => l.id != listing.id).take(6).toList();
    final seller = listing.sellerName.isEmpty ? (ar ? "بائع على Catch the deals" : "Catch the deals seller") : listing.sellerName;
    final mapQuery = googleSearchQuery(city: listing.city, area: listing.neighborhood);

    return Directionality(
      textDirection: ar ? TextDirection.rtl : TextDirection.ltr,
      child: Scaffold(
        backgroundColor: CatchTokens.bg,
        appBar: AppBar(
          backgroundColor: CatchTokens.bg,
          foregroundColor: CatchTokens.dark,
          elevation: 0,
          actions: [
            IconButton(onPressed: () => setState(() => saved = !saved), icon: Icon(saved ? Icons.favorite : Icons.favorite_border, color: CatchTokens.accent)),
            const SizedBox(width: 8),
          ],
        ),
        bottomNavigationBar: SafeArea(
          child: Padding(
            padding: const EdgeInsets.fromLTRB(12, 8, 12, 12),
            child: own
                ? Text(ar ? "هذا إعلانك" : "This is your listing", textAlign: TextAlign.center, style: const TextStyle(color: CatchTokens.muted))
                : Row(
                    children: [
                      Expanded(
                        child: OutlinedButton(
                          style: OutlinedButton.styleFrom(foregroundColor: CatchTokens.dark, side: const BorderSide(color: CatchTokens.border), minimumSize: const Size.fromHeight(50), shape: const StadiumBorder()),
                          onPressed: () async {
                            if (!await gate()) return;
                            if (!mounted) return;
                            showDialog<void>(
                              context: context,
                              builder: (_) => AlertDialog(
                                title: Text(ar ? "اتصال" : "Call"),
                                content: Text(listing.sellerPhone.isEmpty ? (ar ? "ما في رقم" : "No number") : listing.sellerPhone),
                                actions: [TextButton(onPressed: () => Navigator.pop(context), child: Text(ar ? "حسناً" : "OK"))],
                              ),
                            );
                          },
                          child: Row(mainAxisAlignment: MainAxisAlignment.center, children: [const Icon(Icons.phone, size: 18), const SizedBox(width: 6), Text(ar ? "اتصال" : "Call")]),

                        ),
                      ),
                      const SizedBox(width: 8),
                      Expanded(
                        child: FilledButton(
                          style: FilledButton.styleFrom(backgroundColor: CatchTokens.accent, minimumSize: const Size.fromHeight(50), shape: const StadiumBorder()),
                          onPressed: openChat,
                          child: Row(mainAxisAlignment: MainAxisAlignment.center, children: [const Icon(Icons.chat_bubble_outline, size: 18), const SizedBox(width: 6), Text(ar ? "مراسلة" : "Chat")]),
                        ),
                      ),
                    ],
                  ),
          ),
        ),
        body: ListView(
          children: [
            SizedBox(
              height: 280,
              child: Stack(
                children: [
                  PageView.builder(
                    itemCount: gallery.length,
                    onPageChanged: (i) => setState(() => photo = i),
                    itemBuilder: (_, i) => Image.asset(gallery[i], fit: BoxFit.cover, width: double.infinity),
                  ),
                  Positioned(
                    bottom: 10,
                    left: 0,
                    right: 0,
                    child: Text("${photo + 1}/${gallery.length}", textAlign: TextAlign.center, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w700)),
                  ),
                ],
              ),
            ),
            Padding(
              padding: const EdgeInsets.fromLTRB(18, 16, 18, 28),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text("${listing.price} ${listing.currency}", style: const TextStyle(fontFamily: "Georgia", fontSize: 28, color: CatchTokens.dark)),
                  const SizedBox(height: 8),
                  Text(listing.title, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w700, height: 1.3)),
                  TextButton(onPressed: () => openSearch(context, categorySlug: listing.categorySlug), child: Text(catName, style: const TextStyle(color: CatchTokens.accent))),
                  Text("${ar ? "رقم الإعلان" : "Ad"} ${listing.id} · ${listing.views} ${ar ? "مشاهدة" : "views"}", style: const TextStyle(color: CatchTokens.muted)),
                  InkWell(
                    onTap: () {
                      showDialog<void>(
                        context: context,
                        builder: (_) => AlertDialog(
                          title: Text(ar ? "الموقع" : "Location"),
                          content: Text(mapQuery),
                          actions: [TextButton(onPressed: () => Navigator.pop(context), child: Text(ar ? "إغلاق" : "Close"))],
                        ),
                      );
                    },
                    child: Row(
                      children: [
                        const Icon(Icons.location_on, size: 16, color: CatchTokens.accent),
                        const SizedBox(width: 6),
                        Text("${listing.city} · ${listing.neighborhood}", style: const TextStyle(fontWeight: FontWeight.w600)),
                      ],
                    ),
                  ),
                  const SizedBox(height: 14),
                  Text(ar ? "المواصفات" : "Details", style: const TextStyle(fontWeight: FontWeight.w700)),
                  const SizedBox(height: 8),
                  ...listing.attrs.entries.map((e) => Padding(
                        padding: const EdgeInsets.only(bottom: 6),
                        child: Row(children: [Expanded(child: Text(e.key, style: const TextStyle(color: CatchTokens.muted))), Text(e.value, style: const TextStyle(fontWeight: FontWeight.w600))]),
                      )),
                  const SizedBox(height: 16),
                  Text(ar ? "تفاصيل الإعلان" : "Listing details", style: const TextStyle(fontWeight: FontWeight.w700)),
                  const SizedBox(height: 8),
                  Text(listing.description, style: const TextStyle(height: 1.5)),
                  const SizedBox(height: 16),
                  ListTile(
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16), side: const BorderSide(color: CatchTokens.border)),
                    tileColor: CatchTokens.card,
                    leading: const CircleAvatar(backgroundImage: AssetImage("assets/avatars/guest.jpg")),
                    title: Text(seller, style: const TextStyle(fontWeight: FontWeight.w700)),
                    subtitle: Text(loggedIn && listing.sellerPhone.isNotEmpty ? listing.sellerPhone : (ar ? "الجوال بعد التسجيل" : "Phone after you register")),
                    trailing: const Icon(Icons.chevron_left),
                    onTap: () => Navigator.of(context).push(MaterialPageRoute(builder: (_) => SellerProfileScreen(listing: listing))),
                  ),
                  const SizedBox(height: 8),
                  Text(ar ? "اتفق على المعاينة قبل الدفع. لا تحوّل مبلغ قبل ما تشوف السلعة." : "View the item before you pay.", style: const TextStyle(color: CatchTokens.muted, fontSize: 13, height: 1.4)),
                  TextButton(
                    onPressed: () => Navigator.of(context).push(MaterialPageRoute(builder: (_) => ReportListingScreen(listing: listing))),
                    child: Text(ar ? "تبليغ عن الإعلان" : "Report listing", style: const TextStyle(color: CatchTokens.muted)),
                  ),
                  TextButton(
                    onPressed: openChat,
                    child: Text(ar ? "اسأل البائع" : "Ask the seller", style: const TextStyle(color: CatchTokens.accent, fontWeight: FontWeight.w700)),
                  ),
                  ShareRow(listingId: listing.id, arabic: ar),
                  const SizedBox(height: 16),
                  if (similar.isNotEmpty) ...[
                    Text(ar ? "إعلانات مشابهة" : "Similar listings", style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 18)),
                    const SizedBox(height: 10),
                    SizedBox(
                      height: 180,
                      child: ListView.separated(
                        scrollDirection: Axis.horizontal,
                        itemCount: similar.length,
                        separatorBuilder: (_, __) => const SizedBox(width: 10),
                        itemBuilder: (_, i) {
                          final item = similar[i];
                          return GestureDetector(
                            onTap: () => openListing(context, item),
                            child: Container(
                              width: 140,
                              decoration: BoxDecoration(color: CatchTokens.card, borderRadius: BorderRadius.circular(16), border: Border.all(color: CatchTokens.border)),
                              clipBehavior: Clip.antiAlias,
                              child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                                Image.asset(item.imageUrl, height: 90, width: 140, fit: BoxFit.cover),
                                Padding(padding: const EdgeInsets.all(8), child: Text("${item.price} ${item.currency}\n${item.title}", maxLines: 3, overflow: TextOverflow.ellipsis, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w600))),
                              ]),
                            ),
                          );
                        },
                      ),
                    ),
                  ],
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
