import "package:flutter/material.dart";
import "../../navigation.dart";
import "../../state/app_scope.dart";
import "../../state/listing_store.dart";
import "../../theme/tokens.dart";

class ReportListingScreen extends StatefulWidget {
  const ReportListingScreen({super.key, required this.listing});
  final Listing listing;

  @override
  State<ReportListingScreen> createState() => _ReportListingScreenState();
}

class _ReportListingScreenState extends State<ReportListingScreen> {
  String reason = "spam";

  @override
  Widget build(BuildContext context) {
    final ar = AppScopeProvider.of(context).isArabic;
    final reasons = {
      "spam": ar ? "إعلان مكرر / سبام" : "Spam / duplicate",
      "wrong": ar ? "قسم غلط" : "Wrong category",
      "scam": ar ? "احتيال" : "Scam",
      "sold": ar ? "تم البيع وما تشال" : "Sold and still up",
    };
    return Directionality(
      textDirection: ar ? TextDirection.rtl : TextDirection.ltr,
      child: Scaffold(
        backgroundColor: CatchTokens.bg,
        appBar: AppBar(backgroundColor: CatchTokens.bg, foregroundColor: CatchTokens.dark, elevation: 0, title: Text(ar ? "تبليغ عن الإعلان" : "Report listing")),
        body: ListView(
          padding: const EdgeInsets.all(18),
          children: [
            for (final e in reasons.entries)
              RadioListTile<String>(
                value: e.key,
                groupValue: reason,
                onChanged: (v) => setState(() => reason = v!),
                title: Text(e.value),
                activeColor: CatchTokens.accent,
              ),
            const SizedBox(height: 16),
            FilledButton(
              style: FilledButton.styleFrom(backgroundColor: CatchTokens.accent, minimumSize: const Size.fromHeight(50), shape: const StadiumBorder()),
              onPressed: () async {
                if (!AppScopeProvider.of(context).registered) {
                  await requireAccountThen(context, () {});
                  if (!AppScopeProvider.of(context).registered || !mounted) return;
                }
                if (!mounted) return;
                ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(ar ? "وصل التبليغ للمراجعة." : "Report submitted.")));
                Navigator.pop(context);
              },
              child: Text(ar ? "إرسال التبليغ" : "Send report"),
            ),
          ],
        ),
      ),
    );
  }
}
