import "package:flutter/material.dart";
import "features/explore/explore_screen.dart";
import "state/app_scope.dart";
import "theme/tokens.dart";

class CatchTheDealsApp extends StatelessWidget {
  const CatchTheDealsApp({super.key, required this.scope});

  final AppScope scope;

  @override
  Widget build(BuildContext context) {
    return AppScopeProvider(
      scope: scope,
      child: AnimatedBuilder(
        animation: scope,
        builder: (context, _) {
          return MaterialApp(
            title: "Catch the deals",
            debugShowCheckedModeBanner: false,
            locale: scope.locale,
            supportedLocales: const [Locale("ar"), Locale("en")],
            theme: ThemeData(
              useMaterial3: true,
              scaffoldBackgroundColor: CatchTokens.bg,
              colorScheme: const ColorScheme.light(
                primary: CatchTokens.accent,
                onPrimary: Colors.white,
                surface: CatchTokens.card,
                onSurface: CatchTokens.dark,
              ),
            ),
            home: const ExploreScreen(),
          );
        },
      ),
    );
  }
}
