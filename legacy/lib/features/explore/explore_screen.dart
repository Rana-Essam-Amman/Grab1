import "package:flutter/material.dart";
import "../../data/categories.dart";
import "../../data/countries.dart";
import "../../state/app_scope.dart";
import "../../theme/tokens.dart";
import "../../state/listing_store.dart";
import "../../navigation.dart";
import "../../data/home_nav.dart";
import "../../widgets/home_menu_button.dart";
import "../account/settings_screen.dart";
import "country_sheet.dart";

class ExploreScreen extends StatelessWidget {
  const ExploreScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final scope = AppScopeProvider.of(context);
    final country = scope.browseCountry;
    final ar = scope.isArabic;

    return Directionality(
      textDirection: ar ? TextDirection.rtl : TextDirection.ltr,
      child: Scaffold(
        backgroundColor: CatchTokens.scaffoldOutside,
        body: Center(
          child: ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 430),
            child: ColoredBox(
              color: CatchTokens.bg,
              child: Stack(
                children: [
                  ListView(
                    padding: const EdgeInsets.fromLTRB(18, 22, 18, 170),
                    children: [
                      _Header(ar: ar, scope: scope),
                      const SizedBox(height: 8),
                      _Location(country: country, city: scope.browseCity, ar: ar, onTap: () => showCountrySheet(context)),
                      if (country.hasCurrencyChoice) ...[
                        const SizedBox(height: 10),
                        _CurrencyPicker(scope: scope, country: country, ar: ar),
                      ],
                      const SizedBox(height: 16),
                      _SearchBar(placeholder: scope.searchPlaceholder, onTap: () => openSearch(context)),
                      const SizedBox(height: 22),
                      _SectionTitle(
                        title: ar ? "كل الأقسام" : "All Categories",
                        action: ar ? "عرض الكل" : "View all",
                      ),
                      const SizedBox(height: 15),
                      const _CategoryGrid(),
                      const SizedBox(height: 28),
                      _SectionTitle(
                        title: ar ? "أحدث الإعلانات" : "Recent Classifieds",
                        action: ar ? "الكل" : "See all",
                      ),
                      const SizedBox(height: 8),
                      Text(
                        ar ? "تواصل مباشر بين البائع والمشتري" : "Direct peer-to-peer contacts",
                        style: const TextStyle(color: CatchTokens.muted, fontSize: 11),
                      ),
                      const SizedBox(height: 12),
                      _Listings(countryCode: country.code, currency: country.currency, ar: ar),
                    ],
                  ),
                  const Align(alignment: Alignment.bottomCenter, child: _BottomNav()),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}

class _Header extends StatelessWidget {
  const _Header({required this.ar, required this.scope});
  final bool ar;
  final AppScope scope;

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Expanded(
          child: Text.rich(
            TextSpan(
              text: "Catch",
              style: const TextStyle(
                fontFamily: "Georgia",
                fontSize: 35,
                height: 1,
                color: CatchTokens.dark,
                fontWeight: FontWeight.w600,
              ),
              children: [
                TextSpan(
                  text: ar ? "  الصفقات" : "  THE DEALS",
                  style: const TextStyle(
                    fontFamily: "Inter",
                    fontSize: 9,
                    letterSpacing: 2,
                    fontWeight: FontWeight.w700,
                    color: CatchTokens.accent,
                  ),
                ),
              ],
            ),
          ),
        ),
        IconButton(
          onPressed: () {
            scope.setLocale(ar ? const Locale("en") : const Locale("ar"));
          },
          icon: const Icon(Icons.translate, color: CatchTokens.text),
        ),
        GestureDetector(
          onTap: () => Navigator.of(context).push(MaterialPageRoute(builder: (_) => const SettingsScreen())),
          child: const CircleAvatar(
            radius: 21,
            backgroundImage: AssetImage("assets/avatars/guest.jpg"),
          ),
        ),
      ],
    );
  }
}

class _CurrencyPicker extends StatelessWidget {
  const _CurrencyPicker({required this.scope, required this.country, required this.ar});
  final AppScope scope;
  final CountryConfig country;
  final bool ar;

  @override
  Widget build(BuildContext context) {
    return Wrap(
      spacing: 8,
      children: country.currencies.map((c) {
        final on = scope.currency == c.code;
        return GestureDetector(
          onTap: () => scope.setCurrency(c.code),
          child: Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 7),
            decoration: BoxDecoration(
              color: on ? CatchTokens.accent : CatchTokens.card,
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: on ? CatchTokens.accent : CatchTokens.border),
            ),
            child: Text(
              ar ? "${c.code} · ${c.nameAr}" : "${c.code} · ${c.nameEn}",
              style: TextStyle(color: on ? Colors.white : CatchTokens.dark, fontSize: 12, fontWeight: FontWeight.w600),
            ),
          ),
        );
      }).toList(),
    );
  }
}

