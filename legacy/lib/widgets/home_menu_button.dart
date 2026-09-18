import "package:flutter/material.dart";
import "../data/home_nav.dart";
import "../l10n/app_copy.dart";
import "../state/app_scope.dart";

class HomeMenuButton extends StatelessWidget {
  const HomeMenuButton({
    super.key,
    required this.kind,
    this.active = false,
    this.onTap,
  });

  final HomeMenuKind kind;
  final bool active;
  final VoidCallback? onTap;

  @override
  Widget build(BuildContext context) {
    final copy = AppCopy(AppScopeProvider.of(context).isArabic);
    final color = active ? HomeNavSpec.active : HomeNavSpec.idle;
    if (kind == HomeMenuKind.post) {
      return GestureDetector(
        onTap: onTap,
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              width: HomeNavSpec.postSize,
              height: HomeNavSpec.postSize,
              decoration: BoxDecoration(
                color: HomeNavSpec.postFill,
                shape: BoxShape.circle,
                border: Border.all(color: const Color(0xFFF9F8F4), width: 4),
              ),
              child: const Icon(HomeNavSpec.postIconData, color: HomeNavSpec.postIcon, size: 28),
            ),
            const SizedBox(height: 2),
            Text(copy.postAd, style: const TextStyle(fontSize: HomeNavSpec.labelSize, color: HomeNavSpec.idle, fontWeight: FontWeight.w600)),
          ],
        ),
      );
    }
    return InkWell(
      onTap: onTap,
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(_icon, color: color, size: HomeNavSpec.iconSize),
          const SizedBox(height: 4),
          Text(_label(copy), style: TextStyle(color: color, fontSize: HomeNavSpec.labelSize, fontWeight: FontWeight.w600)),
        ],
      ),
    );
  }

  IconData get _icon => switch (kind) {
        HomeMenuKind.explore => HomeNavSpec.exploreIcon,
        HomeMenuKind.categories => HomeNavSpec.categoriesIcon,
        HomeMenuKind.messages => HomeNavSpec.messagesIcon,
        HomeMenuKind.myAds => HomeNavSpec.myAdsIcon,
        HomeMenuKind.post => HomeNavSpec.postIconData,
      };

  String _label(AppCopy copy) => switch (kind) {
        HomeMenuKind.explore => copy.explore,
        HomeMenuKind.categories => copy.categories,
        HomeMenuKind.messages => copy.messages,
        HomeMenuKind.myAds => copy.myAds,
        HomeMenuKind.post => copy.postAd,
      };
}

enum HomeMenuKind { explore, categories, post, messages, myAds }
