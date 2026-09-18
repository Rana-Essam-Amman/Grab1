import "package:flutter/material.dart";
import "../../l10n/app_copy.dart";
import "../../state/app_scope.dart";
import "../../theme/tokens.dart";

class SettingsScreen extends StatelessWidget {
  const SettingsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final scope = AppScopeProvider.of(context);
    final copy = AppCopy(scope.isArabic);
    return Directionality(
      textDirection: scope.isArabic ? TextDirection.rtl : TextDirection.ltr,
      child: Scaffold(
        backgroundColor: CatchTokens.bg,
        appBar: AppBar(
          backgroundColor: CatchTokens.bg,
          foregroundColor: CatchTokens.dark,
          elevation: 0,
          title: Text(copy.settings),
        ),
        body: ListView(
          padding: const EdgeInsets.all(18),
          children: [
            Text(copy.language, style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 18)),
            const SizedBox(height: 8),
            Text(copy.languageHint, style: const TextStyle(color: CatchTokens.muted, height: 1.4)),
            const SizedBox(height: 16),
            _LangTile(
              selected: !scope.isArabic,
              title: copy.english,
              onTap: () => scope.setLocale(const Locale("en")),
            ),
            const SizedBox(height: 10),
            _LangTile(
              selected: scope.isArabic,
              title: copy.arabicLabel,
              onTap: () => scope.setLocale(const Locale("ar")),
            ),
          ],
        ),
      ),
    );
  }
}

class _LangTile extends StatelessWidget {
  const _LangTile({required this.selected, required this.title, required this.onTap});
  final bool selected;
  final String title;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return ListTile(
      onTap: onTap,
      tileColor: CatchTokens.card,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
        side: BorderSide(color: selected ? CatchTokens.accent : CatchTokens.border),
      ),
      title: Text(title, style: const TextStyle(fontWeight: FontWeight.w700)),
      trailing: Icon(selected ? Icons.check_circle : Icons.circle_outlined, color: selected ? CatchTokens.accent : CatchTokens.muted),
    );
  }
}
