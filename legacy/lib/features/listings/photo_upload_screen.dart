import "package:flutter/material.dart";
import "../../data/photo_rules.dart";
import "../../state/app_scope.dart";
import "../../theme/tokens.dart";
import "location_pick_screen.dart";

class PhotoUploadScreen extends StatefulWidget {
  const PhotoUploadScreen({super.key, required this.categorySlug, required this.subcategorySlug});
  final String categorySlug;
  final String subcategorySlug;

  @override
  State<PhotoUploadScreen> createState() => _PhotoUploadScreenState();
}

class _PhotoUploadScreenState extends State<PhotoUploadScreen> {
  final photos = <String>[];

  void addSlot() {
    if (photos.length >= listingMaxPhotos) return;
    setState(() => photos.add("slot-${photos.length + 1}"));
  }

  @override
  Widget build(BuildContext context) {
    final ar = AppScopeProvider.of(context).isArabic;
    final canNext = photos.length >= listingMinPhotos;
    return Directionality(
      textDirection: ar ? TextDirection.rtl : TextDirection.ltr,
      child: Scaffold(
        backgroundColor: CatchTokens.bg,
        appBar: AppBar(backgroundColor: CatchTokens.bg, foregroundColor: CatchTokens.dark, elevation: 0),
        body: ListView(
          padding: const EdgeInsets.fromLTRB(18, 8, 18, 32),
          children: [
            Text(ar ? "أضف صور الإعلان" : "Add listing photos", style: const TextStyle(fontFamily: "Georgia", fontSize: 26, color: CatchTokens.dark)),
            const SizedBox(height: 8),
            Text(
              ar
                  ? "صورة واحدة على الأقل. الحد الأعلى $listingMaxPhotos صور."
                  : "At least $listingMinPhotos photo. Maximum $listingMaxPhotos photos.",
              style: const TextStyle(color: CatchTokens.muted),
            ),
            const SizedBox(height: 18),
            GridView.count(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              crossAxisCount: 3,
              mainAxisSpacing: 10,
              crossAxisSpacing: 10,
              children: [
                for (var i = 0; i < listingMaxPhotos; i++)
                  GestureDetector(
                    onTap: i == photos.length ? addSlot : null,
                    child: Container(
                      decoration: BoxDecoration(
                        color: CatchTokens.card,
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(color: i < photos.length ? CatchTokens.accent : CatchTokens.border),
                      ),
                      child: Icon(
                        i < photos.length ? Icons.check : Icons.add,
                        color: i < photos.length ? CatchTokens.accent : CatchTokens.muted,
                      ),
                    ),
                  ),
              ],
            ),
            const SizedBox(height: 24),
            FilledButton(
              style: FilledButton.styleFrom(backgroundColor: CatchTokens.accent, minimumSize: const Size.fromHeight(52), shape: const StadiumBorder()),
              onPressed: canNext
                  ? () => Navigator.of(context).push(MaterialPageRoute(
                        builder: (_) => LocationPickScreen(
                          categorySlug: widget.categorySlug,
                          subcategorySlug: widget.subcategorySlug,
                        ),
                      ))
                  : null,
              child: Text(ar ? "التالي" : "Next"),
            ),
          ],
        ),
      ),
    );
  }
}