class _Location extends StatelessWidget {
  const _Location({required this.country, required this.city, required this.ar, this.onTap});
  final CountryConfig country;
  final String city;
  final bool ar;
  final VoidCallback? onTap;

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      child: Row(
      children: [
        const Icon(Icons.location_on_outlined, size: 16, color: CatchTokens.accent),
        const SizedBox(width: 6),
        Text(ar ? country.nameAr : country.nameEn, style: const TextStyle(color: CatchTokens.muted, fontSize: 13)),
        const Text("  •  ", style: TextStyle(color: CatchTokens.muted)),
        Text(
          city,
          style: const TextStyle(color: CatchTokens.dark, fontWeight: FontWeight.w600, fontSize: 13),
        ),
      ],
      ),
    );
  }
}

class _SearchBar extends StatelessWidget {
  const _SearchBar({required this.placeholder, this.onTap});
  final String placeholder;
  final VoidCallback? onTap;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
      height: 50,
      padding: const EdgeInsets.symmetric(horizontal: 17),
      decoration: BoxDecoration(
        color: CatchTokens.card,
        borderRadius: BorderRadius.circular(26),
        border: Border.all(color: CatchTokens.border),
      ),
      child: Row(
        children: [
          const Icon(Icons.search, color: CatchTokens.accent, size: 20),
          const SizedBox(width: 11),
          Expanded(
            child: Text(placeholder, style: const TextStyle(color: CatchTokens.muted, fontSize: 14)),
          ),
        ],
      ),
      ),
    );
  }
}

class _SectionTitle extends StatelessWidget {
  const _SectionTitle({required this.title, required this.action});
  final String title;
  final String action;

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Expanded(
          child: Text(
            title,
            style: const TextStyle(fontFamily: "Georgia", fontSize: 25, color: CatchTokens.dark),
          ),
        ),
        GestureDetector(
          onTap: () => openCategories(context),
          child: Text(action, style: const TextStyle(color: CatchTokens.accent, fontSize: 12, fontWeight: FontWeight.w600)),
        ),
      ],
    );
  }
}

class _CategoryGrid extends StatelessWidget {
  const _CategoryGrid();

  @override
  Widget build(BuildContext context) {
    return GridView.builder(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      itemCount: categories.length,
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 4,
        mainAxisSpacing: 14,
        crossAxisSpacing: 10,
        childAspectRatio: 0.72,
      ),
      itemBuilder: (context, index) {
        final item = categories[index];
        return GestureDetector(
          onTap: () => openSearch(context, categorySlug: item.slug),
          child: Column(
          children: [
            Expanded(
              child: Container(
                decoration: BoxDecoration(
                  color: CatchTokens.card,
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: CatchTokens.border),
                ),
                padding: const EdgeInsets.all(10),
                child: Image.asset(item.asset, fit: BoxFit.contain),
              ),
            ),
            const SizedBox(height: 6),
            Text(item.nameEn, maxLines: 1, overflow: TextOverflow.ellipsis, style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w600, color: CatchTokens.dark)),
            Text(item.nameAr, style: const TextStyle(fontSize: 9, color: CatchTokens.muted)),
          ],
        ),
        );
      },
    );
  }
}

class _Listings extends StatelessWidget {
  const _Listings({required this.countryCode, required this.currency, required this.ar});
  final String countryCode;
  final String currency;
  final bool ar;

  @override
  Widget build(BuildContext context) {
    final items = ListingStore.instance.inCountry(countryCode);
    if (items.isEmpty) {
      return Text(ar ? "ما في إعلانات بهالدولة حالياً" : "No listings in this country yet", style: const TextStyle(color: CatchTokens.muted));
    }
    return Row(
      children: [
        for (final item in items.take(2)) ...[
          Expanded(
            child: _ListingCard(listing: item),
          ),
          const SizedBox(width: 13),
        ],
      ],
    );
  }
}

