import "package:flutter/material.dart";
import "features/account/messages_screen.dart";
import "features/account/my_ads_screen.dart";
import "features/auth/register_screen.dart";
import "features/listings/choose_category_screen.dart";
import "features/listings/listing_detail_screen.dart";
import "features/search/search_results_screen.dart";
import "state/listing_store.dart";
import "state/app_scope.dart";

Future<void> requireAccountThen(BuildContext context, VoidCallback next) async {
  final scope = AppScopeProvider.of(context);
  if (scope.registered) {
    next();
    return;
  }
  await Navigator.of(context).push(MaterialPageRoute(builder: (_) => const RegisterScreen()));
  if (scope.registered && context.mounted) next();
}

void openPostAdFlow(BuildContext context) {
  Navigator.of(context).push(MaterialPageRoute(builder: (_) => const ChooseCategoryScreen()));
}

void openMessages(BuildContext context) {
  requireAccountThen(context, () {
    Navigator.of(context).push(MaterialPageRoute(builder: (_) => const MessagesScreen()));
  });
}

void openMyAds(BuildContext context) {
  requireAccountThen(context, () {
    Navigator.of(context).push(MaterialPageRoute(builder: (_) => const MyAdsScreen()));
  });
}

void openCategories(BuildContext context) {
  Navigator.of(context).push(MaterialPageRoute(builder: (_) => const ChooseCategoryScreen(browseOnly: true)));
}

void openSearch(BuildContext context, {String query = "", String? categorySlug}) {
  Navigator.of(context).push(MaterialPageRoute(
    builder: (_) => SearchResultsScreen(query: query, categorySlug: categorySlug),
  ));
}

void openListing(BuildContext context, Listing listing) {
  Navigator.of(context).push(MaterialPageRoute(builder: (_) => ListingDetailScreen(listing: listing)));
}

void openRegister(BuildContext context) {
  requireAccountThen(context, () {});
}
