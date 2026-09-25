import "package:flutter/material.dart";
import "../../data/countries.dart";
import "../../data/locations.dart";
import "../../state/app_scope.dart";
import "../../theme/tokens.dart";

Future<void> showCountrySheet(BuildContext context) {
  final scope = AppScopeProvider.of(context);
  final ar = scope.isArabic;
  return showModalBottomSheet(
    context: context,
    isScrollControlled: true,
    backgroundColor: CatchTokens.bg,
    shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(22))),
    builder: (context) {
      return SizedBox(
        height: MediaQuery.of(context).size.height * 0.75,
        child: ListView(
          padding: const EdgeInsets.fromLTRB(18, 16, 18, 28),
          children: [
            Text(ar ? "الدولة والمدينة" : "Country and city", style: const TextStyle(fontFamily: "Georgia", fontSize: 22, color: CatchTokens.dark)),
            const SizedBox(height: 6),
            Text(ar ? "التصفح والإعلانات لهالمنطقة فقط" : "Browse and results stay inside this market", style: const TextStyle(color: CatchTokens.muted, fontSize: 13)),
            const SizedBox(height: 16),
            for (final c in countries) ...[
              Text(ar ? c.nameAr : c.nameEn, style: const TextStyle(fontWeight: FontWeight.w700)),
              for (final entry in (ar ? locationsAr[c.code]! : locations[c.code]!).entries)
                ListTile(
                  contentPadding: EdgeInsets.zero,
                  title: Text(entry.key),
                  onTap: () {
                    final enCities = locations[c.code]!.keys.toList();
                    final arCities = locationsAr[c.code]!.keys.toList();
                    final idx = (ar ? arCities : enCities).indexOf(entry.key);
                    scope.setBrowseLocation(
                      countryCode: c.code,
                      cityEn: enCities[idx < 0 ? 0 : idx],
                      cityAr: arCities[idx < 0 ? 0 : idx],
                    );
                    Navigator.pop(context);
                  },
                ),
            ],
          ],
        ),
      );
    },
  );
}
