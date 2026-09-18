import "package:flutter/material.dart";
import "../../ai/voice_input.dart";
import "../../state/app_scope.dart";
import "../../theme/tokens.dart";
import "ai_review_screen.dart";

class AiDraftScreen extends StatefulWidget {
  const AiDraftScreen({
    super.key,
    required this.categorySlug,
    required this.subcategorySlug,
    this.city = "",
    this.neighborhood = "",
    this.site = "",
  });
  final String categorySlug;
  final String subcategorySlug;
  final String city;
  final String neighborhood;
  final String site;

  @override
  State<AiDraftScreen> createState() => _AiDraftScreenState();
}

class _AiDraftScreenState extends State<AiDraftScreen> {
  final note = TextEditingController();

  @override
  void dispose() {
    note.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final ar = AppScopeProvider.of(context).isArabic;
    return Directionality(
      textDirection: ar ? TextDirection.rtl : TextDirection.ltr,
      child: Scaffold(
        backgroundColor: CatchTokens.bg,
        appBar: AppBar(backgroundColor: CatchTokens.bg, foregroundColor: CatchTokens.dark, elevation: 0),
        body: ListView(
          padding: const EdgeInsets.fromLTRB(18, 8, 18, 32),
          children: [
            Text(ar ? "صف إعلانك بجملة" : "Describe your listing in one note",
                style: const TextStyle(fontFamily: "Georgia", fontSize: 26, color: CatchTokens.dark)),
            const SizedBox(height: 8),
            Text(
              ar
                  ? "مثال: عندي كامري 2020 للبيع بـ 15000 دينار، فحص 4 جيد، خلدا."
                  : "Example: Camry 2020 for sale, 15000 JOD, good inspection, Khalda.",
              style: const TextStyle(color: CatchTokens.muted, height: 1.4),
            ),
            const SizedBox(height: 16),
            Stack(
              children: [
                TextField(
                  controller: note,
                  maxLines: 6,
                  decoration: InputDecoration(
                    hintText: ar ? "اكتب أو سجّل اللي عندك…" : "Type or speak what you have…",
                    filled: true,
                    fillColor: CatchTokens.card,
                    contentPadding: const EdgeInsets.fromLTRB(16, 16, 16, 64),
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(16), borderSide: const BorderSide(color: CatchTokens.border)),
                  ),
                ),
                Positioned(
                  bottom: 10,
                  left: ar ? 12 : null,
                  right: ar ? null : 12,
                  child: GestureDetector(
                    onTap: () async {
                      final spoken = await captureVoiceNote();
                      if (spoken != null && spoken.trim().isNotEmpty) {
                        note.text = [note.text.trim(), spoken.trim()].where((e) => e.isNotEmpty).join(" ");
                        setState(() {});
                        return;
                      }
                      if (mounted) {
                        ScaffoldMessenger.of(context).showSnackBar(SnackBar(
                          content: Text(ar ? "المايك جاهز. الربط مع اشتراك الصوت." : "Mic is ready. Connect a speech subscription."),
                        ));
                      }
                    },
                    child: Container(
                      width: 48,
                      height: 48,
                      decoration: const BoxDecoration(color: CatchTokens.accent, shape: BoxShape.circle),
                      child: const Icon(Icons.mic, color: Colors.white),
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 22),
            FilledButton(
              style: FilledButton.styleFrom(backgroundColor: CatchTokens.accent, minimumSize: const Size.fromHeight(52), shape: const StadiumBorder()),
              onPressed: () {
                if (note.text.trim().length < 8) return;
                Navigator.of(context).push(MaterialPageRoute(
                  builder: (_) => AiReviewScreen(
                    categorySlug: widget.categorySlug,
                    subcategorySlug: widget.subcategorySlug,
                    raw: note.text.trim(),
                    city: widget.city,
                    neighborhood: widget.neighborhood,
                    site: widget.site,
                  ),
                ));
              },
              child: Text(ar ? "جهّز الإعلان" : "Generate listing"),
            ),
          ],
        ),
      ),
    );
  }
}