class _ListingCard extends StatelessWidget {
  const _ListingCard({required this.listing});
  final Listing listing;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () => openListing(context, listing),
      child: Container(
      decoration: BoxDecoration(
        color: CatchTokens.card,
        borderRadius: BorderRadius.circular(CatchTokens.radius),
        border: Border.all(color: CatchTokens.border),
      ),
      clipBehavior: Clip.antiAlias,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          AspectRatio(
            aspectRatio: 1 / 0.88,
            child: Stack(
              fit: StackFit.expand,
              children: [
                Image.asset(listing.imageUrl, fit: BoxFit.cover),
                Positioned(
                  top: 9,
                  right: 9,
                  child: GestureDetector(
                    onTap: () => openRegister(context),
                    child: const CircleAvatar(
                      radius: 16,
                      backgroundColor: Colors.white,
                      child: Icon(Icons.favorite_border, size: 16, color: CatchTokens.accent),
                    ),
                  ),
                ),
              ],
            ),
          ),
          Padding(
            padding: const EdgeInsets.all(11),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(listing.categorySlug.toUpperCase(), style: const TextStyle(fontSize: 9, letterSpacing: 0.8, color: CatchTokens.accent, fontWeight: FontWeight.w700)),
                const SizedBox(height: 4),
                Text(listing.title, maxLines: 2, style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w700, color: CatchTokens.dark)),
                const SizedBox(height: 7),
                Text("${listing.price} ${listing.currency}", style: const TextStyle(fontFamily: "Georgia", fontSize: 18, fontWeight: FontWeight.w600, color: CatchTokens.dark)),
                const SizedBox(height: 6),
                Row(
                  children: [
                    const Icon(Icons.location_on_outlined, size: 11, color: CatchTokens.muted),
                    const SizedBox(width: 4),
                    Text(listing.neighborhood, style: const TextStyle(fontSize: 9, color: CatchTokens.muted)),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    ),
    );
  }
}

class _BottomNav extends StatelessWidget {
  const _BottomNav();

  @override
  Widget build(BuildContext context) {
    return Container(
      height: HomeNavSpec.barHeight,
      decoration: const BoxDecoration(
        color: Color(0xEBF9F8F4),
        border: Border(top: BorderSide(color: CatchTokens.border)),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceAround,
        children: [
          const HomeMenuButton(kind: HomeMenuKind.explore, active: true),
          HomeMenuButton(kind: HomeMenuKind.categories, onTap: () => openCategories(context)),
          HomeMenuButton(kind: HomeMenuKind.post, onTap: () => openPostAdFlow(context)),
          HomeMenuButton(kind: HomeMenuKind.messages, onTap: () => openMessages(context)),
          HomeMenuButton(kind: HomeMenuKind.myAds, onTap: () => openMyAds(context)),
        ],
      ),
    );
  }
}

class _NavItem extends StatelessWidget {
  const _NavItem({required this.icon, required this.label, this.active = false, this.onTap});
  final IconData icon;
  final String label;
  final bool active;
  final VoidCallback? onTap;

  @override
  Widget build(BuildContext context) {
    final color = active ? CatchTokens.accent : CatchTokens.muted;
    return InkWell(
      onTap: onTap,
      child: Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        Icon(icon, color: color, size: 20),
        const SizedBox(height: 3),
        Text(label, style: TextStyle(color: color, fontSize: 10, fontWeight: FontWeight.w600)),
      ],
      ),
    );
  }
}

class _PostItem extends StatelessWidget {
  const _PostItem();

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () => openPostAdFlow(context),
      child: Column(
      children: [
        Container(
          width: 50,
          height: 50,
          margin: const EdgeInsets.only(top: 0),
          decoration: BoxDecoration(
            color: CatchTokens.accent,
            shape: BoxShape.circle,
            border: Border.all(color: CatchTokens.bg, width: 4),
          ),
          child: const Icon(Icons.add, color: Colors.white),
        ),
        const Text("Post Ad", style: TextStyle(fontSize: 10, color: CatchTokens.muted, fontWeight: FontWeight.w600)),
      ],
      ),
    );
  }
}
